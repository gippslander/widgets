export const handler = async (event) => {
  const API_KEY = process.env.JBOARD_API_KEY; 
  const locParam = event.queryStringParameters.loc || "";
  
  // Split locations or default to an empty string to get all jobs
  const towns = locParam ? locParam.split(',').map(t => t.trim()) : [""];

  try {
    const requests = towns.map(async (town) => {
      // Updated endpoint: /api/jobs
      // Added parameters: page=1 and perPage=20
      const url = `https://app.jboard.io/api/jobs?filter[query]=${encodeURIComponent(town)}&filter[final_status]=active&page=1&perPage=20`;
      
      const response = await fetch(url, {
        headers: { "Authorization": API_KEY }
      });

      // If Jboard returns an error (like a 401 or 404), return empty items for that town
      if (!response.ok) return { items: [] };
      
      return response.json();
    });

    const responses = await Promise.all(requests);
    
    // According to your schema, jobs live in the 'items' array
    let allJobs = responses.flatMap(r => r.items || []);

    // Deduplicate jobs by their unique ID
    const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.id, job])).values());

    return {
      statusCode: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
      body: JSON.stringify(uniqueJobs)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to connect to Jboard" }) };
  }
};
