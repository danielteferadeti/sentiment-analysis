import { BaseResponse } from '../types/baseResponse';
import configs from '../config/configs'
import OpenAI from 'openai';
import { firstPromptForQuestion, systemPrompt } from '../types/chatPromps';

export const commentSentimentAnalysis = async (userComment: string) => {
  try {

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    
      const commentPrompt = firstPromptForQuestion(userComment);

      const messages = [];
      messages.push({ role: "system", content: systemPrompt});

      messages.push({ role: "user", content: commentPrompt });

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        max_tokens: 200
      })

      const completion_text = completion.choices[0].message.content || "Neutral";

      return completion_text.toString()
    
  } catch (error) {
    throw error
  }
};