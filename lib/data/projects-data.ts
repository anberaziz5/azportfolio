export type ProjectTag = "ML/AI" | "Full-Stack" | "Research" | "Open Source" | "Infrastructure";

export interface Project {
  id: string;
  title: string;
  year: string;
  type: string;
  description: string;
  longDescription: string[];
  techStack: string[];
  tags: ProjectTag[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export const projectsData: Project[] = [
  {
    id: "cyberguard",
    title: "CyberGuard AI Threat Intelligence System",
    year: "2025",
    type: "Final Year Research Capstone",
    description: "An AI-powered cybersecurity threat intelligence platform with real-time risk analysis.",
    longDescription: [
      "Designed and developed a full-stack AI-powered cybersecurity intelligence platform as the senior capstone at LCWU, covering the complete lifecycle from threat ingestion to automated reporting.",
      "The platform delivers real-time threat monitoring, automated risk scoring using ML inference, incident lifecycle management, and role-based analytical dashboards tailored to different operator permission levels.",
      "A threat prioritization engine surfaces the highest-severity indicators automatically, reducing manual triage overhead for security analysts and enabling faster incident response.",
      "Integrates structured machine learning inference with a reporting module that generates actionable security briefs without requiring manual analyst input."
    ],
    techStack: ["Python", "Machine Learning", "Role-Based Architecture", "React", "Node.js"],
    tags: ["ML/AI", "Research", "Full-Stack"],
    githubUrl: "https://github.com/anberaziz5/cyberguard-platform",
    liveUrl: "https://cyberguard.xcler.dev",
    featured: true
  },
  {
    id: "omni-node",
    title: "Omni-Node Operations Mesh",
    year: "2025",
    type: "Autonomous SRE Pipeline",
    description: "Event-driven microservice system that streams live server cluster telemetry with autonomous remediation.",
    longDescription: [
      "Built an event-driven microservice system that streams live server cluster telemetry (CPU, RAM, API latency) through a bidirectional WebSocket mesh across three independently deployed services.",
      "Applied a scikit-learn Isolation Forest model to perform unsupervised geometric outlier detection on incoming telemetry, replacing brittle static threshold alerting with statistically grounded anomaly scoring.",
      "When the ML engine returns a critical anomaly score, the system autonomously submits the telemetry context to Google Gemini 2.5 Flash, which diagnoses the root cause and generates exact Linux remediation commands within milliseconds.",
      "Every autonomous AI decision is stored in a MongoDB Atlas audit ledger with a strict schema, creating a permanent immutable trace for post-mortem analysis and compliance review.",
      "Deployed across a multi-cloud topology: Python ML engine and Node.js event broker on Hugging Face Spaces via Docker, and the React command center on Vercel."
    ],
    techStack: ["Microservices", "Isolation Forest", "Gemini 2.5", "MongoDB", "React", "Docker"],
    tags: ["ML/AI", "Infrastructure", "Full-Stack"],
    githubUrl: "https://github.com/anberaziz5/omni-node-ops",
    liveUrl: "https://omninode.anber.me/",
    featured: true
  },
  {
    id: "predictive-supply-chain",
    title: "Predictive Supply Chain Nervous System",
    year: "2025",
    type: "Enterprise Logistics Platform",
    description: "Enterprise-grade logistics prediction platform using XGBoost to assign real-time delay probability scores.",
    longDescription: [
      "Developed an enterprise-grade logistics prediction platform that assigns a real-time delay probability score to each active shipment using an XGBoost classifier trained on synthetic historical supply chain telemetry.",
      "Feature engineering covers container weight, route distance, historical port congestion indexes, and weather pattern variables, giving the model multi-dimensional context for each risk assessment.",
      "High-risk shipments are plotted on an interactive Folium geographic map, clustering anomalous routes for immediate visual identification by operations managers.",
      "An integrated Gemini LLM triage agent automatically generates specific, actionable rerouting and buffering directives for flagged shipments, replacing the reactive crisis management process.",
      "Includes a full synthetic telemetry generation pipeline in Python to produce training datasets that simulate complex real-world supply chain variables."
    ],
    techStack: ["XGBoost", "Folium", "Gemini LLM", "Streamlit", "Python"],
    tags: ["ML/AI", "Research"],
    githubUrl: "https://github.com/anberaziz5/supply-chain-nervous-system",
    liveUrl: "https://logistics.anber.me/",
    featured: true
  },
  {
    id: "openscholar",
    title: "OpenScholar Live Academic Research Engine",
    year: "2025",
    type: "Dynamic RAG System",
    description: "Serverless academic research engine that queries the live arXiv API in real-time.",
    longDescription: [
      "Built a serverless academic research engine that solves the information-lag problem inherent in static RAG systems by querying the live arXiv API in real time rather than relying on pre-indexed corpora.",
      "Downloaded papers are parsed, chunked, embedded on the fly using sentence transformers, and indexed into Qdrant Cloud with active payload indexing keyed to individual paper IDs for isolated per-session workspaces.",
      "The synthesis layer uses Groq as the primary high-throughput inference engine and automatically falls back to Google Gemini under rate-limit conditions, ensuring uninterrupted operation at zero cost.",
      "Frontend is a dual-pane React application built with Vite and Tailwind CSS v4, exposing an exploratory search tracking panel alongside a deeply synthesized literature review output.",
      "Backend FastAPI service containerized and deployed to Hugging Face Spaces; frontend deployed to Vercel with automated production rollouts via GitHub integration."
    ],
    techStack: ["RAG", "arXiv API", "Qdrant", "FastAPI", "React", "Groq"],
    tags: ["ML/AI", "Full-Stack", "Research"],
    githubUrl: "https://github.com/anberaziz5/openscholar",
    liveUrl: "https://scholar.anber.me/",
    featured: true
  },
  {
    id: "ai-pr-reviewer",
    title: "AI-Powered CI/CD Pull Request Reviewer",
    year: "2025",
    type: "Autonomous Code Review Tool",
    description: "Stateless webhook microservice for real-time autonomous code review using Gemini 2.5 Flash.",
    longDescription: [
      "Designed a stateless webhook microservice that intercepts GitHub pull request events (opened and synchronize actions) in real time, fetches the full file diff, and submits it to Google Gemini 2.5 Flash for autonomous code review.",
      "The LLM is prompted to prioritize security vulnerabilities (hardcoded credentials, injection vectors, improper error handling), logic errors, and best practice violations before surfacing stylistic feedback.",
      "Review output is published as formatted Markdown directly to the GitHub pull request timeline, giving reviewers structured, actionable feedback without a manual first-pass inspection cycle.",
      "Fully containerized with Docker and deployed to Hugging Face Spaces as a persistent webhook listener operating continuously with zero downtime."
    ],
    techStack: ["FastAPI", "GitHub Webhooks", "Gemini 2.5 Flash", "Docker"],
    tags: ["ML/AI", "Infrastructure", "Open Source"],
    githubUrl: "https://github.com/anberaziz5/ai-pr-reviewer",
    liveUrl: "https://github.com/anberaziz5/ai-pr-reviewer"
  },
  {
    id: "resume-checker",
    title: "Enterprise AI Resume Checker",
    year: "2024",
    type: "LLM Guardrail Gateway",
    description: "Hardened full-stack microservice with LLM guardrails for semantic resume parsing.",
    longDescription: [
      "Built a hardened full-stack microservice that semantically maps candidate qualifications against job description requirements using the Groq LPU inference engine running Llama 3.3 70B.",
      "Designed a three-layer LLM Guardrail Gateway: a regex-based prompt injection scanner, a PII redactor under GDPR principles, and a Pydantic BaseModel schema validator for deterministic JSON output.",
      "Deployed as a Vercel Serverless Function with automatic scaling and minimal cold start latency, serving both static frontend assets and the Python worker from a single vercel.json configuration."
    ],
    techStack: ["Python", "Flask", "Groq", "Llama 3.3", "Pydantic", "Vercel"],
    tags: ["ML/AI", "Full-Stack"],
    githubUrl: "https://github.com/anberaziz5/ai-resume-checker",
    liveUrl: "https://resumechecker.anber.me/"
  },
  {
    id: "multi-agent-researcher",
    title: "Autonomous Multi-Agent Researcher",
    year: "2024",
    type: "Agentic Orchestration",
    description: "Sequential state-machine pipeline with three specialized LLM agents for web research.",
    longDescription: [
      "Architected a sequential state-machine pipeline with three specialized LLM agents: a Planner, a Researcher, and a Synthesizer to compile fully cited Markdown intelligence reports.",
      "Deliberately separates planning, retrieval, and synthesis across distinct agents to prevent context degradation and confabulation.",
      "Implements rate-limit safeguards and graceful degradation logic so the pipeline continues producing partial results.",
      "Hosted on Hugging Face Spaces as a Streamlit application with persistent containerized deployment."
    ],
    techStack: ["Google Gemini", "DuckDuckGo Search", "Streamlit", "Python"],
    tags: ["ML/AI", "Research"],
    githubUrl: "https://github.com/anberaziz5/autonomous-agent-researcher",
    liveUrl: "http://autonomous-agent-researcher.anber.me/"
  },
  {
    id: "synthtox-engine",
    title: "SynthTox Engine",
    year: "2024",
    type: "Edge-Native Clinical Drug Triage",
    description: "Zero-hallucination clinical decision support pipeline deployed entirely on Cloudflare's global edge network.",
    longDescription: [
      "Designed a zero-hallucination clinical decision support pipeline deployed entirely on Cloudflare's global edge network, achieving sub-second end-to-end triage latency.",
      "A multimodal Llama-4-Scout model performs OCR on mobile device photographs to extract drug entity names.",
      "Drug entities are embedded using Cloudflare Workers AI and matched against a Cloudflare Vectorize index of FDA drug interaction data.",
      "The final inference call runs at temperature 0.0 with a hard budget, forcing the model to output exactly one categorical triage token: SAFE, CAUTION, SEVERE, or UNKNOWN."
    ],
    techStack: ["Cloudflare Workers", "Groq", "Cloudflare Vectorize", "D1 SQLite", "Llama Models"],
    tags: ["ML/AI", "Infrastructure"],
    githubUrl: "https://github.com/anberaziz5/synth-tox",
    liveUrl: "https://synhttox.anber.me/"
  },
  {
    id: "feature-control",
    title: "Feature Control Panel",
    year: "2024",
    type: "Full-Stack MERN Application",
    description: "Internal DevOps administration portal for managing runtime feature toggles without redeploying code.",
    longDescription: [
      "Built an internal DevOps administration portal for managing runtime feature toggles without redeploying code, supporting a complete CRUD lifecycle across a three-tier MERN architecture.",
      "Implements automatic token normalization and maintains live telemetry counters for total flags, active flags, and offline flags.",
      "Character-by-character search bar and environment category filters allow operations teams to isolate specific flags instantly during incident response scenarios."
    ],
    techStack: ["MERN Stack", "MongoDB", "Express", "React", "Node.js"],
    tags: ["Full-Stack", "Infrastructure"],
    githubUrl: "https://github.com/anberaziz5/feature-flag-platform",
    liveUrl: "https://github.com/anberaziz5/feature-flag-platform"
  },
  {
    id: "hypewear",
    title: "HypeWear Storefront",
    year: "2024",
    type: "Zero-Dependency Vanilla JS SPA",
    description: "Full-featured e-commerce single-page application built completely without frameworks.",
    longDescription: [
      "Engineered a full-featured e-commerce single-page application with no framework, library, or build toolchain, demonstrating complete mastery of native browser APIs and JavaScript engine behavior.",
      "The multi-dimensional product filtration engine performs a single-pass O(n) reduction over three simultaneous attributes.",
      "Cart state management uses a localized reactive data model that dynamically computes aggregate pricing and conditional rendering without any external state library."
    ],
    techStack: ["Vanilla JS", "CSS3", "DOM API"],
    tags: ["Full-Stack"],
    githubUrl: "https://github.com/anberaziz5/hypewear",
    liveUrl: "http://hypewear.anber.me/"
  }
];
