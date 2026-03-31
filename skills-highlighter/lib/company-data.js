// Curated database of ~100 notable tech companies
// Includes founding year, funding rounds, IPO, and notable events
// Used for company name highlighting and formative years detection

if (!window.__companyDatabase) {
  window.__companyDatabase = [
    // FAANG / Big Tech
    { name: "Google", aliases: ["Alphabet"], founded: 1998, ipo: 2004, stages: [{ year: 1998, event: "Founded" }, { year: 1999, event: "Series A ($25M)" }, { year: 2004, event: "IPO" }], category: "big-tech" },
    { name: "Apple", founded: 1976, ipo: 1980, stages: [{ year: 1976, event: "Founded" }, { year: 1980, event: "IPO" }, { year: 2007, event: "iPhone launched" }], category: "big-tech" },
    { name: "Amazon", aliases: ["AWS"], founded: 1994, ipo: 1997, stages: [{ year: 1994, event: "Founded" }, { year: 1997, event: "IPO" }, { year: 2006, event: "AWS launched" }], category: "big-tech" },
    { name: "Meta", aliases: ["Facebook"], founded: 2004, ipo: 2012, stages: [{ year: 2004, event: "Founded" }, { year: 2005, event: "Series A ($12.7M)" }, { year: 2006, event: "Series B ($27.5M)" }, { year: 2012, event: "IPO" }, { year: 2021, event: "Rebrand to Meta" }], category: "big-tech" },
    { name: "Netflix", founded: 1997, ipo: 2002, stages: [{ year: 1997, event: "Founded" }, { year: 2002, event: "IPO" }, { year: 2007, event: "Streaming launched" }], category: "big-tech" },
    { name: "Microsoft", founded: 1975, ipo: 1986, stages: [{ year: 1975, event: "Founded" }, { year: 1986, event: "IPO" }, { year: 2014, event: "Nadella era begins" }], category: "big-tech" },
    { name: "Tesla", founded: 2003, ipo: 2010, stages: [{ year: 2003, event: "Founded" }, { year: 2004, event: "Series A ($7.5M)" }, { year: 2006, event: "Series C ($40M)" }, { year: 2010, event: "IPO" }], category: "big-tech" },
    { name: "Salesforce", founded: 1999, ipo: 2004, stages: [{ year: 1999, event: "Founded" }, { year: 2004, event: "IPO" }], category: "big-tech" },
    { name: "Oracle", founded: 1977, ipo: 1986, stages: [{ year: 1977, event: "Founded" }, { year: 1986, event: "IPO" }], category: "big-tech" },
    { name: "IBM", founded: 1911, ipo: 1915, stages: [{ year: 1911, event: "Founded" }], category: "big-tech" },
    { name: "Intel", founded: 1968, ipo: 1971, stages: [{ year: 1968, event: "Founded" }, { year: 1971, event: "IPO" }], category: "big-tech" },
    { name: "NVIDIA", founded: 1993, ipo: 1999, stages: [{ year: 1993, event: "Founded" }, { year: 1999, event: "IPO" }, { year: 2016, event: "AI/GPU boom" }], category: "big-tech" },
    { name: "Adobe", founded: 1982, ipo: 1986, stages: [{ year: 1982, event: "Founded" }, { year: 1986, event: "IPO" }, { year: 2012, event: "Creative Cloud launched" }], category: "big-tech" },

    // Major Tech Companies
    { name: "Uber", founded: 2009, ipo: 2019, stages: [{ year: 2009, event: "Founded" }, { year: 2011, event: "Series A ($11M)" }, { year: 2013, event: "Series C ($258M)" }, { year: 2014, event: "Series D ($1.2B)" }, { year: 2019, event: "IPO" }], category: "major-tech" },
    { name: "Airbnb", founded: 2008, ipo: 2020, stages: [{ year: 2008, event: "Founded" }, { year: 2009, event: "Seed ($600K)" }, { year: 2011, event: "Series B ($112M)" }, { year: 2015, event: "Series E ($1.5B)" }, { year: 2020, event: "IPO" }], category: "major-tech" },
    { name: "Spotify", founded: 2006, ipo: 2018, stages: [{ year: 2006, event: "Founded" }, { year: 2008, event: "Public launch" }, { year: 2018, event: "Direct listing" }], category: "major-tech" },
    { name: "Snap", aliases: ["Snapchat"], founded: 2011, ipo: 2017, stages: [{ year: 2011, event: "Founded" }, { year: 2013, event: "Series B ($60M)" }, { year: 2017, event: "IPO" }], category: "major-tech" },
    { name: "Twitter", aliases: ["X"], founded: 2006, ipo: 2013, stages: [{ year: 2006, event: "Founded" }, { year: 2007, event: "Series B ($15M)" }, { year: 2013, event: "IPO" }, { year: 2022, event: "Acquired by Musk, became X" }], category: "major-tech" },
    { name: "Lyft", founded: 2012, ipo: 2019, stages: [{ year: 2012, event: "Founded" }, { year: 2013, event: "Series B ($60M)" }, { year: 2019, event: "IPO" }], category: "major-tech" },
    { name: "Pinterest", founded: 2010, ipo: 2019, stages: [{ year: 2010, event: "Founded" }, { year: 2012, event: "Series C ($100M)" }, { year: 2019, event: "IPO" }], category: "major-tech" },
    { name: "Dropbox", founded: 2007, ipo: 2018, stages: [{ year: 2007, event: "Founded" }, { year: 2011, event: "Series B ($250M)" }, { year: 2018, event: "IPO" }], category: "major-tech" },
    { name: "Palantir", founded: 2003, ipo: 2020, stages: [{ year: 2003, event: "Founded" }, { year: 2005, event: "Series A ($30M)" }, { year: 2020, event: "Direct listing" }], category: "major-tech" },
    { name: "Block", aliases: ["Square"], founded: 2009, ipo: 2015, stages: [{ year: 2009, event: "Founded" }, { year: 2012, event: "Series D ($200M)" }, { year: 2015, event: "IPO" }, { year: 2021, event: "Renamed to Block" }], category: "major-tech" },
    { name: "Shopify", founded: 2006, ipo: 2015, stages: [{ year: 2006, event: "Founded" }, { year: 2010, event: "Series A ($7M)" }, { year: 2015, event: "IPO" }], category: "major-tech" },
    { name: "Twilio", founded: 2008, ipo: 2016, stages: [{ year: 2008, event: "Founded" }, { year: 2009, event: "Seed ($3.7M)" }, { year: 2016, event: "IPO" }], category: "major-tech" },
    { name: "Cloudflare", founded: 2009, ipo: 2019, stages: [{ year: 2009, event: "Founded" }, { year: 2012, event: "Series B ($20M)" }, { year: 2019, event: "IPO" }], category: "major-tech" },
    { name: "CrowdStrike", founded: 2011, ipo: 2019, stages: [{ year: 2011, event: "Founded" }, { year: 2013, event: "Series B ($30M)" }, { year: 2019, event: "IPO" }], category: "major-tech" },
    { name: "Snowflake", founded: 2012, ipo: 2020, stages: [{ year: 2012, event: "Founded" }, { year: 2014, event: "Series B ($26M)" }, { year: 2018, event: "Series E ($263M)" }, { year: 2020, event: "IPO" }], category: "major-tech" },
    { name: "Databricks", founded: 2013, stages: [{ year: 2013, event: "Founded" }, { year: 2017, event: "Series D ($140M)" }, { year: 2021, event: "Series H ($1.6B)" }, { year: 2023, event: "Series I ($500M)" }], category: "unicorn" },
    { name: "Stripe", founded: 2010, stages: [{ year: 2010, event: "Founded" }, { year: 2012, event: "Series A ($18M)" }, { year: 2014, event: "Series C ($70M)" }, { year: 2019, event: "Series G ($250M)" }, { year: 2023, event: "Series I ($6.5B)" }], category: "unicorn" },
    { name: "Coinbase", founded: 2012, ipo: 2021, stages: [{ year: 2012, event: "Founded" }, { year: 2013, event: "Series A ($5M)" }, { year: 2018, event: "Series E ($300M)" }, { year: 2021, event: "Direct listing" }], category: "major-tech" },

    // AI / ML Companies
    { name: "OpenAI", founded: 2015, stages: [{ year: 2015, event: "Founded (nonprofit)" }, { year: 2019, event: "Microsoft $1B investment" }, { year: 2023, event: "Microsoft $10B investment" }, { year: 2023, event: "ChatGPT reaches 100M users" }], category: "ai" },
    { name: "Anthropic", founded: 2021, stages: [{ year: 2021, event: "Founded" }, { year: 2022, event: "Series B ($580M)" }, { year: 2023, event: "Google invests $300M" }, { year: 2023, event: "Amazon invests $4B" }], category: "ai" },
    { name: "Hugging Face", founded: 2016, stages: [{ year: 2016, event: "Founded" }, { year: 2021, event: "Series B ($40M)" }, { year: 2023, event: "Series D ($235M)" }], category: "ai" },
    { name: "DeepMind", founded: 2010, stages: [{ year: 2010, event: "Founded" }, { year: 2014, event: "Acquired by Google ($500M)" }, { year: 2016, event: "AlphaGo beats Lee Sedol" }], category: "ai" },
    { name: "Cohere", founded: 2019, stages: [{ year: 2019, event: "Founded" }, { year: 2022, event: "Series B ($125M)" }, { year: 2023, event: "Series C ($270M)" }], category: "ai" },
    { name: "Scale AI", founded: 2016, stages: [{ year: 2016, event: "Founded" }, { year: 2019, event: "Series C ($100M)" }, { year: 2021, event: "Series E ($325M)" }], category: "ai" },
    { name: "Stability AI", founded: 2019, stages: [{ year: 2019, event: "Founded" }, { year: 2022, event: "Series A ($101M)" }, { year: 2022, event: "Stable Diffusion released" }], category: "ai" },
    { name: "Mistral AI", founded: 2023, stages: [{ year: 2023, event: "Founded" }, { year: 2023, event: "Seed ($113M)" }, { year: 2024, event: "Series B ($640M)" }], category: "ai" },
    { name: "Perplexity", founded: 2022, stages: [{ year: 2022, event: "Founded" }, { year: 2024, event: "Series B ($73M)" }], category: "ai" },
    { name: "Inflection AI", founded: 2022, stages: [{ year: 2022, event: "Founded" }, { year: 2023, event: "Series B ($1.3B)" }], category: "ai" },

    // Fintech
    { name: "Plaid", founded: 2013, stages: [{ year: 2013, event: "Founded" }, { year: 2016, event: "Series B ($44M)" }, { year: 2021, event: "Series D ($425M)" }], category: "fintech" },
    { name: "Robinhood", founded: 2013, ipo: 2021, stages: [{ year: 2013, event: "Founded" }, { year: 2017, event: "Series C ($110M)" }, { year: 2021, event: "IPO" }], category: "fintech" },
    { name: "Klarna", founded: 2005, stages: [{ year: 2005, event: "Founded" }, { year: 2019, event: "Series D ($460M)" }, { year: 2021, event: "Series E ($1B, $45.6B valuation)" }], category: "fintech" },
    { name: "Revolut", founded: 2015, stages: [{ year: 2015, event: "Founded" }, { year: 2018, event: "Series C ($250M)" }, { year: 2021, event: "Series E ($800M)" }], category: "fintech" },
    { name: "Wise", aliases: ["TransferWise"], founded: 2011, ipo: 2021, stages: [{ year: 2011, event: "Founded" }, { year: 2017, event: "Series E ($280M)" }, { year: 2021, event: "Direct listing" }], category: "fintech" },
    { name: "Brex", founded: 2017, stages: [{ year: 2017, event: "Founded" }, { year: 2019, event: "Series C ($100M)" }, { year: 2022, event: "Series D ($300M)" }], category: "fintech" },
    { name: "Chime", founded: 2013, stages: [{ year: 2013, event: "Founded" }, { year: 2020, event: "Series F ($533M)" }, { year: 2021, event: "Series G ($750M)" }], category: "fintech" },
    { name: "Nubank", founded: 2013, ipo: 2021, stages: [{ year: 2013, event: "Founded" }, { year: 2018, event: "Series F ($400M)" }, { year: 2021, event: "IPO" }], category: "fintech" },
    { name: "Affirm", founded: 2012, ipo: 2021, stages: [{ year: 2012, event: "Founded" }, { year: 2019, event: "Series F ($300M)" }, { year: 2021, event: "IPO" }], category: "fintech" },
    { name: "Rippling", founded: 2019, stages: [{ year: 2019, event: "Founded" }, { year: 2022, event: "Series C ($250M)" }, { year: 2024, event: "Series D ($200M)" }], category: "fintech" },

    // SaaS / Enterprise
    { name: "Atlassian", founded: 2002, ipo: 2015, stages: [{ year: 2002, event: "Founded" }, { year: 2010, event: "Secondary ($60M)" }, { year: 2015, event: "IPO" }], category: "saas" },
    { name: "Slack", founded: 2013, stages: [{ year: 2013, event: "Founded" }, { year: 2015, event: "Series E ($160M)" }, { year: 2019, event: "Direct listing" }, { year: 2021, event: "Acquired by Salesforce ($27.7B)" }], category: "saas" },
    { name: "Notion", founded: 2016, stages: [{ year: 2016, event: "Founded" }, { year: 2020, event: "Series B ($50M)" }, { year: 2021, event: "Series C ($275M)" }], category: "saas" },
    { name: "Figma", founded: 2012, stages: [{ year: 2012, event: "Founded" }, { year: 2015, event: "Series A ($14M)" }, { year: 2020, event: "Series D ($50M)" }, { year: 2022, event: "Adobe deal ($20B, later cancelled)" }], category: "saas" },
    { name: "Canva", founded: 2012, stages: [{ year: 2012, event: "Founded" }, { year: 2018, event: "Series C" }, { year: 2021, event: "Series F ($200M, $40B valuation)" }], category: "saas" },
    { name: "Airtable", founded: 2012, stages: [{ year: 2012, event: "Founded" }, { year: 2018, event: "Series C ($100M)" }, { year: 2021, event: "Series F ($735M)" }], category: "saas" },
    { name: "Monday.com", founded: 2012, ipo: 2021, stages: [{ year: 2012, event: "Founded" }, { year: 2019, event: "Series D ($150M)" }, { year: 2021, event: "IPO" }], category: "saas" },
    { name: "Datadog", founded: 2010, ipo: 2019, stages: [{ year: 2010, event: "Founded" }, { year: 2014, event: "Series C ($31M)" }, { year: 2019, event: "IPO" }], category: "saas" },
    { name: "HashiCorp", founded: 2012, ipo: 2021, stages: [{ year: 2012, event: "Founded" }, { year: 2016, event: "Series C ($24M)" }, { year: 2021, event: "IPO" }, { year: 2024, event: "Acquired by IBM" }], category: "saas" },
    { name: "Vercel", founded: 2015, stages: [{ year: 2015, event: "Founded (as ZEIT)" }, { year: 2020, event: "Series B ($40M)" }, { year: 2021, event: "Series D ($150M)" }], category: "saas" },
    { name: "Supabase", founded: 2020, stages: [{ year: 2020, event: "Founded" }, { year: 2022, event: "Series B ($80M)" }], category: "saas" },
    { name: "Linear", founded: 2019, stages: [{ year: 2019, event: "Founded" }, { year: 2021, event: "Series B ($35M)" }], category: "saas" },
    { name: "Retool", founded: 2017, stages: [{ year: 2017, event: "Founded" }, { year: 2021, event: "Series C ($45M)" }, { year: 2022, event: "Series D ($45M)" }], category: "saas" },
    { name: "GitLab", founded: 2011, ipo: 2021, stages: [{ year: 2011, event: "Founded" }, { year: 2016, event: "Series B ($20M)" }, { year: 2019, event: "Series E ($268M)" }, { year: 2021, event: "IPO" }], category: "saas" },
    { name: "Confluent", founded: 2014, ipo: 2021, stages: [{ year: 2014, event: "Founded (Apache Kafka creators)" }, { year: 2017, event: "Series C ($50M)" }, { year: 2021, event: "IPO" }], category: "saas" },

    // Cybersecurity
    { name: "Palo Alto Networks", founded: 2005, ipo: 2012, stages: [{ year: 2005, event: "Founded" }, { year: 2012, event: "IPO" }], category: "security" },
    { name: "Snyk", founded: 2015, stages: [{ year: 2015, event: "Founded" }, { year: 2020, event: "Series D ($200M)" }, { year: 2022, event: "Series G ($530M)" }], category: "security" },
    { name: "Wiz", founded: 2020, stages: [{ year: 2020, event: "Founded" }, { year: 2021, event: "Series B ($130M)" }, { year: 2023, event: "Series D ($300M)" }], category: "security" },
    { name: "SentinelOne", founded: 2013, ipo: 2021, stages: [{ year: 2013, event: "Founded" }, { year: 2020, event: "Series F ($267M)" }, { year: 2021, event: "IPO" }], category: "security" },
    { name: "1Password", founded: 2005, stages: [{ year: 2005, event: "Founded" }, { year: 2019, event: "Series A ($200M)" }, { year: 2022, event: "Series C ($620M)" }], category: "security" },

    // E-commerce / Consumer
    { name: "DoorDash", founded: 2013, ipo: 2020, stages: [{ year: 2013, event: "Founded" }, { year: 2018, event: "Series D ($535M)" }, { year: 2020, event: "IPO" }], category: "consumer" },
    { name: "Instacart", founded: 2012, ipo: 2023, stages: [{ year: 2012, event: "Founded" }, { year: 2018, event: "Series E ($350M)" }, { year: 2023, event: "IPO" }], category: "consumer" },
    { name: "Discord", founded: 2015, stages: [{ year: 2015, event: "Founded" }, { year: 2020, event: "Series H ($100M)" }, { year: 2021, event: "Series I ($500M)" }], category: "consumer" },
    { name: "Reddit", founded: 2005, ipo: 2024, stages: [{ year: 2005, event: "Founded" }, { year: 2014, event: "Series B ($50M)" }, { year: 2021, event: "Series F ($410M)" }, { year: 2024, event: "IPO" }], category: "consumer" },
    { name: "Etsy", founded: 2005, ipo: 2015, stages: [{ year: 2005, event: "Founded" }, { year: 2015, event: "IPO" }], category: "consumer" },
    { name: "Roblox", founded: 2004, ipo: 2021, stages: [{ year: 2004, event: "Founded" }, { year: 2020, event: "Series H ($150M)" }, { year: 2021, event: "Direct listing" }], category: "consumer" },
    { name: "Duolingo", founded: 2011, ipo: 2021, stages: [{ year: 2011, event: "Founded" }, { year: 2020, event: "Series H ($35M)" }, { year: 2021, event: "IPO" }], category: "consumer" },

    // Infrastructure / Cloud
    { name: "MongoDB", founded: 2007, ipo: 2017, stages: [{ year: 2007, event: "Founded" }, { year: 2013, event: "Series F ($150M)" }, { year: 2017, event: "IPO" }], category: "infrastructure" },
    { name: "Elastic", founded: 2012, ipo: 2018, stages: [{ year: 2012, event: "Founded" }, { year: 2014, event: "Series B ($70M)" }, { year: 2018, event: "IPO" }], category: "infrastructure" },
    { name: "DigitalOcean", founded: 2011, ipo: 2021, stages: [{ year: 2011, event: "Founded" }, { year: 2015, event: "Series B ($83M)" }, { year: 2021, event: "IPO" }], category: "infrastructure" },
    { name: "PlanetScale", founded: 2018, stages: [{ year: 2018, event: "Founded" }, { year: 2021, event: "Series B ($30M)" }, { year: 2022, event: "Series C ($50M)" }], category: "infrastructure" },
    { name: "Cockroach Labs", aliases: ["CockroachDB"], founded: 2015, stages: [{ year: 2015, event: "Founded" }, { year: 2020, event: "Series D ($86.6M)" }, { year: 2021, event: "Series F ($278M)" }], category: "infrastructure" },

    // Health Tech
    { name: "Veeva", founded: 2007, ipo: 2013, stages: [{ year: 2007, event: "Founded" }, { year: 2013, event: "IPO" }], category: "healthtech" },
    { name: "Oscar Health", founded: 2012, ipo: 2021, stages: [{ year: 2012, event: "Founded" }, { year: 2018, event: "Series E ($375M)" }, { year: 2021, event: "IPO" }], category: "healthtech" },
    { name: "Ro", founded: 2017, stages: [{ year: 2017, event: "Founded" }, { year: 2020, event: "Series C ($200M)" }, { year: 2021, event: "Series D ($500M)" }], category: "healthtech" },

    // Dev Tools
    { name: "GitHub", founded: 2008, stages: [{ year: 2008, event: "Founded" }, { year: 2012, event: "Series A ($100M)" }, { year: 2018, event: "Acquired by Microsoft ($7.5B)" }], category: "devtools" },
    { name: "JetBrains", founded: 2000, stages: [{ year: 2000, event: "Founded" }], category: "devtools" },
    { name: "Postman", founded: 2014, stages: [{ year: 2014, event: "Founded" }, { year: 2020, event: "Series C ($150M)" }, { year: 2021, event: "Series D ($225M)" }], category: "devtools" },
    { name: "Docker", founded: 2013, stages: [{ year: 2013, event: "Founded (as dotCloud)" }, { year: 2014, event: "Series C ($40M)" }, { year: 2015, event: "Series D ($95M)" }], category: "devtools" },
    { name: "CircleCI", founded: 2011, stages: [{ year: 2011, event: "Founded" }, { year: 2020, event: "Series E ($100M)" }], category: "devtools" },
    { name: "LaunchDarkly", founded: 2014, stages: [{ year: 2014, event: "Founded" }, { year: 2021, event: "Series D ($200M)" }], category: "devtools" },
    { name: "Sentry", founded: 2012, stages: [{ year: 2012, event: "Founded" }, { year: 2021, event: "Series D ($60M)" }], category: "devtools" },

    // Crypto / Web3
    { name: "Binance", founded: 2017, stages: [{ year: 2017, event: "Founded" }], category: "crypto" },
    { name: "Chainalysis", founded: 2014, stages: [{ year: 2014, event: "Founded" }, { year: 2021, event: "Series E ($100M)" }, { year: 2022, event: "Series F ($170M)" }], category: "crypto" },
    { name: "Alchemy", founded: 2017, stages: [{ year: 2017, event: "Founded" }, { year: 2022, event: "Series C ($200M)" }], category: "crypto" },

    // Other Notable
    { name: "Zoom", founded: 2011, ipo: 2019, stages: [{ year: 2011, event: "Founded" }, { year: 2017, event: "Series D ($100M)" }, { year: 2019, event: "IPO" }, { year: 2020, event: "Pandemic growth boom" }], category: "major-tech" },
    { name: "ServiceNow", founded: 2004, ipo: 2012, stages: [{ year: 2004, event: "Founded" }, { year: 2012, event: "IPO" }], category: "saas" },
    { name: "Workday", founded: 2005, ipo: 2012, stages: [{ year: 2005, event: "Founded" }, { year: 2012, event: "IPO" }], category: "saas" },
    { name: "Splunk", founded: 2003, ipo: 2012, stages: [{ year: 2003, event: "Founded" }, { year: 2012, event: "IPO" }, { year: 2024, event: "Acquired by Cisco ($28B)" }], category: "saas" },
    { name: "Grafana Labs", founded: 2014, stages: [{ year: 2014, event: "Founded" }, { year: 2021, event: "Series C ($220M)" }, { year: 2022, event: "Series D ($240M)" }], category: "devtools" },
    { name: "Miro", founded: 2011, stages: [{ year: 2011, event: "Founded" }, { year: 2022, event: "Series C ($400M)" }], category: "saas" },
    { name: "Deel", founded: 2019, stages: [{ year: 2019, event: "Founded" }, { year: 2021, event: "Series D ($425M)" }, { year: 2022, event: "Series D ext ($50M)" }], category: "saas" },
    { name: "Loom", founded: 2015, stages: [{ year: 2015, event: "Founded" }, { year: 2021, event: "Series C ($130M)" }, { year: 2023, event: "Acquired by Atlassian ($975M)" }], category: "saas" },
    { name: "Grammarly", founded: 2009, stages: [{ year: 2009, event: "Founded" }, { year: 2019, event: "Series C ($90M)" }, { year: 2021, event: "Series D ($200M)" }], category: "saas" },
  ];
}
