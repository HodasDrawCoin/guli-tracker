// =============================================================================
// Guli Games tracker — компоненты v2 (плотнее, ярче, с акцентами)
// =============================================================================
const { useState, useEffect, useMemo, useRef } = React;

// ---------------------- Палитра по статусам ---------------------------------
const STATUS_META = {
  done:        { label: "Done",        dot: "#34d399", bg: "rgba(52,211,153,0.12)",  fg: "#86efac", border: "rgba(52,211,153,0.30)" },
  in_progress: { label: "In progress", dot: "#f59e0b", bg: "rgba(245,158,11,0.14)",  fg: "#fcd34d", border: "rgba(245,158,11,0.32)" },
  blocked:     { label: "Blocked",     dot: "#fb7185", bg: "rgba(251,113,133,0.14)", fg: "#fda4af", border: "rgba(251,113,133,0.30)" },
  planned:     { label: "Planned",     dot: "#818cf8", bg: "rgba(129,140,248,0.14)", fg: "#c7d2fe", border: "rgba(129,140,248,0.30)" }
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
          {lever.progressDots ? (() => {
            const { filled, total, label } = lever.progressDots;
            return (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--fg-3)" }}>
                  <span style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>{label || "Состав"}</span>
                  <span style={{ color: meta.fg, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{filled} / {total}</span>
                </div>
                <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 2 }}>
                  {Array.from({ length: total }, (_, i) => (
                    <div key={i} style={{
                      width: 14, height: 14, borderRadius: 3,
                      background: i < filled ? meta.dot : "transparent",
                      border: `1.5px solid ${i < filled ? meta.dot : "rgba(255,255,255,0.15)"}`,
                      boxShadow: i < filled ? `0 0 6px ${meta.dot}66` : "none"
                    }} />
                  ))}
                </div>
              </>
            );
          })() : (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--fg-3)" }}>
                <span style={{ textTransform: "uppercase", letterSpacing: 0.4 }}>Прогресс</span>
                <span style={{ color: meta.fg, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {lever.progress}%
                </span>
              </div>
              <ProgressBar value={lever.progress} status={lever.status} />
            </>
          )}
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
                <SectionLabel>{lever.stepsLabel || "Следующие шаги"}</SectionLabel>
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
                <SectionLabel>Показатели</SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {Object.entries(lever.metrics).map(([k, v]) => (
                    <div key={k} style={{
                      background: meta.bg,
                      border: `1px solid ${meta.border}`,
                      borderRadius: 8, padding: "8px 10px"
                    }}>
                      <div style={{ fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>{k}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: meta.fg, fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}>{v}</div>
                    </div>
                  ))}
                </div>
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
  const months = ["Apr","May","Jun","Jul","Aug","Sep"];
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
      <SectionLabel right={<span style={{ fontSize: 11, color: "var(--fg-3)" }}>next 6 months</span>}>
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

// ---------------------- SourceCalendar (источники + календарь) ---------------
function SourceCalendar({ calendar, accent, period }) {
  if (!calendar) return null;

  const today    = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
  const curM = today.getMonth(), curY = today.getFullYear();
  let prevM = curM - 1, prevY = curY;
  if (prevM < 0) { prevM = 11; prevY--; }

  const MONTH_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  function buildDays(y, m) {
    const n = new Date(y, m + 1, 0).getDate();
    return Array.from({ length: n }, (_, i) => {
      const d = i + 1;
      return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    });
  }

  const months = [
    { label: `${MONTH_EN[prevM]} ${prevY}`, days: buildDays(prevY, prevM), year: prevY, month: prevM },
    { label: `${MONTH_EN[curM]}  ${curY}`,  days: buildDays(curY,  curM),  year: curY,  month: curM  }
  ];

  const doneMap = {}, plannedMap = {};
  (calendar.done    || []).forEach(d => { doneMap[d.date]    = d; });
  (calendar.planned || []).forEach(d => { plannedMap[d.date] = d; });

  const sources = [
    { key: "inhouse",   label: "In-house",  color: "#34d399" },
    { key: "freelance", label: "Freelance", color: "#818cf8" },
    { key: "outsource", label: "Outsource", color: "#f59e0b" },
  ];

  function getMonthTotals(y, m) {
    const ms = `${y}-${String(m+1).padStart(2,"0")}`;
    const t = { inhouse: 0, freelance: 0, outsource: 0 };
    [...(calendar.done || []), ...(calendar.planned || [])]
      .filter(d => d.date.startsWith(ms))
      .forEach(d => { t.inhouse += d.inhouse||0; t.freelance += d.freelance||0; t.outsource += d.outsource||0; });
    return t;
  }

  const LABELW = 66, TOTALW = 46;

  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
      {months.map(({ label, days, year, month }, idx) => {
        const mt    = getMonthTotals(year, month);
        const mSum  = mt.inhouse + mt.freelance + mt.outsource;
        return (
          <div key={label} style={{ marginBottom: 10 }}>
            {idx > 0 && (
              <div style={{ height: 1, background: "var(--line-2)", margin: "10px 0 12px" }} />
            )}
            {/* Заголовок месяца */}
            <div style={{ fontSize: 9.5, color: "var(--fg-2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
              {label}
            </div>
            {/* Числа дней */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 3 }}>
              <div style={{ width: LABELW, flexShrink: 0 }} />
              <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 1 }}>
                {days.map(dateStr => {
                  const day = parseInt(dateStr.split("-")[2]);
                  const isToday = dateStr === todayStr;
                  return (
                    <div key={dateStr} style={{ textAlign: "center", fontSize: 7, lineHeight: 1.2,
                      color: isToday ? accent : "var(--fg-3)", fontWeight: isToday ? 800 : 400 }}>
                      {day}
                    </div>
                  );
                })}
              </div>
              <div style={{ width: TOTALW, flexShrink: 0 }} />
            </div>
            {/* Строки по источникам */}
            {sources.map(src => {
              const srcTotal = mt[src.key] || 0;
              const srcPct   = mSum ? Math.round(srcTotal / mSum * 100) : 0;
              return (
                <div key={src.key} style={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
                  {/* Лейбл */}
                  <div style={{ width: LABELW, flexShrink: 0, display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: src.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: "var(--fg-2)", fontWeight: 500, whiteSpace: "nowrap" }}>{src.label}</span>
                  </div>
                  {/* Квадраты */}
                  <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 1 }}>
                    {days.map(dateStr => {
                      const done    = doneMap[dateStr]    || {};
                      const planned = plannedMap[dateStr] || {};
                      const dc = done[src.key]    || 0;
                      const pc = planned[src.key] || 0;
                      const tot = dc + pc;
                      const isToday  = dateStr === todayStr;
                      const isDone   = dc > 0;
                      if (tot === 0) return (
                        <div key={dateStr} style={{ aspectRatio: "1", borderRadius: 2,
                          background: isToday ? `${src.color}15` : "rgba(255,255,255,0.03)",
                          border: `1px solid ${isToday ? src.color+"30" : "rgba(255,255,255,0.05)"}` }} />
                      );
                      return (
                        <div key={dateStr} style={{ aspectRatio: "1", borderRadius: 2,
                          background: isDone ? `${src.color}cc` : `${src.color}22`,
                          border: `1px solid ${src.color}${isDone ? "99" : "44"}`,
                          borderStyle: isDone ? "solid" : "dashed",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 8, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                          color: isDone ? "#fff" : src.color }}>
                          {tot}
                        </div>
                      );
                    })}
                  </div>
                  {/* Итог */}
                  <div style={{ width: TOTALW, flexShrink: 0, textAlign: "right", paddingLeft: 6, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "var(--fg-0)", fontVariantNumeric: "tabular-nums" }}>{srcTotal}</span>
                    {mSum > 0 && <span style={{ fontSize: 9, color: "var(--fg-3)" }}>{srcPct}%</span>}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      {/* Легенда */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.4)" }} />
          <span style={{ fontSize: 9, color: "var(--fg-3)" }}>Done</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, border: "1px dashed rgba(255,255,255,0.3)" }} />
          <span style={{ fontSize: 9, color: "var(--fg-3)" }}>Planned</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------- CalendarStrip (legacy, заменён SourceCalendar) --------
function CalendarStrip({ calendar, accent }) {
  if (!calendar) return null;

  const today    = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  const curM = today.getMonth(), curY = today.getFullYear();
  let prevM = curM - 1, prevY = curY;
  if (prevM < 0) { prevM = 11; prevY--; }

  const MONTH_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  function buildDays(y, m) {
    const n = new Date(y, m + 1, 0).getDate();
    return Array.from({ length: n }, (_, i) => {
      const d = i + 1;
      return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    });
  }

  const months = [
    { label: `${MONTH_EN[prevM]} ${prevY}`, days: buildDays(prevY, prevM) },
    { label: `${MONTH_EN[curM]} ${curY}`,   days: buildDays(curY, curM) }
  ];

  const doneMap = {}, plannedMap = {};
  (calendar.done    || []).forEach(d => { doneMap[d.date]    = d; });
  (calendar.planned || []).forEach(d => { plannedMap[d.date] = d; });

  const sources = [
    { key: "inhouse",   label: "In-house",  color: "#34d399" },
    { key: "freelance", label: "Freelance", color: "#818cf8" },
    { key: "outsource", label: "Outsource", color: "#f59e0b" },
  ];

  const DH = 14;

  return (
    <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line)" }}>
      <div style={{ fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600, marginBottom: 6 }}>
        Delivery calendar
      </div>

      {/* Месяцы — один под другим */}
      {months.map(({ label, days }) => (
        <div key={label} style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 9, color: "var(--fg-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 3 }}>
            {label}
          </div>
          {/* Числа дней */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 1, marginBottom: 2 }}>
            {days.map(dateStr => {
              const day = parseInt(dateStr.split("-")[2]);
              const isToday = dateStr === todayStr;
              return (
                <div key={dateStr} style={{ textAlign: "center", fontSize: 7,
                  color: isToday ? accent : "var(--fg-3)", fontWeight: isToday ? 800 : 400 }}>
                  {day}
                </div>
              );
            })}
          </div>
          {/* Строки по источникам */}
          {sources.map(src => (
            <div key={src.key} style={{ display: "grid", gridTemplateColumns: `repeat(${days.length}, 1fr)`, gap: 1, marginBottom: 1 }}>
              {days.map(dateStr => {
                const done    = doneMap[dateStr]    || {};
                const planned = plannedMap[dateStr] || {};
                const dc    = done[src.key]    || 0;
                const pc    = planned[src.key] || 0;
                const total = dc + pc;
                const isToday = dateStr === todayStr;
                const isDone  = dc > 0;
                if (total === 0) {
                  return <div key={dateStr} style={{ height: DH, borderRadius: 2,
                    background: isToday ? `${src.color}15` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${isToday ? src.color+"30" : "rgba(255,255,255,0.05)"}` }} />;
                }
                return (
                  <div key={dateStr} style={{ height: DH, borderRadius: 2,
                    background: isDone ? `${src.color}cc` : `${src.color}22`,
                    border: `1px solid ${src.color}${isDone ? "99" : "55"}`,
                    borderStyle: isDone ? "solid" : "dashed",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                    color: isDone ? "#fff" : src.color }}>
                    {total}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}

      {/* Легенда */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {sources.map(s => (
          <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
            <span style={{ fontSize: 9, color: "var(--fg-3)" }}>{s.label}</span>
          </div>
        ))}
        <div style={{ width: 1, height: 10, background: "var(--line)", margin: "0 2px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: "rgba(255,255,255,0.4)" }} />
          <span style={{ fontSize: 9, color: "var(--fg-3)" }}>Done</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, border: "1px dashed rgba(255,255,255,0.3)" }} />
          <span style={{ fontSize: 9, color: "var(--fg-3)" }}>Planned</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------- Creo Production Dashboard ---------------------------
function CreoProduction({ data }) {
  if (!data) return null;
  const blocks = [
    { key: "creatives", accent: "#00c896", data: data.creatives },
    { key: "playables", accent: "#f97316", data: data.playables }
  ];
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{
          width: 3, height: 14, borderRadius: 2,
          background: "linear-gradient(to bottom, #00c896, #00c89640)",
          boxShadow: "0 0 10px #00c89688",
        }} />
        <span style={{ fontSize: 9, color: "#00c896", textTransform: "uppercase", letterSpacing: 1.5, fontWeight: 700 }}>
          Volume · {data.period || "current period"}
        </span>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(0,200,150,0.3), transparent)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignItems: "start" }}>
        {blocks.map(b => (
          <CreoVolumeCard key={b.key} accent={b.accent} block={b.data} period={data.period} />
        ))}
      </div>
    </div>
  );
}

function CreoVolumeCard({ block, accent, period }) {
  if (!block) return null;
  const { label, planNow } = block;

  const patchKey = label === "Креативы" ? "creo.planTarget" : "play.planTarget";
  const isLocal = location.hostname === "localhost" || location.hostname === "127.0.0.1";

  const [planTarget, setPlanTarget] = useState(block.planTarget);
  const [saved, setSaved] = useState(false);
  const [saveErr, setSaveErr] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  // Регистрируем текущее значение глобально — Publish-кнопка читает его перед git push
  useEffect(() => {
    if (!isLocal) return;
    if (!window.__GULI_LOCAL_TARGETS) window.__GULI_LOCAL_TARGETS = {};
    window.__GULI_LOCAL_TARGETS[patchKey] = planTarget;
  }, [planTarget]);

  function changeTarget(delta) {
    const newVal = Math.max(0, planTarget + delta);
    setPlanTarget(newVal);
    setSaveErr(false);
    fetch("/api/patch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [patchKey]: newVal })
    }).then(r => r.json()).then(d => {
      if (d.ok) { setSaved(true); setTimeout(() => setSaved(false), 1500); }
      else { setSaveErr(true); setTimeout(() => setSaveErr(false), 3000); }
    }).catch(() => { setSaveErr(true); setTimeout(() => setSaveErr(false), 3000); });
  }

  const targetDelta = planTarget - planNow;

  // Месячные суммы из calendar
  const SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  function calMonthSum(arr, y, m) {
    const prefix = `${y}-${String(m + 1).padStart(2, "0")}`;
    return (arr || []).filter(d => d.date.startsWith(prefix))
      .reduce((s, d) => s + (d.inhouse || 0) + (d.freelance || 0) + (d.outsource || 0), 0);
  }
  const now2   = new Date();
  const curY   = now2.getFullYear();
  const curM   = now2.getMonth();          // 0-indexed
  const prevM  = curM === 0 ? 11 : curM - 1;
  const prevY  = curM === 0 ? curY - 1 : curY;
  const nextM  = curM === 11 ? 0 : curM + 1;
  const nextY  = curM === 11 ? curY + 1 : curY;

  const cal        = block.calendar || {};
  const sdanoPrev  = calMonthSum(cal.done,    prevY, prevM);
  const sdanoCur   = calMonthSum(cal.done,    curY,  curM);
  const workCur    = calMonthSum(cal.planned, curY,  curM);
  const workNext   = calMonthSum(cal.planned, nextY, nextM);

  const prevShort  = SHORT_MONTHS[prevM];
  const curShort   = SHORT_MONTHS[curM];
  const nextShort  = SHORT_MONTHS[nextM];

  // Circular gauge
  const GR = 48, GC = 2 * Math.PI * GR;
  const pctTarget = Math.min(100, Math.round((sdanoCur / (planTarget || 1)) * 100));
  const gaugeLen  = mounted ? (pctTarget / 100) * GC : 0;

  // Mini bars
  const bars = [
    { label: prevShort, value: sdanoPrev, type: "done" },
    { label: curShort,  value: sdanoCur > 0 ? sdanoCur : workCur, type: sdanoCur > 0 ? "partial" : "planned" },
    { label: nextShort, value: workNext,  type: "planned" },
  ];
  const maxBar = Math.max(...bars.map(b => b.value), 1);

  return (
    <div style={{
      background: `linear-gradient(160deg, ${accent}0e 0%, #0d1a1500 55%), #0d1a15`,
      border: `1px solid ${accent}28`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 14, padding: "18px 18px 14px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: -30, right: -30, width: 130, height: 130,
        borderRadius: "50%", background: `${accent}10`, filter: "blur(36px)", pointerEvents: "none",
      }} />

      {/* Header row: label + target control */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, position: "relative" }}>
        <div style={{ fontSize: 9, color: accent, textTransform: "uppercase", letterSpacing: 1.4, fontWeight: 700 }}>
          {label === "Креативы" ? "Creatives" : label}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: 0.5 }}>Target</span>
          {isLocal && (
            <button onClick={() => changeTarget(-1)} style={{
              width: 20, height: 20, borderRadius: 4, border: `1px solid ${accent}44`,
              background: `${accent}14`, color: accent, fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>−</button>
          )}
          <span style={{ fontSize: 17, fontWeight: 700, color: accent, fontVariantNumeric: "tabular-nums", minWidth: 24, textAlign: "center" }}>
            {planTarget}
          </span>
          {isLocal && (
            <button onClick={() => changeTarget(1)} style={{
              width: 20, height: 20, borderRadius: 4, border: `1px solid ${accent}44`,
              background: `${accent}14`, color: accent, fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>+</button>
          )}
          {targetDelta !== 0 && (
            <span style={{ fontSize: 10, padding: "1px 5px", borderRadius: 4, background: `${accent}1a`, color: accent, fontWeight: 700 }}>
              {targetDelta > 0 ? "+" : ""}{targetDelta}
            </span>
          )}
          {saved && <span style={{ fontSize: 9, color: "#00c896" }}>✓</span>}
          {saveErr && <span style={{ fontSize: 9, color: "#f87171" }}>✗</span>}
        </div>
      </div>

      {/* Circular gauge + stats row */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        {/* Big SVG gauge */}
        <div style={{ position: "relative", width: 116, height: 116, flexShrink: 0 }}>
          <svg width="116" height="116" viewBox="0 0 116 116" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="58" cy="58" r={GR} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <circle
              cx="58" cy="58" r={GR} fill="none"
              stroke={accent} strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${gaugeLen} ${GC}`}
              style={{ transition: "stroke-dasharray 1.4s cubic-bezier(.2,.8,.2,1)" }}
            />
          </svg>
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              fontSize: 30, fontWeight: 900, color: "#fff",
              fontVariantNumeric: "tabular-nums", lineHeight: 1,
              textShadow: `0 0 24px ${accent}99`,
            }}>
              {pctTarget}<span style={{ fontSize: 15, fontWeight: 700, color: accent }}>%</span>
            </div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: 0.8, marginTop: 4 }}>
              of target
            </div>
          </div>
        </div>

        {/* Right stats */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>
              Delivered {curShort}
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: accent, fontVariantNumeric: "tabular-nums", lineHeight: 1, textShadow: `0 0 18px ${accent}66` }}>
                {sdanoCur}
              </span>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.2)" }}>/ {planTarget}</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 8, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 3 }}>
              In progress {curShort}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "var(--fg-0)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {workCur}
            </div>
          </div>
        </div>
      </div>

      {/* Mini 3-bar trend chart */}
      <div style={{
        background: "rgba(255,255,255,0.02)", borderRadius: 8, padding: "10px 12px",
        marginBottom: 12, border: `1px solid ${accent}10`,
      }}>
        <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 8 }}>Trend</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: 46 }}>
          {bars.map((b, i) => {
            const h = Math.max(3, Math.round((b.value / maxBar) * 40));
            const isCur = i === 1;
            const isDone = b.type === "done";
            return (
              <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: isCur ? "#fff" : "rgba(255,255,255,0.3)", fontVariantNumeric: "tabular-nums" }}>{b.value}</div>
                <div style={{
                  width: "100%", height: mounted ? h : 0, transition: "height 1s " + (0.1 + i * 0.12) + "s cubic-bezier(.2,.8,.2,1)",
                  background: isDone ? accent : (b.type === "partial" ? `${accent}66` : `${accent}22`),
                  borderRadius: "3px 3px 0 0",
                  boxShadow: isDone ? `0 0 10px ${accent}44` : "none",
                  border: isCur ? `1px solid ${accent}44` : "none",
                }} />
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", textTransform: "uppercase" }}>{b.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prev month delivered strip */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "6px 10px", borderRadius: 7, marginBottom: 12,
        background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}10`,
      }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: 0.5 }}>
          {prevShort} delivered
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.55)", fontVariantNumeric: "tabular-nums" }}>{sdanoPrev}</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)" }}>→ {nextShort} planned: <b style={{ color: accent }}>{workNext}</b></span>
      </div>

      {/* Source calendar */}
      <SourceCalendar calendar={block.calendar} accent={accent} period={period} />
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
      <SectionLabel right={<span style={{ fontSize: 11, color: "var(--fg-3)" }}>team composition</span>}>
        Creative Production Team
      </SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
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
                <div style={{ fontSize: 11, color: "var(--fg-2)" }}>{g.type === "outsource" ? "studios" : "ppl."}</div>
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

// =============================================================================
// CreoHero — full-bleed арт + прогресс + donut источников
// =============================================================================
function CreoHero({ production, kpis }) {
  if (!production) return null;
  var creo = production.creatives || {};
  var play = production.playables || {};
  var creoKpi = (kpis || []).find(function(k){ return k.id === "creo"; }) || {};
  var playKpi = (kpis || []).find(function(k){ return k.id === "playables"; }) || {};

  // Источники для donut
  var bd = creo.breakdown || {};
  var ih = (bd.inhouse  && bd.inhouse.count)  || 0;
  var fr = (bd.freelance && bd.freelance.count) || 0;
  var os = (bd.outsource && bd.outsource.count) || 0;
  var srcTotal = (ih + fr + os) || 1;
  var R = 34; var C = 2 * Math.PI * R;
  var donutSegs = [
    { v: ih, color: "#00c896", label: "In-house" },
    { v: fr, color: "#818cf8", label: "Freelance" },
    { v: os, color: "#f97316", label: "Outsource" },
  ];
  var donutOffset = 0;

  // Прогресс к цели
  var delivered  = creo.doneThisMonth != null ? creo.doneThisMonth : 0;
  var inProgress = creo.inProgress    != null ? creo.inProgress    : 0;
  var target     = creo.planTarget    || 1;
  var pct        = Math.min(100, Math.round((delivered / target) * 100));

  var kpis4 = [
    { label: "Creo / month", value: creoKpi.value || "~29", color: "#00c896" },
    { label: "In progress",  value: inProgress,              color: "#f97316" },
    { label: "Playables",    value: playKpi.value || "—",   color: "#a78bfa" },
    { label: "Period",       value: production.period || "—", color: "rgba(255,255,255,0.5)" },
  ];

  // Sparkline from calendar.done (last 10 months)
  var cal = creo.calendar || {};
  var nowH = new Date();
  var sparkData = [];
  for (var si = 0; si < 10; si++) {
    var sm = nowH.getMonth() - (9 - si);
    var sy = nowH.getFullYear();
    if (sm < 0) { sm += 12; sy -= 1; }
    var prefix = sy + "-" + String(sm + 1).padStart(2, "0");
    var tot = (cal.done || []).filter(function(d) { return d.date.startsWith(prefix); })
      .reduce(function(s, d) { return s + (d.inhouse||0) + (d.freelance||0) + (d.outsource||0); }, 0);
    sparkData.push(tot);
  }
  var sparkMax = Math.max.apply(null, sparkData.concat([target, 1]));
  var SW = 700, SH = 88;
  var sparkPts = sparkData.map(function(v, i) {
    return [20 + (i / 9) * (SW - 40), SH - 6 - (v / sparkMax) * (SH - 16)];
  });
  var sparkPath = sparkPts.map(function(p, i) {
    if (i === 0) return "M " + p[0].toFixed(1) + " " + p[1].toFixed(1);
    var prev = sparkPts[i - 1];
    var cpx = ((prev[0] + p[0]) / 2).toFixed(1);
    return "C " + cpx + " " + prev[1].toFixed(1) + " " + cpx + " " + p[1].toFixed(1) + " " + p[0].toFixed(1) + " " + p[1].toFixed(1);
  }).join(" ");
  var lastPt = sparkPts[sparkPts.length - 1] || [SW - 20, SH / 2];
  var areaPath = sparkPath + " L " + lastPt[0].toFixed(1) + " " + SH + " L 20 " + SH + " Z";

  return (
    <div style={{
      position: "relative",
      margin: "-24px -32px 24px",
      height: 380,
      background: "#060f0a",
      overflow: "hidden",
    }}>

      {/* ── CSS анимации ──────────────────────────────────── */}
      <style>{`
        @keyframes creoFadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes creoBarExpand { from { width:0; } }
        @keyframes creoArcDraw   { from { stroke-dasharray:0 10000; } }
        @keyframes creoLineDraw  {
          from { stroke-dashoffset:2400; }
          to   { stroke-dashoffset:0; }
        }
        @keyframes creoGlow {
          0%,100% { text-shadow:0 0 22px rgba(0,200,150,0.35); }
          50%      { text-shadow:0 0 52px rgba(0,200,150,0.8); }
        }
        @keyframes creoPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.55; transform:scale(0.88); }
        }
        @keyframes creoChipIn {
          from { opacity:0; transform:translateY(10px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .cf1 { animation:creoFadeUp 0.55s 0.05s ease both; }
        .cf2 { animation:creoFadeUp 0.55s 0.16s ease both; }
        .cf3 { animation:creoFadeUp 0.55s 0.27s ease both; }
        .cf4 { animation:creoFadeUp 0.55s 0.38s ease both; }
        .cln { stroke-dasharray:2400; animation:creoLineDraw 2.4s 0.2s cubic-bezier(.2,.8,.2,1) both; }
        .cc0 { animation:creoChipIn 0.5s 0.55s ease both; }
        .cc1 { animation:creoChipIn 0.5s 0.68s ease both; }
        .cc2 { animation:creoChipIn 0.5s 0.81s ease both; }
        .cc3 { animation:creoChipIn 0.5s 0.94s ease both; }
        .cgn { animation:creoGlow   3s  1.0s ease infinite; }
        .cpls{ animation:creoPulse  2.2s 0.8s ease infinite; }
      `}</style>

      {/* Арт */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(/assets/legendale-promo.png?v=3)",
        backgroundSize: "cover",
        backgroundPosition: "center 15%",
        opacity: 0.65, filter: "saturate(0.9) brightness(0.85)",
      }} />

      {/* Тёмно-зелёный colour cast */}
      <div style={{ position:"absolute", inset:0, background:"rgba(0,18,10,0.52)" }} />

      {/* SVG-линия поверх арта */}
      <div style={{ position:"absolute", inset:0, zIndex:1, pointerEvents:"none" }}>
        <svg viewBox={"0 0 " + SW + " " + (SH + 20)} preserveAspectRatio="none"
          style={{ position:"absolute", bottom:100, left:0, width:"100%", height:110 }}>
          <defs>
            <linearGradient id="csparkA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#f97316" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0"    />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#csparkA)" />
          <path d={sparkPath} fill="none" stroke="#f97316" strokeWidth="2.8"
            strokeLinejoin="round" strokeLinecap="round" className="cln" />
          <circle cx={lastPt[0]} cy={lastPt[1]} r="5"  fill="#f97316" />
          <circle cx={lastPt[0]} cy={lastPt[1]} r="10" fill="none" stroke="#f97316" strokeWidth="1.5" opacity="0.4" />
        </svg>
      </div>

      {/* Градиенты */}
      <div style={{ position:"absolute", inset:0, zIndex:2,
        background:"linear-gradient(108deg, rgba(6,15,10,0.97) 0%, rgba(6,15,10,0.80) 36%, rgba(6,15,10,0.18) 68%, transparent 100%)" }} />
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:150, zIndex:2,
        background:"linear-gradient(to top, rgba(6,15,10,1) 0%, rgba(6,15,10,0.55) 45%, transparent 100%)" }} />
      <div style={{ position:"absolute", top:0, left:0, right:0, height:70, zIndex:2,
        background:"linear-gradient(to bottom, rgba(6,15,10,0.7) 0%, transparent 100%)" }} />
      <div style={{ position:"absolute", bottom:-60, left:-60, width:320, height:320, zIndex:2,
        borderRadius:"50%", background:"radial-gradient(circle, rgba(0,200,150,0.10) 0%, transparent 70%)", pointerEvents:"none" }} />

      {/* Контент */}
      <div style={{
        position:"relative", zIndex:3,
        padding:"28px 40px 22px", height:"100%", boxSizing:"border-box",
        display:"flex", flexDirection:"column", justifyContent:"space-between",
      }}>

        {/* Верх: заголовок + donut */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>

          {/* Левая часть */}
          <div>
            <div className="cf1" style={{
              fontSize:10, color:"rgba(0,200,150,0.65)",
              textTransform:"uppercase", letterSpacing:2.2, fontWeight:700, marginBottom:14,
              display:"flex", alignItems:"center", gap:10,
            }}>
              <span style={{ width:26, height:1.5, background:"linear-gradient(to right,#00c896,transparent)", display:"inline-block" }} />
              Guli Games · Creative Production
            </div>

            <div className="cf2" style={{
              fontSize:46, fontWeight:900, color:"#fff",
              letterSpacing:-2.5, lineHeight:0.92, marginBottom:18,
              textShadow:"0 2px 40px rgba(0,0,0,0.9)",
            }}>
              Legendale
            </div>

            <div className="cf3" style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:12 }}>
              <span className="cgn" style={{
                fontSize:44, fontWeight:900, color:"#00c896",
                fontVariantNumeric:"tabular-nums", lineHeight:1,
              }}>{delivered}</span>
              <span style={{ fontSize:18, color:"rgba(255,255,255,0.18)", lineHeight:1 }}>/ {target}</span>
              <span style={{ fontSize:10, color:"rgba(255,255,255,0.3)", letterSpacing:0.5 }}>delivered · target</span>
            </div>

            <div className="cf4" style={{ width:280 }}>
              <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
                <div style={{
                  width:pct+"%", height:"100%",
                  background:"linear-gradient(to right,#00c896,#6ee7b7)",
                  borderRadius:3, boxShadow:"0 0 14px rgba(0,200,150,0.55)",
                  animation:"creoBarExpand 1.5s 0.3s cubic-bezier(.2,.8,.2,1) both",
                }} />
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                <span style={{ fontSize:10, color:"rgba(0,200,150,0.65)", fontWeight:600 }}>{pct}% к цели</span>
                <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)", fontVariantNumeric:"tabular-nums" }}>{inProgress} in progress</span>
              </div>
            </div>
          </div>

          {/* Donut панель */}
          <div style={{
            display:"flex", alignItems:"center", gap:20,
            background:"rgba(6,15,10,0.78)", backdropFilter:"blur(18px)",
            border:"1px solid rgba(0,200,150,0.18)",
            borderRadius:20, padding:"20px 24px",
            boxShadow:"0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(0,200,150,0.08)",
          }}>
            <div style={{ position:"relative", width:100, height:100, flexShrink:0 }}>
              <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform:"rotate(-90deg)" }}>
                <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                {donutSegs.map(function(s, i) {
                  var len = (s.v / srcTotal) * C;
                  var el = React.createElement("circle", {
                    key: i, cx:"50", cy:"50", r:R, fill:"none",
                    stroke:s.color, strokeWidth:"12",
                    strokeDasharray: len + " " + (C - len),
                    strokeDashoffset: -donutOffset,
                    style: { animation:"creoArcDraw 1.6s "+(0.3+i*0.15)+"s cubic-bezier(.2,.8,.2,1) both" },
                  });
                  donutOffset += len;
                  return el;
                })}
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <div style={{ fontSize:22, fontWeight:800, color:"#fff", lineHeight:1 }}>{srcTotal}</div>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.28)", textTransform:"uppercase", letterSpacing:0.8, marginTop:2 }}>creos</div>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              <div style={{ fontSize:9, color:"rgba(255,255,255,0.22)", textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>Sources</div>
              {donutSegs.map(function(s) {
                var ps = Math.round((s.v / srcTotal) * 100);
                return (
                  <div key={s.label} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div className="cpls" style={{ width:8, height:8, borderRadius:2, background:s.color, flexShrink:0, boxShadow:"0 0 6px "+s.color+"66" }} />
                    <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)", minWidth:68 }}>{s.label}</span>
                    <span style={{ fontSize:14, fontWeight:700, color:"#fff", fontVariantNumeric:"tabular-nums", minWidth:20, textAlign:"right" }}>{s.v}</span>
                    <span style={{ fontSize:10, color:"rgba(255,255,255,0.2)" }}>{ps}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* KPI-чипы */}
        <div style={{ display:"flex", gap:10 }}>
          {kpis4.map(function(s, i) {
            return (
              <div key={s.label} className={"cc"+i} style={{
                background:"rgba(6,15,10,0.85)",
                border:"1px solid rgba(255,255,255,0.07)",
                borderTop:"2px solid "+s.color+"66",
                borderRadius:12, padding:"12px 18px", flex:1,
                backdropFilter:"blur(14px)",
                boxShadow:"0 4px 24px rgba(0,0,0,0.45)",
              }}>
                <div style={{ fontSize:8, color:"rgba(255,255,255,0.25)", textTransform:"uppercase", letterSpacing:1.1, marginBottom:8 }}>
                  {s.label}
                </div>
                <div style={{
                  fontSize:28, fontWeight:900, color:s.color,
                  fontVariantNumeric:"tabular-nums", lineHeight:1,
                  textShadow:"0 0 22px "+s.color+"55",
                }}>
                  {s.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// HiringTab — Hiring Control Panel
// Источники: Google Sheets (приоритеты) + Huntflow (TTF, воронка)
// =============================================================================

function HiringTab({ tab }) {
  const d        = tab.hiringData || {};
  const summary  = d.summary  || {};
  const funnel   = d.funnel   || [];
  const planNaim = d.planNaim || [];
  const updatedAt = d.updatedAt;

  // Приоритеты: 5=критично, 4=высокий, 3=средний, 2=низкий, 1=беклог, 0=будущее
  const PRIO = {
    "5": { label: "Критично",  color: "#ef4444", bg: "#ef444418", dot: "#ef4444" },
    "4": { label: "Высокий",   color: "#f97316", bg: "#f9731618", dot: "#f97316" },
    "3": { label: "Средний",   color: "#eab308", bg: "#eab30818", dot: "#eab308" },
    "2": { label: "Низкий",    color: "#38bdf8", bg: "#38bdf818", dot: "#38bdf8" },
    "1": { label: "Беклог",    color: "#6b7280", bg: "#6b728018", dot: "#6b7280" },
    "0": { label: "Будущее",   color: "#4b5563", bg: "#4b556318", dot: "#4b5563" },
  };

  // Только открытые позиции, сортируем по приоритету (5 вверху)
  const open   = planNaim.filter(p => !p.closed).sort((a,b) => Number(b.priority||0) - Number(a.priority||0));
  const closed = planNaim.filter(p => p.closed);

  // Считаем: нужно нанять всего
  const totalNeeded = open.reduce((s, p) => s + (p.count || 1), 0);
  const totalHired  = closed.length;
  const offerRate   = summary.offersAccepted || "—";

  // Воронка — общее время = сумма всех стадий
  const totalFunnelDays = funnel.reduce((s, f) => s + f.avgDays, 0);
  const maxFunnelDays   = funnel.reduce((m, f) => Math.max(m, f.avgDays), 1);

  // Группировка открытых по приоритету
  const byPrio = {};
  for (const p of open) {
    const k = p.priority || "0";
    if (!byPrio[k]) byPrio[k] = [];
    byPrio[k].push(p);
  }
  const prioKeys = ["5","4","3","2","1","0"].filter(k => byPrio[k]);

  const CSS = `
    @keyframes hUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
    @keyframes hBar { from{width:0} to{width:var(--tw)} }
    @keyframes hGap { from{stroke-dashoffset:var(--len)} to{stroke-dashoffset:0} }
    .ha1{animation:hUp .4s ease both}
    .ha2{animation:hUp .4s .07s ease both}
    .ha3{animation:hUp .4s .14s ease both}
    .ha4{animation:hUp .4s .21s ease both}
    .hgb{animation:hBar .8s .2s ease both}
  `;

  const CHAR_RECRUITER = "assets/characters/222222-removebg-preview.png";
  const CHAR_LAPTOP    = "assets/characters/1111-removebg-preview.png";

  return (
    <div style={{ padding: "20px 0 60px" }}>
      <style>{CSS}</style>

      {/* ══ TOP STRIP ══════════════════════════════════════════════════════ */}
      <div className="ha1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 28 }}>
        {/* Hiring Gap */}
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderTop: "2px solid #ef4444", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Hiring Gap</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#ef4444", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{totalNeeded}</div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>позиций в активном поиске</div>
        </div>
        {/* Offer rate */}
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderTop: "2px solid #f97316", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Офферов принято</div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#f97316", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{offerRate}</div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>за всё время · закрыто {totalHired} ролей</div>
        </div>
        {/* Avg TTF */}
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderTop: "2px solid #818cf8", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Avg Time to Fill</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#818cf8", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{summary.avgTTF ?? "—"}</span>
            {summary.avgTTF && <span style={{ fontSize: 13, color: "var(--fg-3)" }}>дн.</span>}
          </div>
          <div style={{ fontSize: 11, color: summary.avgTTF > 60 ? "#f97316" : "#00c896", marginTop: 4 }}>
            {summary.avgTTF > 60 ? "⚠ выше целевых 60 дн." : "✓ в норме"}
          </div>
        </div>
        {/* Days in progress */}
        <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderTop: "2px solid #00c896", borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8, fontWeight: 600 }}>Avg в работе</div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#00c896", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>{summary.avgDaysInProgress ?? "—"}</span>
            {summary.avgDaysInProgress && <span style={{ fontSize: 13, color: "var(--fg-3)" }}>дн.</span>}
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 4 }}>среднее время на вакансию</div>
        </div>
      </div>

      {/* ══ PRIORITY ROLES + ПЕРСОНАЖ ══════════════════════════════════════ */}
      <div className="ha2" style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 0, marginBottom: 28, alignItems: "start" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>
            Активный поиск · {open.length} позиций
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {prioKeys.map(pk => {
              const tier = PRIO[pk] || PRIO["0"];
              const roles = byPrio[pk];
              return (
                <div key={pk} style={{ background: "var(--surface-1)", border: `1px solid var(--border)`, borderLeft: `3px solid ${tier.color}`, borderRadius: 10, overflow: "hidden" }}>
                  {/* Tier header */}
                  <div style={{ padding: "8px 14px", background: tier.bg, display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: tier.color, boxShadow: `0 0 6px ${tier.color}` }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: tier.color, textTransform: "uppercase", letterSpacing: 0.8 }}>{tier.label}</span>
                    <span style={{ fontSize: 11, color: "var(--fg-3)", marginLeft: "auto" }}>{roles.reduce((s,r) => s+(r.count||1), 0)} позиц.</span>
                  </div>
                  {/* Role rows */}
                  {roles.map((r, i) => (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "1fr auto auto",
                      alignItems: "center", gap: 12,
                      padding: "10px 14px",
                      borderTop: i > 0 ? "1px solid var(--border)" : undefined,
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg-0)" }}>{r.position}</div>
                        {r.comment && <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 1 }}>{r.comment}</div>}
                      </div>
                      {r.count > 1 && (
                        <div style={{ fontSize: 12, color: "var(--fg-3)", whiteSpace: "nowrap" }}>×{r.count}</div>
                      )}
                      <div>
                        {r.offers && r.offers.length > 0
                          ? <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 999, background: "#f9731618", color: "#f97316", fontWeight: 700, whiteSpace: "nowrap" }}>ОФФЕР</span>
                          : <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 999, background: "#00c89618", color: "#00c896", fontWeight: 700, whiteSpace: "nowrap" }}>В ПОИСКЕ</span>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Персонаж — рекрутер */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", paddingLeft: 12, marginTop: 30 }}>
          <img src={CHAR_RECRUITER} alt="" style={{ width: 180, height: "auto", filter: "drop-shadow(0 8px 24px rgba(0,200,150,0.18))", userSelect: "none" }} />
        </div>
      </div>

      {/* ══ PIPELINE FUNNEL + ПЕРСОНАЖ ═════════════════════════════════════ */}
      {funnel.length > 0 && (
        <div className="ha3" style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 0, marginBottom: 28, alignItems: "start" }}>
          {/* Персонаж — аналитик */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", paddingRight: 12, marginTop: 30 }}>
            <img src={CHAR_LAPTOP} alt="" style={{ width: 175, height: "auto", filter: "drop-shadow(0 8px 24px rgba(129,140,248,0.18))", userSelect: "none" }} />
          </div>

          <div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 14 }}>
              Воронка найма · avg {totalFunnelDays} дн. от заявки до оффера
            </div>
            <div style={{ background: "var(--surface-1)", border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 11 }}>
              {funnel.map((f, i) => {
                const pct = Math.round((f.avgDays / maxFunnelDays) * 100);
                // Цвет: чем дольше — тем краснее
                const hue = Math.round(145 - (pct / 100) * 100);
                const isBottleneck = f.avgDays >= 28;
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "155px 1fr 52px", alignItems: "center", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {isBottleneck && <span style={{ fontSize: 9, color: "#f97316" }}>▲</span>}
                      <span style={{ fontSize: 12, color: isBottleneck ? "var(--fg-1)" : "var(--fg-2)", fontWeight: isBottleneck ? 600 : 400, whiteSpace: "nowrap" }}>{f.stage}</span>
                    </div>
                    <div style={{ height: 7, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                      <div className="hgb" style={{
                        "--tw": `${pct}%`, height: "100%", width: `${pct}%`,
                        background: `hsl(${hue},70%,45%)`, borderRadius: 4
                      }} />
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: isBottleneck ? "#f97316" : "var(--fg-1)", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{f.avgDays} дн.</div>
                  </div>
                );
              })}
            </div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 8 }}>
              ▲ узкие места — стадии дольше 28 дн., замедляют весь процесс
            </div>
          </div>
        </div>
      )}

      {/* ══ ЗАКРЫТЫЕ НЕДАВНО ═══════════════════════════════════════════════ */}
      {closed.length > 0 && (
        <div className="ha4">
          <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>
            Закрытые позиции · {closed.length}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {closed.slice().reverse().map((p, i) => (
              <div key={i} style={{
                background: "var(--surface-1)", border: "1px solid var(--border)",
                borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8
              }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                <span style={{ fontSize: 12, color: "var(--fg-2)", fontWeight: 500 }}>{p.position}</span>
                {p.offers && p.offers.length > 0 && (
                  <span style={{ fontSize: 11, color: "var(--fg-3)" }}>→ {p.offers[0]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {updatedAt && (
        <div style={{ fontSize: 11, color: "var(--fg-3)", marginTop: 28, textAlign: "right" }}>
          обновлено {updatedAt} · Google Sheets + Huntflow
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  StatusPill, ProgressBar, KV, Chip, Card, SectionLabel,
  LeverCard, RoadmapStrip, FunnelStrip, CreoPipeline,
  CreoProduction, CreoTeam,
  StatTile, HealthDonut, CreoHero,
  HiringTab,
  STATUS_META, fmtDate
});
