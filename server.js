import OpenAI from 'openai';  // import w- ES syntax
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();
const openAIClient = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],  // API key is in .env 
});

// express app
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// get stress tips based on stress level
app.post('/get-stress-tips', async (req, res) => {
  //console.log("Received request with body:", req.body); // log the incoming request
  const { stressLevel } = req.body;
  //console.log("Received stress level:", stressLevel); // log the stress level

  try {
    //console.log("Sending request to OpenAI API..."); // before api call

    const response = await openAIClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a mental health assistant."
        },
        {
          role: "user",
          content: `I need brief, quick concise tips and tricks on managing my stress. give a single tip. My stress is rated on a scale of 1-10, 
                    with 1 being the lowest and 10 being the highest level of stress experience. Don't repeat answers often. 
                    My current rating is ${stressLevel}. Give me brief tips on how to lower my stress.
                    Also give a mindefuleness tip to get my spirits up; keep it short!
                    Provide information in a professional way.`
        }
      ],
      model: "gpt-4o-mini"
    });
    //console.log("Received response from OpenAI:", response); // log response
    res.json(response.choices[0].message);
  } 
  
  catch (error) {
    //console.error('Error occurred while fetching stress tips:', error); // log error
    res.status(500).json({ error: "Failed to retrieve stress management tips. Please try again later." });
  }
});

// if fail to res
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); //log that it has started
});
