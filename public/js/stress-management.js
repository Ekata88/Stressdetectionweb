// Function to extract stress level from URL parameters
function getStressLevelFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('stressLevel');
}

// Fetch stress level from URL
const stressLevel = getStressLevelFromURL();
console.log("Stress level from URL:", stressLevel);  // Log the stress level fetched from the URL

if (stressLevel) {
  // Log before making the request
  console.log("Making request to get stress tips for stress level:", stressLevel);
  
  // Make a POST request to the backend to get stress management tips
  fetch('/get-stress-tips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ stressLevel: stressLevel })  // Send stressLevel as JSON
  })
  .then(response => {
    console.log("Raw response received:", response);  // Log the raw response object
    return response.json();  // Parse the response as JSON
  })
  .then(data => {
    console.log("Parsed response data:", data);  // Log the entire parsed response

    // Access the content of the response directly
    if (data && data.content) {
      const tips = data.content.trim();
      console.log("Stress management tips received:", tips);  // Log the actual tips received
      document.getElementById('stress-tips').innerText = tips;
    } else {
      console.log("Unexpected response structure:", data);  // Log if the structure is unexpected
      document.getElementById('stress-tips').innerText = "No tips available. Please try again later.";
    }
  })
  .catch(error => {
    console.error('Error fetching tips:', error);  // Log any errors that occur
    document.getElementById('stress-tips').innerText = "Error retrieving tips. Please try again later.";
  });
} else {
  console.log("No stress level provided in URL.");  // Log if no stress level is provided
  document.getElementById('stress-tips').innerText = "No stress level provided.";
}
