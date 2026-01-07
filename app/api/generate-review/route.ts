import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: Request) {
  try {
    const { business, service, timeframe, price, hints, tone, length, language } = await req.json()

    const prompt = `
      Write a ${tone || "friendly"} review for Blu' Steak House, an upscale steakhouse.
      
      Focus on the steakhouse dining experience including:
      - Quality and preparation of the steak (cut, doneness, flavor, tenderness)
      - Service received: ${service}
      - Timeframe/Speed: ${timeframe}
      - Price/Value: ${price}
      - Additional context: ${hints}
      - Mention aspects like: ambiance, side dishes, appetizers, wine selection, or desserts as appropriate
      
      The review should be ${length || "normal"} length and written in ${language || "English"}.
      Make it sound authentic and natural, like a real steakhouse customer wrote it.
      Do not include placeholders or brackets. Just the review text.
      Focus on what makes a great steakhouse experience - the quality of the beef, cooking expertise, and upscale dining atmosphere.
    `

    const { text } = await generateText({
      model: xai("grok-4"),
      prompt: prompt,
    })

    return Response.json({ success: true, text })
  } catch (error) {
    console.error("Error generating review:", error)
    return Response.json({ success: false, message: "Failed to generate review" }, { status: 500 })
  }
}
