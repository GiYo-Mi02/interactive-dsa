import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const PISTON_API_URL = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston/execute";

// Language configurations for Piston API
const LANGUAGE_CONFIG: Record<string, { language: string; version: string }> = {
  java: { language: "java", version: "15.0.2" },
  csharp: { language: "csharp", version: "6.12.0" },
  python: { language: "python", version: "3.10.0" },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, input } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: "Code and language are required" },
        { status: 400 }
      );
    }

    const langConfig = LANGUAGE_CONFIG[language];
    if (!langConfig) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    // Try executing via Piston API first
    try {
      const pistonRequest = {
        language: langConfig.language,
        version: langConfig.version,
        files: [
          {
            name: getFileName(language),
            content: code,
          },
        ],
        stdin: input || "",
        run_timeout: 10000,
        compile_timeout: 10000,
      };

      const startTime = Date.now();
      
      const response = await fetch(PISTON_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pistonRequest),
      });

      const executionTime = Date.now() - startTime;

      if (response.ok) {
        const result = await response.json();
        
        // Handle compilation errors
        if (result.compile && result.compile.code !== 0) {
          return NextResponse.json({
            success: false,
            output: "",
            error: result.compile.stderr || result.compile.output || "Compilation failed",
            executionTime,
            stage: "compile",
          });
        }

        // Handle runtime errors
        if (result.run && result.run.code !== 0) {
          return NextResponse.json({
            success: false,
            output: result.run.stdout || "",
            error: result.run.stderr || "Runtime error",
            executionTime,
            stage: "runtime",
          });
        }

        // Success
        return NextResponse.json({
          success: true,
          output: result.run?.stdout || "",
          error: result.run?.stderr || null,
          executionTime,
          stage: "complete",
        });
      }
      
      console.warn(`Piston API returned status ${response.status}. Falling back to local execution...`);
    } catch (apiErr) {
      console.warn("Piston API fetch failed. Falling back to local execution...", apiErr);
    }

    // Fallback: Local execution using host compilers/interpreters
    const localResult = await runLocal(language, code, input || "");
    return NextResponse.json(localResult);

  } catch (err) {
    console.error("Execute API error:", err);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to execute code. Please try again." 
      },
      { status: 500 }
    );
  }
}

function getFileName(language: string): string {
  switch (language) {
    case "java":
      return "Main.java";
    case "csharp":
      return "Program.cs";
    case "python":
      return "main.py";
    default:
      return "code.txt";
  }
}

