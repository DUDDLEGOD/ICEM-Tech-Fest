# Static Site Config

Edit the JSON blocks in this file, then rebuild/redeploy the site.
This keeps all site content static and removes the runtime CMS/server-config fetch.

## Hero
```json hero
{
  "institution": "INDIRA COLLEGE OF ENGINEERING & MANAGEMENT",
  "organizingLabel": "Organizing",
  "subLabel": "The Largest Gathering of Pune's Tech Innovators",
  "mainTitlePart1": "TECHNOFEST",
  "mainTitlePart2": "2026",
  "scrambleText": "THE ULTIMATE TECH ARENA",
  "buttonText": "INITIATE CONNECTION",
  "countdownDate": "2026-03-27T09:00:00"
}
```

## Announcement
```json announcement
{
  "enabled": false,
  "label": "Live Update",
  "message": "Registrations are now open for all TechnoFest 2026 events.",
  "ctaText": "View Events",
  "ctaHref": "#events-section"
}
```

## Registration
```json registration
{
  "isOpen": true,
  "closedMessage": "Registrations are currently paused. Please check back later or contact the organizing team.",
  "paymentUpiIds": [
    "ashishpdng@okicici"
  ]
}
```

## Sponsors
```json sponsors
[
  {
    "name": "Cognizant",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/4/43/Cognizant_logo_2022.svg"
  },
  {
    "name": "TCS",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg"
  },
  {
    "name": "Reliance",
    "logo": "https://upload.wikimedia.org/wikipedia/en/9/99/Reliance_Industries_Logo.svg"
  },
  {
    "name": "Infosys",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
  },
  {
    "name": "Wipro",
    "logo": "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg"
  }
]
```

## Social Links
```json socialLinks
{
  "instagram": "#",
  "twitter": "#",
  "linkedin": "#"
}
```

## Contact
```json contact
{
  "address": "Parandwadi, Pune, MH 410506",
  "email": "icem@indiraicem.ac.in",
  "phone": "+91 88559 77815",
  "institutionSiteUrl": "https://indiraicem.ac.in/",
  "footerBlurb": "Official technical wing of SCES. Focusing on Engineering & Management excellence."
}
```

## Brochure Visibility
```json brochureVisibility
{
  "CHAKRAVYUH": false,
  "NEUROAVATAR": false,
  "DATA_DASH": false,
  "CYBER_SHIELD": false,
  "BRIDGE": false,
  "FAST_FURIOUS": false,
  "CIRCUIT_CRAFTERS": false,
  "WEB_WIZARDS": false,
  "LAUNCHPAD": false
}
```

## About Page
```json about
{
  "eventBadge": "Live Event Briefing",
  "eventHeadline": "THE FESTIVAL OF",
  "eventHighlight": "FUTURE TECHNOLOGY",
  "eventQuote": "TechnoFest 2026 is the premier platform where technical proficiency meets innovative application. We convene the most ambitious engineering minds for a showcase of high-level competition.",
  "technicalFrameworkText": "Adhering to professional industry standards in hackathons and robotics.",
  "industryLinkageText": "Direct engagement between students and corporate technical leadership.",
  "eventImageUrl": "https://images.shiksha.com/mediadata/images/1552471453phpAHMSjf.jpeg",
  "institutionBadge": "Institutional Data",
  "institutionTitle": "INDIRA",
  "institutionHighlight": "CAMPUS_PROFILE",
  "institutionDescription": "Founded in 2007 under the SCES, ICEM is a leading engineering institute in Pune. We merge theoretical foundations with practical industrial exposure to foster holistic development.",
  "visionText": "Global leaders in technology through comprehensive academic research.",
  "missionText": "Equipping students with professional skillsets for technical innovation.",
  "campusImageUrl": "https://images.shiksha.com/mediadata/images/1571490951phpBvvHa3.jpeg",
  "campusLocationLabel": "Parandwadi / Pune / MH",
  "campusSiteUrl": "https://indiraicem.ac.in/",
  "stats": [
    {
      "label": "Uplink Est.",
      "value": "2007",
      "sub": "EST. YEAR"
    },
    {
      "label": "Competitions",
      "value": "12+",
      "sub": "TECH EVENTS"
    },
    {
      "label": "Participation",
      "value": "2.5K+",
      "sub": "ANNUAL REACH"
    },
    {
      "label": "Reward Pool",
      "value": "₹1.5L+",
      "sub": "TOTAL PRIZES"
    }
  ]
}
```

