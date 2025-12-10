/**
 * GIPPSLANDER TRENDING TAGS CONFIGURATION
 * ---------------------------------------
 * This file controls the "Popular Searches" pills on the homepage.
 * * INSTRUCTIONS:
 * 1. Edit the list below.
 * 2. Commit changes to GitHub.
 * 3. Netlify will auto-update the file.
 * * FIELDS:
 * - label:  The text shown on the pill.
 * - href:   The link where the user goes when clicking.
 * - type:   Selects the icon. Options are:
 * 'loc'   (Location Pin - Red)
 * 'work'  (Briefcase - Blue)
 * 'edu'   (School/Education - Purple)
 * 'gen'   (Sparkle/General - Orange)
 * 'entry' (Seedling/Entry Level - Green)
 * - weight: (Optional) 1-10. Higher numbers mean this tag appears more often 
 * in the random rotation. Default is 1.
 */

window.GIPPS_TRENDING_TAGS = [
  // --- LOCATIONS ---
  { 
    label: "Traralgon", 
    href: "/jobs/in-traralgon-victoria-australia", 
    type: 'loc', 
    weight: 10 
  },
  { 
    label: "Sale", 
    href: "/jobs/in-sale-victoria-australia", 
    type: 'loc', 
    weight: 8 
  },
  { 
    label: "Warragul", 
    href: "/jobs/in-warragul-victoria-australia", 
    type: 'loc', 
    weight: 8 
  },
  { 
    label: "Bairnsdale", 
    href: "/jobs/in-bairnsdale-victoria-australia", 
    type: 'loc', 
    weight: 6 
  },
  { 
    label: "Inverloch", 
    href: "/jobs/in-inverloch-victoria-australia", 
    type: 'loc', 
    weight: 8 
  },
  { 
    label: "Wonthaggi", 
    href: "/jobs/in-wonthaggi-victoria-australia", 
    type: 'loc', 
    weight: 8 
  },  

  // --- JOB CATEGORIES ---
  { 
    label: "Retail", 
    href: "/jobs/retail-and-hospitality", 
    type: 'gen', 
    weight: 9 
  },
  { 
    label: "Healthcare", 
    href: "/jobs/healthcare-and-medical", 
    type: 'gen', 
    weight: 2 
  },
  { 
    label: "Education", 
    href: "/jobs/education-and-training", 
    type: 'edu', 
    weight: 1 
  },
  { 
    label: "Trades", 
    href: "/jobs/construction-and-trades", 
    type: 'work', 
    weight: 7 
  },
    { 
    label: "Cleaner", 
    href: "/jobs/maintenance-and-cleaning", 
    type: 'work', 
    weight: 7 
  },

  // --- WORK TYPES ---
  { 
    label: "Full-time", 
    href: "/jobs/full-time", 
    type: 'work', 
    weight: 4 
  },
  { 
    label: "Part-time", 
    href: "/jobs/part-time", 
    type: 'work', 
    weight: 4 
  },
  { 
    label: "Entry Level", 
    href: "/jobs/entry-level", 
    type: 'entry', 
    weight: 3 
  }
];
