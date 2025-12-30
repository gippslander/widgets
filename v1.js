(async () => {
    const scriptTag = document.currentScript;
    const locations = scriptTag.getAttribute('loc') || 'Inverloch';
    const API_URL = `https://cdn.gippslander.com.au/get-jobs?loc=${encodeURIComponent(locations)}`;

    const container = document.createElement('div');
    // Main outer container styling to match your screenshot
    container.style.cssText = `
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        max-width: 650px;
        margin: 20px auto;
        padding: 10px;
    `;
    scriptTag.parentNode.insertBefore(container, scriptTag);

    try {
        const response = await fetch(API_URL);
        const jobs = await response.json();

        if (!jobs || jobs.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:40px; color:#666;">No current openings in ${locations}.</div>`;
            return;
        }

        // Generate each job card
        const jobCardsHtml = jobs.slice(0, 5).map(job => {
            const logo = job.employer.logo || 'https://gippslander.com.au/favicon.ico';
            const locationText = job.location.split(',')[0];
            const jobType = job.job_type?.name || 'Full-time'; // Safely access job type

            return `
            <div class="gipps-card" style="
                background: #fff;
                border: 1px solid #eef0f2;
                border-radius: 16px;
                padding: 24px;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                transition: transform 0.2s ease, box-shadow 0.2s ease;
            ">
                <div style="width: 64px; height: 64px; flex-shrink: 0; margin-right: 20px;">
                    <img src="${logo}" style="width: 100%; height: 100%; border-radius: 12px; object-fit: contain; border: 1px solid #f0f0f0;">
                </div>

                <div style="flex-grow: 1;">
                    <div style="font-weight: 800; font-size: 18px; color: #1a1b1e; margin-bottom: 4px;">${job.title}</div>
                    <div style="font-size: 14px; color: #6a6e73; margin-bottom: 12px;">${job.employer.name}</div>
                    
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <span style="background: #f1f3f5; color: #495057; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">
                            ${locationText}, Victoria
                        </span>
                        <span style="background: #e7f5ff; color: #1971c2; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 500;">
                            ${jobType}
                        </span>
                    </div>
                </div>

                <a href="${job.job_details_url}" target="_blank" style="
                    background: #a39c8e;
                    color: white;
                    text-decoration: none;
                    padding: 12px 28px;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 14px;
                    margin-left: 20px;
                    transition: background 0.2s;
                ">Apply</a>
            </div>`;
        }).join('');

        container.innerHTML = `
            <style>
                .gipps-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
                    border-color: #d1d8df;
                }
                @media (max-width: 500px) {
                    .gipps-card { flex-direction: column; text-align: center; }
                    .gipps-card img { margin-right: 0; margin-bottom: 15px; }
                    .gipps-card a { margin-left: 0; margin-top: 20px; width: 100%; box-sizing: border-box; }
                    .gipps-card div { align-items: center; justify-content: center; }
                }
            </style>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding:0 10px;">
                <h2 style="font-size: 1.25rem; font-weight: 800; color: #1a1b1e; margin: 0;">Local Jobs via Gippslander</h2>
                <a href="https://gippslander.com.au" target="_blank" style="color: #007bff; font-size: 13px; font-weight: 600; text-decoration: none;">View All →</a>
            </div>
            ${jobCardsHtml}
            <div style="text-align: center; margin-top: 15px;">
                <a href="https://gippslander.com.au/post-a-job" target="_blank" style="font-size: 12px; color: #adb5bd; text-decoration: none;">+ Post a job here</a>
            </div>
        `;

    } catch (e) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#fa5252;">Unable to load current jobs.</div>`;
    }
})();
