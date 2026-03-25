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
  "payeeName": "TechnoFest 2026",
  "bankAccountNo": "201025452641",
  "bankIfsc": "INDB0000999",
  "departmentPayments": {
    "First-Year Dept.": {
      "upiId": "truptikathale@ybl",
      "payeeName": "ICEM First Year Dept",
      "bankAccountNo": "4040010100057655",
      "bankIfsc": "UTIB0000404"
    },
    "Computer Dept.": {
      "upiId": "9145616101@ibl",
      "payeeName": "ICEM Computer Dept",
      "bankAccountNo": "50100351881924",
      "bankIfsc": "HDFC0004884"
    },
    "AIDS Dept.": {
      "upiId": "pallavichavan1707@oksbi",
      "payeeName": "ICEM AIDS Dept",
      "bankAccountNo": "922010060640068",
      "bankIfsc": "UTIB0000110"
    },
    "IT Dept.": {
      "upiId": "wankhade81@okhdfcbank",
      "payeeName": "ICEM IT Dept",
      "bankAccountNo": "50100391133848",
      "bankIfsc": "HDFC0002524"
    },
    "Civil Dept.": {
      "upiId": "9819298069@yescred",
      "payeeName": "ICEM Civil Dept",
      "bankAccountNo": "30724368718",
      "bankIfsc": "SBIN0000569"
    },
    "Mech Dept.": {
      "upiId": "pranali.khatake@okicici",
      "payeeName": "ICEM Mech Dept",
      "bankAccountNo": "169701500487",
      "bankIfsc": "ICOC0001697"
    },
    "ENTC Dept.": {
      "upiId": "psmrpatil-4@okhdfcbank",
      "payeeName": "ICEM ENTC Dept",
      "bankAccountNo": "50100754250032",
      "bankIfsc": "HDFC0007247"
    },
    "MCA/BCA Dept.": {
      "upiId": "dhanashree.patil89-1@oksbi",
      "payeeName": "ICEM MCA/BCA Dept",
      "bankAccountNo": "30677698705",
      "bankIfsc": "SBIN0011134"
    },
    "MBA Dept. (IGSB+ICEM)": {
      "upiId": "not given",
      "payeeName": "IGSB MBA Dept",
      "bankAccountNo": "201025452649",
      "bankIfsc": "INDB0000999"
    }
  }
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
  "footerBlurb": "S.No. 64,65, Gat No. 276 At Post: Parandwadi, Near Somatne phata, Tal.: Maval, Dist. Pune – 410 506"
}
```

## Brochure Visibility

```json brochureVisibility
{
  "CHAKRAVYUH": false,
  "NEUROAVATAR": false,
  "ORCHESTRON": false,
  "CODEVERSE": false,
  "BRIDGE": false,
  "BLIND_ASSEMBLY": false,
  "ROBONEX": false,
  "VIBEASTRA": false,
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
    "department": "First-Year Dept.",
    "minTeam": 3,
    "maxTeam": 5,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Trupti Kathale",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 7841994889",
    "facultyCoordinators": [
      {
        "name": "Prof. Trupti Kathale",
        "phone": "+91 7841994889",
        "email": "icem@indiraicem.ac.in"
      }
    ],
    "studentCoordinators": [
      {
        "name": "Sampada Katageri",
        "phone": "+91 8668955724"
      },
      {
        "name": "Sujal Dhumal",
        "phone": "+91 9028820220"
      }
    ],
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
    "fee": 250,
    "requiresUpload": true,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Minal Patil",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 9145616101",
    "facultyCoordinators": [
      {
        "name": "Prof. Minal Patil",
        "phone": "+91 9145616101",
        "email": "icem@indiraicem.ac.in"
      }
    ],
    "studentCoordinators": [
      {
        "name": "Advait Kende",
        "phone": "+91 9552637352"
      },
      {
        "name": "Suraj Prajapati",
        "phone": "+91 8767291440"
      }
    ],
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
    "eventTimeLabel": "10am",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Pallavi Chavan",
    "coordinatorEmail": "pallavichavan@indiraicem.ac.in",
    "coordinatorPhone": "+91 9175151731",
    "facultyCoordinators": [
      {
        "name": "Prof. Pallavi Chavan",
        "phone": "+91 9175151731",
        "email": "pallavichavan@indiraicem.ac.in"
      }
    ],
    "studentCoordinators": [
      {
        "name": "Soham Kate",
        "phone": "+91 7385504133"
      },
      {
        "name": "Vedant Padmawar",
        "phone": "+91 9561258843"
      }
    ],
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
    "coordinatorName": "Prof. Ashwini Wankhade",
    "coordinatorEmail": "ashwini.wankhade@indiraicem.ac.in",
    "coordinatorPhone": "+91 7066230348",
    "facultyCoordinators": [
      {
        "name": "Prof. Ashwini Wankhade",
        "phone": "+91 7066230348",
        "email": "ashwini.wankhade@indiraicem.ac.in"
      }
    ],
    "studentCoordinators": [
      {
        "name": "Dharmesh Bhatt",
        "phone": "+91 7249452498"
      },
      {
        "name": "Shubham Shinde",
        "phone": "+91 9689650744"
      }
    ],
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
    "facultyCoordinators": [
      {
        "name": "Prof. Vijay Kumar Saini",
        "phone": "+91 9819298069",
        "email": "icem@indiraicem.ac.in"
      }
    ],
    "studentCoordinators": [
      {
        "name": "Yash Mhatre",
        "phone": "+91 9322044906"
      },
      {
        "name": "Neel Bodade",
        "phone": "+91 9975836063"
      }
    ],
    "isRegistrationOpen": true,
    "rules": [
      "Provided Kit: 150 Ice Cream Sticks and Rubber Bands",
      "Participant-Supplied: Members must bring their own Hot Glue Gun",
      "No electronic devices or unauthorized materials allowed",
      "Bridge must satisfy span, width, height, and mid-span load requirements",
      "Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K"
    ],
    "rounds": [
      {
        "title": "Round 1: Bridge Construction",
        "desc": "Build the bridge on site within the allotted time while staying within the span, width, height, and support constraints."
      },
      {
        "title": "Round 2: Stability and Roadway Check",
        "desc": "The bridge is checked for alignment, symmetry, free-standing stability, and roadway readiness for the RC testing car/static load."
      },
      {
        "title": "Round 3: Central Load Test",
        "desc": "Weights are applied incrementally at the exact geometric center until failure, with scoring based on load carrying capacity and structural efficiency."
      }
    ]
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
    "facultyCoordinators": [
      {
        "name": "Prof. Pranali Khatake",
        "phone": "+91 7083597073",
        "email": "icem@indiraicem.ac.in"
      }
    ],
    "studentCoordinators": [
      {
        "name": "Ritesh Supekar",
        "phone": "+91 9730920512"
      },
      {
        "name": "Keval Salunke",
        "phone": "+91 9313449805"
      }
    ],
    "isRegistrationOpen": true
  },
  {
    "id": "ROBONEX",
    "name": "RoboNex",
    "tagline": "Robotics Combat & Race",
    "description": "Robo Race is a fast-paced robotics competition in Robonex where teams design manually controlled robots to race through a challenging track. The robots must navigate obstacles such as turns, ramps, and hurdles while completing the track in the shortest possible time, testing participants' skills in robot design, control, and speed.",
    "department": "ENTC Dept.",
    "minTeam": 2,
    "maxTeam": 4,
    // 200 without robot, 250 if the team brings its own robot.
    "fee": 200/250,
    "requiresUpload": false,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Prof. Balu Tandale",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 8805048185",
    "facultyCoordinators": [
      {
        "name": "Prof. Balu Tandale",
        "phone": "+91 8805048185",
        "email": "icem@indiraicem.ac.in"
      }
    ],
    "studentCoordinators": [
      {
        "name": "Soham Kulkarni",
        "phone": "+91 8623990668"
      },
      {
        "name": "Atharv Kulkarni",
        "phone": "+91 7219536282"
      }
    ],
    "isRegistrationOpen": true,
    "rules": [
      "Fee: \u20B9200 without robot / \u20B9250 with your own robot",
      "Manually controlled robots only",
      "Prize Distribution: 1st - \u20B915K, 2nd - \u20B910K"
    ],
    "rounds": [
      {
        "title": "Robo Race",
        "desc": "Race a manually controlled robot through turns, ramps, and hurdles in the shortest possible time."
      }
    ]
  },
  {
    "id": "VIBEASTRA",
    "name": "VibeAstra",
    "tagline": "Creative Coding Experience",
    "description": "Step into VibeAstra—where ideas meet action! Compete in exciting challenges, think out of the box, and turn real-world problems into innovative solutions with your team.",
    "department": "MCA/BCA Dept.",
    "minTeam": 1,
    "maxTeam": 2,
    "fee": 250,
    "requiresUpload": false,
    "prizePool": "₹25,000",
    "eventDateLabel": "March 27, 2026",
    "eventTimeLabel": "To Be Announced",
    "venueLabel": "ICEM Campus",
    "coordinatorName": "Dr. Dhanashree Patil",
    "coordinatorEmail": "icem@indiraicem.ac.in",
    "coordinatorPhone": "+91 7972308184",
    "facultyCoordinators": [
      {
        "name": "Dr. Dhanashree Patil",
        "phone": "+91 7972308184",
        "email": "icem@indiraicem.ac.in"
      }
    ],
    "studentCoordinators": [
      {
        "name": "Aditya Agarwal",
        "phone": "+91 7076525693"
      },
      {
        "name": "Stanley James",
        "phone": "+91 8408077248"
      }
    ],
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
    "facultyCoordinators": [
      {
        "name": "Prof. Aditee Huparikar",
        "phone": "+91 9823459833",
        "email": "icem@indiraicem.ac.in"
      },
      {
        "name": "Dr. Aniruddha Thuse",
        "phone": "+91 9850901315",
        "email": "icem@indiraicem.ac.in"
      }
    ],
    "studentCoordinators": [
      {
        "name": "Rajveer Gil",
        "phone": "+91 7587227100"
      },
      {
        "name": "Radhika Nannaware",
        "phone": "+91 8956717423"
      },
      {
        "name": "Atharv Salunke / Rajveer Preet Gill",
        "phone": "+91 7888106167"
      }
    ],
    "isRegistrationOpen": true,
    "rules": [
      "Prize Distribution: 1st - ₹7K, 2nd - ₹5K, 3rd - ₹3K"
    ]
  }
]
```
