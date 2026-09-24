import sharp from "sharp";
import path from "node:path";
import fs from "node:fs";

const assets = "C:\\Users\\pc\\.cursor\\projects\\d-02-Research-Thesis-azportfolio\\assets";
const out = path.join(process.cwd(), "public", "blog");

const map = {
  "cover-fine-tuning-vs-prompting-vs-rag.png": "fine-tuning-vs-prompting-vs-rag.webp",
  "cover-react-render-performance.png": "optimizing-react-render-performance-beyond-the-basics-of-usememo-and-usecallback.webp",
  "cover-glassmorphic-nextjs.png": "architecting-high-performance-glassmorphic-interfaces-in-modern-next-js-applications.webp",
  "cover-distributed-rate-limiting.png": "architecting-resilient-api-gateways-implementing-distributed-rate-limiting-with-node-js-and.webp",
  "cover-realtime-threat-graphs.png": "visualizing-cyber-threat-vectors-real-time-network-graphs-using-html5-canvas-and-react-hooks.webp",
  "cover-context-drift-multi-agent.png": "the-hidden-overhead-of-autonomy-mitigating-context-drift-and-token-fragmentation-in-multi-agent.webp",
  "cover-multi-agent-threat-intel.png": "automating-threat-intelligence-building-multi-agent-vulnerability-assessment-pipelines-with.webp",
  "cover-terraform-gitops.png": "declarative-infrastructure-scaling-cloud-environments-with-terraform-and-automated-gitops.webp",
};

fs.mkdirSync(out, { recursive: true });

for (const [src, dest] of Object.entries(map)) {
  const input = path.join(assets, src);
  const output = path.join(out, dest);
  if (!fs.existsSync(input)) {
    console.error("missing", input);
    continue;
  }
  await sharp(input)
    .resize(1200, 630, { fit: "cover", position: "centre" })
    .webp({ quality: 88, effort: 6 })
    .toFile(output);
  const meta = await sharp(output).metadata();
  console.log("wrote", dest, `${meta.width}x${meta.height}`);
}
