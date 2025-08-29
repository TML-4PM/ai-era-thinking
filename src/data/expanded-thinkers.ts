import { Lobe } from "./thinkers";

export interface TeamMember {
  member_code: string;
  display_name: string;
  description: string;
  role_on_team: string;
  rationale: string;
}

export interface CoreFramework {
  summary: string;
  keyConcepts: string[];
  whyItMatters: string;
  aiImplications: string;
  recommendedPractices: string[];
  commonPitfalls: string[];
  successMetrics: string[];
}

export interface ExpandedThinker {
  name: string;
  area: string;
  coreIdea: string;
  aiShift: string;
  lobe: Lobe;
  bio?: string;
  coreFramework?: CoreFramework;
  hardCodedTeam?: TeamMember[];
  crossEraRelevance: {
    onPrem: {
      people: string;
      policy: string;
      process: string;
      technology: string;
    };
    cloudNative: {
      people: string;
      policy: string;
      process: string;
      technology: string;
    };
    genAI: {
      people: string;
      policy: string;
      process: string;
      technology: string;
    };
    agenticAI: {
      people: string;
      policy: string;
      process: string;
      technology: string;
    };
    bci: {
      people: string;
      policy: string;
      process: string;
      technology: string;
    };
  };
  usagePrompts: {
    question: string;
    context: string;
    application: string;
  }[];
  relatedThinkers: string[];
  practicalApplications: {
    immediate: string;
    mediumTerm: string;
    longTerm: string;
  };
}

