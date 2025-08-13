export type Lobe =
  | "Perception/Patterning"
  | "Decision/Action"
  | "Innovation/Strategy"
  | "Ethics/Governance"
  | "Culture/Behaviour";

export interface Thinker {
  name: string;
  area: string;
  coreIdea: string;
  aiShift: string;
  lobe: Lobe;
}

export const THINKERS: Thinker[] = [
  { name: "Daniel Kahneman", area: "Decision Science", coreIdea: "Thinking, Fast and Slow", aiShift: "Fast/slow dichotomy breaks when AI operates in parallel at both speeds.", lobe: "Decision/Action" },
  { name: "Amos Tversky", area: "Decision Science", coreIdea: "Prospect theory, heuristics", aiShift: "Bias correction and AI nudging can bypass traditional human heuristics.", lobe: "Decision/Action" },
  { name: "Gerd Gigerenzer", area: "Decision Science", coreIdea: "Simple heuristics that make us smart", aiShift: "AI can out-heuristic humans, rethinking bounded rationality.", lobe: "Perception/Patterning" },
  { name: "Herbert Simon", area: "Decision Science", coreIdea: "Bounded rationality", aiShift: "AI removes some bounds, introduces compute cost and algorithmic bias.", lobe: "Decision/Action" },
  { name: "Gary Klein", area: "Decision Science", coreIdea: "Recognition-primed decision making", aiShift: "AI simulates decades of pattern recognition instantly.", lobe: "Perception/Patterning" },
  { name: "Richard Thaler", area: "Behavioral Economics", coreIdea: "Nudge theory", aiShift: "Hyper-personalized nudges in real time raise ethical stakes.", lobe: "Culture/Behaviour" },

  { name: "Donella Meadows", area: "Systems Thinking", coreIdea: "Leverage points, system archetypes", aiShift: "Agentic AI dynamically alters leverage points.", lobe: "Innovation/Strategy" },
  { name: "Peter Senge", area: "Systems Thinking", coreIdea: "Learning organizations", aiShift: "AI accelerates feedback loops to near real-time.", lobe: "Innovation/Strategy" },
  { name: "Jay Forrester", area: "System Dynamics", coreIdea: "Simulation of complex systems", aiShift: "Agentic AI runs constant simulation-based governance.", lobe: "Ethics/Governance" },
  { name: "Geoffrey West", area: "Complexity Science", coreIdea: "Scaling laws", aiShift: "AI disrupts linear scaling models in cities, companies, economies.", lobe: "Innovation/Strategy" },

  { name: "Clayton Christensen", area: "Innovation", coreIdea: "Disruptive innovation", aiShift: "AI shortens disruption cycles to months.", lobe: "Innovation/Strategy" },
  { name: "Everett Rogers", area: "Innovation Diffusion", coreIdea: "Diffusion of innovations", aiShift: "Agentic AI skips adoption stages by embedding in workflows.", lobe: "Culture/Behaviour" },
  { name: "Geoffrey Moore", area: "Market Strategy", coreIdea: "Crossing the Chasm", aiShift: "AI bridges chasms with personalized onboarding at scale.", lobe: "Innovation/Strategy" },
  { name: "Peter Drucker", area: "Management", coreIdea: "Management theory", aiShift: "AI redefines productivity and knowledge work.", lobe: "Innovation/Strategy" },
  { name: "W. Edwards Deming", area: "Quality", coreIdea: "Total quality management", aiShift: "Predictive quality control and self-correcting processes.", lobe: "Decision/Action" },

  { name: "John Maynard Keynes", area: "Economics", coreIdea: "Macroeconomics", aiShift: "AI alters employment models and multipliers.", lobe: "Ethics/Governance" },
  { name: "Friedrich Hayek", area: "Economics", coreIdea: "Price signals and decentralization", aiShift: "Synthetic markets and real-time micro-pricing.", lobe: "Innovation/Strategy" },
  { name: "Michael Porter", area: "Strategy", coreIdea: "Competitive advantage", aiShift: "Advantage shifts from resource control to orchestration.", lobe: "Innovation/Strategy" },
  { name: "Elinor Ostrom", area: "Governance", coreIdea: "Commons governance", aiShift: "AI-managed commons blur public/private stewardship.", lobe: "Ethics/Governance" },

  { name: "Malcolm Gladwell", area: "Sociology", coreIdea: "Social tipping points", aiShift: "AI can manufacture tipping points algorithmically.", lobe: "Culture/Behaviour" },
  { name: "Shoshana Zuboff", area: "Political Economy", coreIdea: "Surveillance capitalism", aiShift: "Agentic AI deepens surveillance-utility trade-off.", lobe: "Ethics/Governance" },
  { name: "Yuval Noah Harari", area: "History", coreIdea: "Future narratives", aiShift: "AI becomes an active narrative-shaper.", lobe: "Culture/Behaviour" },
  { name: "Jane Jacobs", area: "Urbanism", coreIdea: "Urban design, bottom-up order", aiShift: "AI micro-planning changes city dynamics in real time.", lobe: "Perception/Patterning" },
  { name: "Erving Goffman", area: "Sociology", coreIdea: "Presentation of self", aiShift: "AI agents co-author social identity.", lobe: "Culture/Behaviour" },
  { name: "Marshall McLuhan", area: "Media Theory", coreIdea: "The medium is the message", aiShift: "AI is both medium and co-creator.", lobe: "Culture/Behaviour" },

  { name: "Nick Bostrom", area: "Futures", coreIdea: "Superintelligence", aiShift: "Agentic AI arrives earlier than long-term models assumed.", lobe: "Ethics/Governance" },
  { name: "Ray Kurzweil", area: "Futures", coreIdea: "Singularity", aiShift: "AI agency steepens exponential change.", lobe: "Innovation/Strategy" },
  { name: "Kevin Kelly", area: "Tech Philosophy", coreIdea: "Tech inevitabilities", aiShift: "Non-human inevitabilities via agency.", lobe: "Innovation/Strategy" },
  { name: "Tim O’Reilly", area: "Platform Strategy", coreIdea: "Platform thinking", aiShift: "Agentic AI is both platform and participant.", lobe: "Innovation/Strategy" },
  { name: "Vernor Vinge", area: "Futures", coreIdea: "Intelligence explosion", aiShift: "Agentic AI accelerates the curve.", lobe: "Innovation/Strategy" },

  { name: "Isaiah Berlin", area: "Ethics", coreIdea: "Value pluralism", aiShift: "AI can embody conflicting values simultaneously.", lobe: "Ethics/Governance" },
  { name: "John Rawls", area: "Ethics", coreIdea: "Justice as fairness", aiShift: "Fairness at machine speed.", lobe: "Ethics/Governance" },
  { name: "Amartya Sen", area: "Ethics", coreIdea: "Capabilities approach", aiShift: "AI enhances or reduces capabilities directly.", lobe: "Ethics/Governance" },
  { name: "Martha Nussbaum", area: "Ethics", coreIdea: "Human flourishing", aiShift: "Non-human actors in flourishing metrics.", lobe: "Ethics/Governance" },
  { name: "Hannah Arendt", area: "Political Theory", coreIdea: "The human condition", aiShift: "AI challenges labour, work, action boundaries.", lobe: "Ethics/Governance" },

  { name: "Kotter & Schlesinger", area: "Change Management", coreIdea: "Change strategies", aiShift: "AI personalizes change journeys role-by-role.", lobe: "Innovation/Strategy" },
  { name: "Chris Argyris", area: "Org Learning", coreIdea: "Double-loop learning", aiShift: "Double-loop learning in days, not years.", lobe: "Innovation/Strategy" },
  { name: "Edgar Schein", area: "Org Culture", coreIdea: "Cultural embedding", aiShift: "AI becomes part of the culture itself.", lobe: "Culture/Behaviour" },
  { name: "Simon Sinek", area: "Leadership", coreIdea: "Purpose-driven leadership", aiShift: "Purpose must include AI alignment.", lobe: "Culture/Behaviour" },

  { name: "Alvin Toffler", area: "Futures", coreIdea: "Future shock", aiShift: "Shock cycles compressed into daily events.", lobe: "Culture/Behaviour" },
  { name: "William Gibson", area: "Futures", coreIdea: "The future is here", aiShift: "Prototype-to-deployment gap flattens.", lobe: "Innovation/Strategy" },
  { name: "Neal Stephenson", area: "Futures", coreIdea: "Metaverse concepts", aiShift: "AI operationalizes immersive economies.", lobe: "Innovation/Strategy" },
  { name: "Margaret Atwood", area: "Speculative Futures", coreIdea: "Speculative narratives", aiShift: "AI becomes a character in the plot.", lobe: "Culture/Behaviour" },
];
