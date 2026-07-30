import groq from "../config/groq.js";

export const analyzeFeedback = async (feedbacks) => {
  // Sirf required fields bhejo
  const cleanFeedback = feedbacks.map((item) => ({
    feedback: item.feedbackText,
    area: item.productArea,
    rating: item.rating,
  }));

  const prompt = `
You are an AI Product Feedback Analyst.

Analyze the following customer feedback.

Tasks:
1. Group similar feedback into themes.
2. Count occurrences.
3. Identify recurring problems.
4. Write a short summary.
5. Suggest recommended actions.

Return ONLY valid JSON.

{
  "themes": [
    {
      "theme": "",
      "occurrences": 0,
      "examples": []
    }
  ],
  "recurringProblems": [],
  "summary": "",
  "recommendedActions": []
}

Feedback:
${JSON.stringify(cleanFeedback)}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  return completion.choices[0].message.content;
};