function runLocal(language: string, code: string, input: string): Promise<{
  success: boolean;
  output: string;
  error?: string;
  executionTime: number;
  stage: string;
}> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const tempDir = path.join(process.cwd(), ".temp");
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const uniqueId = Date.now() + "_" + Math.floor(Math.random() * 1000);

    if (language === "python") {
      const filePath = path.join(tempDir, `main_${uniqueId}.py`);
      fs.writeFileSync(filePath, code);

      const process = spawn("python", [filePath]);
      let stdout = "";
      let stderr = "";

      const timeout = setTimeout(() => {
        process.kill();
        resolve({
          success: false,
          output: stdout,
          error: "Execution timed out (limit: 10s)",
          executionTime: Date.now() - startTime,
          stage: "runtime",
        });
        try { fs.unlinkSync(filePath); } catch (e) {}
      }, 10000);

      if (input) {
        process.stdin.write(input);
        process.stdin.end();
      }

      process.stdout.on("data", (data) => {
        stdout += data.toString();
      });

      process.stderr.on("data", (data) => {
        stderr += data.toString();
      });

      process.on("close", (codeVal) => {
        clearTimeout(timeout);
        try { fs.unlinkSync(filePath); } catch (e) {}
        
        resolve({
          success: codeVal === 0,
          output: stdout,
          error: codeVal === 0 ? undefined : (stderr || `Process exited with code ${codeVal}`),
          executionTime: Date.now() - startTime,
          stage: "runtime",
        });
      });
    } else if (language === "java") {
      const classMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
      const className = classMatch ? classMatch[1] : "Main";
      
      const javaDir = path.join(tempDir, `java_${uniqueId}`);
      fs.mkdirSync(javaDir, { recursive: true });
      const filePath = path.join(javaDir, `${className}.java`);
      fs.writeFileSync(filePath, code);

      // Compile
      const compileProcess = spawn("javac", [filePath]);
      let compileStderr = "";

      compileProcess.stderr.on("data", (data) => {
        compileStderr += data.toString();
      });

      compileProcess.on("close", (compileCode) => {
        if (compileCode !== 0) {
          try { fs.rmSync(javaDir, { recursive: true, force: true }); } catch (e) {}
          resolve({
            success: false,
            output: "",
            error: compileStderr || "Compilation failed",
            executionTime: Date.now() - startTime,
            stage: "compile",
          });
          return;
        }

        // Execute
        const runProcess = spawn("java", ["-cp", javaDir, className]);
        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
          runProcess.kill();
          try { fs.rmSync(javaDir, { recursive: true, force: true }); } catch (e) {}
          resolve({
            success: false,
            output: stdout,
            error: "Execution timed out (limit: 10s)",
            executionTime: Date.now() - startTime,
            stage: "runtime",
          });
        }, 10000);

        if (input) {
          runProcess.stdin.write(input);
          runProcess.stdin.end();
        }

        runProcess.stdout.on("data", (data) => {
          stdout += data.toString();
        });

        runProcess.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        runProcess.on("close", (runCodeVal) => {
          clearTimeout(timeout);
          try { fs.rmSync(javaDir, { recursive: true, force: true }); } catch (e) {}
          resolve({
            success: runCodeVal === 0,
            output: stdout,
            error: runCodeVal === 0 ? undefined : (stderr || `Process exited with code ${runCodeVal}`),
            executionTime: Date.now() - startTime,
            stage: "runtime",
          });
        });
      });
    } else if (language === "csharp") {
      const csDir = path.join(tempDir, `cs_${uniqueId}`);
      fs.mkdirSync(csDir, { recursive: true });

      const initProcess = spawn("dotnet", ["new", "console", "--force"], { cwd: csDir });
      
      initProcess.on("close", (initCode) => {
        if (initCode !== 0) {
          try { fs.rmSync(csDir, { recursive: true, force: true }); } catch (e) {}
          resolve({
            success: false,
            output: "",
            error: "Failed to initialize temporary .NET console project",
            executionTime: Date.now() - startTime,
            stage: "compile",
          });
          return;
        }

        const programPath = path.join(csDir, "Program.cs");
        fs.writeFileSync(programPath, code);

        const runProcess = spawn("dotnet", ["run", "--project", csDir]);
        let stdout = "";
        let stderr = "";

        const timeout = setTimeout(() => {
          runProcess.kill();
          try { fs.rmSync(csDir, { recursive: true, force: true }); } catch (e) {}
          resolve({
            success: false,
            output: stdout,
            error: "Execution timed out (limit: 15s)",
            executionTime: Date.now() - startTime,
            stage: "runtime",
          });
        }, 15000);

        if (input) {
          runProcess.stdin.write(input);
          runProcess.stdin.end();
        }

        runProcess.stdout.on("data", (data) => {
          stdout += data.toString();
        });

        runProcess.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        runProcess.on("close", (runCodeVal) => {
          clearTimeout(timeout);
          try { fs.rmSync(csDir, { recursive: true, force: true }); } catch (e) {}
          resolve({
            success: runCodeVal === 0,
            output: stdout,
            error: runCodeVal === 0 ? undefined : (stderr || `Process exited with code ${runCodeVal}`),
            executionTime: Date.now() - startTime,
            stage: "runtime",
          });
        });
      });
    } else {
      resolve({
        success: false,
        output: "",
        error: `Unsupported local execution language: ${language}`,
        executionTime: Date.now() - startTime,
        stage: "runtime",
      });
    }
  });
}
