import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { algorithm, step, state, prompt: customPrompt } = body;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    // Use custom prompt if provided (for sandbox), otherwise build visualizer prompt
    let prompt: string;
    
    if (customPrompt) {
      // Sandbox mode - use the custom prompt directly
      prompt = customPrompt;
    } else {
      // Visualizer mode - build prompt from algorithm state
      prompt = `
You are an interactive algorithm tutor helping students understand data structures and algorithms.

Explain the following step of the ${algorithm} algorithm.
Current step/action: ${step}

Here is the internal algorithm state (JSON):
${JSON.stringify(state, null, 2)}

Your explanation should be:
- Simple and clear
- Student-friendly (assume they're learning)
- Short (3-5 sentences maximum)
- Specific to the current state shown
- Avoid generic algorithm definitions
- Use concrete values from the state when explaining
- If relevant, mention what will happen next

Remember: You're explaining what's happening RIGHT NOW in this specific step.
      `.trim();
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: customPrompt ? 1000 : 300, // More tokens for sandbox explanations
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "AI explanation failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const explanation = data.choices[0]?.message?.content || "Unable to generate explanation.";

    return NextResponse.json({ explanation });

  } catch (err) {
    console.error("Explain API error:", err);
    return NextResponse.json(
      { error: "AI explanation failed" },
      { status: 500 }
    );
  }
}
