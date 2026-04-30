// =============================================================================
// Guli Games tracker — компоненты v2 (плотнее, ярче, с акцентами)
// =============================================================================
const { useState, useEffect, useMemo, useRef } = React;

// ---------------------- Палитра по статусам ---------------------------------
const STATUS_META = {
  done:        { label: "Готово",        dot: "#34d399", bg: "rgba(52,211,153,0.12)",  fg: "#86efac", border: "rgba(52,211,153,0.30)" },
  in_progress: { label: "В работе",      dot: "#f59e0b", bg: "rgba(245,158,11,0.14)",  fg: "#fcd34d", border: "rgba(245,158,11,0.32)" },
  blocked:     { label: "Заблокировано", dot: "#fb7185", bg: "rgba(251,113,133,0.14)", fg: "#fda4af", border: "rgba(251,113,133,0.30)" },
  planned:     { label: "Запланировано", dot: "#818cf8", bg: "rgba(129,140,248,0.14)", fg: "#c7d2fe", border: "rgba(129,140,248,0.30)" }
};

function fmtDate(s) {
  if (!s) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return `${m[3]}.${m[2]}.${m[1]}`;
  return s;
}

// ---------------------- StatusPill ------------------------------------------
function StatusPill({ status, size = "md" }) {
  const meta = STATUS_META[status] || STATUS_META.planned;
  const pad = size === "sm" ? "2px 8px" : "4px 10px";
  const fs = size === "sm" ? 10 : 11;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: pad, borderRadius: 999,
      background: meta.bg, color: meta.fg,
      fontSize: fs, fontWeight: 600, letterSpacing: 0.4,
      textTransform: "uppercase",
      border: `1px solid ${meta.border}`
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%",
        background: meta.dot, boxShadow: `0 0 10px ${meta.dot}`
      }} />
      {meta.label}
    </span>
  );
}

// ---------------------- ProgressBar -----------------------------------------
function ProgressBar({ value, status, height = 6 }) {
  const meta = STATUS_META[status] || STATUS_META.planned;
  return (
    <div style={{
      width: "100%", height, borderRadius: height / 2,
      background: "rgba(255,255,255,0.06)", overflow: "hidden"
    }}>
      <div style={{
        width: `${value}%`, height: "100%",
        background: `linear-gradient(90deg, ${meta.dot}aa, ${meta.dot})`,
        boxShadow: `0 0 12px ${meta.dot}66`,
        transition: "width 600ms cubic-bezier(.2,.8,.2,1)"
      }} />
    </div>
  );
}

// ---------------------- KV row ----------------------------------------------
function KV({ label, children }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between",
      gap: 12, padding: "6px 0",
      borderBottom: "1px solid rgba(255,255,255,0.05)"
    }}>
      <div style={{ color: "var(--fg-3)", fontSize: 11, textTransform: "uppercase", letterSpacing: 0.4 }}>
        {label}
      </div>
      <div style={{ color: "var(--fg-0)", fontSize: 12.5, fontWeight: 500, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
        {children}
      </div>
    </div>
  );
}

// ---------------------- Tag chip --------------------------------------------
function Chip({ children, tone = "neutral" }) {
  const tones = {
    neutral: { bg: "rgba(255,255,255,0.05)",   fg: "#d6d8df", bd: "rgba(255,255,255,0.10)" },
    accent:  { bg: "rgba(129,140,248,0.10)",   fg: "#c7d2fe", bd: "rgba(129,140,248,0.25)" },
    warm:    { bg: "rgba(245,158,11,0.10)",    fg: "#fcd34d", bd: "rgba(245,158,11,0.28)" },
    success: { bg: "rgba(52,211,153,0.10)",    fg: "#86efac", bd: "rgba(52,211,153,0.25)" },
    warn:    { bg: "rgba(251,113,133,0.10)",   fg: "#fda4af", bd: "rgba(251,113,133,0.25)" }
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "3px 8px", borderRadius: 5,
      background: t.bg, color: t.fg,
      border: `1px solid ${t.bd}`,
      fontSize: 11, fontWeight: 500, lineHeight: 1.3
    }}>{children}</span>
  );
}

// ---------------------- Card shell ------------------------------------------
function Card({ children, accent, style, padding = 18 }) {
  const accentBar = accent ? {
    borderLeft: `2px solid ${accent}`,
    background: `linear-gradient(135deg, ${accent}10 0%, transparent 40%), var(--bg-1)`
  } : { background: "var(--bg-1)" };
  return (
    <div style={{
      ...accentBar,
      border: "1px solid var(--line)",
      borderRadius: 10,
      padding,
      ...style
    }}>{children}</div>
  );
}

