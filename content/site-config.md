````markdown
# Static Site Config

Edit the JSON blocks in this file, then rebuild/redeploy the site.
This keeps all site content static and removes the runtime CMS/server-config fetch.

## Hero
```json hero
{
  "institution": "INDIRA COLLEGE OF ENGINEERING & MANAGEMENT, INDIRA GLOBAL SCHOOL OF BUSINESS",
  "organizingLabel": "Organizing",
  "subLabel": "The Largest Gathering of Pune's Tech Innovators",
  "mainTitlePart1": "TECHNOFEST",
  "mainTitlePart2": "2026",
  "scrambleText": "THE ULTIMATE TECH ARENA",
  "buttonText": "INITIATE CONNECTION",
  "countdownDate": "2026-03-27T09:00:00"
}
````

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
  ],
  "payeeName": "TechnoFest 2026",
  "bankAccountNo": "201025452641",
  "bankIfsc": "INDB0000999"
}
```

## Sponsors

```json sponsors
[
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
    "name": "Chakravyuh",
    "tagline": "Break through the challenge, innovate, and conquer the core!",
    "description": "Chakravyuh 2026 is a multistage technical challenge inspired by breaking through layers of complexity. Participants must demonstrate teamwork, logic, creativity, and innovation to advance through three rounds.",
    "department": "First-Year",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Trupti Kethale",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 7841994889",
    "isRegistrationOpen": true,
    "rules": [
      "Team size: 3-5 MEMBERS",
      "Registration: 250 per team",
      "Prize Distribution: 1st - ₹15K, 2nd - ₹10K",
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
    "name": "NeuroAvatar Arena",
    "tagline": "The 4-Hour Challenge",
    "description": "An exclusive, fast-paced project showcase and refinement competition focused on Digital Avatar, Virtual Avatar, and Virtual Persona.",
    "department": "Computer Dept.",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 300,
    "requiresUpload": true,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Minal Patil",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 9145616101",
    "isRegistrationOpen": true,
    "rules": [
      "Teams must arrive with a ready-to-demonstrate MVP",
      "Prize Distribution: 1st - ₹15K, 2nd - ₹10K",
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
    "id": "ORCHESTRON",
    "name": "Orchestron - Agentic AI",
    "tagline": "Agentic AI Innovation Challenge",
    "description": "Showcase AI systems capable of planning, reasoning, and solving real-world problems.",
    "department": "AIDS Dept.",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 250,
    "requiresUpload": true,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Pallavi Chavan",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 9175151731",
    "isRegistrationOpen": true,
    "rules": [
      "Prize Distribution: 1st - ₹15K, 2nd - ₹10K"
    ],
    "rounds": [
      {
        "title": "Round 1",
        "desc": "Project presentation with PPT or demo."
      },
      {
        "title": "Round 2",
        "desc": "Q&A and scenario-based evaluation."
      }
    ]
  },
  {
    "id": "CODEVERSE",
    "name": "CodeVerse",
    "tagline": "Programming Battle Arena",
    "description": "Multi-round coding event including output prediction, DSA problems, and debugging.",
    "department": "IT Dept.",
    "minTeam": 3,
    "maxTeam": 3,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Ashwini Wankhede",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 7066230348",
    "isRegistrationOpen": true,
    "rules": [
      "Team size fixed at 3",
      "Prize Distribution: 1st - ₹15K, 2nd - ₹10K"
    ],
    "rounds": [
      {
        "title": "Round 1",
        "desc": "Predict the output"
      },
      {
        "title": "Round 2",
        "desc": "DSA problems"
      },
      {
        "title": "Round 3",
        "desc": "Debugging"
      }
    ]
  },
  {
    "id": "BRIDGE",
    "name": "The Gravity Game.... Bridge Making",
    "tagline": "Structural Design Challenge",
    "description": "Build a bridge using limited materials and test load capacity.",
    "department": "Civil Dept.",
    "minTeam": 2,
    "maxTeam": 5,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "09:30 AM - 03:30 PM",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Vijay Kumar Saini",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 9819298069",
    "isRegistrationOpen": true
  },
  {
    "id": "BLIND_ASSEMBLY",
    "name": "Blind Assembly",
    "tagline": "Mechanical Intuition Test",
    "description": "Identify and assemble components blindfolded using touch.",
    "department": "Mech Dept.",
    "minTeam": 2,
    "maxTeam": 2,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Pranali Khatake",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 7083597073",
    "isRegistrationOpen": true
  },
  {
    "id": "ROBONEX",
    "name": "RoboNex",
    "tagline": "Robotics Combat & Race",
    "description": "Includes Robo Race and Robo Rumble events.",
    "department": "ENTC Dept.",
    "minTeam": 2,
    "maxTeam": 4,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Balu Tandale",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 8805048185",
    "isRegistrationOpen": true
  },
  {
    "id": "VIBEASTRA",
    "name": "VibeAstra",
    "tagline": "Creative Coding Experience",
    "description": "Gamified coding event focused on logic and creativity.",
    "department": "MCA/BCA Dept.",
    "minTeam": 1,
    "maxTeam": 1,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Dr. Dhanashree Patil",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 7972308184",
    "isRegistrationOpen": true
  },
  {
    "id": "LAUNCHPAD",
    "name": "LaunchPad – Business Plan Challenge",
    "tagline": "Startup Pitch Arena",
    "description": "Present startup ideas and business models.",
    "department": "MBA Dept. (IGSB+ICEM)",
    "minTeam": 1,
    "maxTeam": 5,
    "fee": 500,
    "requiresUpload": true,
    "prizePool": "₹15,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "Indira Global School of Business",
    "coordinatorName": "Prof. Aditee Huparikar & Dr. Aniruddha Thuse",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 9823459833 / 9850901315",
    "isRegistrationOpen": true,
    "rules": [
      "Prize Distribution: 1st - ₹7K, 2nd - ₹5K, 3rd - ₹3K"
    ]
  }
]
```
