// Common tech skills for keyword suggestions
// Structured by category for JD parsing; flat array maintained for content script

if (!window.__knownSkillsByCategory) {
  window.__knownSkillsByCategory = [
    {
      category: "Programming Languages",
      color: "#81d4fa",
      skills: [
        "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Go", "Rust",
        "Ruby", "PHP", "Swift", "Kotlin", "Scala", "R", "Perl", "Lua", "Dart",
        "Elixir", "Clojure", "Haskell", "Erlang", "MATLAB", "Julia", "Groovy",
        "Objective-C", "Assembly", "COBOL", "Fortran", "Shell", "Bash", "PowerShell",
        "SQL", "PL/SQL", "T-SQL",
      ],
    },
    {
      category: "Frontend",
      color: "#ce93d8",
      skills: [
        "React", "Angular", "Vue", "Svelte", "Next.js", "Nuxt", "Gatsby",
        "HTML", "CSS", "SASS", "SCSS", "Less", "Tailwind", "Bootstrap",
        "Material UI", "Chakra UI", "Styled Components", "Redux", "MobX", "Zustand",
        "jQuery", "Webpack", "Vite", "Rollup", "Parcel", "Babel", "ESLint",
        "Prettier", "Storybook", "Cypress", "Playwright", "Puppeteer",
        "Three.js", "D3.js", "Chart.js", "WebGL", "Canvas",
        "Progressive Web App", "PWA", "Service Workers", "Web Components",
        "Accessibility", "WCAG", "SEO", "Responsive Design",
      ],
    },
    {
      category: "Backend",
      color: "#ffab91",
      skills: [
        "Node.js", "Express", "Fastify", "NestJS", "Koa", "Hapi",
        "Django", "Flask", "FastAPI", "Spring Boot", "Spring",
        "Rails", "Sinatra", "Laravel", "Symfony",
        "ASP.NET", ".NET", ".NET Core",
        "GraphQL", "REST", "RESTful", "gRPC", "WebSocket", "SOAP",
        "Microservices", "Serverless", "Lambda", "API Gateway",
        "OAuth", "JWT", "SAML", "SSO", "LDAP",
      ],
    },
    {
      category: "Databases",
      color: "#a5d6a7",
      skills: [
        "PostgreSQL", "MySQL", "MariaDB", "SQLite", "Oracle",
        "MongoDB", "DynamoDB", "Cassandra", "CouchDB", "Firebase",
        "Redis", "Memcached", "Elasticsearch", "Solr",
        "Neo4j", "ArangoDB", "InfluxDB", "TimescaleDB",
        "Prisma", "Sequelize", "TypeORM", "Mongoose", "Hibernate",
        "SQL Server", "Snowflake", "BigQuery", "Redshift",
      ],
    },
    {
      category: "Cloud & DevOps",
      color: "#fff176",
      skills: [
        "AWS", "Azure", "GCP", "Google Cloud", "Heroku", "Vercel", "Netlify",
        "Docker", "Kubernetes", "Helm", "Istio",
        "Terraform", "Ansible", "Puppet", "Chef", "CloudFormation", "Pulumi",
        "Jenkins", "GitHub Actions", "GitLab CI", "CircleCI", "Travis CI",
        "ArgoCD", "Spinnaker", "Flux",
        "Nginx", "Apache", "Caddy", "HAProxy",
        "Linux", "Ubuntu", "CentOS", "RHEL", "Windows Server",
        "Prometheus", "Grafana", "Datadog", "New Relic", "Splunk",
        "ELK Stack", "Logstash", "Kibana", "PagerDuty",
        "Vault", "Consul",
      ],
    },
    {
      category: "Data & ML",
      color: "#f48fb1",
      skills: [
        "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
        "TensorFlow", "PyTorch", "Keras", "scikit-learn", "XGBoost",
        "Pandas", "NumPy", "SciPy", "Matplotlib", "Seaborn",
        "Spark", "Hadoop", "Kafka", "Airflow", "dbt",
        "Tableau", "Power BI", "Looker", "Metabase",
        "ETL", "Data Pipeline", "Data Warehouse", "Data Lake",
        "A/B Testing", "Statistical Analysis", "Data Modeling",
        "LLM", "GPT", "Transformers", "RAG", "Fine-tuning",
        "MLOps", "MLflow", "Kubeflow", "SageMaker",
        "OpenAI", "Hugging Face", "LangChain",
      ],
    },
    {
      category: "Mobile",
      color: "#90caf9",
      skills: [
        "React Native", "Flutter", "SwiftUI", "Jetpack Compose",
        "Xamarin", "Ionic", "Cordova", "Expo",
        "iOS", "Android", "Mobile Development", "App Store",
        "Push Notifications", "Deep Linking",
      ],
    },
    {
      category: "Testing",
      color: "#b39ddb",
      skills: [
        "Jest", "Mocha", "Chai", "Jasmine", "Vitest",
        "pytest", "unittest", "JUnit", "TestNG", "NUnit",
        "Selenium", "Appium", "Detox",
        "TDD", "BDD", "Unit Testing", "Integration Testing",
        "E2E Testing", "Load Testing", "Performance Testing",
        "SonarQube", "Code Coverage",
      ],
    },
    {
      category: "Tools & Practices",
      color: "#80cbc4",
      skills: [
        "Git", "GitHub", "GitLab", "Bitbucket", "SVN",
        "Jira", "Confluence", "Notion", "Linear", "Asana", "Trello",
        "Figma", "Sketch", "Adobe XD", "InVision",
        "VS Code", "IntelliJ", "Vim", "Emacs",
        "Agile", "Scrum", "Kanban", "SAFe",
        "CI/CD", "DevOps", "SRE", "Platform Engineering",
        "Pair Programming", "Code Review", "Technical Writing",
        "System Design", "Architecture", "Design Patterns",
        "Clean Code", "SOLID", "DRY", "KISS",
      ],
    },
    {
      category: "Security",
      color: "#ef9a9a",
      skills: [
        "Cybersecurity", "Penetration Testing", "OWASP",
        "Encryption", "TLS", "SSL", "HTTPS",
        "IAM", "RBAC", "Zero Trust",
        "SOC 2", "GDPR", "HIPAA", "PCI DSS", "ISO 27001",
        "Vulnerability Assessment", "Security Audit",
      ],
    },
    {
      category: "Soft Skills",
      color: "#ffe0b2",
      skills: [
        "Communication", "Leadership", "Problem Solving",
        "Collaboration", "Mentoring", "Cross-functional",
        "Stakeholder Management", "Project Management",
        "Time Management", "Critical Thinking",
        "Presentation", "Documentation",
      ],
    },
  ];
}

// Maintain flat array for backward compatibility with content script extractSkills()
if (!window.__knownSkills) {
  window.__knownSkills = window.__knownSkillsByCategory.flatMap((cat) => cat.skills);
}
