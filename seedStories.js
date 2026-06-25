const { MongoClient } = require("mongodb");

// 1. Update this to your local or live MongoDB URI connection string
const uri = "mongodb+srv://devuser:medevuser@cluster0.bexhohy.mongodb.net/portfolio?retryWrites=true&w=majority";
const dbName = "portfolio";

const storiesData = [
  {
    title: "The Architecture of My Growth: An Educational Journey",
    category: "education",
    content: `# The Architecture of My Growth: An Educational Journey\n\n## Roots and Foundations: Matriculation (2017–2019)\nMy formal scientific journey began at the secondary school level under the Board of Intermediate & Secondary Education (BISE) Lahore. Living in the small, rural village of Rajji Wala in Kasur presented an immediate logistical barrier: quality educational institutions were located miles away from home. Every single day required an exhausting, long-distance commute that tested my resolve before I even stepped into a classroom.\n\nDespite these daily geographic and physical challenges, I channeled my energy entirely into my studies within the Science group. I achieved a total of **964 out of 1100 marks**, securing a **Grade-A+**.\n\n### The Symphony of Mathematics\nWhile my grades were high across the board, Mathematics was where I found my true calling. Scoring 149 out of 150 was not merely a matter of rote memorization; it was a reflection of my deep fascination with logic.\n\n---\n\n## The Language of Higher Science: Intermediate FSc (2019–2021)\nTransitioning to higher secondary education, I joined CIMS College for Girls in Kasur to pursue FSc Pre-Engineering. The college was located even further from my village, requiring grueling early morning journeys. Beyond the long travel distances, I faced a massive pedagogical shift: **the medium of instruction abruptly changed completely to English** for all science elective courses.\n\n---\n\n## Engineering Abstract Ecosystems: BS Software Engineering (2022–2026)\nTo pursue my dream of engineering impactful technological ecosystems, I took a massive leap and crossed regional bounds to enroll at **Lahore College for Women University (LCWU)** for a **Bachelor of Science in Software Engineering**.\n\nLeaving Kasur for an entirely different city meant navigating intense logistical hurdles, exhausting inter-city travel, and the demands of an elite, fast-paced urban university environment. Conducted entirely in English, the rigorous four-year program pushed me to transform from a student of raw logic into a practical software builder. I maintained a highly competitive academic profile, achieving an aggregate of **2763 obtained marks out of 3750** with a solid **Cumulative GPA of 3.16**.`
  },
  {
    title: "Defying Geography: A Story of Tech and Philanthropy",
    category: "life",
    content: `# Defying Geography: A Story of Tech and Philanthropy\n\n## The Reality of Rajji Wala\nI grew up in Rajji Wala, a quiet, traditional village situated in the district of Kasur. In our community, path-breaking academic journeys—especially for young women—are exceptionally rare. The cultural and physical infrastructure of my village presented severe barriers: limited power grid access, non-existent high-speed internet connectivity, and a lack of local, advanced educational institutions.\n\nTo acquire an education, I had to completely defy these spatial boundaries. My journey to school and college required long-distance daily travel from the village to the city centers of Kasur. Later, to obtain my engineering degree, I had to commute out of my district entirely to Lahore.\n\n## The Computer Science Obsession and the Machine Learning Pivot\nMy obsession with computer science began as an aesthetic and logical fascination with how software systems function. When I first stepped into a computer lab during my secondary school years, I realized that programming was an open-ended canvas driven entirely by mathematical principles.\n\n## Philanthropic and Volunteer Horizons\nTrue engineering cannot exist in a vacuum separated from human suffering. Alongside my heavy technical commitments, my lived experiences under rural infrastructure challenges motivated me to step up as a dedicated volunteer and community organizer.\n\n### Frontline Crisis Management\n* **COVID-19 Relief Operations**: During the height of the global pandemic, I worked extensively with volunteer networks to manage distribution channels, deliver essential relief supplies, and organize educational awareness campaigns.\n* **August/September 2025 Flood Relief**: When severe devastating floods struck our regions in the late summer of 2025, I immediately joined frontline humanitarian operations. I worked under grueling conditions to manage supply chains for emergency rations, medical kits, and clean water delivery to displaced families.`
  },
  {
    title: "Engineering through Inquiry: A Research-Driven Methodology",
    category: "research",
    content: `# Engineering through Inquiry: A Research-Driven Methodology\n\nMy engineering approach is fundamentally guided by strict analytical research, systematic data modeling, and iterative problem-solving. Coming from a background rooted heavily in mathematics, I don't view software development as merely writing code to meet a set of functional requirements. Instead, I treat software engineering as an investigative process designed to solve complex, real-world problems.\n\n## Core Ideals of My Research Philosophy\n\n### 1. Mathematical Rigor and Algorithmic Validation\nEvery system architecture I design is grounded in structural logic. Drawing from my academic foundation in Linear Algebra, Calculus, Discrete Structures, and Data Structures, I evaluate solution paths based on algorithmic efficiency, architectural scalability, and resource footprints.\n\n### 2. Empirical Data Analysis and Predictive Modeling\nIn building machine learning frameworks and multi-agent ecosystems, I employ an empirical research model.\n\n### 3. Socio-Technical Problem Discovery\nTrue software research requires a deep understanding of the human environment. My design thinking actively analyzes user pain points, socio-economic contexts, and infrastructural challenges. This allows me to build intuitive, resilient, and highly secure software platforms that address the unique needs of real users.`
  }
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected successfully to database cluster...");
    
    const db = client.db(dbName);
    const collection = db.collection("stories");
    
    // Clear old matches if any exist to prevent duplicate key constraint failure
    await collection.deleteMany({});
    
    // Insert new parsed objects
    const result = await collection.insertMany(storiesData);
    console.log(`Successfully seeded ${result.insertedCount} stories into MongoDB!`);
  } catch (error) {
    console.error("Seeding operation dropped:", error);
  } finally {
    await client.close();
  }
}

seed();