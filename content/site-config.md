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
  "countdownDate": "2026-03-14T09:00:00"
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
  "closedMessage": "Registrations are currently paused. Please check back later or contact the organizing team."
}
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
  "VAC": false,
  "CODEVERSE": false,
  "AGENTS": false,
  "ROBO": false,
  "BRIDGE": false,
  "VIBE": false,
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
    "id": "VAC",
    "name": "Virtual Avatar Championship",
    "tagline": "Unleash your digital alter ego",
    "description": "Design and render high-fidelity 3D avatars. Compete in the ultimate digital fashion and lore showdown.",
    "department": "Computer Engineering",
    "minTeam": 4,
    "maxTeam": 5,
    "fee": 0,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 14, 2026",
    "eventTimeLabel": "10:00 AM - 04:00 PM",
    "venueLabel": "Digital Design Lab, ICEM",
    "coordinatorName": "Prof. Aditi Patil",
    "coordinatorEmail": "vac@indiraicem.ac.in",
    "coordinatorPhone": "+91 88559 77815",
    "isRegistrationOpen": true,
    "rules": [
      "Character must be original",
      "Idea abstract must be submitted in text",
      "Real-time rendering required in Final Round",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Conceptualization",
        "desc": "Submit your character design abstract and lore."
      },
      {
        "title": "The Nexus Arena",
        "desc": "Live presentation of your 3D avatar."
      }
    ]
  },
  {
    "id": "CODEVERSE",
    "name": "CodeVerse",
    "tagline": "Survival of the Fittest Code",
    "description": "Battle through algorithmic gauntlets and full-stack architecture challenges in a high-pressure environment.",
    "department": "Information Technology",
    "minTeam": 4,
    "maxTeam": 5,
    "fee": 0,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 14, 2026",
    "eventTimeLabel": "09:00 AM - 06:00 PM",
    "venueLabel": "Seminar Hall 2, ICEM",
    "coordinatorName": "Prof. Rohan Kulkarni",
    "coordinatorEmail": "codeverse@indiraicem.ac.in",
    "coordinatorPhone": "+91 90211 33445",
    "isRegistrationOpen": true,
    "rules": [
      "Exact team size protocols active",
      "No internet access during rounds",
      "Languages: C++, Java, Python",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "The Matrix",
        "desc": "Rapid fire algorithmic challenges."
      },
      {
        "title": "Project Architect",
        "desc": "Full-stack module development."
      }
    ]
  },
  {
    "id": "AGENTS",
    "name": "Agentic AI",
    "tagline": "Prompt, Deploy, Dominate",
    "description": "Master LLM orchestration. Build autonomous agents capable of solving multi-step real-world workflows.",
    "department": "AI & Data Science",
    "minTeam": 4,
    "maxTeam": 5,
    "fee": 0,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 14, 2026",
    "eventTimeLabel": "11:00 AM - 05:00 PM",
    "venueLabel": "AI Center, ICEM",
    "coordinatorName": "Prof. Snehal Joshi",
    "coordinatorEmail": "agenticai@indiraicem.ac.in",
    "coordinatorPhone": "+91 97662 14789",
    "isRegistrationOpen": true,
    "rules": [
      "Use of any LLM allowed",
      "Must build a functional agentic workflow",
      "Focus on automation and problem solving",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "The Prompt Engineering",
        "desc": "Optimizing AI outputs for complex tasks."
      },
      {
        "title": "Agent Deployment",
        "desc": "Solving real-world scenarios with autonomous agents."
      }
    ]
  },
  {
    "id": "ROBO",
    "name": "RoboVerse",
    "tagline": "The Ultimate Metal Clash",
    "description": "Engineered for destruction. Enter the arena for high-octane robot combat and precision obstacle racing.",
    "department": "Mechanical / E&TC",
    "minTeam": 4,
    "maxTeam": 5,
    "fee": 0,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 14, 2026",
    "eventTimeLabel": "10:30 AM - 06:30 PM",
    "venueLabel": "Mechanical Workshop Arena, ICEM",
    "coordinatorName": "Prof. Pratik More",
    "coordinatorEmail": "roboverse@indiraicem.ac.in",
    "coordinatorPhone": "+91 91588 00124",
    "isRegistrationOpen": true,
    "rules": [
      "Robot weight limit: 15kg",
      "Combat and Racing categories",
      "Remote control only (No wired)",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Circuit Race",
        "desc": "Navigate the obstacle-filled track."
      },
      {
        "title": "Death Match",
        "desc": "The last bot standing wins."
      }
    ]
  },
  {
    "id": "BRIDGE",
    "name": "The Gravity Game....Bridge Making",
    "tagline": "Structural Elegance & Strength",
    "description": "Welcome to “The Gravity Game....Bridge Making”, a hands-on engineering competition designed to test participants’ understanding of structural design, load distribution, and material efficiency. Teams will design and construct a model bridge using limited materials within a fixed time. The bridges will then be tested for maximum load carrying capacity and structural efficiency.",
    "department": "Civil Engineering",
    "minTeam": 2,
    "maxTeam": 5,
    "fee": 500,
    "requiresUpload": false,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "09:30 AM - 03:30 PM",
    "venueLabel": "Civil Structure Lab, ICEM",
    "coordinatorName": "Prof. Shruti Deshmukh",
    "coordinatorEmail": "bridgeit@indiraicem.ac.in",
    "coordinatorPhone": "+91 99228 11456",
    "isRegistrationOpen": true,
    "rules": [
      "Provided Kit: 150 Ice Cream Sticks and Rubber Bands",
      "Participant-Supplied: Members must bring their own Hot Glue Gun",
      "Span Length: 30 cm - 40 cm, Bridge Width: 10 cm - 15 cm, Bridge Height: 15 cm - 20 cm",
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
    "id": "VIBE",
    "name": "VibeCode: The Tech Escape Challenge",
    "tagline": "Decode clues, think like developers, and use innovative ideas to move forward",
    "description": "The event combines problem-solving, creativity, and technical thinking through a gamified escape-room format.",
    "department": "BCA / BCS",
    "minTeam": 4,
    "maxTeam": 5,
    "fee": 0,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 14, 2026",
    "eventTimeLabel": "12:00 PM - 05:00 PM",
    "venueLabel": "Innovation Studio, ICEM",
    "coordinatorName": "Prof. Neha Pawar",
    "coordinatorEmail": "vibecoding@indiraicem.ac.in",
    "coordinatorPhone": "+91 98344 77120",
    "isRegistrationOpen": true,
    "rules": [
      "Test participants’ analytical thinking, problem-solving ability, and adaptability",
      "Application of UI/UX principles, ease of use, and intuitive design",
      "Ability to extend features or modify the system dynamically",
      "Prize Distribution: 1st - ₹25K, 2nd - ₹10K, 3rd - ₹5K",
      "Trophy for winner and runner-up; certificates for all participants"
    ],
    "rounds": [
      {
        "title": "Round 1: Tech Escape Room (Logic & Puzzle Round)",
        "desc": "Solve tech-themed puzzles and logical problems within a limited time."
      },
      {
        "title": "Round 2: Idea & Frontend Creation",
        "desc": "Translate a creative idea into a user-friendly and visually clear frontend experience."
      },
      {
        "title": "Round 3: Backend & Feature Expansion",
        "desc": "Demonstrate skill in prompting AI tools to generate or modify backend logic."
      }
    ]
  },
  {
    "id": "LAUNCHPAD",
    "name": "LaunchPad – Business Plan Challenge",
    "tagline": "Present your innovative startup idea",
    "description": "Develop a feasible business model and showcase the market potential and financial viability of your startup. Open to all undergraduate students (BBA, B.Com, B.Tech, BA, etc.).",
    "department": "MBA Department (IGSB & ICEM)",
    "minTeam": 1,
    "maxTeam": 5,
    "fee": 500,
    "requiresUpload": true,
    "prizePool": "₹40,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "Indira Global School of Business",
    "coordinatorName": "Organizing Team",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 88559 77815",
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
