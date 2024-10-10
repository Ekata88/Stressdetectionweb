import OpenAI from 'openai';  // Import OpenAI with ES module syntax
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set up the OpenAI client
const openAIClient = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],  // Ensure your API key is loaded from the .env file
});

// Create an Express application
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Get the current file's __dirname (ES Modules do not have __dirname by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get stress management tips based on stress level
app.post('/get-stress-tips', async (req, res) => {
  // Log the incoming request body to verify the stressLevel is being sent correctly
  console.log("Received request with body:", req.body);

  const { stressLevel } = req.body;
  
  // Log the stress level to ensure it's parsed correctly
  console.log("Received stress level:", stressLevel);

  try {
    // Log before making OpenAI API call
    console.log("Sending request to OpenAI API...");

    const response = await openAIClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a mental health assistant."
        },
        {
          role: "user",
          content: `I need brief, quick concise tips and tricks on managing my stress. give a single tip. My stress is rated on a scale of 1-10, 
                    with 1 being the lowest and 10 being the highest level of stress experience. 
                    My current rating is ${stressLevel}. Give me brief tips on how to lower my stress.`
        }
      ],
      model: "gpt-4o-mini"
    });

    // Log the response from OpenAI API
    console.log("Received response from OpenAI:", response);

    res.json(response.choices[0].message);
  } catch (error) {
    // Log the error if something goes wrong
    console.error('Error occurred while fetching stress tips:', error);

    res.status(500).json({ error: "Failed to retrieve stress management tips. Please try again later." });
  }
});

// Fallback route to handle all other routes (SPA behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and log that it has started
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
