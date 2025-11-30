(function() {
    // ------------------------------------------------------------------
    // 1. HTML WIDGET STRUCTURE (INJECTED FIRST)
    // This is the HTML that was outside your original <script> tag
    // ------------------------------------------------------------------
    const WIDGET_HTML = `
        <div class="gipps-top-bar">
            <div class="gipps-search-wrapper">
                <input type="text" id="gipps-search-input" placeholder="Search jobs (e.g. Barista, Nurse)...">
            </div>
            <a href="https://gippslander.com.au/pricing" target="_blank" class="gipps-post-btn">Post a Job</a>
        </div>

        <div id="gippslander-job-feed">
            <p class="gipps-loading">Loading local opportunities...</p>
        </div>

        <button id="gipps-load-more-btn" style="display:none;">Load More Jobs</button>

        <div class="gipps-footer">
            <span class="gipps-footer-text">Powered by</span>
            <a href="https://gippslander.com.au" target="_blank" class="gipps-footer-link">
                <img src="https://d3535lqr6sqxto.cloudfront.net/logos/rEkuQybTnVw95OUPNTLLVxtGB7t4BbAVgbRJTndj.png" alt="Gippslander" class="gipps-footer-logo">
            </a>
        </div>
    `;

    // Find the root element we told the client to put on their page
    const ROOT_ELEMENT = document.getElementById('gippslander-widget-root');

    // If the client embedded the root, inject the HTML structure and styles
    if (ROOT_ELEMENT) {
        ROOT_ELEMENT.innerHTML = WIDGET_HTML;
        // Add the outermost container ID back to the root element for CSS targeting
        ROOT_ELEMENT.id = 'gippslander-container'; 
    } else {
        console.error("Gippslander Widget Error: Could not find required container with ID 'gippslander-widget-root'.");
        return; // Stop execution if we can't find the root
    }

    // ------------------------------------------------------------------
    // 2. JS LOGIC (YOUR ORIGINAL CODE)
    // ------------------------------------------------------------------
    const ORIGINAL_URL = 'https://app.jboard.io/board/5976/feeds/ratg7azz61-visininverlochco';
    const PROXY_URL = 'https://corsproxy.io/?' + encodeURIComponent(ORIGINAL_URL);

    const CONTAINER = document.getElementById('gippslander-job-feed'); 
    const SEARCH_INPUT = document.getElementById('gipps-search-input');
    const LOAD_MORE_BTN = document.getElementById('gipps-load-more-btn');

    let ALL_JOBS = [];
    let visibleCount = 10; 

    // --- Helpers ---
    function getXmlVal(el, tagName) {
        const node = el.querySelector(tagName);
        return node ? node.textContent.trim() : '';
    }

    function formatSalary(salaryStr) {
        if (!salaryStr) return '';
        const isHourly = salaryStr.includes('hourly');
        const matches = salaryStr.match(/([\d\.]+)/g);
        if (!matches) return '';

        const min = parseFloat(matches[0]);
        const max = matches[1] ? parseFloat(matches[1]) : null;

        if (isHourly) {
            const minClean = Math.round(min);
            const maxClean = max ? Math.round(max) : null;
            return maxClean ? `$${minClean} - $${maxClean} / hr` : `$${minClean} / hr`;
        } else {
            const minK = Math.round(min / 1000) + 'k';
            if (!max) return `$${minK}`;
            const maxK = Math.round(max / 1000) + 'k';
            return `$${minK} - $${maxK}`;
        }
    }

    function renderJobs(jobs, isSearch = false) {
        CONTAINER.innerHTML = ''; 
        const jobsToShow = isSearch ? jobs : jobs.slice(0, visibleCount);

        if (jobs.length === 0) {
            CONTAINER.innerHTML = '<p style="text-align:center; padding:40px; color:#666;">No jobs found matching your search.</p>';
            LOAD_MORE_BTN.style.display = 'none';
            return;
        }

        jobsToShow.forEach(item => {
            const card = document.createElement('div');
            card.className = 'gipps-job-card';

            const { title, company, location, type, link, salaryRaw, logoUrl } = item;
            const salaryFormatted = formatSalary(salaryRaw);
            let salaryTag = salaryFormatted ? `<span class="gipps-tag gipps-salary">${salaryFormatted}</span>` : '';

            let logoHtml;
            if (logoUrl && logoUrl.length > 0) {
                logoHtml = `<img src="${logoUrl}" class="gipps-logo-box" alt="${company}">`;
            } else {
                const letter = company.charAt(0);
                logoHtml = `<div class="gipps-logo-box is-letter">${letter}</div>`;
            }

            card.innerHTML = `
                <div class="gipps-card-top">
                    ${logoHtml}
                    <div class="gipps-job-info">
                        <h3 class="gipps-job-title">${title}</h3>
                        <div class="gipps-job-company">${company}</div>
                        <div class="gipps-job-meta">
                            <span class="gipps-tag">${location}</span>
                            ${type ? `<span class="gipps-tag">${type}</span>` : ''}
                            ${salaryTag}
                        </div>
                    </div>
                </div>
                <a href="${link}" target="_blank" class="gipps-apply-btn">Apply</a>
            `;
            CONTAINER.appendChild(card);
        });

        if (!isSearch && jobs.length > visibleCount) {
            LOAD_MORE_BTN.style.display = 'block';
            LOAD_MORE_BTN.textContent = `Load More Jobs (${jobs.length - visibleCount} remaining)`;
        } else {
            LOAD_MORE_BTN.style.display = 'none';
        }
    }

    // --- Fetch & Init ---
    fetch(PROXY_URL)
    .then(response => response.text())
    .then(str => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(str, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        if (items.length === 0) {
            CONTAINER.innerHTML = '<p style="text-align:center; padding:20px;">No current listings available.</p>';
            return;
        }

        ALL_JOBS = Array.from(items).map(item => ({
            title: getXmlVal(item, 'title'),
            company: getXmlVal(item, 'employer_name') || 'Gippslander',
            location: getXmlVal(item, 'location'),
            type: getXmlVal(item, 'job_type_title'),
            link: getXmlVal(item, 'url'),
            salaryRaw: getXmlVal(item, 'salary'),
            logoUrl: getXmlVal(item, 'employer_logo')
        }));

        renderJobs(ALL_JOBS);
    })
    .catch(err => {
        console.error('Widget Error:', err);
        CONTAINER.innerHTML = '<p style="text-align:center; padding:20px;">View all jobs at <a href="https://gippslander.com.au">Gippslander.com.au</a></p>';
    });

    // --- Search Listener ---
    SEARCH_INPUT.addEventListener('keyup', (e) => {
        const term = e.target.value.toLowerCase();

        if (term.length === 0) {
            renderJobs(ALL_JOBS, false);
            return;
        }

        const filtered = ALL_JOBS.filter(job => 
            job.title.toLowerCase().includes(term) || 
            job.company.toLowerCase().includes(term) || 
            job.location.toLowerCase().includes(term)
        );
        renderJobs(filtered, true);
    });

    // --- Load More Listener ---
    LOAD_MORE_BTN.addEventListener('click', () => {
        visibleCount += 10;
        renderJobs(ALL_JOBS, false);
    });
})();
