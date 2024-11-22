import sys
import json
import joblib
import numpy as np

# Load the trained model
model = joblib.load('rf_stress_model.pkl')

# Get input data from command line arguments
input_data = json.loads(sys.argv[1])

# Prepare input features based on the expected order (14 features in total)
features = np.array([[input_data['snoring range'],
                      input_data['respiration rate'],
                      input_data['body temperature'],
                      input_data['limb movement'],
                      input_data['blood oxygen'],
                      input_data['eye movement'],
                      input_data['hours of sleep'],
                      input_data['heart rate'],
                      input_data.get('body temperature_missing', 0),  # Add missing value indicator
                      input_data.get('limb movement_missing', 0),     # Add missing value indicator
                      input_data.get('blood oxygen_missing', 0),      # Add missing value indicator
                      input_data.get('eye movement_missing', 0),      # Add missing value indicator
                      input_data.get('hours of sleep_missing', 0),    # Add missing value indicator
                      input_data.get('heart rate_missing', 0)         # Add missing value indicator
                     ]])

# Make prediction
prediction = model.predict(features)

# Output the prediction
print(prediction[0])

