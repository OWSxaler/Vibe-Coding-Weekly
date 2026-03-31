// Pre-built role persona templates for quick list creation
// Each persona contains categorized skills typical for the role

const RolePersonas = [
  {
    id: "frontend-engineer",
    name: "Frontend Engineer",
    icon: "🖥",
    description: "UI/UX focused web development",
    categories: [
      {
        name: "Languages",
        color: "#81d4fa",
        keywords: ["JavaScript", "TypeScript", "HTML", "CSS", "SASS", "SCSS"],
      },
      {
        name: "Frameworks & Libraries",
        color: "#ce93d8",
        keywords: [
          "React", "Angular", "Vue", "Svelte", "Next.js", "Nuxt",
          "Redux", "Zustand", "MobX", "Tailwind", "Bootstrap",
          "Material UI", "Styled Components",
        ],
      },
      {
        name: "Build Tools & Testing",
        color: "#ffab91",
        keywords: [
          "Webpack", "Vite", "Rollup", "Babel", "ESLint", "Prettier",
          "Jest", "Cypress", "Playwright", "Storybook", "Vitest",
        ],
      },
      {
        name: "Concepts",
        color: "#a5d6a7",
        keywords: [
          "Responsive Design", "Accessibility", "WCAG", "SEO",
          "Progressive Web App", "PWA", "Web Components",
          "Performance", "Core Web Vitals", "SSR", "SSG",
        ],
      },
    ],
  },
  {
    id: "backend-engineer",
    name: "Backend Engineer",
    icon: "⚙",
    description: "Server-side and API development",
    categories: [
      {
        name: "Languages",
        color: "#81d4fa",
        keywords: ["Python", "Java", "Go", "Node.js", "C#", "Ruby", "Rust", "TypeScript"],
      },
      {
        name: "Frameworks",
        color: "#ce93d8",
        keywords: [
          "Express", "Fastify", "NestJS", "Django", "Flask", "FastAPI",
          "Spring Boot", "Spring", "Rails", "ASP.NET", ".NET",
        ],
      },
      {
        name: "Databases & Storage",
        color: "#ffab91",
        keywords: [
          "PostgreSQL", "MySQL", "MongoDB", "Redis", "DynamoDB",
          "Elasticsearch", "Cassandra", "SQLite",
          "Prisma", "Sequelize", "TypeORM", "Hibernate",
        ],
      },
      {
        name: "APIs & Infrastructure",
        color: "#a5d6a7",
        keywords: [
          "REST", "RESTful", "GraphQL", "gRPC", "WebSocket",
          "Microservices", "Serverless", "Lambda", "API Gateway",
          "Docker", "Kubernetes", "AWS", "OAuth", "JWT",
        ],
      },
    ],
  },
  {
    id: "fullstack-engineer",
    name: "Full Stack Engineer",
    icon: "🔗",
    description: "End-to-end web development",
    categories: [
      {
        name: "Frontend",
        color: "#81d4fa",
        keywords: [
          "JavaScript", "TypeScript", "React", "Vue", "Angular",
          "Next.js", "HTML", "CSS", "Tailwind", "Redux",
        ],
      },
      {
        name: "Backend",
        color: "#ce93d8",
        keywords: [
          "Node.js", "Express", "Python", "Django", "FastAPI",
          "REST", "GraphQL", "Microservices", "Serverless",
        ],
      },
      {
        name: "Databases",
        color: "#ffab91",
        keywords: [
          "PostgreSQL", "MongoDB", "Redis", "MySQL", "DynamoDB",
          "Prisma", "Sequelize", "Firebase",
        ],
      },
      {
        name: "DevOps & Tools",
        color: "#a5d6a7",
        keywords: [
          "Docker", "AWS", "GCP", "CI/CD", "GitHub Actions",
          "Git", "Jest", "Cypress", "Webpack", "Vite",
        ],
      },
    ],
  },
  {
    id: "ml-engineer",
    name: "ML Engineer",
    icon: "🧠",
    description: "Machine learning and AI systems",
    categories: [
      {
        name: "Core ML",
        color: "#81d4fa",
        keywords: [
          "Python", "Machine Learning", "Deep Learning",
          "TensorFlow", "PyTorch", "Keras", "scikit-learn", "XGBoost",
        ],
      },
      {
        name: "Data Tools",
        color: "#ce93d8",
        keywords: [
          "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn",
          "Spark", "Hadoop", "SQL", "Jupyter",
        ],
      },
      {
        name: "MLOps & Infrastructure",
        color: "#ffab91",
        keywords: [
          "MLflow", "Kubeflow", "SageMaker", "MLOps",
          "Docker", "Kubernetes", "AWS", "GCP",
          "Airflow", "dbt", "Kafka",
        ],
      },
      {
        name: "Specialties",
        color: "#a5d6a7",
        keywords: [
          "NLP", "Computer Vision", "LLM", "GPT", "Transformers",
          "RAG", "Fine-tuning", "Hugging Face", "LangChain", "OpenAI",
          "A/B Testing", "Statistical Analysis",
        ],
      },
    ],
  },
  {
    id: "devops-sre",
    name: "DevOps / SRE",
    icon: "🚀",
    description: "Infrastructure, reliability, and deployment",
    categories: [
      {
        name: "Cloud Platforms",
        color: "#81d4fa",
        keywords: [
          "AWS", "Azure", "GCP", "Google Cloud",
          "Heroku", "Vercel", "Netlify",
        ],
      },
      {
        name: "Containers & Orchestration",
        color: "#ce93d8",
        keywords: [
          "Docker", "Kubernetes", "Helm", "Istio",
          "Linux", "Ubuntu", "CentOS", "Shell", "Bash",
        ],
      },
      {
        name: "IaC & CI/CD",
        color: "#ffab91",
        keywords: [
          "Terraform", "Ansible", "Puppet", "CloudFormation", "Pulumi",
          "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI",
          "ArgoCD", "Spinnaker", "Flux",
        ],
      },
      {
        name: "Observability & Security",
        color: "#a5d6a7",
        keywords: [
          "Prometheus", "Grafana", "Datadog", "New Relic", "Splunk",
          "ELK Stack", "PagerDuty", "Vault", "Consul",
          "SRE", "Incident Management",
        ],
      },
    ],
  },
  {
    id: "mobile-engineer",
    name: "Mobile Engineer",
    icon: "📱",
    description: "iOS and Android app development",
    categories: [
      {
        name: "Cross-Platform",
        color: "#81d4fa",
        keywords: [
          "React Native", "Flutter", "Dart", "Expo",
          "Xamarin", "Ionic",
        ],
      },
      {
        name: "Native iOS",
        color: "#ce93d8",
        keywords: [
          "Swift", "SwiftUI", "Objective-C", "iOS",
          "Xcode", "CocoaPods", "App Store",
        ],
      },
      {
        name: "Native Android",
        color: "#ffab91",
        keywords: [
          "Kotlin", "Jetpack Compose", "Java", "Android",
          "Android Studio", "Gradle",
        ],
      },
      {
        name: "Mobile Concepts",
        color: "#a5d6a7",
        keywords: [
          "Mobile Development", "Push Notifications", "Deep Linking",
          "CI/CD", "Firebase", "REST", "GraphQL",
          "Unit Testing", "E2E Testing", "Appium", "Detox",
        ],
      },
    ],
  },
  {
    id: "data-engineer",
    name: "Data Engineer",
    icon: "📊",
    description: "Data pipelines, warehousing, and analytics",
    categories: [
      {
        name: "Languages & SQL",
        color: "#81d4fa",
        keywords: [
          "Python", "SQL", "Scala", "Java",
          "PL/SQL", "T-SQL", "Shell", "Bash",
        ],
      },
      {
        name: "Data Processing",
        color: "#ce93d8",
        keywords: [
          "Spark", "Hadoop", "Kafka", "Airflow", "dbt",
          "ETL", "Data Pipeline", "Flink", "Beam",
        ],
      },
      {
        name: "Storage & Warehousing",
        color: "#ffab91",
        keywords: [
          "Snowflake", "BigQuery", "Redshift", "PostgreSQL",
          "Data Warehouse", "Data Lake", "S3", "Delta Lake",
          "DynamoDB", "MongoDB", "Elasticsearch",
        ],
      },
      {
        name: "Tools & Visualization",
        color: "#a5d6a7",
        keywords: [
          "Tableau", "Power BI", "Looker", "Metabase",
          "AWS", "GCP", "Azure", "Docker", "Kubernetes",
          "Data Modeling", "Terraform",
        ],
      },
    ],
  },
  {
    id: "engineering-manager",
    name: "Engineering Manager",
    icon: "👥",
    description: "Technical leadership and team management",
    categories: [
      {
        name: "Leadership & Management",
        color: "#81d4fa",
        keywords: [
          "Leadership", "Mentoring", "Coaching", "People Management",
          "Performance Reviews", "Hiring", "Team Building",
          "Cross-functional", "Stakeholder Management",
        ],
      },
      {
        name: "Process & Methodology",
        color: "#ce93d8",
        keywords: [
          "Agile", "Scrum", "Kanban", "SAFe",
          "Sprint Planning", "Retrospectives", "OKRs",
          "Project Management", "Roadmap",
        ],
      },
      {
        name: "Technical",
        color: "#ffab91",
        keywords: [
          "System Design", "Architecture", "Code Review",
          "Technical Writing", "Design Patterns",
          "CI/CD", "DevOps", "Microservices",
        ],
      },
      {
        name: "Soft Skills",
        color: "#a5d6a7",
        keywords: [
          "Communication", "Problem Solving", "Collaboration",
          "Critical Thinking", "Presentation", "Documentation",
          "Conflict Resolution", "Strategic Thinking",
        ],
      },
    ],
  },
];
