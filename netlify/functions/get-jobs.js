export const handler = async (event) => {
  // This pulls the key from the Netlify Environment Variable you just set
  const API_KEY = process.env.JBOARD_API_KEY; 
  const locParam = event.queryStringParameters.loc || "Inverloch";
  const towns = locParam.split(',').map(t => t.trim());

  try {
    const requests = towns.map(town => 
      fetch(`https://app.jboard.io/api/v1/jobs?filter[query]=${encodeURIComponent(town)}`, {
        headers: { "Authorization": API_KEY }
      }).then(res => res.json())
    );

    const responses = await Promise.all(requests);
    let allJobs = responses.flatMap(r => r.items || []);

    // Deduplicate by ID
    const uniqueJobs = Array.from(new Map(allJobs.map(job => [job.id, job])).values());

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(uniqueJobs)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
