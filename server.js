import OpenAI from 'openai';  // Import OpenAI with ES module syntax
import express from 'express';
import passport from 'passport';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import session from 'express-session';

// OpenAI API request logging middleware
const openAILogger = async (req, res, next) => {
  const originalCreateChatCompletion = openAIClient.chat.completions.create;
  
  openAIClient.chat.completions.create = async function (...args) {
    console.log('OpenAI API Request:', JSON.stringify(args[0], null, 2));
    try {
      const response = await originalCreateChatCompletion.apply(this, args);
      console.log('OpenAI API Response:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  };
  
  next();
};

dotenv.config();

// Initialize OpenAI client
const openAIClient = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(openAILogger); // Add the OpenAI logger middleware

// Configure session middleware before passport initialization
app.use(
  session({
    secret: 'your_secret_key', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },  
  })
);

// Passport configuration for Fitbit OAuth2
app.use(passport.initialize());
app.use(passport.session());

// Fitbit API credentials
const FITBIT_CLIENT_ID = process.env.FITBIT_CLIENT_ID;
const FITBIT_CLIENT_SECRET = process.env.FITBIT_CLIENT_SECRET;
const FITBIT_REDIRECT_URI = `http://localhost:5000/fitbit/callback`;

// Configure Fitbit OAuth2 strategy
const { FitbitOAuth2Strategy } = await import('passport-fitbit-oauth2');
passport.use(new FitbitOAuth2Strategy({
  clientID: FITBIT_CLIENT_ID,
  clientSecret: FITBIT_CLIENT_SECRET,
  callbackURL: FITBIT_REDIRECT_URI
},
function(accessToken, refreshToken, profile, done) {
  const user = { fitbitId: profile.id, accessToken, refreshToken };
  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Route to start Fitbit authentication
app.get('/auth/fitbit', passport.authenticate('fitbit', {
  scope: [
    'activity', 'cardio_fitness', 'electrocardiogram', 'heartrate', 'irregular_rhythm_notifications',
    'location', 'nutrition', 'oxygen_saturation', 'profile', 'respiratory_rate',
    'settings', 'sleep', 'social', 'temperature', 'weight'
  ]
}));

// Callback route for Fitbit OAuth
app.get('/fitbit/callback', passport.authenticate('fitbit', { failureRedirect: '/auth/fitbit/failure' }), (req, res) => {
  req.session.user = req.user;
  console.log("[INFO] Fitbit authentication successful:", req.user);
  res.redirect('/auth/fitbit/success');
});

// Success and failure routes
app.get('/auth/fitbit/success', (req, res) => {
  res.send("Fitbit authentication successful!");
});

app.get('/auth/fitbit/failure', (req, res) => {
  res.send("Fitbit authentication failed.");
});

// Route to check session for debugging
app.get('/check-session', (req, res) => {
  res.json(req.session.user || { error: "User not authenticated" });
});

// Route to fetch data from the Fitbit API
app.get('/fitbit/data', async (req, res) => {
  const user = req.session.user;

  if (!user || !user.accessToken) {
    return res.status(401).json({ error: "User not authenticated" });
  }

  try {
    console.log("[INFO] Using Fitbit access token:", user.accessToken);

    // Fetch heart rate data from Fitbit API
    const heartRateResponse = await fetch('https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json', {
      headers: { 'Authorization': `Bearer ${user.accessToken}` }
    });

    const heartRateData = await heartRateResponse.json();
    if (!heartRateResponse.ok) {
      throw new Error(`Heart rate API call failed: ${heartRateResponse.statusText}`);
    }

    // Extract heart rate zones and calculate average min value
    const heartRateZones = heartRateData['activities-heart'][0]?.value?.heartRateZones || [];
    let averageMinValue = 'N/A'; // Default if no zones are available
    if (heartRateZones.length > 0) {
      const totalMin = heartRateZones.reduce((sum, zone) => sum + zone.min, 0);
      averageMinValue = totalMin / heartRateZones.length;
    }
    console.log("[INFO] Average Min Value:", averageMinValue);

    // Fetch sleep data from Fitbit API with a dynamic date range
    const endDate = new Date(); // Today's date
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30); // 30 days ago

    // Format dates as yyyy-MM-dd
    const startDateFormatted = startDate.toISOString().split('T')[0];
    const endDateFormatted = endDate.toISOString().split('T')[0];

    const sleepResponse = await fetch(
      `https://api.fitbit.com/1.2/user/-/sleep/date/${startDateFormatted}/${endDateFormatted}.json`,
      {
        headers: { 'Authorization': `Bearer ${user.accessToken}` },
      }
    );

    const sleepData = await sleepResponse.json();
    if (!sleepResponse.ok) {
      throw new Error(`Sleep data API call failed: ${sleepResponse.statusText}`);
    }

    // Aggregate sleep data: Sum and average minutesAsleep
    let totalMinutesAsleep = 0;
    let sleepLogCount = 0;

    if (sleepData.sleep && sleepData.sleep.length > 0) {
      sleepData.sleep.forEach((log) => {
        totalMinutesAsleep += log.minutesAsleep || 0;
        sleepLogCount++;
      });
    }

    const averageSleepingHrs = sleepLogCount > 0
      ? Math.round((totalMinutesAsleep / sleepLogCount / 60) *10) / 10 // Convert minutes to hours
      : 7; // Default to 7 hours if no sleep data

    // Fetch skin temperature data
    const skinTempResponse = await fetch('https://api.fitbit.com/1/user/-/temp/skin/date/today.json', {
      headers: { 'Authorization': `Bearer ${user.accessToken}` },
    });
    const skinTempData = await skinTempResponse.json();

    if (!skinTempResponse.ok) {
      throw new Error(`Temperature (Skin) API call failed: ${skinTempResponse.statusText}`);
    }

    console.log("[INFO] Temperature (Skin) Response Data:", JSON.stringify(skinTempData, null, 2));

    // Extract nightly relative skin temperature value
    const defaultTempSkinValue = 98.6; // Default in Fahrenheit
    const tempSkinValue = (skinTempData?.tempSkin?.length > 0)
      ? skinTempData.tempSkin[0].value?.nightlyRelative ?? defaultTempSkinValue
      : defaultTempSkinValue;

    // Prepare data for stress prediction
    const predictionInput = {
      'snoring range': 10,       // Match the server's key
      'respiration rate': 16,
      'body temperature': tempSkinValue,
      'limb movement': 5,
      'blood oxygen': 95,
      'eye movement': 3,                 // Static placeholder for now
      'hours of sleep': averageSleepingHrs,
      'heart rate': tempSkinValue,
    };

    // Call the external stress prediction server
    let stressLevel = null;

    try {
      const predictionResponse = await fetch('http://localhost:3000/predict-stress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(predictionInput),
      });
    
      if (!predictionResponse.ok) {
        throw new Error(`Stress prediction API call failed: ${predictionResponse.statusText}`);
      }
    
      const predictionData = await predictionResponse.json();
      console.log("[INFO] Stress Prediction Response:", predictionData);
      
      if (predictionData.predictedStressLevel !== undefined && predictionData.predictedStressLevel !== null) {
        stressLevel = parseInt(predictionData.predictedStressLevel.toString().trim(), 10);
        console.log("[INFO] Parsed Stress Level:", stressLevel);
      } else {
        console.warn("[WARN] Missing predictedStressLevel in the response");
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch stress prediction:", error);
    }
    console.log("[INFO] Final Stress Level:", stressLevel);

    // Structure the response
    const dashboardData = {
      ...predictionInput,
      predictedStressLevel: stressLevel,
    };
    console.log("[INFO] Predicted Stress Level", stressLevel);  

    res.json(dashboardData);
  } catch (error) {
    console.error('[ERROR] Failed to fetch Fitbit data or predict stress:', error);
    res.status(500).json({ error: 'Failed to retrieve Fitbit data or predict stress' });
  }
});

// get stress tips based on stress level
app.post('/get-stress-tips', async (req, res) => {
  console.log("Received request with body:", req.body);
  const { stressLevel } = req.body;
  console.log("Received stress level:", stressLevel);

  try {
    console.log("Sending request to OpenAI API...");

    const response = await openAIClient.chat.completions.create({
      model: "gpt-4o-mini",
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
    });
    console.log("Received response from OpenAI:", response);
    res.json(response.choices[0].message);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve stress management tips. Please try again later." });
  }
}, (error) => {error});

// Default route to handle all other paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`[INFO] Server is running on port ${PORT}`);
});