export const EXPANDED_THINKERS: ExpandedThinker[] = [
  {
    name: "Daniel Kahneman",
    area: "Behavioral Economics & Decision Science",
    coreIdea: "Dual-process theory: System 1 (fast, intuitive) vs System 2 (slow, deliberate) thinking shapes all human judgment under uncertainty",
    aiShift: "AI transcends human dual-process limitations by operating simultaneously at both intuitive and analytical speeds, while potentially inheriting human biases from training data",
    lobe: "Decision/Action",
    bio: "Nobel Prize-winning psychologist and economist whose groundbreaking work on behavioral economics and decision-making under uncertainty fundamentally changed how we understand human judgment. His dual-process theory distinguishing System 1 (fast, intuitive) and System 2 (slow, deliberate) thinking has profound implications for designing AI systems that complement rather than replace human cognition. Author of 'Thinking, Fast and Slow' and pioneer in prospect theory, his insights are crucial for building AI that understands and works with human cognitive biases rather than against them.",
    coreFramework: {
      summary: "Kahneman's dual-process theory reveals that human cognition operates through two distinct systems: System 1 (fast, automatic, intuitive) and System 2 (slow, deliberate, analytical). This framework has profound implications for AI design, as it helps us understand both the cognitive biases we might accidentally embed in AI systems and how to create AI that complements rather than replaces human judgment. In the AI era, this becomes critical for designing human-AI collaboration that leverages the strengths of both systems.",
      keyConcepts: [
        "System 1 Thinking: Fast, automatic, pattern-based decisions that feel effortless",
        "System 2 Thinking: Slow, deliberate analysis requiring conscious mental effort",
        "Cognitive Biases: Systematic errors in thinking that affect decisions and judgments",
        "Prospect Theory: How people make decisions involving risk and uncertainty",
        "Loss Aversion: The tendency to prefer avoiding losses over acquiring equivalent gains",
        "Availability Heuristic: Judging probability by how easily examples come to mind",
        "Anchoring Bias: Over-relying on first piece of information encountered"
      ],
      whyItMatters: "As AI systems become more sophisticated, understanding human cognitive limitations becomes essential for several reasons: (1) AI training data reflects human biases that can be amplified at scale, (2) Human-AI collaboration requires designing interfaces that work with, not against, human psychology, (3) Critical decisions still require human judgment, especially for high-stakes, value-laden choices, and (4) AI systems need to be designed to help humans make better decisions, not just faster ones.",
      aiImplications: "AI systems can simultaneously operate at both System 1 and System 2 speeds, potentially transcending human cognitive limitations. However, they also risk inheriting and amplifying human biases present in training data. The key is designing AI that enhances human decision-making by providing System 1 speed with System 2 accuracy, while preserving human agency in critical choices and maintaining awareness of when human judgment is essential.",
      recommendedPractices: [
        "Implement bias detection systems that monitor AI outputs for common human biases",
        "Design decision architectures with explicit System 1/System 2 pathways",
        "Create 'judgment preservation modes' that require human input to maintain cognitive skills",
        "Use prospect theory principles in AI interface design to account for loss aversion",
        "Build in human oversight triggers for high-uncertainty or value-critical decisions",
        "Apply behavioral economics to create ethical AI recommendation systems",
        "Design choice architecture that preserves human agency while optimizing outcomes"
      ],
      commonPitfalls: [
        "Assuming AI is immune to cognitive biases when it inherits them from training data",
        "Over-automating decisions that require human judgment and contextual understanding",
        "Ignoring loss aversion in AI recommendations, leading to user resistance",
        "Designing AI interfaces that work against human psychology rather than with it",
        "Failing to preserve human decision-making skills in AI-augmented environments",
        "Not accounting for availability bias in AI training data selection"
      ],
      successMetrics: [
        "Bias detection rate: Percentage of cognitive biases caught before deployment",
        "Human override rate: Frequency humans choose different paths than AI recommendations",
        "Decision accuracy improvement: Measurable better outcomes with AI assistance",
        "Cognitive skill retention: Evidence humans maintain judgment capabilities",
        "User acceptance rate: How readily people adopt AI decision support",
        "Ethical compliance score: Adherence to behavioral economics principles in design"
      ]
    },
    hardCodedTeam: [
      {
        member_code: "KAHNEMAN_01",
        display_name: "Behavioral Data Scientist",
        description: "Specialist in detecting cognitive biases in AI systems and human-AI interaction patterns",
        role_on_team: "Bias Detection Lead",
        rationale: "Essential for implementing Kahneman's insights about System 1/2 thinking in AI architectures and preventing inherited biases"
      },
      {
        member_code: "KAHNEMAN_02", 
        display_name: "Nudge Architecture Designer",
        description: "Expert in behavioral economics applications for AI interface design and choice architecture",
        role_on_team: "UX Behavioral Economist",
        rationale: "Applies prospect theory and loss aversion principles to create ethical AI recommendation systems"
      },
      {
        member_code: "KAHNEMAN_03",
        display_name: "Decision Systems Architect", 
        description: "Specializes in hybrid decision-making frameworks that preserve human judgment while leveraging AI speed",
        role_on_team: "System Design Lead",
        rationale: "Designs AI systems with explicit System 1/System 2 pathways and human oversight triggers"
      },
      {
        member_code: "KAHNEMAN_04",
        display_name: "Cognitive Preservation Specialist",
        description: "Focuses on maintaining human decision-making skills in AI-augmented environments",
        role_on_team: "Human Factor Consultant", 
        rationale: "Ensures AI systems include 'judgment preservation modes' to maintain human cognitive capabilities"
      },
      {
        member_code: "KAHNEMAN_05",
        display_name: "Risk Assessment Modeler",
        description: "Applies behavioral economics to AI risk evaluation and resource allocation decisions",
        role_on_team: "Risk Strategy Advisor",
        rationale: "Implements prospect theory in AI systems to better understand and account for human risk perception patterns"
      }
    ],
    crossEraRelevance: {
      onPrem: {
        people: "Decision makers rely heavily on System 2 thinking - deliberate analysis, risk committees, slow methodical review processes with human expertise central to all major choices",
        policy: "Risk management policies dominate - extensive approval chains, compliance frameworks, audit trails, and governance structures that favor careful System 2 deliberation over speed",
        process: "Multi-stage decision workflows with checkpoints, documentation requirements, and formal review cycles that mirror System 2's methodical approach to complex problems",
        technology: "Rule-based systems, decision trees, expert systems that codify System 2 logic into deterministic processes - slow but reliable, limited by pre-programmed scenarios"
      },
      cloudNative: {
        people: "Teams develop System 1 pattern recognition for cloud operations - experienced engineers intuitively understanding system health, developing 'ops intuition' for complex distributed systems",
        policy: "Shift to outcome-based policies - SLAs replace detailed procedures, allowing teams System 1 autonomy within guardrails, policy-as-code enables rapid adaptation",
        process: "Real-time feedback loops mirror System 1 processing - continuous integration/deployment, automated testing, instant rollbacks based on pattern recognition rather than deliberate analysis",
        technology: "Auto-scaling, circuit breakers, and monitoring systems that make split-second System 1-style decisions based on pattern recognition across thousands of metrics simultaneously"
      },
      genAI: {
        people: "Humans develop new cognitive partnership - learning to prompt effectively, understanding AI capabilities/limitations, developing judgment about when to trust vs verify AI decisions",
        policy: "AI governance emerges - policies for model usage, data privacy, bias testing, human oversight requirements, with frameworks that balance innovation speed with ethical constraints",
        process: "Hybrid workflows combining AI rapid processing with human judgment - AI handles pattern recognition and initial analysis while humans make final decisions on high-stakes choices",
        technology: "Large language models that simultaneously process System 1 pattern matching and System 2 logical reasoning, creating new hybrid decision architectures that transcend human cognitive limitations"
      },
      agenticAI: {
        people: "Humans become strategic overseers rather than tactical decision makers - setting objectives and constraints while agents handle thousands of micro-decisions using both systems",
        policy: "Dynamic policy frameworks that agents can interpret and apply in novel situations - principles-based rather than rule-based, requiring constant human calibration of agent behavior",
        process: "Continuous delegation loops - humans define goals, agents execute with real-time adaptation, humans review outcomes and adjust agent parameters in ongoing feedback cycles",
        technology: "Multi-agent systems that embody both cognitive systems - making intuitive real-time decisions while maintaining analytical oversight, challenging fundamental assumptions about decision authority"
      },
      bci: {
        people: "Cognitive augmentation eliminates System 1/2 distinction - direct neural interfaces enable thought-speed analysis without conscious effort, fundamentally changing human decision-making capacity",
        policy: "Neural rights frameworks emerge - policies governing cognitive enhancement, mental privacy, neural data ownership, with unprecedented challenges to concepts of individual agency and consent",
        process: "Thought-to-action workflows bypass traditional decision processes - neural commands directly execute complex operations, requiring new models for accountability and error handling",
        technology: "Brain-computer interfaces that directly access and augment human cognitive processes - eliminating bottlenecks between thinking and doing, creating new forms of human-machine consciousness"
      }
    },
    usagePrompts: [
      {
        question: "How should we design AI decision architectures that leverage both System 1 and System 2 thinking?",
        context: "Building hybrid AI systems that balance speed and accuracy",
        application: "Create decision trees where routine choices use System 1 patterns, while high-stakes decisions trigger System 2 analytical processes with human oversight"
      },
      {
        question: "What cognitive biases are our AI systems inheriting from training data, and how do we detect them?",
        context: "Bias auditing for deployed AI systems across different domains",
        application: "Build bias detection dashboards that monitor for availability heuristic, anchoring bias, and confirmation bias in AI outputs with automated alerts"
      },
      {
        question: "How do we design 'nudge architectures' for AI agents interacting with humans?",
        context: "Creating AI systems that guide human decision-making ethically",
        application: "Implement choice architecture principles in AI interfaces that preserve human agency while optimizing outcomes through behavioral insights"
      },
      {
        question: "What happens to human judgment when AI handles most System 1 processing?",
        context: "Designing human-AI collaboration that preserves human decision-making skills",
        application: "Build AI systems with 'judgment preservation modes' that occasionally require human System 1 input to maintain cognitive capabilities"
      },
      {
        question: "How do we apply prospect theory to AI risk assessment and resource allocation?",
        context: "Building AI systems that understand human risk perception and loss aversion",
        application: "Design AI recommendation systems that account for human loss aversion by framing choices in terms of gains rather than losses"
      },
      {
        question: "What decision-making processes should remain exclusively human in an AI-dominant world?",
        context: "Defining the boundaries between human and AI decision authority",
        application: "Create decision classification frameworks that reserve high-uncertainty, value-laden, and irreversible choices for human System 2 processing"
      }
    ],
    relatedThinkers: ["Amos Tversky", "Gerd Gigerenzer", "Herbert Simon", "Dan Ariely", "Richard Thaler", "Nassim Nicholas Taleb"],
    practicalApplications: {
      immediate: "Audit existing AI systems for inherited cognitive biases using behavioral economics frameworks, implement bias detection alerts, and create decision classification systems",
      mediumTerm: "Design hybrid AI architectures with explicit System 1/System 2 pathways, build nudge-based human-AI interfaces, and develop AI systems that preserve human judgment skills",
      longTerm: "Create post-cognitive AI systems that transcend human decision-making limitations while preserving human agency in value-critical choices"
    }
  },
  {
    name: "Donella Meadows",
    area: "Systems Thinking",
    coreIdea: "Leverage points, system archetypes",
    aiShift: "Agentic AI dynamically alters leverage points.",
    lobe: "Innovation/Strategy", 
    hardCodedTeam: [
      {
        member_code: "MEADOWS_01",
        display_name: "Systems Dynamics Modeler",
        description: "Expert in mapping complex organizational and technical system interdependencies",
        role_on_team: "Systems Mapping Lead",
        rationale: "Essential for identifying leverage points in AI transformation and understanding system feedback loops"
      },
      {
        member_code: "MEADOWS_02",
        display_name: "Leverage Point Analyst", 
        description: "Specialist in Meadows' 12 leverage points framework and intervention design",
        role_on_team: "Strategic Intervention Designer",
        rationale: "Applies systems thinking to find high-impact points for AI deployment and organizational change"
      },
      {
        member_code: "MEADOWS_03",
        display_name: "Emergence Facilitator",
        description: "Focuses on creating conditions for beneficial system behaviors to emerge from AI integration",
        role_on_team: "System Behavior Designer", 
        rationale: "Designs AI systems that enable positive emergent behaviors while preventing unintended consequences"
      },
      {
        member_code: "MEADOWS_04",
        display_name: "Constraint Architecture Specialist",
        description: "Expert in designing system constraints that guide but don't restrict beneficial AI evolution",
        role_on_team: "Governance Framework Designer",
        rationale: "Builds constraints preventing AI agents from altering critical system leverage points inappropriately"
      },
      {
        member_code: "MEADOWS_05",
        display_name: "System Evolution Strategist",
        description: "Specializes in managing transitions between different system paradigms and mental models",
        role_on_team: "Transition Strategy Lead",
        rationale: "Guides organizations through paradigm shifts required for successful AI-human collaboration patterns"
      }
    ],
    crossEraRelevance: {
      onPrem: {
        people: "Systems thinkers are rare specialists - few understand complex interdependencies, change initiatives require extensive training and cultural shifts",
        policy: "Hierarchical policies reflect linear thinking - departmental silos, sequential approval processes that miss systemic interactions and feedback loops",
        process: "Waterfall methodologies dominate - phase-gate processes that assume linear causation, missing leverage points that emerge from system interactions",
        technology: "Monolithic architectures with fixed relationships - database schemas and business logic that embed assumptions about system structure and limit adaptation"
      },
      cloudNative: {
        people: "DevOps culture emerges around systems thinking - cross-functional teams understand service interdependencies, platform teams think systemically about developer experience",
        policy: "Platform policies enable emergence - API standards, service mesh governance that allow complex behaviors to emerge from simple rules and local interactions",
        process: "Continuous feedback loops - observability, chaos engineering, and iterative deployment that reveal system behavior and enable rapid leverage point identification",
        technology: "Microservices and container orchestration create dynamic leverage points - auto-scaling, service discovery, and infrastructure-as-code that enable real-time system reconfiguration"
      },
      genAI: {
        people: "AI amplifies systems thinking capabilities - models help humans visualize complex interdependencies, identify patterns across vast system interactions",
        policy: "Adaptive governance frameworks - policies that evolve based on system feedback, AI-assisted policy modeling that predicts systemic effects of regulatory changes",
        process: "AI-assisted leverage point discovery - machine learning identifies high-impact intervention points across complex organizational and technical systems",
        technology: "Foundation models can understand and manipulate system structure - updating their own behavior based on system feedback, creating new categories of leverage points"
      },
      agenticAI: {
        people: "Agents democratize systems thinking - every user gains access to systems analysis capabilities, reducing dependence on rare systems thinking specialists",
        policy: "Dynamic policy adaptation - agents continuously adjust governance frameworks based on real-time system feedback, enabling policy that evolves with system structure",
        process: "Real-time leverage point optimization - agents identify and act on system interventions as they emerge, creating continuous system improvement cycles",
        technology: "Self-modifying system architectures - agents that can alter their own system structure and that of other systems, creating unprecedented leverage point accessibility"
      },
      bci: {
        people: "Direct systems perception - neural interfaces enable intuitive understanding of complex system dynamics, making systems thinking as natural as spatial reasoning",
        policy: "Collective intelligence governance - neural networks of human decision-makers creating policy through direct cognitive connection and shared systems understanding",
        process: "Thought-speed system intervention - neural interfaces enable real-time system modification at the speed of thought, eliminating delays between insight and action",
        technology: "Neural-digital system integration - brain-computer interfaces that make human cognition part of technical systems, creating hybrid organic-digital leverage points"
      }
    },
    usagePrompts: [
      {
        question: "Where are the leverage points in our AI transformation?",
        context: "Strategic planning for AI deployment",
        application: "Map the 12 leverage points against your current AI initiatives"
      },
      {
        question: "How do agents change the system they operate within?",
        context: "Designing self-modifying agent systems",
        application: "Build constraints that prevent agents from altering their own constraints"
      }
    ],
    relatedThinkers: ["Peter Senge", "Jay Forrester", "Geoffrey West"],
    practicalApplications: {
      immediate: "Map current leverage points in your organization using Meadows' hierarchy",
      mediumTerm: "Design AI systems that can identify but not alter high-leverage points",
      longTerm: "Create AI-human collaboration patterns that responsibly manage system evolution"
    }
  },
  {
    name: "Shoshana Zuboff",
    area: "Political Economy", 
    coreIdea: "Surveillance capitalism",
    aiShift: "Agentic AI deepens surveillance-utility trade-off.",
    lobe: "Ethics/Governance",
    hardCodedTeam: [
      {
        member_code: "ZUBOFF_01",
        display_name: "Behavioral Surplus Auditor",
        description: "Specialist in identifying and measuring extraction of behavioral data for commercial purposes",
        role_on_team: "Privacy Impact Assessor",
        rationale: "Essential for detecting surveillance capitalism patterns in AI systems and protecting user behavioral data"
      },
      {
        member_code: "ZUBOFF_02",
        display_name: "Consent Dynamics Designer",
        description: "Expert in creating meaningful consent frameworks for continuously learning AI agents",
        role_on_team: "Ethical AI Consent Lead",
        rationale: "Develops dynamic consent systems that adapt to agent learning while preserving user agency and choice"
      },
      {
        member_code: "ZUBOFF_03", 
        display_name: "Value Creation Strategist",
        description: "Focuses on business models that create value without exploiting user behavioral surplus",
        role_on_team: "Post-Surveillance Business Designer",
        rationale: "Pioneers alternative value creation models that benefit users without extracting behavioral data for manipulation"
      },
      {
        member_code: "ZUBOFF_04",
        display_name: "Digital Rights Advocate",
        description: "Specializes in protecting cognitive liberty and mental privacy in AI-human interactions",
        role_on_team: "Human Autonomy Guardian",
        rationale: "Ensures AI systems preserve human decision-making autonomy and protect against manipulation techniques"
      },
      {
        member_code: "ZUBOFF_05",
        display_name: "Regulatory Framework Analyst",
        description: "Expert in governance frameworks that prevent regulatory capture by AI companies",
        role_on_team: "Democratic Governance Lead",
        rationale: "Develops governance structures that prioritize public interest over corporate surveillance and behavioral control"
      }
    ],
    crossEraRelevance: {
      onPrem: {
        people: "Workers largely unaware of data extraction - limited visibility into what data is collected, stored locally with minimal sharing between systems",
        policy: "Privacy regulations focused on personal data protection - GDPR-style frameworks assuming data as property, with individual consent as primary mechanism",
        process: "Batch data processing limits surveillance scope - periodic analytics, manual data mining, limited real-time behavioral insight extraction",
        technology: "Data silos prevent comprehensive behavioral profiles - disconnected databases, limited integration, storage and processing constraints limit surveillance scale"
      },
      cloudNative: {
        people: "Digital workers become unwitting data sources - remote work tools capture unprecedented behavioral details, productivity monitoring normalized",
        policy: "Data governance struggles with cloud complexity - compliance frameworks lag behind technical capabilities, cross-border data flows complicate regulatory oversight",
        process: "Real-time behavioral data streams - continuous monitoring, instant analytics, behavioral patterns detected across multiple platforms and services",
        technology: "Unified data platforms enable comprehensive surveillance - cloud storage and processing remove constraints, APIs connect previously isolated behavioral data sources"
      },
      genAI: {
        people: "Users trade behavioral data for AI utility - accepting surveillance in exchange for personalized AI services, often unaware of the full scope of data extraction",
        policy: "AI governance frameworks emerge slowly - regulatory attempts to control algorithmic decision-making while companies lobby for self-regulation and innovation freedom",
        process: "Behavioral surplus extraction becomes invisible - AI models learn from interactions without explicit surveillance, making data extraction less visible to users",
        technology: "Foundation models aggregate massive behavioral datasets - training on human conversations, decisions, and actions to predict and influence future behavior"
      },
      agenticAI: {
        people: "Agents become intimate behavioral data collectors - conversational AI extracts deeper psychological profiles through natural interaction and emotional engagement",
        policy: "Regulatory capture by AI companies - complex technical systems outpace regulatory understanding, policies written by industry lobbyists masquerading as neutral governance",
        process: "Active behavioral surplus extraction - agents designed to elicit valuable behavioral data through engaging interactions, gamification, and psychological manipulation",
        technology: "Multi-agent systems coordinate behavioral data collection - swarms of specialized agents working together to extract, correlate, and monetize human behavioral patterns"
      },
      bci: {
        people: "Neural data becomes the ultimate behavioral surplus - direct access to thoughts, emotions, and intentions eliminates all privacy boundaries and consent mechanisms",
        policy: "Neural rights frameworks nonexistent - no established governance for cognitive liberty, mental privacy, or protection against neural manipulation and exploitation",
        process: "Direct extraction of behavioral surplus from neural activity - bypassing all conscious awareness and consent, reading intentions before individuals are aware of them",
        technology: "Brain-computer interfaces eliminate the final privacy frontier - direct neural data extraction creates perfect behavioral prediction and influence capabilities"
      }
    },
    usagePrompts: [
      {
        question: "How do we extract value without extracting behavioral surplus?",
        context: "Building ethical AI products",
        application: "Design value creation that benefits users without exploiting behavioral data"
      },
      {
        question: "What consent models work for agentic AI that learns continuously?",
        context: "Privacy-preserving agent design",
        application: "Implement dynamic consent systems that adapt to agent learning"
      }
    ],
    relatedThinkers: ["Yuval Noah Harari", "Hannah Arendt", "Elinor Ostrom"],
    practicalApplications: {
      immediate: "Audit your AI systems for surveillance capitalism patterns",
      mediumTerm: "Develop value models that don't depend on behavioral surplus extraction",
      longTerm: "Pioneer post-surveillance business models for neural interface era"
    }
  }
];

export function getExpandedThinker(name: string): ExpandedThinker | undefined {
  return EXPANDED_THINKERS.find(t => t.name === name);
}

export function getThinkersByLobe(lobe: Lobe): ExpandedThinker[] {
  return EXPANDED_THINKERS.filter(t => t.lobe === lobe);
}