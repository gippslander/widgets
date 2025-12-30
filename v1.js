(async () => {
    // 1. Find the script tag itself to read the 'loc' attribute
    const scriptTag = document.currentScript;
    const locations = scriptTag.getAttribute('loc') || 'Inverloch';
    
    // 2. Point this to your actual Netlify function URL
    const API_BASE = "https://cdn.gippslander.com.au/get-jobs";
    const requestUrl = `${API_BASE}?loc=${encodeURIComponent(locations)}`;

    const containerId = "gippslander-widget";
    let container = document.getElementById(containerId);

    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        scriptTag.parentNode.insertBefore(container, scriptTag);
    }

    container.innerHTML = `<p style="font-family: sans-serif; color: #666;">Finding local jobs in ${locations}...</p>`;

    try {
        const response = await fetch(requestUrl);
        const jobs = await response.json();

        if (!jobs || jobs.length === 0) {
            container.innerHTML = `<p style="font-family: sans-serif; color: #666;">No current openings found for ${locations}.</p>`;
            return;
        }

        // 3. Build the HTML using your specific Jboard schema
        container.innerHTML = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; border: 1px solid #e1e4e8; border-radius: 8px; overflow: hidden; background: #fff;">
                <div style="background: #f6f8fa; padding: 12px 15px; border-bottom: 1px solid #e1e4e8; display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: #24292e;">Local Jobs via Gippslander</span>
                    <a href="https://gippslander.com.au" target="_blank" style="font-size: 12px; color: #0366d6; text-decoration: none;">View All →</a>
                </div>
                <div style="padding: 0 15px;">
                    ${jobs.slice(0, 5).map(job => `
                        <div style="padding: 15px 0; border-bottom: 1px solid #eee; display: flex; align-items: flex-start;">
                            <img src="${job.employer.logo}" alt="${job.employer.name}" style="width: 40px; height: 40px; border-radius: 4px; margin-right: 12px; object-fit: contain; border: 1px solid #eee;">
                            <div style="flex: 1;">
                                <h4 style="margin: 0 0 4px 0; font-size: 15px;">
                                    <a href="${job.job_details_url}" target="_blank" style="color: #0366d6; text-decoration: none;">${job.title}</a>
                                </h4>
                                <div style="font-size: 13px; color: #586069;">
                                    <strong>${job.employer.name}</strong> • ${job.location.split(',')[0]}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="padding: 10px; text-align: center; background: #fff;">
                    <a href="https://gippslander.com.au/post-a-job" target="_blank" style="font-size: 12px; color: #6a737d; text-decoration: none;">+ Post a job here</a>
                </div>
            </div>
        `;
    } catch (error) {
        container.innerHTML = `<p style="color: red;">Unable to load jobs at this time.</p>`;
        console.error("Gippslander Widget Error:", error);
    }
})();
