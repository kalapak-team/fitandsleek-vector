import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";

const endpoints = [
  { method: "GET", path: "/", desc: "Service title + version" },
  { method: "GET", path: "/collections", desc: "List collections" },
  { method: "PUT", path: "/collections/{name}", desc: "Create collection" },
  { method: "GET", path: "/collections/{name}", desc: "Collection info" },
  { method: "DELETE", path: "/collections/{name}", desc: "Delete collection" },
  { method: "PUT", path: "/collections/{name}/points", desc: "Upsert points" },
  { method: "GET", path: "/collections/{name}/points/{id}", desc: "Get point" },
  { method: "POST", path: "/collections/{name}/points/delete", desc: "Delete points" },
  { method: "POST", path: "/collections/{name}/points/search", desc: "Similarity search" },
  { method: "POST", path: "/collections/{name}/points/recommend", desc: "Recommend by examples" },
  { method: "POST", path: "/collections/{name}/points/scroll", desc: "Scroll / page points" },
  { method: "POST", path: "/collections/{name}/points/count", desc: "Count points" },
  { method: "POST", path: "/collections/{name}/snapshots", desc: "Create snapshot" },
  { method: "GET", path: "/collections/{name}/snapshots", desc: "List snapshots" },
  { method: "POST", path: "/embed/image", desc: "Embed an image" },
  { method: "POST", path: "/embed/text", desc: "Embed text" },
  { method: "POST", path: "/search/image", desc: "Search by uploaded image" },
  { method: "POST", path: "/collections/{name}/points/upload-image", desc: "Embed + upsert image point" },
];

export default function DocsPage() {
  return (
    <main>
      <div className="relative overflow-hidden border-b border-mist/10 bg-hero-glow pb-16 pt-28">
        <SiteHeader />
        <div className="fs-container relative">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-mint/80">REST API</p>
          <h1 className="mt-3 font-display text-4xl font-bold text-mist md:text-5xl">FitandSleek Vector API</h1>
          <p className="mt-4 max-w-2xl text-mist/60">
            Qdrant-shaped endpoints for collections, points, search, recommend, scroll, count, and snapshots — plus
            FitandSleek image helpers.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/console" className="fs-btn">
              Open Console
            </Link>
            <a href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:6333"}/docs`} className="fs-btn-ghost">
              Swagger UI
            </a>
          </div>
        </div>
      </div>

      <section className="py-14">
        <div className="fs-container">
          <div className="fs-panel overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-mist/10 text-xs uppercase tracking-[0.14em] text-mist/45">
                <tr>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Path</th>
                  <th className="px-4 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((e) => (
                  <tr key={e.method + e.path} className="border-b border-mist/5">
                    <td className="px-4 py-3 font-mono text-mint">{e.method}</td>
                    <td className="px-4 py-3 font-mono text-xs text-mist/80">{e.path}</td>
                    <td className="px-4 py-3 text-mist/55">{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <pre className="fs-panel mt-8 overflow-x-auto p-5 font-mono text-xs text-mist/70">{`# Create collection
curl -X PUT http://localhost:6333/collections/fitandsleek_products \\
  -H "Content-Type: application/json" \\
  -d '{"vectors":{"size":512,"distance":"Cosine"}}'

# Search
curl -X POST http://localhost:6333/collections/fitandsleek_products/points/search \\
  -H "Content-Type: application/json" \\
  -d '{"vector":[...],"limit":5,"with_payload":true}'`}</pre>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
