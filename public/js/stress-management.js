// Fetch stress level and management tips
async function fetchStressManagementData() {
  try {
    // Step 1: Fetch stress level from Fitbit data
    const fitbitResponse = await fetch('/fitbit/data');
    if (!fitbitResponse.ok) {
      throw new Error(`Failed to fetch Fitbit data: ${fitbitResponse.status} - ${fitbitResponse.statusText}`);
    }
    const fitbitData = await fitbitResponse.json();
    const predictedStressLevel = fitbitData.predictedStressLevel || 0;
    console.log("[INFO] Predicted Stress Level:", predictedStressLevel);

    // Step 2: Fetch stress tips based on the stress level
    const tipsResponse = await fetch('/get-stress-tips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stressLevel: predictedStressLevel }),
    });
    if (!tipsResponse.ok) {
      throw new Error(`Failed to fetch stress tips: ${tipsResponse.status} - ${tipsResponse.statusText}`);
    }
    const tipsData = await tipsResponse.json();
    const tips = tipsData.content ? tipsData.content.trim() : "No tips available";
    console.log("[INFO] Stress Management Tips:", tips);

    // Update the UI
    document.getElementById('predicted-stress-level').innerText = `Predicted Stress Level: ${predictedStressLevel}`;
    document.getElementById('stress-tips').innerText = tips;

    // Store tips locally for fallback usage
    storeStressTips(predictedStressLevel, tips);
  } catch (error) {
    console.error("[ERROR] Failed to fetch stress management data:", error);

    // Fallback: Retrieve stored tips if available
    const storedData = getStoredStressTips();
    document.getElementById('stress-tips').innerText =
      storedData.tips || "Error retrieving tips. Please try again later.";
  }
}

// Function to store stress tips in local storage
function storeStressTips(stressLevel, tips) {
  localStorage.setItem('stressLevel', stressLevel.toString());
  localStorage.setItem('stressTips', tips);
}

// Function to retrieve stored stress tips
function getStoredStressTips() {
  return {
    stressLevel: localStorage.getItem('stressLevel'),
    tips: localStorage.getItem('stressTips'),
  };
}

// Fetch stress management data when the page loads
window.onload = fetchStressManagementData;
