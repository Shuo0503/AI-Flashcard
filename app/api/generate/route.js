import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", // Ensure this is the correct base URL
  apiKey: process.env.OPENAI_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.YOUR_SITE_URL || "http://localhost:3000",
    "X-Title": "HeadStartAI",
  },
});

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guideline
1. Create clear and concise questions for the front of the flashcard.
2. Consider accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information. 
4. Use simple language to make the flashcards accessible to a wide range of learners. 
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.

Remember, the goal is to facilitate effective learning and retention of information through these flashcards.

You should return in the following JSON format:
{
  "flashcards": [
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  try {
    // Log incoming request data for debugging
    const data = await req.text();
    console.log("Request Data:", data);

    // Call the OpenAI API to generate flashcards
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data },
      ],
      model: "meta-llama/llama-3.1-8b-instruct:free",
      response_format: { type: "json_object" },
    });

    // Log the raw response for debugging
    console.log("Raw API Response:", completion);

    // Extract and clean the response content
    let responseContent = completion.choices[0]?.message?.content || "";
    console.log("Raw Response Content:", responseContent);

    // Remove Markdown code block delimiters
    const jsonStart = responseContent.indexOf("{");
    const jsonEnd = responseContent.lastIndexOf("}");

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error("Invalid response format: JSON not found.");
    }

    // Extract JSON part
    responseContent = responseContent.substring(jsonStart, jsonEnd + 1);
    console.log("Cleaned Response Content:", responseContent);

    // Parse the JSON response
    const flashcards = JSON.parse(responseContent);

    // Return the flashcards as a JSON response
    return NextResponse.json(flashcards.flashcards);
  } catch (error) {
    // Log the error for debugging
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: "Failed to generate flashcards" },
      { status: 500 }
    );
  }
}
