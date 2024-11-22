# Stressdetectionweb


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