## Events
```json events
[
  {
    "id": "CHAKRAVYUH",
    "name": "Chakravyuh [cite: 267]",
    "tagline": "Break through the challenge, innovate, and conquer the core!",
    "description": "Chakravyuh 2026 is a multistage technical challenge inspired by breaking through layers of complexity. Participants must demonstrate teamwork, logic, creativity, and innovation to advance through three rounds[cite: 267].",
    "department": "First Year [cite: 267]",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus [cite: 279]",
    "coordinatorName": "Prof. Trupti Kethale [cite: 278]",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 7841994889 [cite: 278]",
    "isRegistrationOpen": true,
    "rules": [
      "Team size: 3-5 MEMBERS [cite: 267]",
      "Registration: 250 per team [cite: 267]",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Round 1: The Drona Gate",
        "desc": "Physical + mental challenge including short physical activity and solving logical, programming, and debugging questions."
      },
      {
        "title": "Round 2: The Archer Wall",
        "desc": "A technical treasure hunt challenge where teams solve technology-based puzzles hidden within programming, cybersecurity, and logical clues."
      },
      {
        "title": "Final Round: The Core",
        "desc": "The Rapid Prototyping Challenge is the final stage of the competition where teams transform their ideas into a working technological solution."
      }
    ]
  },
  {
    "id": "NEUROAVATAR",
    "name": "NeuroAvatar Arena [cite: 267]",
    "tagline": "The 4-Hour Challenge [cite: 267]",
    "description": "An exclusive, fast-paced project showcase and refinement competition. Focused on the theme of \"Digital Avatar, Virtual Avatar, and Virtual Persona,\" this event requires teams to arrive with a ready-to-demonstrate MVP (Minimum Viable Product.) [cite: 267]",
    "department": "Computer Dept. [cite: 267]",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 300,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus [cite: 279]",
    "coordinatorName": "Prof. Minal Patil [cite: 278]",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 9145616101 [cite: 278]",
    "isRegistrationOpen": true,
    "rules": [
      "Teams must arrive with a ready-to-demonstrate MVP [cite: 267]",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Project Showcase",
        "desc": "Demonstrate your MVP and refine it based on the theme."
      }
    ]
  },
  {
    "id": "DATA_DASH",
    "name": "Data Dash [cite: 267]",
    "tagline": "Data analysis and visualization contest [cite: 267]",
    "description": "Data analysis and visualization contest. [cite: 267]",
    "department": "AIDS Dept. [cite: 267]",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 250,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus [cite: 279]",
    "coordinatorName": "Organizing Team",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 88559 77815",
    "isRegistrationOpen": true,
    "rules": [
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Data Challenge",
        "desc": "Analyze provided datasets and build comprehensive visualizations."
      }
    ]
  },
  {
    "id": "CYBER_SHIELD",
    "name": "Cyber Shield Challenge [cite: 267]",
    "tagline": "A competition focused on cybersecurity and ethical hacking [cite: 267]",
    "description": "A competition focused on cybersecurity and ethical hacking. [cite: 267]",
    "department": "IT Dept [cite: 267]",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 250,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus [cite: 279]",
    "coordinatorName": "Organizing Team",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 88559 77815",
    "isRegistrationOpen": true,
    "rules": [
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Security Challenge",
        "desc": "Solve ethical hacking tasks and bypass security challenges."
      }
    ]
  },
  {
    "id": "BRIDGE",
    "name": "The Gravity Game.... Bridge Making [cite: 267]",
    "tagline": "Structural Elegance & Strength",
    "description": "Welcome to “The Gravity Game....Bridge Making”, a hands-on engineering competition designed to test participants’ understanding of structural design, load distribution, and material efficiency. Teams will design and construct a model bridge using limited materials within a fixed time[cite: 267].",
    "department": "Civil Dept. [cite: 267]",
    "minTeam": 2,
    "maxTeam": 5,
    "fee": 500,
    "requiresUpload": false,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "09:30 AM - 03:30 PM",
    "venueLabel": "ICEM Campus [cite: 279]",
    "coordinatorName": "Prof. Vijay Kumar Saini [cite: 278]",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 9819298069 [cite: 278]",
    "isRegistrationOpen": true,
    "rules": [
      "Provided Kit: 150 Ice Cream Sticks and Rubber Bands",
      "Participant-Supplied: Members must bring their own Hot Glue Gun",
      "No electronic devices are allowed during the competition",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Construction Phase",
        "desc": "On-site bridge building for approximately 2 hours."
      },
      {
        "title": "Load Test",
        "desc": "A concentrated point load will be applied vertically at the exact geometric center (mid-span) of the bridge."
      }
    ]
  },
  {
    "id": "FAST_FURIOUS",
    "name": "Fast & Furious [cite: 274]",
    "tagline": "Navigate mechanical systems using your memory [cite: 274]",
    "description": "High Octane Competition designed to see who truly navigate mechanical systems using their memory[cite: 274].",
    "department": "Mech Dept. [cite: 274]",
    "minTeam": 2,
    "maxTeam": 2,
    "fee": 0,
    "requiresUpload": false,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus [cite: 279]",
    "coordinatorName": "Prof. Pranali Knatake [cite: 278]",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 7083597073 [cite: 278]",
    "isRegistrationOpen": true,
    "rules": [
      "Blindfold Protocol: Participants are blindfolded before the start; removing the blindfold results in instant disqualification.",
      "Hands-Only: Participants must identify and assemble parts using only their hands.",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Round 1: Qualification",
        "desc": "Initial heat to filter top performers."
      },
      {
        "title": "Round 2: Semi-Final",
        "desc": "Advanced assembly tasks for qualifiers."
      },
      {
        "title": "Round 3: Final",
        "desc": "The fastest and most accurate participants compete for the win."
      }
    ]
  },
  {
    "id": "CIRCUIT_CRAFTERS",
    "name": "Circuit Crafters [cite: 274]",
    "tagline": "Designing and implementing electronic circuits [cite: 274]",
    "description": "Designing and implementing electronic circuits. [cite: 274]",
    "department": "ENTC Dept. [cite: 274]",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus [cite: 279]",
    "coordinatorName": "Prof. Balu Tandale [cite: 278]",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 8805048185 [cite: 278]",
    "isRegistrationOpen": true,
    "rules": [
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Circuit Implementation",
        "desc": "Design, build, and test the provided electronic circuit challenges."
      }
    ]
  },
  {
    "id": "WEB_WIZARDS",
    "name": "Web Wizards Challenge [cite: 274]",
    "tagline": "Website development and design competition [cite: 274]",
    "description": "Website development and design competition. [cite: 274]",
    "department": "MCA/BCA Dept. [cite: 274]",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 250,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus [cite: 279]",
    "coordinatorName": "Organizing Team",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 88559 77815",
    "isRegistrationOpen": true,
    "rules": [
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Web Development",
        "desc": "Develop and design a website based on the given prompt or theme."
      }
    ]
  },
  {
    "id": "LAUNCHPAD",
    "name": "LaunchPad Business Plan Challenge [cite: 274]",
    "tagline": "Present your innovative startup idea",
    "description": "Present your innovative startup idea Develop a feasible business model Showcase market potential and financial viability. [cite: 274]",
    "department": "MBA Dept. (IGSB+ICEM) [cite: 274]",
    "minTeam": 1,
    "maxTeam": 5,
    "fee": 500,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "Indira Global School of Business",
    "coordinatorName": "Prof. Aditee Huparikar & Anirudha Thuse [cite: 278]",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 9823459833 / 9850901315 [cite: 278]",
    "isRegistrationOpen": true,
    "rules": [
      "Last Date of Registration: 23rd March 2026",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Business Model Pitch",
        "desc": "Present your innovative startup idea, feasible business model, and financial viability."
      }
    ]
  }
]
```
