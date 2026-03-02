
import { Department, EventID, EventConfig } from './types';

export const EVENTS: EventConfig[] = [
  {
    id: EventID.VAC,
    name: "Virtual Avatar Championship",
    tagline: "Unleash your digital alter ego",
    description: "Design and render high-fidelity 3D avatars. Compete in the ultimate digital fashion and lore showdown.",
    department: Department.COMPS,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: "₹25,000",
    rules: [
      "Character must be original",
      "Idea abstract must be submitted in text",
      "Real-time rendering required in Final Round"
    ],
    rounds: [
      { title: "Conceptualization", desc: "Submit your character design abstract and lore." },
      { title: "The Nexus Arena", desc: "Live presentation of your 3D avatar." }
    ]
  },
  {
    id: EventID.CODEVERSE,
    name: "CodeVerse",
    tagline: "Survival of the Fittest Code",
    description: "Battle through algorithmic gauntlets and full-stack architecture challenges in a high-pressure environment.",
    department: Department.IT,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: "₹30,000",
    rules: [
      "Exact team size protocols active",
      "No internet access during rounds",
      "Languages: C++, Java, Python"
    ],
    rounds: [
      { title: "The Matrix", desc: "Rapid fire algorithmic challenges." },
      { title: "Project Architect", desc: "Full-stack module development." }
    ]
  },
  {
    id: EventID.AGENTS,
    name: "Agentic AI",
    tagline: "Prompt, Deploy, Dominate",
    description: "Master LLM orchestration. Build autonomous agents capable of solving multi-step real-world workflows.",
    department: Department.AIDS,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: "₹20,000",
    rules: [
      "Use of any LLM allowed",
      "Must build a functional agentic workflow",
      "Focus on automation and problem solving"
    ],
    rounds: [
      { title: "The Prompt Engineering", desc: "Optimizing AI outputs for complex tasks." },
      { title: "Agent Deployment", desc: "Solving real-world scenarios with autonomous agents." }
    ]
  },
  {
    id: EventID.ROBO,
    name: "RoboVerse",
    tagline: "The Ultimate Metal Clash",
    description: "Engineered for destruction. Enter the arena for high-octane robot combat and precision obstacle racing.",
    department: Department.MECH,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: "₹50,000",
    rules: [
      "Robot weight limit: 15kg",
      "Combat and Racing categories",
      "Remote control only (No wired)"
    ],
    rounds: [
      { title: "Circuit Race", desc: "Navigate the obstacle-filled track." },
      { title: "Death Match", desc: "The last bot standing wins." }
    ]
  },
  {
    id: EventID.BRIDGE,
    name: "Bridge-It",
    tagline: "Structural Elegance & Strength",
    description: "Construct popsicle-stick marvels. Test the limits of structural engineering under extreme point loads.",
    department: Department.CIVIL,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: "₹15,000",
    rules: [
      "Only popsicles and glue allowed",
      "Maximum span: 1.5 meters",
      "Aesthetics carry 30% weightage"
    ],
    rounds: [
      { title: "Construction Phase", desc: "On-site bridge building (3 hours)." },
      { title: "Load Test", desc: "Point load application until structural failure." }
    ]
  },
  {
    id: EventID.VIBE,
    name: "Vibe Coding",
    tagline: "Code with Aesthetic & Rhythm",
    description: "Where UI design meets creative rhythm. Build stunning visual experiences with live interactive logic.",
    department: Department.BCA,
    minTeam: 4,
    maxTeam: 5,
    fee: 0,
    requiresUpload: true,
    prizePool: "₹10,000",
    rules: [
      "Creative synergy required",
      "Creativity > Complexity",
      "Live 'Vibing' while coding is encouraged"
    ],
    rounds: [
      { title: "Visual Symphony", desc: "Build the most visually stunning UI." },
      { title: "Creative Logic", desc: "Add interactivity that wows the judges." }
    ]
  }
];

export const COLORS = {
  stone: "#0c0a09",
  amber: "#f59e0b",
  blue: "#3b82f6",
  slate: "#f8fafc"
};
