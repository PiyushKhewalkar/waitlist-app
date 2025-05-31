// get user requirement

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { OPENAI_API_KEY } from "../config/env.js";

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY
});

const requirementFormat = z.object({
    requirement: z.string()
})

export const getUserRequirement = async(userPrompt) => {
    const response = await openai.responses.parse({
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: `You're a Product Strategist helping users turn vague ideas into clear website requirements.

Your job: Interpret the user’s message and explain, in simple natural language, what they want to build.

Instructions:
- Write a short paragraph that clearly explains what the user is trying to create.
- If the user’s prompt is unclear, make reasonable assumptions.
- Use a helpful, confident tone.
- Focus on their goal, target audience, design preferences, and key sections (if mentioned).`
},
          {
            role: "user",
            content: userPrompt,
          },
        ],
        text: {
          format: zodTextFormat(requirementFormat, "userRequirement"),
        },
      });

      const result = response.output_parsed;

      return result
}

// select page

export const choosePageTemplate = async(userRequirement, templateChoices) => {

    const templatesSchema = z.union(templateChoices.map(t => z.object({
        name: z.literal(t.name),
        description: z.literal(t.description),
        templateNumber: z.literal(t.templateNumber)
      })));
      
      const templateResponseFormat = z.object({
        chosenTemplate: templatesSchema
      });

    const response = await openai.responses.parse({
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: `You're a smart web strategist helping match users to the best landing page design.

Your job: Read the user's requirement and pick the most relevant template from the provided list.

Instructions:
- Carefully compare the user’s requirement with the list of templates.
- Choose the template that best fits the user’s goals, audience, tone, and intent.
- Return the chosen template object exactly as it appears in the list.
- Do not explain your reasoning.`
},
          {
            role: "user",
            content: userRequirement.requirement,
          },
        ],
        text: {
          format: zodTextFormat(templateResponseFormat, "waitlistPageTemplates"),
        },
      });

      const result = response.output_parsed;

      return result
}


export const generateCopy = async(responseFormat, requirement) => {
    const response = await openai.responses.parse({
        model: "gpt-4o-mini",
        input: [
          { role: "system", content: `You are an expert copywriter tasked with generating landing page content.

Instructions:
- Create content that fits exactly into the provided schema structure.
- Be clear, concise, persuasive, and aligned with marketing best practices.
- Match the tone and style implied by the schema.
- Output ONLY the filled schema as a JSON object.
- Do not include explanations, comments, or any extra text.

requirement: ${requirement.requirement}`
},
{
  role: "user",
  content: requirement.requirement,
}
        ],
        text: {
          format: zodTextFormat(responseFormat, "websiteCopy"),
        },
      });

      let result = response.output_parsed;
      console.log(result, "result")

      return result
}