(async () => {
    const scriptTag = document.currentScript;
    const locations = scriptTag.getAttribute('loc') || 'Inverloch';
    const API_URL = `https://cdn.gippslander.com.au/get-jobs?loc=${encodeURIComponent(locations)}`;

    const container = document.createElement('div');
    // Set to 100% width with a larger max-width for a more expansive feel
    container.style.cssText = `
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        width: 100%;
        max-width: 850px; 
        margin: 20px auto;
        padding: 0 15px;
        box-sizing: border-box;
    `;
    scriptTag.parentNode.insertBefore(container, scriptTag);

    try {
        const response = await fetch(API_URL);
        const jobs = await response.json();

        if (!jobs || jobs.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:40px; color:#666; border:1px dashed #ccc; border-radius:16px;">No current openings in ${locations}. Check back soon!</div>`;
            return;
        }

        const jobCardsHtml = jobs.slice(0, 5).map(job => {
            const logo = job.employer.logo || 'https://gippslander.com.au/favicon.ico';
            const locationText = job.location.split(',')[0];
            const jobType = job.job_type?.name || 'Full-time';

            return `
            <div class="gipps-card" style="
                background: #fff;
                border: 1px solid #eef0f2;
                border-radius: 16px;
                padding: 20px 24px;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.02);
                transition: all 0.2s ease;
            ">
                <div style="width: 56px; height: 56px; flex-shrink: 0; margin-right: 20px;">
                    <img src="${logo}" style="width: 100%; height: 100%; border-radius: 10px; object-fit: contain; border: 1px solid #f8f9fa;">
                </div>

                <div style="flex-grow: 1;">
                    <div style="font-weight: 700; font-size: 17px; color: #1a1b1e; margin-bottom: 4px;">${job.title}</div>
                    <div style="font-size: 14px; color: #525960; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
                        <span>${job.employer.name}</span>
                    </div>
                    
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <span style="background: #f8f9fa; color: #4b5563; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; border: 1px solid #e5e7eb;">
                            📍 ${locationText}
                        </span>
                        <span style="background: #ecfdf5; color: #065f46; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 500; border: 1px solid #d1fae5;">
                            💼 ${jobType}
                        </span>
                    </div>
                </div>

                <a href="${job.job_details_url}" target="_blank" class="gipps-apply-btn" style="
                    background: #a39c8e;
                    color: white;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 14px;
                    margin-left: 20px;
                    white-space: nowrap;
                    transition: background 0.2s;
                ">Apply</a>
            </div>`;
        }).join('');

        container.innerHTML = `
            <style>
                .gipps-card:hover { border-color: #d1d8df; box-shadow: 0 8px 16px rgba(0,0,0,0.04); transform: translateY(-1px); }
                .gipps-apply-btn:hover { background: #8e8779 !important; }
                @media (max-width: 600px) {
                    .gipps-card { flex-direction: column; text-align: center; padding: 20px; }
                    .gipps-card div { margin-right: 0; margin-bottom: 10px; align-items: center; justify-content: center; }
                    .gipps-apply-btn { margin-left: 0; margin-top: 15px; width: 100%; box-sizing: border-box; }
                }
            </style>
            
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:16px; padding:0 5px;">
                <div>
                    <h2 style="font-size: 20px; font-weight: 800; color: #1a1b1e; margin: 0;">Local Jobs in ${locations}</h2>
                    <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280;">Hand-picked vacancies from your local community</p>
                </div>
                <a href="https://gippslander.com.au" target="_blank" style="color: #0366d6; font-size: 14px; font-weight: 600; text-decoration: none;">View All →</a>
            </div>

            ${jobCardsHtml}

            <div style="margin-top: 24px; padding: 16px; border-top: 1px solid #eee; display: flex; flex-direction: column; align-items: center; gap: 12px;">
                <a href="https://gippslander.com.au/post-a-job" target="_blank" style="font-size: 13px; color: #0366d6; font-weight: 600; text-decoration: none;">
                    + Post a job for your business here
                </a>
                
                <div style="display: flex; align-items: center; gap: 8px; opacity: 0.8;">
                    <span style="font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Powered by</span>
                    <a href="https://gippslander.com.au" target="_blank">
                        <img src="https://d3535lqr6sqxto.cloudfront.net/logos/rEkuQybTnVw95OUPNTLLVxtGB7t4BbAVgbRJTndj.png" alt="Gippslander" style="height: 24px; display: block;">
                    </a>
                </div>
            </div>
        `;

    } catch (e) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#fa5252;">Error loading jobs.</div>`;
    }
})();