function SectionLabel({ children, right }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "baseline",
      marginBottom: 10
    }}>
      <div style={{ fontSize: 10.5, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600 }}>
        {children}
      </div>
      {right}
    </div>
  );
}

// ---------------------- LeverCard (плотнее, с цветным акцентом) -------------
function LeverCard({ lever, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = STATUS_META[lever.status] || STATUS_META.planned;

  return (
    <div style={{
      background: `linear-gradient(135deg, ${meta.bg} 0%, transparent 35%), var(--bg-1)`,
      border: "1px solid var(--line)",
      borderLeft: `3px solid ${meta.dot}`,
      borderRadius: 10,
      overflow: "hidden",
      transition: "border-color 200ms"
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", textAlign: "left", cursor: "pointer",
          background: "transparent", border: 0, color: "inherit",
          padding: "16px 18px",
          display: "grid",
          gridTemplateColumns: "1fr 180px 28px",
          gap: 18, alignItems: "center"
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <StatusPill status={lever.status} size="sm" />
            {lever.targetDate && <Chip tone="neutral">Срок: {lever.targetDate}</Chip>}
            {lever.updatedAt && (
              <span style={{ color: "var(--fg-3)", fontSize: 11 }}>
                обн. {fmtDate(lever.updatedAt)}
              </span>
            )}
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: "var(--fg-0)", letterSpacing: -0.1 }}>
            {lever.title}
          </div>
          <div style={{ fontSize: 13, color: "var(--fg-2)", marginTop: 3, textWrap: "pretty" }}>
            {lever.summary}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--fg-3)" }}>
            <span style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>Прогресс</span>
            <span style={{ color: meta.fg, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
              {lever.progress}%
            </span>
          </div>
          <ProgressBar value={lever.progress} status={lever.status} />
        </div>

        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: "rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 200ms"
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path d="M2 4 L6 8 L10 4" stroke="var(--fg-2)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {open && (
        <div style={{
          padding: "16px 18px 18px",
          borderTop: "1px solid var(--line)",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 24,
          background: "rgba(0,0,0,0.15)"
        }}>
          <div>
            {lever.nextSteps?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <SectionLabel>Следующие шаги</SectionLabel>
                <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {lever.nextSteps.map((s, i) => (
                    <li key={i} style={{ display: "flex", gap: 10, fontSize: 13, color: "var(--fg-1)", lineHeight: 1.5 }}>
                      <span style={{
                        flex: "0 0 20px", height: 20, borderRadius: 4,
                        background: meta.bg, color: meta.fg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums"
                      }}>{i + 1}</span>
                      <span style={{ textWrap: "pretty" }}>{s}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {lever.risks?.length > 0 && (
              <div>
                <SectionLabel>Риски</SectionLabel>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {lever.risks.map((r, i) => (
                    <li key={i} style={{
                      fontSize: 12.5, color: "var(--fg-1)", lineHeight: 1.5,
                      paddingLeft: 10, borderLeft: "2px solid rgba(251,113,133,0.45)"
                    }}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {lever.links?.length > 0 && (
              <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {lever.links.map((l, i) => (
                  <a key={i} href={l.href} target="_blank" rel="noreferrer" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "5px 10px", borderRadius: 6,
                    background: "var(--accent-indigo-soft)", color: "#c7d2fe",
                    border: "1px solid rgba(129,140,248,0.30)",
                    textDecoration: "none", fontSize: 12, fontWeight: 500
                  }}>
                    {l.label}
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M3 1 H9 V7 M9 1 L1 9" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            {lever.metrics && Object.keys(lever.metrics).length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <SectionLabel>Метрики</SectionLabel>
                {Object.entries(lever.metrics).map(([k, v]) => <KV key={k} label={k}>{v}</KV>)}
              </div>
            )}

            {lever.ownersInternal?.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <SectionLabel>Внутри команды</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {lever.ownersInternal.map((o, i) => <Chip key={i} tone="neutral">{o}</Chip>)}
                </div>
              </div>
            )}

            {lever.counterparties?.length > 0 && (
              <div>
                <SectionLabel>Контрагенты</SectionLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {lever.counterparties.map((c, i) => <Chip key={i} tone="warm">{c}</Chip>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------- Roadmap (Gantt-lite) --------------------------------
function RoadmapStrip({ levers }) {
  const months = ["Апр","Май","Июн","Июл","Авг","Сен"];
  function parseTarget(t) {
    if (!t) return null;
    if (/^Live$/i.test(t)) return 0;
    const m = /^(\d{4})-(\d{2})$/.exec(t);
    if (m) return Math.max(0, (parseInt(m[1]) - 2026) * 12 + (parseInt(m[2]) - 4));
    const q = /^(\d{4})-Q(\d)$/.exec(t);
    if (q) return Math.max(0, (parseInt(q[1]) - 2026) * 12 + ((parseInt(q[2]) - 1) * 3) - 3 + 2);
    return null;
  }
  return (
    <Card padding={16}>
      <SectionLabel right={<span style={{ fontSize: 11, color: "var(--fg-3)" }}>след. 6 месяцев</span>}>
        Roadmap
      </SectionLabel>
      <div style={{
        display: "grid", gridTemplateColumns: `170px repeat(${months.length}, 1fr)`,
        marginBottom: 6, paddingBottom: 6, borderBottom: "1px solid var(--line)"
      }}>
        <div />
        {months.map((m, i) => (
          <div key={i} style={{ fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
            {m} 26
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {levers.map(lev => {
          const end = parseTarget(lev.targetDate);
          const meta = STATUS_META[lev.status] || STATUS_META.planned;
          return (
            <div key={lev.id} style={{
              display: "grid", gridTemplateColumns: `170px repeat(${months.length}, 1fr)`,
              alignItems: "center", height: 24
            }}>
              <div style={{ fontSize: 12, color: "var(--fg-1)", paddingRight: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {lev.title}
              </div>
              {months.map((_, i) => {
                const inSpan = end != null && i <= end;
                const isEnd = end === i;
                return (
                  <div key={i} style={{
                    height: 14, position: "relative",
                    borderLeft: i === 0 ? "1px solid rgba(255,255,255,0.04)" : "none"
                  }}>
                    {inSpan && (
                      <div style={{
                        position: "absolute", inset: "1px 3px",
                        background: meta.bg,
                        borderTop: `1px solid ${meta.dot}`,
                        borderBottom: `1px solid ${meta.dot}`,
                        borderLeft: i === 0 ? `2px solid ${meta.dot}` : "none",
                        borderRight: isEnd ? `2px solid ${meta.dot}` : "none"
                      }} />
                    )}
                    {isEnd && (
                      <div style={{
                        position: "absolute", right: 3, top: -3, bottom: -3,
                        display: "flex", alignItems: "center"
                      }}>
                        <div style={{
                          padding: "2px 6px", borderRadius: 4,
                          background: meta.dot, color: "#0a0a0b",
                          fontSize: 9, fontWeight: 800, letterSpacing: 0.3
                        }}>{lev.progress}%</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---------------------- Funnel ----------------------------------------------
function FunnelStrip({ steps }) {
  const max = steps[0]?.value || 1;
  return (
    <Card padding={16}>
      <SectionLabel right={<span style={{ fontSize: 11, color: "var(--fg-3)" }}>моки · подключение к analytics — следующий шаг</span>}>
        Воронка веб-шопа · Aghanim
      </SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {steps.map((s, i) => {
          const w = (s.value / max) * 100;
          const colors = ["#818cf8", "#a78bfa", "#f59e0b", "#34d399"];
          const c = colors[i] || "#818cf8";
          return (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "150px 1fr 110px", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 12.5, color: "var(--fg-1)" }}>{s.label}</div>
              <div style={{ height: 22, position: "relative", background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  width: `${w}%`, height: "100%",
                  background: `linear-gradient(90deg, ${c}aa, ${c}33)`,
                  borderRight: `2px solid ${c}`
                }} />
              </div>
              <div style={{ fontSize: 13, color: "var(--fg-0)", textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
                {s.value.toLocaleString("ru-RU")}
                {s.hint && <span style={{ color: "var(--fg-3)", fontSize: 11, marginLeft: 6, fontWeight: 400 }}>{s.hint}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---------------------- CreoPipeline (kanban) -------------------------------
function CreoPipeline() {
  const cols = [
    { id: "brief",  label: "В брифе",         count: 10, accent: "#818cf8", items: ["Аутсорс A — батч #2", "Аутсорс A — батч #3"] },
    { id: "prod",   label: "В продакшне",     count: 3,  accent: "#f59e0b", items: ["Аутсорс B — playable #1", "Аутсорс B — playable #2", "Аутсорс B — playable #3"] },
    { id: "review", label: "На ревью",        count: 2,  accent: "#a78bfa", items: ["Sett.ai — pilot pack"] },
    { id: "ready",  label: "Готовы / в тесте", count: 5, accent: "#34d399", items: ["Аутсорс A — playable #1…#5"] }
  ];
  return (
    <Card padding={16}>
      <SectionLabel right={<span style={{ fontSize: 11, color: "var(--fg-3)" }}>сводно по подрядчикам</span>}>
        Pipeline playables
      </SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
        {cols.map(c => (
          <div key={c.id} style={{
            background: `linear-gradient(180deg, ${c.accent}14, transparent 60%), var(--bg-2)`,
            border: "1px solid var(--line)",
            borderTop: `2px solid ${c.accent}`,
            borderRadius: 8, padding: 12, minHeight: 130
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <div style={{ fontSize: 10.5, color: "var(--fg-2)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: c.accent, fontVariantNumeric: "tabular-nums" }}>
                {c.count}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {c.items.map((it, i) => (
                <div key={i} style={{
                  fontSize: 11.5, color: "var(--fg-1)",
                  padding: "5px 8px",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 4,
                  borderLeft: `2px solid ${c.accent}88`
                }}>{it}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ---------------------- Creo Production Dashboard ---------------------------
// Большой блок «факт / план / прогресс / разбивка» для креативов и playables.
function CreoProduction({ data }) {
  if (!data) return null;
  const blocks = [
    { key: "creatives", accent: "#f59e0b", data: data.creatives },
    { key: "playables", accent: "#34d399", data: data.playables }
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      {blocks.map(b => (
        <CreoVolumeCard key={b.key} accent={b.accent} block={b.data} />
      ))}
    </div>
  );
}

function CreoVolumeCard({ block, accent }) {
  if (!block) return null;
  const { label, planNow, inProgress, doneThisMonth, breakdown } = block;

  const patchKey = label === "Креативы" ? "creo.planTarget" : "play.planTarget";
  const storageKey = "guli_target_" + patchKey;

  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";

  const [planTarget, setPlanTarget] = useState(block.planTarget);
  const [saved, setSaved] = useState(false);

  function changeTarget(delta) {
    const newVal = Math.max(0, planTarget + delta);
    setPlanTarget(newVal);
    fetch("/api/patch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [patchKey]: newVal })
    }).then(r => r.json()).then(d => {
      if (d.ok) { setSaved(true); setTimeout(() => setSaved(false), 1500); }
    }).catch(() => {});
  }

  const targetDelta = planTarget - planNow;
  const totalSources =
    (breakdown.inhouse?.count || 0) +
    (breakdown.freelance?.count || 0) +
    (breakdown.outsource?.count || 0);

  return (
    <div style={{
      background: `linear-gradient(135deg, ${accent}14 0%, transparent 45%), var(--bg-1)`,
      border: "1px solid var(--line)",
      borderTop: `3px solid ${accent}`,
      borderRadius: 10, padding: 16
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: accent, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 }}>
          {label} · объёмы
        </div>
        <div style={{ fontSize: 11, color: "var(--fg-3)" }}>шт. / мес</div>
      </div>

      {/* План сейчас → план через 2-3 мес */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr auto 1fr",
        gap: 12, alignItems: "center", marginBottom: 14
      }}>
        <div>
          <div style={{ fontSize: 10.5, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600, marginBottom: 4 }}>
            Сейчас планируем
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--fg-0)", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
            {planNow}
          </div>
        </div>
        <div style={{ color: accent, fontSize: 18, opacity: 0.7 }}>→</div>
        <div>
          <div style={{ fontSize: 10.5, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600, marginBottom: 4 }}>
            Цель 2–3 мес
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            {isLocal && (
              <button onClick={() => changeTarget(-1)} style={{
                width: 28, height: 28, borderRadius: 6, border: `1px solid ${accent}44`,
                background: `${accent}14`, color: accent, fontSize: 18, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                lineHeight: 1, flexShrink: 0
              }}>−</button>
            )}
            <div style={{ fontSize: 32, fontWeight: 700, color: accent, letterSpacing: -0.5, fontVariantNumeric: "tabular-nums", lineHeight: 1, minWidth: 36, textAlign: "center" }}>
              {planTarget}
            </div>
            {isLocal && (
              <button onClick={() => changeTarget(1)} style={{
                width: 28, height: 28, borderRadius: 6, border: `1px solid ${accent}44`,
                background: `${accent}14`, color: accent, fontSize: 18, fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                lineHeight: 1, flexShrink: 0
              }}>+</button>
            )}
            {targetDelta !== 0 && (
              <span style={{
                fontSize: 11, padding: "2px 6px", borderRadius: 4,
                background: `${accent}22`, color: accent, fontWeight: 700,
                fontVariantNumeric: "tabular-nums"
              }}>
                {targetDelta > 0 ? "+" : ""}{targetDelta}
              </span>
            )}
            {saved && (
              <span style={{ fontSize: 10, color: "#34d399" }}>✓ сохранено</span>
            )}
          </div>
        </div>
      </div>

      {/* Текущий статус */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14
      }}>
        <div style={{
          padding: "10px 12px", borderRadius: 6,
          background: "rgba(245,158,11,0.10)",
          border: "1px solid rgba(245,158,11,0.25)"
        }}>
          <div style={{ fontSize: 10, color: "#fcd34d", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>В работе</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--fg-0)", fontVariantNumeric: "tabular-nums", marginTop: 2 }}>{inProgress}</div>
        </div>
        <div style={{
          padding: "10px 12px", borderRadius: 6,
          background: "rgba(52,211,153,0.10)",
          border: "1px solid rgba(52,211,153,0.25)"
        }}>
          <div style={{ fontSize: 10, color: "#86efac", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>Сделано в месяце</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--fg-0)", fontVariantNumeric: "tabular-nums", marginTop: 2 }}>{doneThisMonth}</div>
        </div>
      </div>

      {/* Разбивка по источникам */}
      <div style={{ paddingTop: 12, borderTop: "1px solid var(--line)" }}>
        <div style={{ fontSize: 10.5, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600, marginBottom: 10 }}>
          Откуда поступают · {totalSources} шт.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <SourceRow
            label="In-house"
            count={breakdown.inhouse?.count || 0}
            total={totalSources}
            note={breakdown.inhouse?.note}
            color="#34d399"
          />
          <SourceRow
            label="Freelance"
            count={breakdown.freelance?.count || 0}
            total={totalSources}
            note={breakdown.freelance?.note}
            color="#818cf8"
          />
          <SourceRow
            label="Outsource"
            count={breakdown.outsource?.count || 0}
            total={totalSources}
            note={breakdown.outsource?.note}
            color="#f59e0b"
            vendors={breakdown.outsource?.vendors}
          />
        </div>
      </div>
    </div>
  );
}

function SourceRow({ label, count, total, note, color, vendors }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "100px 1fr 60px", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
          <span style={{ fontSize: 12.5, color: "var(--fg-1)", fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: color, opacity: 0.85 }} />
        </div>
        <div style={{ textAlign: "right", fontSize: 13, fontWeight: 600, color: "var(--fg-0)", fontVariantNumeric: "tabular-nums" }}>
          {count}
          <span style={{ color: "var(--fg-3)", fontSize: 10.5, marginLeft: 4, fontWeight: 400 }}>{pct}%</span>
        </div>
      </div>
      {note && (
        <div style={{ fontSize: 11.5, color: "var(--fg-3)", paddingLeft: 16, marginTop: 3 }}>
          {note}
        </div>
      )}
      {vendors && vendors.length > 0 && (
        <div style={{ paddingLeft: 16, marginTop: 6, display: "flex", flexWrap: "wrap", gap: 5 }}>
          {vendors.map((v, i) => (
            <span key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "3px 8px", borderRadius: 4,
              background: "rgba(245,158,11,0.08)",
              border: "1px solid rgba(245,158,11,0.20)",
              fontSize: 11, color: "#fcd34d"
            }}>
              <b style={{ fontWeight: 700 }}>{v.name}</b>
              <span style={{ color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>· {v.count}</span>
              {v.status === "negotiation" && (
                <span style={{ color: "var(--fg-3)", fontSize: 10 }}>· negotiation</span>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------- Creo Team -------------------------------------------
function CreoTeam({ team }) {
  if (!team) return null;
  return (
    <Card padding={16} style={{ marginBottom: 16 }}>
      <SectionLabel right={<span style={{ fontSize: 11, color: "var(--fg-3)" }}>состав отдела</span>}>
        Команда креопродакшена
      </SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {team.groups.map(g => {
          const typeMeta = {
            inhouse:   { label: "In-house",  color: "#34d399", bg: "rgba(52,211,153,0.10)",  border: "rgba(52,211,153,0.25)" },
            freelance: { label: "Freelance", color: "#818cf8", bg: "rgba(129,140,248,0.10)", border: "rgba(129,140,248,0.25)" },
            hiring:    { label: "В найме",   color: "#fb7185", bg: "rgba(251,113,133,0.10)", border: "rgba(251,113,133,0.25)" },
            outsource: { label: "Outsource", color: "#f59e0b", bg: "rgba(245,158,11,0.10)",  border: "rgba(245,158,11,0.25)" }
          }[g.type] || { label: g.type, color: "#818cf8", bg: "rgba(129,140,248,0.10)", border: "rgba(129,140,248,0.25)" };
          return (
            <div key={g.id} style={{
              background: "var(--bg-2)",
              border: "1px solid var(--line)",
              borderTop: `2px solid ${typeMeta.color}`,
              borderRadius: 8, padding: 14
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <div style={{ fontSize: 12.5, color: "var(--fg-0)", fontWeight: 600 }}>{g.label}</div>
                <span style={{
                  fontSize: 10, padding: "2px 7px", borderRadius: 3,
                  background: typeMeta.bg, color: typeMeta.color,
                  border: `1px solid ${typeMeta.border}`,
                  textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700
                }}>{typeMeta.label}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "var(--fg-0)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                  {g.count}
                </div>
                <div style={{ fontSize: 11, color: "var(--fg-2)" }}>чел.</div>
              </div>
              {g.note && (
                <div style={{ fontSize: 11.5, color: "var(--fg-2)", marginBottom: 10, textWrap: "pretty", lineHeight: 1.4 }}>
                  {g.note}
                </div>
              )}
              {g.members && g.members.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4, paddingTop: 8, borderTop: "1px solid var(--line)" }}>
                  {g.members.map((m, i) => {
                    const isOpen = m.status === "open";
                    const isInterim = m.status === "interim";
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        fontSize: 11.5, color: isOpen ? "var(--fg-3)" : "var(--fg-1)",
                        fontStyle: isOpen ? "italic" : "normal"
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: isOpen ? "#fb7185" : (isInterim ? "#f59e0b" : "#34d399"),
                          flex: "0 0 6px"
                        }} />
                        <span style={{ fontWeight: 600, color: isOpen ? "var(--fg-3)" : "var(--fg-0)" }}>
                          {m.name}
                        </span>
                        <span style={{ color: "var(--fg-3)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          · {m.role}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---------------------- Mini stat tile (для overview-сетки) -----------------
function StatTile({ label, value, sub, accent = "#818cf8", icon }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${accent}14 0%, transparent 50%), var(--bg-1)`,
      border: "1px solid var(--line)",
      borderRadius: 10, padding: "14px 16px",
      display: "flex", flexDirection: "column", gap: 4,
      position: "relative", overflow: "hidden"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 10.5, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
          {label}
        </div>
        {icon && <div style={{ color: accent, opacity: 0.8 }}>{icon}</div>}
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "var(--fg-0)", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums", lineHeight: 1.05 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--fg-2)" }}>{sub}</div>}
    </div>
  );
}

// ---------------------- Health donut (для сводки прогресса) -----------------
function HealthDonut({ counts }) {
  // counts: {done, in_progress, planned, blocked}
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  const segments = [
    { key: "done",        color: STATUS_META.done.dot },
    { key: "in_progress", color: STATUS_META.in_progress.dot },
    { key: "planned",     color: STATUS_META.planned.dot },
    { key: "blocked",     color: STATUS_META.blocked.dot }
  ];
  const C = 2 * Math.PI * 28;
  let offset = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        {segments.map(s => {
          const v = counts[s.key] || 0;
          const len = (v / total) * C;
          const el = (
            <circle key={s.key} cx="40" cy="40" r="28" fill="none"
              stroke={s.color} strokeWidth="10"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {segments.map(s => {
          const v = counts[s.key] || 0;
          const meta = STATUS_META[s.key];
          return (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              <span style={{ color: "var(--fg-2)", flex: 1 }}>{meta.label}</span>
              <span style={{ color: "var(--fg-0)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{v}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

Object.assign(window, {
  StatusPill, ProgressBar, KV, Chip, Card, SectionLabel,
  LeverCard, RoadmapStrip, FunnelStrip, CreoPipeline,
  CreoProduction, CreoTeam,
  StatTile, HealthDonut,
  STATUS_META, fmtDate
});
