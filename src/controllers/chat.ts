//Import the OpenAPI Large Language Model (you can import other models here eg. Cohere)
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { Request, Response, NextFunction } from 'express';
import { userValidator } from '../validations/joiModelValidator';
import { BaseResponse } from '../types/baseResponse';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env'});

const userChat = async (req: Request, res: Response, next: NextFunction) => {
  const {
    userQuestion, chatHistoryObj
  } = req.body;

  const courseObj = {
    title: "Fundamentals of Programming",
    description: `Programming involves activities such as analysis, 
                  developing understanding, generating algorithms, verification of requirements of 
                  algorithms including their correctness and resources consumption, and implementation
                  (commonly referred to as coding) of algorithms in a target programming language`
  }

  const questionObj = {
    description: "Which of the following is NOT a programming language?",
    choiceA: "Java",
    choiceB: "Python",
    choiceC: "HTML",
    choiceD: "C++",
    answer: "choice_C",
  }

  const model = new OpenAI({ temperature: 0.9 });
  const template2 = `What is the answer to the question {userQuestion}? considering 
                    the question in relation to a course provided in a stringified JSON here: {course} 
                    and is specific to the question provided in a stringified JSON here: {genQuestion}.
                    The AI is interactive and chats as a person and  Previous conversation between AI(you) 
                    and human(who is asking the questions) is provided in a stringified JSON as follows: {chatHistory}. 
                    If the chat history JSON is empty it means there was no conversation between the two. 
                    In the chat history JSON the human labeled entries are made by the human and AI labeled once are made by you(the AI). 
                    If the question human asked is not about question: {genQuestion}, then the 
                    AI will answer if the question in a way that makes sense.`;
  
  const template3 = `The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. 
                    If the AI does not know the answer to a question, it truthfully says it does not know. 
                    The reason for conversation is to answer questions human has on multiple choice question provided here in a stringified JSON: {genQuestion}.
                    The provided question is taken from a course described in this JSON: {course}.The conversation between the AI and Human is stored in a JSON format and 
                    is provided here: chat_history: {chat_history}
                    Current conversation:
                    Human: {userQuestion}
                    AI:`;

  const template = `Previously we had a chat and the chat we had is provided in the JSON below. I was a human and you were an interactive AI.
  The reason for conversation is to answer questions human has on multiple choice question provided here in a stringified JSON: {genQuestion}.
  The provided question is taken from a course described in this JSON: {course}.The conversation between the AI and Human is stored in a JSON format and 
  is provided here: chat_history: {chat_history}
  Current conversation:
  Human: {userQuestion}
  AI:`;

  const prompt = new PromptTemplate({ template, inputVariables: ["userQuestion", "course", "genQuestion", "chat_history"] });
  const chain = new LLMChain({ llm: model, prompt });

  // const chatHistoryObj = [{human: "Hi there!", AI: "Hello there how may I assist you!"}]
  const chat_history =  JSON.stringify(chatHistoryObj)
  // console.log("Chat History: ", chat_history)
  const course = JSON.stringify(courseObj)
  const genQuestion = JSON.stringify(questionObj)

  const GPTResponse = await chain.call({ userQuestion, course, genQuestion, chat_history,});

  let baseResponse = new BaseResponse();
  baseResponse.success = true;
  baseResponse.message = 'User created successfully!';
  baseResponse.data = {
    GPTResponse,
  };

  return res.status(201).json(baseResponse);
};

const chatControllers = {userChat}

export default chatControllers