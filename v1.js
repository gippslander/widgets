(async () => {
    const scriptTag = document.currentScript;
    const locations = scriptTag.getAttribute('loc') || 'Inverloch';
    const API_URL = `https://cdn.gippslander.com.au/get-jobs?loc=${encodeURIComponent(locations)}`;

    // Create the widget container with modern styling
    const container = document.createElement('div');
    container.style.cssText = `
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        max-width: 450px;
        margin: 10px auto;
        border: 1px solid #e1e4e8;
        border-radius: 12px;
        overflow: hidden;
        background: #ffffff;
        box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    `;
    scriptTag.parentNode.insertBefore(container, scriptTag);

    // Initial Loading State
    container.innerHTML = `<div style="padding: 30px; text-align: center; color: #6a737d;">Searching for jobs in ${locations}...</div>`;

    try {
        const response = await fetch(API_URL);
        const jobs = await response.json();

        if (!jobs || jobs.length === 0) {
            container.innerHTML = `
                <div style="padding: 30px; text-align: center;">
                    <p style="margin-bottom: 12px; color: #586069;">No current vacancies found in ${locations}.</p>
                    <a href="https://gippslander.com.au" target="_blank" style="color: #0366d6; font-weight: 600; text-decoration: none;">Browse all Gippsland Jobs</a>
                </div>`;
            return;
        }

        // Generate the job rows
        const jobListHtml = jobs.slice(0, 6).map(job => {
            const logo = job.employer.logo || 'https://gippslander.com.au/favicon.ico';
            const town = job.location.split(',')[0];
            
            return `
            <a href="${job.job_details_url}" target="_blank" class="gipps-job-row" style="
                display: flex;
                align-items: center;
                padding: 16px;
                text-decoration: none;
                border-bottom: 1px solid #f0f2f5;
                transition: background 0.2s ease;
            ">
                <div style="width: 48px; height: 48px; flex-shrink: 0; margin-right: 16px;">
                    <img src="${logo}" style="width: 100%; height: 100%; border-radius: 8px; object-fit: contain; border: 1px solid #f0f0f0;">
                </div>
                <div style="flex-grow: 1;">
                    <div style="font-weight: 700; color: #1a1a1a; font-size: 15px; line-height: 1.2; margin-bottom: 4px;">${job.title}</div>
                    <div style="font-size: 13px; color: #666;">
                        <span style="font-weight: 600; color: #444;">${job.employer.name}</span> • ${town}
                    </div>
                </div>
                <div style="color: #ccc; padding-left: 10px;">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path d="M7 5l5 5-5 5"/></svg>
                </div>
            </a>`;
        }).join('');

        // Set the final HTML structure
        container.innerHTML = `
            <div style="background: #fdfdfd; padding: 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #2d3436;">Jobs in ${locations}</h3>
                <img src="https://gippslander.com.au/favicon.ico" style="height: 20px; opacity: 0.8;">
            </div>
            <div style="max-height: 400px; overflow-y: auto;">
                ${jobListHtml}
            </div>
            <a href="https://gippslander.com.au" target="_blank" style="
                display: block;
                padding: 14px;
                text-align: center;
                background: #f8f9fa;
                color: #0366d6;
                text-decoration: none;
                font-size: 13px;
                font-weight: 700;
            ">
                View all ${jobs.length} jobs on Gippslander →
            </a>
            <style>
                .gipps-job-row:hover { background: #fcfcfc !important; }
                .gipps-job-row:last-child { border-bottom: none !important; }
            </style>
        `;

    } catch (e) {
        container.innerHTML = `<div style="padding: 20px; color: #d73a49; font-size: 14px; text-align: center;">Unable to load jobs at this time.</div>`;
    }
})();
