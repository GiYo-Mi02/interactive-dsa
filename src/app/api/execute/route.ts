import { NextRequest, NextResponse } from "next/server";

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

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

    // Prepare the request to Piston API
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
      run_timeout: 10000, // 10 second timeout
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Piston API error:", errorText);
      return NextResponse.json(
        { 
          success: false, 
          error: "Code execution service unavailable. Please try again." 
        },
        { status: 500 }
      );
    }

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
