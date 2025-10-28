"use client";

import { useMemo, useState } from "react";

type Waveform = "Calm" | "Flow" | "Surge";

interface SessionRecord {
  id: number;
  createdAt: string;
  mantra: string;
  intensity: number;
  tempo: number;
  echo: number;
  waveform: Waveform;
}

const waveforms: Waveform[] = ["Calm", "Flow", "Surge"];

const formatter = new Intl.DateTimeFormat("en", {
  hour: "2-digit",
  minute: "2-digit"
});

function buildMantra(intensity: number, tempo: number, echo: number, waveform: Waveform) {
  const base = "H".repeat(Math.max(3, Math.round(intensity / 4)));
  const flow = waveform === "Calm" ? "~" : waveform === "Flow" ? "~~~" : "~~~~~";
  const echoBlock = `(${"h".repeat(Math.max(2, Math.round(echo * 8)))})`;
  const segments = Array.from({ length: Math.max(3, Math.round(tempo / 30)) }, () => `${base}${flow}${echoBlock}`);
  return segments.join("  ");
}

function computeTiles(intensity: number) {
  const base = 28;
  return Math.min(96, base + Math.round(intensity * 1.8));
}

function pickPulseIndices(intensity: number, total: number) {
  const stride = Math.max(2, Math.round(12 - intensity / 6));
  return new Set(Array.from({ length: total }, (_, index) => index).filter((index) => index % stride === 0));
}

export function HChantSimulator() {
  const [intensity, setIntensity] = useState(18);
  const [tempo, setTempo] = useState(72);
  const [echo, setEcho] = useState(0.42);
  const [waveform, setWaveform] = useState<Waveform>("Flow");
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  const totalTiles = useMemo(() => computeTiles(intensity), [intensity]);
  const pulseIndices = useMemo(() => pickPulseIndices(intensity, totalTiles), [intensity, totalTiles]);
  const mantra = useMemo(() => buildMantra(intensity, tempo, echo, waveform), [echo, intensity, tempo, waveform]);

  const harmonicScore = useMemo(() => {
    const balance = 1 - Math.abs(tempo - 70) / 70;
    return Math.round((intensity / 36 + echo + balance) * 33);
  }, [echo, intensity, tempo]);

  const breathSpan = useMemo(() => Math.round(tempo / (echo * 10 + 1.5)) + 3, [echo, tempo]);

  const startSession = () => {
    setSessions((prev) => {
      const next: SessionRecord = {
        id: Date.now(),
        createdAt: formatter.format(new Date()),
        mantra,
        intensity,
        tempo,
        echo,
        waveform
      };
      const combined = [next, ...prev];
      return combined.slice(0, 6);
    });
  };

  return (
    <section className="card" aria-labelledby="chant-lab">
      <header style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div className="pill glow-ring" role="status" aria-live="polite">
          <span>Live mantra studio</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <h2 id="chant-lab" className="section-title gradient-text">
            Harmonize your &ldquo;Hhhhh&rdquo;
          </h2>
          <p className="section-subtitle">
            Sculpt the resonance of a whispered H and watch it ripple through a field of luminous glyphs. Adjust the
            controls, craft your mantra, and capture the perfect release.
          </p>
        </div>
      </header>

      <div className="studio-grid" style={{ marginTop: "2rem" }}>
        <div className="studio-card" aria-label="Tonal controls">
          <h3>Breathcraft Controls</h3>
          <p className="muted">Fine-tune the shape of your mantra. Every dial nudges the resonance field into a new pattern.</p>

          <div className="slider-wrapper">
            <label htmlFor="intensity">Intensity: {intensity}</label>
            <input
              id="intensity"
              type="range"
              min={6}
              max={36}
              step={1}
              value={intensity}
              onChange={(event) => setIntensity(Number(event.target.value))}
            />
          </div>

          <div className="slider-wrapper">
            <label htmlFor="tempo">Tempo: {tempo} bpm</label>
            <input
              id="tempo"
              type="range"
              min={40}
              max={120}
              step={2}
              value={tempo}
              onChange={(event) => setTempo(Number(event.target.value))}
            />
          </div>

          <div className="slider-wrapper">
            <label htmlFor="echo">Echo Depth: {(echo * 100).toFixed(0)}%</label>
            <input
              id="echo"
              type="range"
              min={0.1}
              max={0.85}
              step={0.01}
              value={echo}
              onChange={(event) => setEcho(Number(event.target.value))}
            />
          </div>

          <div className="control-row" role="radiogroup" aria-labelledby="waveform-label">
            <div className="control-card">
              <strong id="waveform-label">Waveform</strong>
              <p className="muted">Choose how the H travels through the ether.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "0.75rem" }}>
                {waveforms.map((shape) => {
                  const active = waveform === shape;
                  return (
                    <button
                      key={shape}
                      type="button"
                      onClick={() => setWaveform(shape)}
                      aria-pressed={active}
                      className="pill glow-ring"
                      style={{
                        background: active ? "rgba(162, 119, 255, 0.28)" : undefined,
                        borderColor: active ? "rgba(162, 119, 255, 0.6)" : undefined
                      }}
                    >
                      {shape}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="control-card">
              <strong>Session Snapshot</strong>
              <div className="status-grid" style={{ marginTop: "0.75rem" }}>
                <div className="status-pill">
                  <span>Harmonic score</span>
                  <strong>{harmonicScore}</strong>
                </div>
                <div className="status-pill">
                  <span>Breath span</span>
                  <strong>{breathSpan} counts</strong>
                </div>
                <div className="status-pill">
                  <span>Glyph field</span>
                  <strong>{totalTiles}</strong>
                </div>
              </div>
            </div>
          </div>

          <button className="cta-button" type="button" onClick={startSession}>
            Capture this release
          </button>
        </div>

        <div className="studio-card visualizer-area" aria-live="polite">
          <h3>Resonance Field</h3>
          <p className="muted">Each tile pulses with the breath pattern you sculpt above.</p>
          <div className="hhhhh-grid" style={{ marginTop: "1rem" }}>
            {Array.from({ length: totalTiles }, (_, index) => (
              <div key={index} className="hhhhh-tile" data-pulse={pulseIndices.has(index)}>
                H
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: "1.5rem" }}>
        <h3 className="muted" style={{ textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "0.9rem" }}>
          Generated mantra
        </h3>
        <div className="hhhhh-mantra" aria-live="polite">
          {mantra}
        </div>
      </div>

      <div className="insight-grid">
        <article className="insight-card">
          <h3>Session history</h3>
          {sessions.length === 0 ? (
            <p className="muted">Capture a release to preserve your favorite Hhhhh signature.</p>
          ) : (
            <div className="session-list">
              {sessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div>
                    <strong>{session.waveform} wave</strong>
                    <span>
                      {session.intensity} intensity · {session.tempo} bpm · {(session.echo * 100).toFixed(0)}% echo
                    </span>
                  </div>
                  <time dateTime={session.createdAt}>{session.createdAt}</time>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="insight-card">
          <h3>How to sculpt the perfect &ldquo;Hhhhh&rdquo;</h3>
          <ul>
            <li>Intensity controls the density of glyphs — more force means a fuller wall of resonant Hs.</li>
            <li>
              Tempo guides the inhale/exhale cadence. Hover near 70 bpm for a meditative flow or push higher to build a
              euphoric swell.
            </li>
            <li>Echo describes how the whisper lingers; higher values generate longer trailing harmonics.</li>
            <li>Waveforms shape the timbre of the release — experiment to find the contour that matches your mood.</li>
          </ul>
        </article>
      </div>
    </section>
  );
}
