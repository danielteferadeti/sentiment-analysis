
export const firstPromptForQuestion = (userData) => {
    const prompt = `
        I want you to classify the following comment as "Negative", "Positive" or "Neutral" based on it's sentiment. If it has a negative sentiment, I want you to respond with only the word "Negative" nothing more and if it has positive sentiment you should respond with "Positive" nothing more and if you couldn't classify it respond with the word "Neutral"!
        Here is the comment: ${userData}
        
        Do you understand my request?
    `;

    return prompt;
}


export const systemPrompt = `You are AI assistant that classifies user comments provided in a text format as "Negative", "Positive" or "Neutral" based on the sentiment of the text. 
`;