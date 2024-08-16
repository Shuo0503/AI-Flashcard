
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1", // Ensure this is the correct base URL
  apiKey: process.env.OPENROUTER_API_KEY,
});


const systemPrompt = `
You are a flashcard creator. You take in text and create exactly 10 flashcards from it.
Both front and back should be one sentence long.
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
const response = await fetch('/generate', {
  method: 'POST',
  body: JSON.stringify({ text: "Your input text here" }),
  headers: {
      'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log(data);


export async function POST(req) {
  const openai = new OpenAI()
  const data = await req.text()

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data },
    ],
    model: "meta-llama/llama-3.1-8b-instruct:free",
    response_format: { type: 'json_object' },
  })

  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(completion.choices[0].message.content)

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards)
}
    