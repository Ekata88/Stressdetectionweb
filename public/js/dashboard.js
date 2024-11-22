// Fetch Fitbit data on page load and on button click
async function fetchFitbitData() {
  try {
    const response = await fetch('/fitbit/data');
    if (!response.ok) {
      throw new Error('Failed to fetch Fitbit data');
    }

    // Parse the JSON response
    const data = await response.json();
    console.log("[DEBUG] Full Response:", data);

    // Extract and log predictedStressLevel
    const predictedStressLevel = data.predictedStressLevel || 0; 
    console.log("[INFO] Predicted Stress Level:", predictedStressLevel);

    // Display predicted stress level on the dashboard
    const predictedStressLevelElement = document.getElementById('stress-level-value');
    if (predictedStressLevelElement) {
      predictedStressLevelElement.innerText = predictedStressLevel; // Update DOM
    } else {
      console.error("[ERROR] Element with ID 'stress-level-value' not found.");
    }

    // Continue updating other dashboard elements (e.g., snoring rate, respiration rate)
    document.getElementById("snoring-rate").querySelector("p").innerText = data['snoring range']
      ? `${data['snoring range']} dB`
      : "No Data Available";
    document.getElementById("respiration-rate").querySelector("p").innerText = data['respiration rate']
      ? `${data['respiration rate']} BPM`
      : "No Data Available";
    document.getElementById("body-temp").querySelector("p").innerText = data['body temperature']
      ? `${data['body temperature']}°F`
      : "No Data Available";
    document.getElementById("limb-movement").querySelector("p").innerText = data['limb movement']
      ? `${data['limb movement']} movements/min`
      : "No Data Available";
    document.getElementById("body-oxygen").querySelector("p").innerText = data['blood oxygen']
      ? `${data['blood oxygen']}%`
      : "No Data Available";
    document.getElementById("sleeping-hrs").querySelector("p").innerText = data['hours of sleep']
      ? `${data['hours of sleep']} hrs`
      : "No Data Available";

    // Update heart rate
    const heartRateElement = document.getElementById("heart-rate").querySelector("p");
    if (data['heart rate'] && data['heart rate'] !== 'N/A') {
      heartRateElement.innerText = `${data['heart rate']} BPM`;
    } else {
      heartRateElement.innerText = "Heart Rate Unavailable";
    }
  } catch (error) {
    console.error("[ERROR] Failed to fetch Fitbit data:", error);
  }
}

// Call fetchFitbitData when the page loads
window.onload = fetchFitbitData;

// Set up the button to fetch stress prediction data on click
document.getElementById("refresh-data-btn").addEventListener("click", () => {
  const inputData = {
    'snoring range': 10,
    'respiration rate': 16,
    'body temperature': 98.6,
    'limb movement': 5,
    'blood oxygen': 95,
    'hours of sleep': 8,
    'heart rate': 70,
  };
  fetchStressPrediction(inputData);
});
