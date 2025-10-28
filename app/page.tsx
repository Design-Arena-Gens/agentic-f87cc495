import { HChantSimulator } from "./components/HChantSimulator";

export default function Home() {
  return (
    <main>
      <section className="card" style={{ position: "relative", overflow: "hidden" }}>
        <div
          className="floating-orb"
          style={{ top: "-40px", right: "-60px", animationDelay: "-4s", filter: "blur(10px)" }}
          aria-hidden
        />
        <div
          className="floating-orb"
          style={{ bottom: "-60px", left: "-80px", width: "200px", height: "200px", opacity: 0.45 }}
          aria-hidden
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div className="pill">Whisper laboratory</div>
          <h1 className="section-title gradient-text" style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}>
            Hhhhh — the art of breathing consonants
          </h1>
          <p className="section-subtitle" style={{ maxWidth: "58ch" }}>
            Slide into the sonic atelier where the humble &ldquo;H&rdquo; becomes an immersive, meditative current. Craft
            hypnotic mantras, map flowing lattices of glyphs, and preserve your favorite releases in a shimmering
            archive.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <div className="pill">Breathwork</div>
            <div className="pill">Micro-tonal flow</div>
            <div className="pill">Generative typography</div>
          </div>
        </div>
      </section>

      <HChantSimulator />

      <footer className="footer">Feel the hush. Shape the hush. Release the hush.</footer>
    </main>
  );
}
