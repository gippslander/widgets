export const handler = async (event) => {
  // 1. Get the towns from the URL (e.g., ?loc=Inverloch,Wonthaggi)
  const locationsStr = event.queryStringParameters.loc || "Inverloch";
  const locations = locationsStr.split(',').map(l => l.trim());

  // Your Jboard API Key (Keep this secret!)
  const API_KEY = "YOUR_JBOARD_API_KEY_HERE";

  try {
    // 2. Fetch jobs for each location
    const promises = locations.map(loc => 
      fetch(`https://app.jboard.io/api/v1/jobs?filter[query]=${encodeURIComponent(loc)}`, {
        headers: { "Authorization": API_KEY }
      }).then(res => res.json())
    );

    const responses = await Promise.all(promises);

    // 3. Combine results and remove duplicates (by Job ID)
    const allJobs = responses.flatMap(r => r.items || []);
    const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.id, job])).values());

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allows any partner site to call this
        "Content-Type": "application/json"
      },
      body: JSON.stringify(uniqueJobs)
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch jobs" })
    };
  }
};
