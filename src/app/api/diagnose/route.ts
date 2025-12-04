import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { algorithm, userAction, expectedAction, state } = body;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `
You are a patient and encouraging algorithm tutor helping a student learn ${algorithm}.

The student just made an action that might be incorrect or suboptimal.

Student's action: ${userAction}
Expected/optimal action: ${expectedAction || "Not specified"}

Current algorithm state:
${JSON.stringify(state, null, 2)}

Please provide feedback in this format:

1. **What happened**: Briefly describe what the student did
2. **The issue**: Explain why this might not be the best choice (if applicable)
3. **Better approach**: Suggest what they should do instead
4. **Encouragement**: End with a supportive note

Keep your response:
- Friendly and non-judgmental
- Educational and specific
- Under 150 words
- Use the actual values from the state

If the student's action was actually correct, acknowledge that and explain why it was right!
    `.trim();

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Diagnosis failed" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const feedback = data.choices[0]?.message?.content || "Unable to generate feedback.";

    return NextResponse.json({ feedback });

  } catch (err) {
    console.error("Diagnose API error:", err);
    return NextResponse.json(
      { error: "Diagnosis failed" },
      { status: 500 }
    );
  }
}
