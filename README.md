# Stressdetectionweb
Front-End Documentation
====================================

This project integrates a dynamic front-end with a robust back-end to deliver stress prediction and management tips based on user health data. Below is a detailed description of the key files in the application.

Short Instructions
==================

1. **Setup**:
   - Place all front-end JavaScript files in the `/public/js` directory.
   - Install dependencies with `npm install`.
   - Register app on https://www.fitbit.com to obtain FITBIT_CLIENT_ID and FITBIT_CLIENT_SECRET.
   - Use https://platform.openai.com/ to obtain OpenAI OPENAI_API_KEY.
   - Add the following API keys to the `.env` file in the root directory:
     - `OPENAI_API_KEY`: Your OpenAI API key.
     - `FITBIT_CLIENT_ID`: Fitbit API client ID.
     - `FITBIT_CLIENT_SECRET`: Fitbit API client secret.

2. **Run the Server**:
   - Start the server with `node server.js` or `npm start`.
    - Server1.js - Port : 3000 (backend - prediction-model).
    - Server.js - Port : 5000 (frontend - ui).

3. **Fitbit API**:
   - Use `http://localhost:5000/auth/fitbit` to authenticate with the Fitbit API.
   - Access Fitbit data at `http://localhost:5000/fitbit/data`.

4. **Front-End**:
   - Open the app in a browser, navigate through the dashboard, and explore dynamic stress prediction and management features.

1. server.js (Back-End)
-----------------------
Purpose:
- The main backend server that connects the front-end to APIs, manages user sessions, and processes requests.

Key Features:
- OpenAI Integration:
  - Endpoint `/get-stress-tips`: Fetches stress management tips from OpenAI based on the user's stress level.
- Fitbit Integration:
  - OAuth2 Authentication with Fitbit API to fetch user health data.
  - Endpoint `/fitbit/data`: Retrieves metrics such as heart rate, skin temperature, and sleep hours from Fitbit.
- Session Management:
  - Uses `express-session` to manage user sessions securely.
- Static File Serving:
  - Serves front-end files from the `/public` directory.
- Fallback Routes:
  - Redirects all undefined routes to `index.html`.

Endpoints:
- `/get-stress-tips` (POST): Fetches stress tips based on a stress level input.
- `/fitbit/data` (GET): Fetches and aggregates user health data for stress prediction.
- `/auth/fitbit` (GET): Initiates Fitbit OAuth2 authentication flow.
- `/fitbit/callback` (GET): Handles Fitbit API callback and stores user tokens.
- `/auth/fitbit/success` (GET): Displays a success message after Fitbit authentication.
- `/auth/fitbit/failure` (GET): Displays an error message if Fitbit authentication fails.

Setup:
- Requires environment variables:
  - `OPENAI_API_KEY`: OpenAI API key.
  - `FITBIT_CLIENT_ID` and `FITBIT_CLIENT_SECRET`: Fitbit API credentials.
- Uses `dotenv` to load environment variables.

2. dashboard.js
---------------
Purpose:
- Manages the display of user data fetched from the Fitbit API on the dashboard.

Key Features:
- Fetches real-time data from the `/fitbit/data` endpoint upon page load and button click.
- Updates UI components like stress level, snoring rate, heart rate, and body temperature dynamically.
- Provides fallback messages if data is unavailable.

Entry Points:
- `window.onload`: Triggers `fetchFitbitData()` to load Fitbit data upon page initialization.
- Button: A refresh button triggers data updates via `fetchStressPrediction()`.

3. script.js
------------
Purpose:
- Provides smooth navigation for in-page links.

Key Features:
- Implements smooth scrolling for navigation links targeting sections within the page.
- Ensures better user experience when navigating between sections of the app.

4. stress-management.js
-----------------------
Purpose:
- Fetches and displays stress management tips based on user data.

Key Features:
- Calls the same `/fitbit/data` endpoint to extract stress levels and corresponding tips.
- Updates stress management tips dynamically on the UI.
- Stores tips locally in `localStorage` for offline access and error fallback.
- Provides error handling and fallback mechanisms to ensure a smooth user experience.

5. about.js
-----------
Purpose:
- Adds animations and interactivity to the "About" page.

Key Features:
- Fades in the header and developer profile cards with smooth animations.
- Provides hover effects for profile cards, enhancing interactivity.
- Implements smooth scrolling for internal navigation links.

Dynamic Elements in the UI
--------------------------
- Stress Level: Displayed dynamically on the dashboard using `#stress-level-value`.
- Stress Management Tips: Updated dynamically using `#stress-tips`.
- Interactive Navigation: Smooth scroll implemented for all internal navigation links.

Setup Instructions
------------------
1. Place all the front-end JavaScript files in the `/public/js` directory.
2. Ensure the backend server is running to provide data for `/fitbit/data` and `/get-stress-tips` endpoints.
3. Open the application in a browser, and navigate through the dashboard and other sections to view dynamic updates and interactions.

Dependencies
------------
- Node.js: Required for running the server and managing dependencies.
- Express: Used for handling API requests and serving static files.
- Local Storage: Used in `stress-management.js` to cache stress tips.
- CSS for Animations: Ensure linked stylesheets provide necessary styles for transitions and effects.




# Stress Detection Backend

This repository contains the backend implementation of a stress detection web application that predicts stress levels based on input data from wearable sensors. The project uses a trained machine learning model to perform predictions and integrates with a web frontend for user interaction.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Endpoints](#endpoints)
- [How to Run](#how-to-run)
- [License](#license)

---

## Features
- Predicts stress levels using physiological data such as heart rate, snoring range, and more.
- Implements a trained neural network model optimized with SMOTE to handle imbalanced data.
- Provides REST API endpoints for stress prediction.

---

## Technologies Used
- **Backend Framework**: [Express.js](https://expressjs.com/)
- **Machine Learning**: Python, Scikit-learn, Imbalanced-learn
- **Language**: JavaScript (Node.js) and Python
- **Model Deployment**: Joblib for model serialization
- **Data Processing**: Pandas, NumPy

---

## Project Structure
Stressdetectionweb/ ├── server1.js # Backend server ├── predict.py # Python script for stress prediction ├── newstress_model.pkl # Trained Random Forest model ├── best_stress_model.pkl # Best trained MLPClassifier model ├── data_stress-2.csv # Dataset used for training the model ├── README.md # Project documentation


---

## Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/Ekata88/Stressdetectionweb.git
   cd Stressdetectionweb
   
Install Node.js dependencies:
npm install

Set up Python environment and install dependencies:
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

Add your trained model (rf_stress_model.pkl) to the repository if not already present.

Endpoints
POST /predict-stress
Description: Predicts the stress level based on input data.

Request Body:

{
    "snoring range": 3.4,
    "respiration rate": 18.5,
    "body temperature": 37.2,
    "limb movement": 5,
    "blood oxygen": 95,
    "eye movement": 2.1,
    "hours of sleep": 6,
    "heart rate": 78
}
Response:

{
    "predictedStressLevel": 1,
    "inputData": { ... }
}
How to Run

Start the backend server:
node server1.js

Send a POST request to the /predict-stress endpoint using a tool like Postman or curl:
curl -X POST http://localhost:3000/predict-stress -H "Content-Type: application/json" -d '{"snoring range":3.4,"respiration rate":18.5,"body temperature":37.2,"limb movement":5,"blood oxygen":95,"eye movement":2.1,"hours of sleep":6,"heart rate":78}'

The server will invoke predict.py to return the predicted stress level.

License

This project is open-source. Feel free to use and contribute!


Let me know if you’d like any additional sections or edits.
