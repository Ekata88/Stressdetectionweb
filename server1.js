const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Endpoint to receive data for stress prediction
app.post('/predict-stress', (req, res) => {
    const inputData = req.body;

    // Validate incoming data
    if (
        !inputData ||
        typeof inputData['snoring range'] === 'undefined' ||
        typeof inputData['respiration rate'] === 'undefined' ||
        typeof inputData['body temperature'] === 'undefined' ||
        typeof inputData['limb movement'] === 'undefined' ||
        typeof inputData['blood oxygen'] === 'undefined' ||
        typeof inputData['eye movement'] === 'undefined' ||
        typeof inputData['hours of sleep'] === 'undefined' ||
        typeof inputData['heart rate'] === 'undefined'
    ) {
        return res.status(400).json({ error: 'Invalid input data.' });
    }

    // Prepare input for the Python script
    const pythonProcess = spawn('python3', ['predict.py', JSON.stringify(inputData)]);

    pythonProcess.stdout.on('data', (data) => {
        const prediction = data.toString();
        return res.status(200).json({
            predictedStressLevel: prediction,
            inputData: inputData,
        });
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        return res.status(500).json({ error: 'Error predicting stress level.' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
