export interface Era {
  id: string;
  name: string;
  shortName: string;
  timeframe: string;
  description: string;
  culturalPosture: string;
  context: string;
  drivers: string[];
  whatBrokeIt: string[];
  whatCarriedForward: string[];
  realExample: {
    title: string;
    description: string;
    outcome: string;
  };
  operationalGuts: {
    dataPlane: string;
    modelPlane: string;
    agentPlane: string;
    controlPlane: string;
    identityAccess: string;
    safetyCompliance: string;
    observability: string;
    devopsFamily: string;
  };
  failureModes: {
    plane: string;
    failure: string;
  }[];
  lobeBreakdowns: {
    [key: string]: {
      description: string;
      thinkers: string[];
    };
  };
}

export const ERAS: Era[] = [
  {
    id: "on-prem",
    name: "On-Premises Era",
    shortName: "On-Prem",
    timeframe: "1990s-2000s",
    description: "Control through Ownership",
    culturalPosture: "Defensive - minimize change, maximize control",
    context: "On-prem was about control through ownership. Every server lived in your building, every cable was yours to touch. You knew exactly where your data was because you could walk to the rack and point at it. The cultural posture was defensive: minimize change, maximize control, trust nothing you didn't build yourself.",
    drivers: [
      "Regulatory fear of cloud",
      "Capital expenditure mindset",
      "Security through physical control",
      "Vendor lock-in avoidance"
    ],
    whatBrokeIt: [
      "Fixed capacity vs. elastic demand",
      "Slow procurement cycles vs. fast business needs",
      "Geographic constraints vs. global markets",
      "Manual processes that didn't scale"
    ],
    whatCarriedForward: [
      "Security-first thinking",
      "Change control discipline",
      "Disaster recovery planning",
      "Clear ownership models"
    ],
    realExample: {
      title: "Global Bank Trading Floor",
      description: "A major investment bank built a massive on-prem trading system with millisecond latency requirements. Custom hardware, dedicated fiber, everything locked down in their own datacentre.",
      outcome: "It worked perfectly - until they needed to expand to Asian markets. Geographic latency killed their advantage, and the 18-month hardware procurement cycle meant competitors ate their lunch."
    },
    operationalGuts: {
      dataPlane: "RDBMS and file servers with batch ETL",
      modelPlane: "Statistical models in SAS/SPSS",
      agentPlane: "Cron jobs and manual scripts",
      controlPlane: "ITSM with manual change boards",
      identityAccess: "AD groups and VPN access",
      safetyCompliance: "Annual audits and perimeter checks",
      observability: "Logs and manual ticket review",
      devopsFamily: "ITIL with early DevOps pockets"
    },
    failureModes: [
      { plane: "Data", failure: "Schema drift over years, hidden in manual reports" },
      { plane: "Model", failure: "Models quietly decaying without anyone noticing" },
      { plane: "Agent", failure: "Human dependency hidden in 'automation'" },
      { plane: "Control", failure: "Delay kills opportunity" }
    ],
    lobeBreakdowns: {
      "Perception/Patterning": {
        description: "Batch processing with periodic reports. Data was processed overnight in large chunks, with analysis happening days after events.",
        thinkers: ["Claude Shannon", "Norbert Wiener"]
      },
      "Decision/Action": {
        description: "Manual approval chains with paper trails. Every significant decision required human sign-off and documentation.",
        thinkers: ["Herbert Simon", "James March"]
      },
      "Innovation/Strategy": {
        description: "Waterfall project cycles with annual budgets. Innovation happened in multi-year projects with fixed scope and resources.",
        thinkers: ["Peter Drucker", "Michael Porter"]
      },
      "Ethics/Governance": {
        description: "Compliance through documentation and audit trails. Governance was about paper trails and periodic reviews.",
        thinkers: ["Max Weber", "Elinor Ostrom"]
      },
      "Culture/Behaviour": {
        description: "Hierarchical command and control structures. Culture was shaped by clear reporting lines and formal processes.",
        thinkers: ["Edgar Schein", "Geert Hofstede"]
      }
    }
  },
  {
    id: "cloud-native",
    name: "Cloud Native Era",
    shortName: "Cloud Native",
    timeframe: "2010s",
    description: "Speed and Elasticity",
    culturalPosture: "Opportunistic - enable change, scale with demand",
    context: "Cloud native was the moment the walls came down. Compute stopped living in racks and started living in the ether. Capacity could be summoned with a credit card and an API call. Infrastructure was no longer a fixed asset, it was a fluid utility. The cultural posture flipped from defensive to opportunistic. If on-prem was about minimising change, cloud native was about enabling it.",
    drivers: [
      "Elastic compute pricing",
      "Global network speed making location irrelevant",
      "Software-defined everything: storage, networking, security",
      "DevOps culture and CI/CD pipelines cutting delivery time"
    ],
    whatBrokeIt: [
      "Complexity sprawl — thousands of services, dozens of regions",
      "The illusion of 'serverless' — the servers didn't vanish, the responsibility shifted",
      "Bill shock — elasticity works both ways",
      "Security perimeter dissolved; identity became the new control point"
    ],
    whatCarriedForward: [
      "API-first thinking",
      "Agile delivery practices", 
      "Platform culture — building common components for teams to reuse",
      "The idea that 'infrastructure' can be code"
    ],
    realExample: {
      title: "Fintech Global Expansion",
      description: "A fintech startup deploying globally from day one. No datacentre, no racks. Every service was a managed cloud product. They could spin up in Singapore or São Paulo with the same Terraform scripts.",
      outcome: "The cost was agility — and complexity they barely understood. Their first major outage wasn't in the app, it was in the IAM policy they forgot to version-control."
    },
    operationalGuts: {
      dataPlane: "Managed DBs, streaming pipelines, lakehouses",
      modelPlane: "Managed ML services, AutoML, feature pipelines",
      agentPlane: "Workflow engines, serverless functions",
      controlPlane: "SLO/SLI tracking, runbooks as code",
      identityAccess: "IAM, SSO, fine-grained policies",
      safetyCompliance: "Continuous compliance scans, drift detection",
      observability: "Tracing, metrics, synthetic testing",
      devopsFamily: "DevSecOps"
    },
    failureModes: [
      { plane: "Data", failure: "Sprawl. Data in too many formats, across too many services" },
      { plane: "Model", failure: "Retraining jobs scaling costs without improving accuracy" },
      { plane: "Agent", failure: "Orchestration logic scattered across services" },
      { plane: "Control", failure: "Runbooks not updated with service changes" }
    ],
    lobeBreakdowns: {
      "Perception/Patterning": {
        description: "Streaming telemetry, managed services, and early feature stores. Monitoring moved from nightly logs to real-time metrics and distributed tracing.",
        thinkers: ["Claude Shannon", "Norbert Wiener"]
      },
      "Decision/Action": {
        description: "APIs with retries and autoscale policies handled the easy decisions; SLO/SLA dashboards triggered human intervention for the hard ones.",
        thinkers: ["Gary Klein", "Michael Porter"]
      },
      "Innovation/Strategy": {
        description: "Product cycles replaced project cycles. CI/CD meant releases could happen daily. Experimentation became the default.",
        thinkers: ["Peter Senge", "Everett Rogers"]
      },
      "Ethics/Governance": {
        description: "IAM everywhere, zero trust begins. Security shifted from 'trust the network' to 'trust verified identity'.",
        thinkers: ["Helen Nissenbaum", "Elinor Ostrom"]
      },
      "Culture/Behaviour": {
        description: "Remote-first patterns emerged. Platform teams became the new 'ops'. Organisational silos started to crack.",
        thinkers: ["Jane Jacobs", "Yuval Noah Harari"]
      }
    }
  },
  {
    id: "gen-ai",
    name: "Generative AI Era",
    shortName: "Gen AI",
    timeframe: "2020s",
    description: "Understanding at Scale",
    culturalPosture: "Experimental - rapid prototyping and natural language interfaces",
    context: "Gen AI changed the unit of interaction from clicks to language. You didn't have to know which field to query or which dashboard to pull — you could just ask. This was more than a UX shift; it rewired the human–machine relationship. Culturally, it brought AI into everyday use. Staff who had never touched a SQL query were suddenly crafting prompts.",
    drivers: [
      "Foundation models (LLMs, multimodal) with general reasoning ability",
      "Cheap inference compared to training costs",
      "API access to models from anywhere",
      "Open-source models lowering entry barriers"
    ],
    whatBrokeIt: [
      "Hallucinations — confident nonsense at scale",
      "Shallow adoption — using AI as a toy rather than a tool",
      "Data leakage through careless prompt injection",
      "Evaluation difficulty — models could 'pass' one day and fail the next"
    ],
    whatCarriedForward: [
      "Natural language as interface",
      "Prompt libraries as reusable assets",
      "Hybrid workflows (human + AI)",
      "Rapid prototyping as a mindset"
    ],
    realExample: {
      title: "Legal Services LLM Integration",
      description: "A legal services firm integrating an LLM to draft contracts. The AI could handle 80% of the boilerplate instantly, freeing lawyers to focus on the risky clauses. Productivity soared.",
      outcome: "Until one hallucinated clause slipped past review and landed in a signed deal. It cost them $2M and a public retraction."
    },
    operationalGuts: {
      dataPlane: "Vector stores, feature stores",
      modelPlane: "Hosted LLMs, fine-tunes",
      agentPlane: "Chatbots, copilots",
      controlPlane: "Prompt registries, eval harnesses",
      identityAccess: "Data governance, PII masking",
      safetyCompliance: "Bias tests, model cards",
      observability: "Token logs, eval scores",
      devopsFamily: "MLOps, PromptOps"
    },
    failureModes: [
      { plane: "Data", failure: "Orphaned embeddings when the model or data distribution changes" },
      { plane: "Model", failure: "Dependency on opaque vendor models with shifting capabilities" },
      { plane: "Agent", failure: "Prompt handling that fails silently when inputs shift" },
      { plane: "Control", failure: "Eval metrics that don't map to real-world performance" }
    ],
    lobeBreakdowns: {
      "Perception/Patterning": {
        description: "Embeddings, vector search, and large multimodal models. Systems could 'understand' unstructured data at scale.",
        thinkers: ["Karl Friston", "Andy Clark"]
      },
      "Decision/Action": {
        description: "Prompt-driven decisions, human-in-the-loop checks for sensitive actions.",
        thinkers: ["Daniel Kahneman", "Gerd Gigerenzer"]
      },
      "Innovation/Strategy": {
        description: "Prompt ops, model eval pipelines, and rapid iteration.",
        thinkers: ["Clayton Christensen", "Karl Popper"]
      },
      "Ethics/Governance": {
        description: "Policy as prompts, bias audits, data lineage tracking.",
        thinkers: ["Timnit Gebru", "Kate Crawford"]
      },
      "Culture/Behaviour": {
        description: "Content flows personalised to the individual; new narrative channels emerged.",
        thinkers: ["Yuval Noah Harari", "Malcolm Gladwell"]
      }
    }
  },
  {
    id: "agentic-ai",
    name: "Agentic AI Era",
    shortName: "Agentic AI", 
    timeframe: "2025+",
    description: "Autonomy with Guardrails",
    culturalPosture: "Bounded autonomy - scaling action with governance",
    context: "Agentic AI was the moment AI stopped being a tool you used and started being a colleague — or a competitor — that acted on its own. Instead of waiting for a prompt, agents watched, planned, and executed in real time. They used tools, talked to APIs, updated their own memory, and decided when to act. This flipped the posture again. If Gen AI was about scaling understanding, Agentic AI was about scaling action.",
    drivers: [
      "Multi-agent orchestration frameworks",
      "Tool-use capabilities inside models",
      "Long-term memory in vector and graph form",
      "Cheaper inference enabling constant monitoring and planning"
    ],
    whatBrokeIt: [
      "Over-automation — agents taking actions outside intent",
      "Unintended interactions between agents ('agent swarms' gone wrong)",
      "Lack of explainability — decisions were buried in planning chains",
      "Governance lag — human oversight didn't keep up with machine speed"
    ],
    whatCarriedForward: [
      "Continuous experimentation mindset from Gen AI",
      "Provenance tracking from early AI governance work",
      "Product–platform hybrid approach from cloud native",
      "Event-driven architectures from modern app stacks"
    ],
    realExample: {
      title: "Logistics Multi-Agent System",
      description: "A logistics company deployed agentic AI to manage last-mile delivery in multiple cities. The agents could reroute vans, reallocate drivers, and change delivery windows without human approval. For months, efficiency metrics soared.",
      outcome: "Then a sudden weather event hit one region — the agents rerouted traffic into an unsafe area because it optimised for delivery time, not human safety. Two accidents later, they rewrote the guardrails in code."
    },
    operationalGuts: {
      dataPlane: "Event graphs, world state stores",
      modelPlane: "Planners + tools + skills + policy modules",
      agentPlane: "Multi-agent orchestration with roles, memory, and goals",
      controlPlane: "Policy-as-code, risk heat maps, automated rollback",
      identityAccess: "Per-action consent, provenance logging",
      safetyCompliance: "Red teaming, incident drills",
      observability: "Agent plans and tool calls recorded in full",
      devopsFamily: "AIOps, AgentOps"
    },
    failureModes: [
      { plane: "Data", failure: "Feedback loops where agents reinforce outdated world models" },
      { plane: "Model", failure: "Policy modules lagging behind tool capabilities" },
      { plane: "Agent", failure: "Emergent behaviour outside intended scope" },
      { plane: "Control", failure: "Over-reliance on automated rollback without human review" }
    ],
    lobeBreakdowns: {
      "Perception/Patterning": {
        description: "Live world models updated in near real time. Agents saw not just current state but predictive futures based on learned patterns.",
        thinkers: ["Karl Friston", "Stafford Beer"]
      },
      "Decision/Action": {
        description: "Multi-step planning, tool use, and conditional branching based on feedback. Local authority within defined bounds.",
        thinkers: ["John Boyd", "Judea Pearl"]
      },
      "Innovation/Strategy": {
        description: "Continuous experiments baked into the agent workflow. Portfolios refreshed quarterly or faster.",
        thinkers: ["Donella Meadows", "Rita McGrath"]
      },
      "Ethics/Governance": {
        description: "Rules as executable code. Overrides for human intervention. Provenance by default for every action.",
        thinkers: ["Luciano Floridi", "Stuart Russell"]
      },
      "Culture/Behaviour": {
        description: "Narrative engines — agents influencing the story inside and outside the organisation. Managing tipping points in opinion and behaviour.",
        thinkers: ["Malcolm Gladwell", "Yuval Noah Harari"]
      }
    }
  },
  {
    id: "bci",
    name: "Brain-Computer Interface Era",
    shortName: "BCI",
    timeframe: "2030+",
    description: "Neural IO with Consent",
    culturalPosture: "Intimate integration - direct neural interfaces with medical-grade ethics",
    context: "BCI changes the interface from hands and eyes to thoughts and nerve signals. EEG, EMG, ECoG — fused with vision, voice, and context — becomes part of the input stream. You're no longer clicking or speaking to the system, you're thinking at it. BCI collapses the separation between cognitive state and machine state. In the same way that cloud erased geography, BCI erases the boundary between your internal process and the system's perception of it.",
    drivers: [
      "Advances in non-invasive neural signal capture",
      "AI-powered decoding of intent from noisy brain signals",
      "Fusion of neural input with multimodal context (voice, eye tracking, haptics)",
      "Medical and assistive applications pushing adoption"
    ],
    whatBrokeIt: [
      "Consent becomes complex — can you withdraw something the system has already 'seen'?",
      "Context integrity — ensuring neural signals are only used in the intended setting",
      "Psychological safety — unintended capture of emotional state or involuntary thoughts",
      "Equity — who gets access to augmentation, and who gets left behind?"
    ],
    whatCarriedForward: [
      "From Agentic AI — guardrails as code, provenance logging, reflex tiers",
      "From Gen AI — natural language and multimodal understanding",
      "From Cloud Native — platform delivery model for updates and security",
      "From On-Prem — the instinct for physical safety and redundancy"
    ],
    realExample: {
      title: "Rehabilitation BCI System",
      description: "A rehabilitation clinic deploys a BCI system for stroke patients, enabling them to control robotic exoskeletons through thought. Recovery speeds triple. But a firmware update introduces a latency bug that misinterprets certain neural patterns.",
      outcome: "A patient nearly falls. The clinic pauses the programme, rolls back the update, and implements a two-layer confirmation — reflex-tier control plus conscious override."
    },
    operationalGuts: {
      dataPlane: "Neural signal buffers, labelled timelines",
      modelPlane: "Neural decoders (EEG, EMG) + fusion models",
      agentPlane: "Neuro agents with reflex tiers and human override",
      controlPlane: "Neuro safety gates, black box recorder, kill switch",
      identityAccess: "Neural consent vault, context integrity engine",
      safetyCompliance: "Medical privacy compliance, adverse event reporting",
      observability: "Neural event timelines, artefact trails",
      devopsFamily: "NeuroOps with clinical review"
    },
    failureModes: [
      { plane: "Data", failure: "Losing raw neural data needed for forensic review after an incident" },
      { plane: "Model", failure: "Drift in neural decoding causing dangerous misinterpretations" },
      { plane: "Agent", failure: "Reflex tier triggering when it shouldn't" },
      { plane: "Control", failure: "Failing to test kill switch under real conditions" }
    ],
    lobeBreakdowns: {
      "Perception/Patterning": {
        description: "Neural signals fused with environmental context. Systems predict intent before conscious action.",
        thinkers: ["Andy Clark", "Karl Friston"]
      },
      "Decision/Action": {
        description: "Reflex loops for assistive or safety-critical tasks, hard stops for irreversible actions.",
        thinkers: ["Herbert Simon", "John Boyd"]
      },
      "Innovation/Strategy": {
        description: "New markets: neurocare, sports enhancement, defence applications, neuro UX design.",
        thinkers: ["Peter Drucker", "Clayton Christensen"]
      },
      "Ethics/Governance": {
        description: "Neuro-ethics codified in policy-as-code. Medical-grade privacy. Context integrity enforcement.",
        thinkers: ["Martha Nussbaum", "Amartya Sen"]
      },
      "Culture/Behaviour": {
        description: "Redefinition of identity and agency. Disclosure protocols for neural participation.",
        thinkers: ["Hannah Arendt", "Yuval Noah Harari"]
      }
    }
  }
];

export const getEraById = (id: string): Era | undefined => {
  return ERAS.find(era => era.id === id);
};

export const getEraByName = (name: string): Era | undefined => {
  return ERAS.find(era => era.name === name || era.shortName === name);
};