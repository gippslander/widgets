(async () => {
    const scriptTag = document.currentScript;
    const locations = scriptTag.getAttribute('loc') || 'Inverloch';
    const API_URL = `https://cdn.gippslander.com.au/get-jobs?loc=${encodeURIComponent(locations)}`;

    const container = document.createElement('div');
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
        const allJobs = await response.json();

        if (!allJobs || allJobs.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:40px; color:#666; border:1px dashed #ccc; border-radius:16px;">No current openings in ${locations}.</div>`;
            return;
        }

        container.innerHTML = `
            <style>
                .gipps-search-container { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; }
                .gipps-search-input { 
                    flex-grow: 1; padding: 12px 20px; border-radius: 50px; border: 1px solid #e2e8f0; 
                    font-size: 14px; outline: none; background: #f8fafc;
                }
                .gipps-post-btn { 
                    background: #a39c8e; color: white; text-decoration: none; padding: 12px 24px; 
                    border-radius: 50px; font-weight: 700; font-size: 14px; white-space: nowrap;
                }
                .gipps-card { 
                    background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 24px; 
                    margin-bottom: 12px; display: flex; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); 
                }
                .gipps-badge {
                    background: #f1f5f9; color: #475569; padding: 4px 12px; border-radius: 6px; 
                    font-size: 12px; font-weight: 600; margin-top: 8px; display: inline-block;
                }
                .gipps-apply-btn { 
                    background: #a39c8e; color: white; text-decoration: none; padding: 10px 28px; 
                    border-radius: 8px; font-weight: 700; font-size: 14px; margin-left: auto;
                }
                @media (max-width: 600px) {
                    .gipps-card { flex-direction: column; text-align: center; }
                    .gipps-apply-btn { margin-left: 0; margin-top: 15px; width: 100%; }
                    .gipps-search-container { flex-direction: column; }
                    .gipps-post-btn { width: 100%; text-align: center; }
                }
            </style>
            
            <div class="gipps-search-container">
                <input type="text" class="gipps-search-input" id="gippsSearch" placeholder="Search jobs (e.g. Barista, Nurse)...">
                <a href="https://gippslander.com.au/post-a-job" target="_blank" class="gipps-post-btn">Post a Job</a>
            </div>

            <div id="gippsJobList"></div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; display: flex; flex-direction: column; align-items: center; gap: 10px;">
                <div style="display: flex; align-items: center; gap: 8px; opacity: 0.8;">
                    <span style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Powered by</span>
                    <a href="https://gippslander.com.au" target="_blank">
                        <img src="https://d3535lqr6sqxto.cloudfront.net/logos/rEkuQybTnVw95OUPNTLLVxtGB7t4BbAVgbRJTndj.png" alt="Gippslander" style="height: 24px;">
                    </a>
                </div>
            </div>
        `;

        const jobListContainer = document.getElementById('gippsJobList');
        const searchInput = document.getElementById('gippsSearch');

        const renderJobs = (filteredJobs) => {
            if (filteredJobs.length === 0) {
                jobListContainer.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8;">No matching jobs found.</div>`;
                return;
            }
            jobListContainer.innerHTML = filteredJobs.map(job => {
                const jobType = job.job_type?.name || 'Full-time';
                return `
                <div class="gipps-card">
                    <img src="${job.employer.logo || 'https://gippslander.com.au/favicon.ico'}" style="width: 56px; height: 56px; border-radius: 12px; object-fit: contain; margin-right: 20px; border: 1px solid #f1f5f9;">
                    <div style="text-align: left;">
                        <div style="font-weight: 700; font-size: 18px; color: #0f172a; margin-bottom: 2px;">${job.title}</div>
                        <div style="font-size: 14px; color: #64748b;">${job.employer.name}</div>
                        <div class="gipps-badge">${jobType}</div>
                    </div>
                    <a href="${job.job_details_url}" target="_blank" class="gipps-apply-btn">Apply</a>
                </div>
            `}).join('');
        };

        renderJobs(allJobs);

        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allJobs.filter(job => 
                job.title.toLowerCase().includes(term) || 
                job.employer.name.toLowerCase().includes(term)
            );
            renderJobs(filtered);
        });

    } catch (e) {
        container.innerHTML = `<div style="text-align:center; padding:20px; color:#ef4444;">Error loading jobs.</div>`;
    }
})();
