// =============================================================================
// Guli Games tracker — App v2 (sidebar nav, dense overview grid, warmer chrome)
// =============================================================================
const { useState: useStateApp, useMemo: useMemoApp } = React;

const DATA = window.__GULI_DATA__;

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------
function Sidebar({ active, setActive, newCounts }) {
  const groups = [
    { title: "Активные направления", ids: ["overview", "stores", "webshops", "creo"] },
    { title: "В подготовке",          ids: ["ua", "monetization", "content", "team", "vendors"] }
  ];
  const all = [{ id: "overview", title: "Обзор", subtitle: "Сводка по компании" }, ...DATA.tabs];

  return (
    <aside style={{
      width: 240, flex: "0 0 240px",
      background: "var(--bg-1)",
      borderRight: "1px solid var(--line)",
      display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh"
    }}>
      <div style={{
        padding: "20px 20px 18px",
        borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", gap: 12
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "linear-gradient(135deg, var(--accent-amber), var(--accent-indigo))",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 4
        }}>
          <img src="assets/guli-logo.png" alt="Guli" style={{
            width: "100%", height: "100%", objectFit: "contain",
            filter: "brightness(0) invert(1)"
          }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg-0)", letterSpacing: -0.1 }}>
            Guli Games
          </div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", letterSpacing: 0.4 }}>
            Investor tracker
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
        {groups.map(g => (
          <div key={g.title} style={{ marginBottom: 18 }}>
            <div style={{
              fontSize: 10, color: "var(--fg-3)",
              textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600,
              padding: "0 8px 8px"
            }}>{g.title}</div>
            {g.ids.map(id => {
              const item = all.find(t => t.id === id);
              if (!item) return null;
              const isActive = active === id;
              const newN = newCounts[id] || 0;
              return (
                <button key={id} onClick={() => setActive(id)} style={{
                  width: "100%", textAlign: "left", cursor: "pointer", border: 0,
                  background: isActive ? "var(--bg-3)" : "transparent",
                  color: isActive ? "var(--fg-0)" : "var(--fg-2)",
                  padding: "9px 10px", borderRadius: 6,
                  display: "flex", alignItems: "center", gap: 10,
                  fontSize: 13, fontWeight: isActive ? 600 : 500,
                  marginBottom: 2,
                  borderLeft: isActive ? "2px solid var(--accent-amber)" : "2px solid transparent",
                  transition: "background 120ms"
                }}>
                  <span style={{ flex: 1 }}>{item.title}</span>
                  {item.placeholder && (
                    <span style={{
                      fontSize: 9, padding: "2px 5px", borderRadius: 3,
                      background: "rgba(255,255,255,0.05)", color: "var(--fg-3)",
                      letterSpacing: 0.4
                    }}>SOON</span>
                  )}
                  {newN > 0 && (
                    <span style={{
                      fontSize: 10, padding: "2px 6px", borderRadius: 999,
                      background: "var(--accent-emerald-soft)", color: "#86efac",
                      fontWeight: 700
                    }}>+{newN}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={{
        padding: 14, borderTop: "1px solid var(--line)",
        background: "rgba(0,0,0,0.2)"
      }}>
        <div style={{ fontSize: 10, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600, marginBottom: 4 }}>
          Период · последняя синхронизация
        </div>
        <div style={{ fontSize: 12.5, color: "var(--fg-0)", fontVariantNumeric: "tabular-nums" }}>
          {DATA.meta.reportPeriod}
        </div>
        <div style={{ fontSize: 11, color: "var(--fg-2)", fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
          {DATA.meta.lastSync}
        </div>
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Page header (sticky, contextual)
// ---------------------------------------------------------------------------
function PageHeader({ title, subtitle, right }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "20px 32px",
      borderBottom: "1px solid var(--line)",
      background: "rgba(14,16,20,0.85)", backdropFilter: "blur(8px)",
      position: "sticky", top: 0, zIndex: 10
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 600 }}>
          Guli Games · Legendale
        </div>
        <h1 style={{
          margin: "2px 0 0",
          fontSize: 22, fontWeight: 700,
          color: "var(--fg-0)", letterSpacing: -0.4
        }}>{title}</h1>
        {subtitle && (
          <div style={{ color: "var(--fg-2)", fontSize: 12.5, marginTop: 2 }}>{subtitle}</div>
        )}
      </div>
      {right}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Overview page — плотная сетка
// ---------------------------------------------------------------------------
function OverviewPage({ goToTab }) {
  // считаем здоровье портфеля
  const allLevers = DATA.tabs.flatMap(t => t.placeholder ? [] : t.levers);
  const counts = allLevers.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});
  const avgProgress = Math.round(
    allLevers.reduce((s, l) => s + (l.progress || 0), 0) / Math.max(1, allLevers.length)
  );

  const accentMap = {
    stores: "#f59e0b",
    webshops: "#34d399",
    creo: "#818cf8"
  };

  return (
    <div style={{ padding: "24px 32px 60px" }}>
      {/* Top KPI strip */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16
      }}>
        {DATA.kpis.map((k, i) => (
          <StatTile
            key={k.id}
            label={k.label}
            value={k.value}
            sub={k.sub}
            accent={["#f59e0b", "#34d399", "#818cf8", "#a78bfa"][i % 4]}
          />
        ))}
      </div>

      {/* Health + averages + recent updates row */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1.4fr",
        gap: 12, marginBottom: 16
      }}>
        <Card padding={16}>
          <SectionLabel>Здоровье портфеля</SectionLabel>
          <HealthDonut counts={counts} />
        </Card>

        <Card padding={16}>
          <SectionLabel>Средний прогресс</SectionLabel>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: "var(--fg-0)", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {avgProgress}%
            </div>
            <div style={{ fontSize: 12, color: "var(--fg-2)" }}>
              по {allLevers.length} рычагам
            </div>
          </div>
          <ProgressBar value={avgProgress} status="in_progress" height={8} />
          <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--fg-2)", lineHeight: 1.5 }}>
            Активных направлений: <b style={{ color: "var(--fg-0)" }}>3</b> ·
            в подготовке: <b style={{ color: "var(--fg-0)" }}>5</b>
          </div>
        </Card>

        <Card padding={16}>
          <SectionLabel right={<span style={{ fontSize: 11, color: "var(--fg-3)" }}>последние 5</span>}>
            Свежие обновления
          </SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {DATA.changelog.slice(0, 5).map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 12.5, lineHeight: 1.45 }}>
                <span style={{
                  fontSize: 10, color: "var(--fg-3)", fontVariantNumeric: "tabular-nums",
                  flex: "0 0 56px", paddingTop: 2
                }}>{fmtDate(c.date)}</span>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: accentMap[c.tab] || "var(--fg-3)",
                  flex: "0 0 6px", marginTop: 7
                }} />
                <span style={{ color: "var(--fg-1)", flex: 1, textWrap: "pretty" }}>{c.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Three direction cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16
      }}>
        {DATA.tabs.filter(t => !t.placeholder).map(t => {
          const accent = accentMap[t.id] || "#818cf8";
          const tCounts = t.levers.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});
          const tAvg = Math.round(t.levers.reduce((s, l) => s + (l.progress || 0), 0) / Math.max(1, t.levers.length));
          return (
            <button key={t.id} onClick={() => goToTab(t.id)} style={{
              textAlign: "left", cursor: "pointer", border: "1px solid var(--line)",
              background: `linear-gradient(135deg, ${accent}18 0%, transparent 45%), var(--bg-1)`,
              borderTop: `3px solid ${accent}`,
              borderRadius: 10, padding: 16, color: "inherit",
              transition: "border-color 150ms, transform 150ms"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontSize: 10.5, color: accent, textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 700 }}>
                  {t.title}
                </div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "var(--fg-0)", fontVariantNumeric: "tabular-nums" }}>
                  {tAvg}%
                </div>
              </div>
              <div style={{ fontSize: 13, color: "var(--fg-2)", marginBottom: 12 }}>{t.subtitle}</div>
              <ProgressBar value={tAvg} status="in_progress" height={4} />
              <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {Object.entries(tCounts).map(([k, v]) => {
                  const meta = STATUS_META[k];
                  return (
                    <span key={k} style={{
                      fontSize: 11, padding: "3px 8px", borderRadius: 4,
                      background: meta.bg, color: meta.fg,
                      border: `1px solid ${meta.border}`
                    }}>{meta.label}: <b>{v}</b></span>
                  );
                })}
              </div>
              <div style={{
                marginTop: 12, paddingTop: 12,
                borderTop: "1px solid var(--line)",
                fontSize: 11.5, color: "var(--fg-2)"
              }}>
                {t.levers.length} {t.levers.length === 1 ? "рычаг" : "рычагов"} · нажми, чтобы открыть →
              </div>
            </button>
          );
        })}
      </div>

      {/* Top-priority levers preview */}
      <Card padding={16}>
        <SectionLabel right={<span style={{ fontSize: 11, color: "var(--fg-3)" }}>самые активные · по дате обновления</span>}>
          Топ рычагов
        </SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {allLevers
            .filter(l => l.status === "in_progress" || l.status === "blocked")
            .slice(0, 4)
            .map(l => {
              const meta = STATUS_META[l.status];
              return (
                <div key={l.id} style={{
                  background: `linear-gradient(135deg, ${meta.bg} 0%, transparent 40%), var(--bg-2)`,
                  border: "1px solid var(--line)",
                  borderLeft: `3px solid ${meta.dot}`,
                  borderRadius: 8, padding: "12px 14px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg-0)" }}>{l.title}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: meta.fg, fontVariantNumeric: "tabular-nums" }}>{l.progress}%</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--fg-2)", marginBottom: 8, textWrap: "pretty" }}>{l.summary}</div>
                  <ProgressBar value={l.progress} status={l.status} />
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab page
// ---------------------------------------------------------------------------
function TabPage({ tab }) {
  const tCounts = tab.placeholder ? {} : tab.levers.reduce((acc, l) => { acc[l.status] = (acc[l.status] || 0) + 1; return acc; }, {});
  const tAvg = tab.placeholder ? 0 : Math.round(tab.levers.reduce((s, l) => s + (l.progress || 0), 0) / Math.max(1, tab.levers.length));

  return (
    <div style={{ padding: "24px 32px 60px" }}>
      {!tab.placeholder && tab.id !== "creo" && (
        <div style={{
          display: "grid", gridTemplateColumns: "1.1fr 0.9fr 1.4fr", gap: 12, marginBottom: 16
        }}>
          <StatTile
            label="Прогресс направления"
            value={`${tAvg}%`}
            sub={`по ${tab.levers.length} рычагам`}
            accent="#f59e0b"
          />
          <Card padding={14}>
            <SectionLabel>Статусы</SectionLabel>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {Object.entries(tCounts).map(([k, v]) => {
                const meta = STATUS_META[k];
                return (
                  <div key={k} style={{
                    padding: "6px 10px", borderRadius: 6,
                    background: meta.bg, border: `1px solid ${meta.border}`,
                    fontSize: 12, color: meta.fg, display: "flex", gap: 8, alignItems: "center"
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: meta.dot }} />
                    {meta.label} · <b style={{ fontVariantNumeric: "tabular-nums" }}>{v}</b>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card padding={14}>
            <SectionLabel>Контекст направления</SectionLabel>
            <div style={{ fontSize: 13, color: "var(--fg-1)", lineHeight: 1.5, textWrap: "pretty" }}>
              {tab.subtitle}. Карточки разворачиваются — внутри детали по шагам, рискам, ответственным и контрагентам.
            </div>
          </Card>
        </div>
      )}

      {tab.placeholder && (
        <Card padding={20} style={{ marginBottom: 16,
          borderStyle: "dashed", borderColor: "rgba(255,255,255,0.12)",
          background: "rgba(255,255,255,0.015)"
        }}>
          <div style={{ color: "var(--fg-0)", fontWeight: 600, fontSize: 14, marginBottom: 6 }}>
            Раздел в подготовке
          </div>
          <div style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.6 }}>
            Структура карточек заложена. Подключим источник (Google Sheets / Notion / Airtable) — данные начнут падать сюда автоматически.
          </div>
        </Card>
      )}

      {tab.id === "stores" && (
        <div style={{ marginBottom: 16 }}>
          <RoadmapStrip levers={tab.levers} />
        </div>
      )}
      {tab.id === "webshops" && (
        <div style={{ marginBottom: 16 }}>
          <FunnelStrip steps={[
            { label: "Visitors / неделя", value: 12400 },
            { label: "→ Add to cart",       value: 3120, hint: "25%" },
            { label: "→ Checkout open",    value: 1840, hint: "15%" },
            { label: "→ Paid",             value: 612,  hint: "4.9%" }
          ]} />
        </div>
      )}
      {tab.id === "creo" && (
        <React.Fragment>
          {tab.production && <CreoProduction data={tab.production} />}
          {tab.team && <CreoTeam team={tab.team} />}
        </React.Fragment>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {tab.levers.map((lev, i) => (
          <LeverCard key={lev.id} lever={lev} defaultOpen={i === 0 && !tab.placeholder} />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Changelog drawer
// ---------------------------------------------------------------------------
function ChangelogDrawer({ open, onClose, lastSeen, onMarkSeen }) {
  return (
    <>
      {open && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 50, backdropFilter: "blur(2px)"
        }} />
      )}
      <aside style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 420, background: "var(--bg-1)",
        borderLeft: "1px solid var(--line-2)",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 250ms cubic-bezier(.2,.8,.2,1)",
        zIndex: 60, display: "flex", flexDirection: "column"
      }}>
        <div style={{
          padding: "20px 24px", borderBottom: "1px solid var(--line)",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>
              Лог изменений
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg-0)", marginTop: 2 }}>
              Что обновилось
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "transparent", border: 0, cursor: "pointer",
            color: "var(--fg-2)", fontSize: 22, padding: 4
          }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 24px 24px" }}>
          {DATA.changelog.map((c, i) => {
            const isNew = !lastSeen || c.date > lastSeen;
            return (
              <div key={i} style={{
                padding: "14px 0", borderBottom: "1px solid var(--line)",
                display: "flex", gap: 12
              }}>
                <div style={{
                  flex: "0 0 8px", marginTop: 6,
                  width: 8, height: 8, borderRadius: "50%",
                  background: isNew ? "var(--accent-emerald)" : "rgba(255,255,255,0.15)",
                  boxShadow: isNew ? "0 0 8px var(--accent-emerald)" : "none"
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--fg-3)", fontVariantNumeric: "tabular-nums" }}>
                      {fmtDate(c.date)}
                    </span>
                    <Chip tone="neutral">{(DATA.tabs.find(t => t.id === c.tab) || {}).title || c.tab}</Chip>
                    {isNew && <Chip tone="success">NEW</Chip>}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--fg-1)", lineHeight: 1.5, textWrap: "pretty" }}>
                    {c.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: 16, borderTop: "1px solid var(--line)" }}>
          <button onClick={onMarkSeen} style={{
            width: "100%", padding: "10px 16px",
            background: "var(--accent-amber-soft)", color: "#fcd34d",
            border: "1px solid rgba(245,158,11,0.30)",
            borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600
          }}>
            Отметить всё как прочитанное
          </button>
        </div>
      </aside>
    </>
  );
}

function ChangelogButton({ unread, onClick }) {
  return (
    <button onClick={onClick} style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 40,
      padding: "11px 16px", borderRadius: 999,
      background: "linear-gradient(135deg, var(--accent-amber), #fb923c)",
      color: "#1a1208", border: 0, cursor: "pointer",
      fontSize: 13, fontWeight: 700,
      display: "inline-flex", alignItems: "center", gap: 10,
      boxShadow: "0 10px 30px rgba(245,158,11,0.3), 0 0 0 1px rgba(255,255,255,0.1)"
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path d="M3 3 H11 M3 7 H11 M3 11 H8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      Изменения
      {unread > 0 && (
        <span style={{
          background: "#1a1208", color: "var(--accent-amber)",
          borderRadius: 999, padding: "2px 7px",
          fontSize: 11, fontWeight: 800
        }}>{unread}</span>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
function App() {
  const [active, setActive] = useStateApp("overview");
  const [drawerOpen, setDrawerOpen] = useStateApp(false);
  const [lastSeen, setLastSeen] = useStateApp(() => {
    try { return localStorage.getItem("guli_last_seen") || ""; }
    catch (e) { return ""; }
  });

  const newCounts = useMemoApp(() => {
    const map = {};
    DATA.changelog.forEach(c => {
      if (!lastSeen || c.date > lastSeen) {
        map[c.tab] = (map[c.tab] || 0) + 1;
      }
    });
    return map;
  }, [lastSeen]);

  const totalUnread = Object.values(newCounts).reduce((a, b) => a + b, 0);

  function markSeen() {
    const today = new Date().toISOString().slice(0, 10);
    try { localStorage.setItem("guli_last_seen", today); } catch (e) {}
    setLastSeen(today);
  }

  const tab = DATA.tabs.find(t => t.id === active);
  const isOverview = active === "overview";

  const headerTitle = isOverview ? "Обзор" : (tab?.title || "—");
  const headerSub = isOverview
    ? "Сводка по компании · ключевые рычаги влияния на проект"
    : (tab?.subtitle || "");

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-0)" }}>
      <Sidebar active={active} setActive={setActive} newCounts={newCounts} />
      <main style={{ flex: 1, minWidth: 0 }}>
        <PageHeader
          title={headerTitle}
          subtitle={headerSub}
          right={
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setDrawerOpen(true)} style={{
                padding: "8px 14px", borderRadius: 7,
                background: "var(--bg-2)", color: "var(--fg-1)",
                border: "1px solid var(--line-2)", cursor: "pointer",
                fontSize: 12.5, fontWeight: 500,
                display: "inline-flex", alignItems: "center", gap: 8
              }}>
                Изменения
                {totalUnread > 0 && (
                  <span style={{
                    background: "var(--accent-emerald-soft)", color: "#86efac",
                    borderRadius: 999, padding: "1px 7px",
                    fontSize: 11, fontWeight: 700
                  }}>+{totalUnread}</span>
                )}
              </button>
            </div>
          }
        />
        {isOverview ? <OverviewPage goToTab={setActive} /> : <TabPage tab={tab} />}

        <footer style={{
          padding: "20px 32px", borderTop: "1px solid var(--line)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          color: "var(--fg-3)", fontSize: 11, letterSpacing: 0.3
        }}>
          <span>{DATA.meta.investorNote}</span>
          <span>Источник: статичный JSON · хуки на Sheets/Notion/Airtable — следующий шаг</span>
        </footer>
      </main>

      <ChangelogDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        lastSeen={lastSeen}
        onMarkSeen={markSeen}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
