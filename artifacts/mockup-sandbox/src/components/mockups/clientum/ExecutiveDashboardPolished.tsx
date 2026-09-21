import React, { useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  CircleDollarSign,
  Clock3,
  Command,
  Filter,
  LayoutDashboard,
  Mail,
  MoreHorizontal,
  PanelLeftClose,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Target,
  UsersRound,
  Zap,
} from "lucide-react";
import "./ExecutiveDashboardPolished.css";

type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number }>;

const navItems: Array<{ label: string; icon: IconComponent; count?: string }> = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Inbox", icon: Mail, count: "12" },
  { label: "Contacts", icon: UsersRound },
  { label: "Pipeline", icon: BriefcaseBusiness },
  { label: "Calendar", icon: CalendarDays },
  { label: "Reports", icon: BarChart3 },
];

const kpis = [
  { label: "Pipeline value", value: "$284.6k", note: "+12.4%", detail: "vs last month", icon: CircleDollarSign, highlight: true },
  { label: "Won this month", value: "$74.2k", note: "+8.7%", detail: "8 deals closed", icon: Target },
  { label: "Open opportunities", value: "47", note: "+6", detail: "since Monday", icon: BriefcaseBusiness },
  { label: "Avg. sales cycle", value: "18.4d", note: "-2.1d", detail: "faster than Q2", icon: Clock3 },
];

const pipeline = [
  { label: "Discovery", value: "$58.4k", width: "31%", color: "#82aeea" },
  { label: "Qualified", value: "$91.8k", width: "49%", color: "#a895e8" },
  { label: "Proposal", value: "$76.2k", width: "41%", color: "#f3b661" },
  { label: "Negotiation", value: "$42.6k", width: "23%", color: "#ed897f" },
  { label: "Won", value: "$74.2k", width: "39%", color: "#36d2b4" },
];

const attentionItems = [
  { title: "Northstar Health", detail: "Proposal viewed 3 times · 2h ago", icon: CircleAlert, coral: false },
  { title: "Luma Facilities", detail: "No reply after your follow-up · 1d", icon: Clock3, coral: true },
  { title: "Ridgeway Labs", detail: "Contract ready for signature · today", icon: CheckCircle2, coral: false },
];

const activityRows = [
  { initials: "NL", name: "Northstar Health", action: "Proposal moved to negotiation", status: "On track", time: "11 min ago" },
  { initials: "RF", name: "Ridgeway Foods", action: "Deal marked as won", status: "Closed won", time: "42 min ago" },
  { initials: "LM", name: "Luma Facilities", action: "Follow-up task created", status: "Needs reply", time: "1h ago" },
  { initials: "AV", name: "Avenue Retail", action: "Contact added by Maya", status: "New lead", time: "2h ago" },
];

export function ExecutiveDashboardPolished() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [range, setRange] = useState("Last 30 days");
  const [toast, setToast] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  const visibleActivities = activityRows.filter((row) =>
    `${row.name} ${row.action}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="cpd-shell">
      <div className="cpd-app">
        <aside className="cpd-sidebar">
          <div className="cpd-brand">
            <div className="cpd-brand-mark">
              <Zap size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="cpd-brand-name">clientum</div>
              <div className="cpd-brand-sub">revenue workspace</div>
            </div>
          </div>

          <nav className="cpd-nav" aria-label="Main navigation">
            <div className="cpd-nav-label">Workspace</div>
            {navItems.map(({ label, icon: Icon, count }) => (
              <button
                className={`cpd-nav-button ${activeNav === label ? "is-active" : ""}`}
                key={label}
                onClick={() => {
                  setActiveNav(label);
                  notify(`${label} view selected`);
                }}
                type="button"
              >
                <Icon size={15} strokeWidth={1.8} />
                <span>{label}</span>
                {count ? <span className="cpd-nav-count">{count}</span> : null}
              </button>
            ))}
            <div className="cpd-nav-label" style={{ marginTop: 25 }}>Manage</div>
            <button className="cpd-nav-button" onClick={() => notify("Automation settings opened")} type="button">
              <Settings2 size={15} strokeWidth={1.8} />
              <span>Automations</span>
            </button>
            <button className="cpd-nav-button" onClick={() => notify("Team settings opened")} type="button">
              <PanelLeftClose size={15} strokeWidth={1.8} />
              <span>Workspace settings</span>
            </button>
          </nav>

          <div className="cpd-sidebar-foot">
            <div className="cpd-sidebar-foot-row">
              <div className="cpd-avatar">MC</div>
              <div>
                <div className="cpd-user-name">Maya Chen</div>
                <div className="cpd-user-role">Revenue lead</div>
              </div>
              <button
                aria-label="Open user menu"
                className="cpd-top-icon"
                onClick={() => notify("Account menu opened")}
                style={{ marginLeft: "auto", width: 26, height: 26, border: 0, background: "transparent" }}
                type="button"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </aside>

        <main className="cpd-main">
          <header className="cpd-topbar">
            <div className="cpd-breadcrumb">
              <span>Workspace</span>
              <span>/</span>
              <strong>{activeNav}</strong>
            </div>
            <div className="cpd-top-actions">
              <label className="cpd-search">
                <Search size={14} />
                <input
                  aria-label="Search activity"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search workspace"
                  value={search}
                />
                <span className="cpd-key"><Command size={9} /></span>
              </label>
              <button aria-label="View notifications" className="cpd-top-icon" onClick={() => notify("You’re all caught up")} type="button">
                <Bell size={15} strokeWidth={1.8} />
              </button>
              <button aria-label="Create new item" className="cpd-top-add" onClick={() => notify("New opportunity draft started")} type="button">
                <Plus size={16} strokeWidth={2.3} />
              </button>
            </div>
          </header>

          <div className="cpd-content">
            <div className="cpd-header">
              <div>
                <div className="cpd-eyebrow"><span className="cpd-live-dot" /> Live revenue pulse</div>
                <h1 className="cpd-title">Good morning, Maya.</h1>
                <div className="cpd-subtitle">Here’s what moved while you were away.</div>
              </div>
              <div className="cpd-header-actions">
                <button className="cpd-select" onClick={() => setCollapsed(!collapsed)} type="button">
                  <Filter size={13} />
                  {collapsed ? "Compact view" : "Full view"}
                  <ChevronDown size={12} />
                </button>
                <button className="cpd-primary-button" onClick={() => notify("Opportunity form ready")} type="button">
                  <Plus size={13} />
                  New opportunity
                </button>
              </div>
            </div>

            <section aria-label="Key performance indicators" className="cpd-kpis">
              {kpis.map(({ label, value, note, detail, icon: Icon, highlight }) => (
                <article className={`cpd-kpi ${highlight ? "is-highlight" : ""}`} key={label}>
                  <div className="cpd-kpi-top">
                    <span>{label}</span>
                    <div className="cpd-kpi-icon"><Icon size={14} strokeWidth={1.8} /></div>
                  </div>
                  <strong className="cpd-kpi-value">{value}</strong>
                  <div className="cpd-kpi-note"><ArrowUpRight size={11} /> {note} <span>{detail}</span></div>
                </article>
              ))}
            </section>

            <div className="cpd-grid">
              <section className="cpd-panel">
                <div className="cpd-panel-head">
                  <div>
                    <div className="cpd-panel-title">Revenue movement</div>
                    <div className="cpd-panel-meta">Won revenue against your monthly target</div>
                  </div>
                  <button className="cpd-select" onClick={() => setRange(range === "Last 30 days" ? "Last 90 days" : "Last 30 days")} type="button">
                    {range}<ChevronDown size={11} />
                  </button>
                </div>
                <div className="cpd-chart-wrap">
                  <div className="cpd-chart-summary">
                    <div className="cpd-chart-total">$74.2k <small>+8.7%</small></div>
                    <div className="cpd-legend">
                      <span className="cpd-legend-item"><span className="cpd-legend-dot" style={{ background: "#36d2b4" }} /> Won</span>
                      <span className="cpd-legend-item"><span className="cpd-legend-dot" style={{ background: "#71818d" }} /> Target</span>
                    </div>
                  </div>
                  <svg aria-label="Revenue line chart" className="cpd-chart" role="img" viewBox="0 0 700 186">
                    <defs>
                      <linearGradient id="cpd-area" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#36d2b4" stopOpacity=".22" />
                        <stop offset="100%" stopColor="#36d2b4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[26, 66, 106, 146].map((y) => <line className="cpd-chart-grid" key={y} x1="0" x2="700" y1={y} y2={y} />)}
                    <path className="cpd-chart-area" d="M0 138 C55 134 76 116 128 120 S197 105 245 108 S304 74 350 84 S408 64 452 70 S522 47 560 53 S628 32 700 38 L700 170 L0 170 Z" />
                    <path className="cpd-chart-line" d="M0 138 C55 134 76 116 128 120 S197 105 245 108 S304 74 350 84 S408 64 452 70 S522 47 560 53 S628 32 700 38" />
                    {[0, 128, 245, 350, 452, 560, 700].map((x, index) => {
                      const y = [138, 120, 108, 84, 70, 53, 38][index];
                      return <circle className="cpd-chart-point" cx={x} cy={y} key={x} r="4" />;
                    })}
                    {["Jun 03", "Jun 10", "Jun 17", "Jun 24", "Jul 01", "Jul 08", "Today"].map((label, index) => (
                      <text className="cpd-chart-label" key={label} textAnchor={index === 0 ? "start" : index === 6 ? "end" : "middle"} x={[0, 128, 245, 350, 452, 560, 700][index]} y="184">{label}</text>
                    ))}
                  </svg>
                </div>
                <div className="cpd-pipeline">
                  {pipeline.map(({ label, value, width, color }) => (
                    <div className="cpd-pipeline-row" key={label}>
                      <div className="cpd-stage"><span className="cpd-stage-dot" style={{ background: color }} />{label}</div>
                      <div className="cpd-bar" style={{ "--bar-color": color } as React.CSSProperties}><span style={{ width }} /></div>
                      <div className="cpd-pipeline-value">{value}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="cpd-panel cpd-attention">
                <div className="cpd-panel-head">
                  <div>
                    <div className="cpd-panel-title">Needs attention</div>
                    <div className="cpd-panel-meta">Three moments worth your next hour</div>
                  </div>
                  <button aria-label="More attention options" className="cpd-panel-link" onClick={() => notify("Attention queue refreshed")} type="button"><MoreHorizontal size={16} /></button>
                </div>
                <div className="cpd-attention-list">
                  {attentionItems.map(({ title, detail, icon: Icon, coral }) => (
                    <div className="cpd-attention-item" key={title}>
                      <div className={`cpd-attention-icon ${coral ? "is-coral" : ""}`}><Icon size={14} strokeWidth={1.8} /></div>
                      <div className="cpd-attention-copy"><strong>{title}</strong><span>{detail}</span></div>
                      <button aria-label={`Open ${title}`} className="cpd-attention-action" onClick={() => notify(`${title} opened`)} type="button"><ArrowUpRight size={13} /></button>
                    </div>
                  ))}
                </div>
                <div style={{ margin: "auto 17px 16px", padding: "13px", border: "1px solid rgba(54, 210, 180, .18)", borderRadius: 10, background: "rgba(54, 210, 180, .06)" }}>
                  <div className="cpd-eyebrow" style={{ fontSize: 8 }}><Sparkles size={12} /> Signal from copilot</div>
                  <p style={{ margin: "9px 0 10px", color: "var(--cpd-ink-soft)", fontSize: 10, lineHeight: 1.55 }}>Your win rate is strongest when first follow-up lands within 24 hours.</p>
                  <button className="cpd-panel-link" onClick={() => notify("Follow-up playbook opened")} type="button">View playbook <ArrowUpRight size={11} /></button>
                </div>
              </section>

              <section className="cpd-panel cpd-activity">
                <div className="cpd-panel-head">
                  <div>
                    <div className="cpd-panel-title">Recent activity</div>
                    <div className="cpd-panel-meta">{visibleActivities.length} updates across your workspace</div>
                  </div>
                  <button className="cpd-panel-link" onClick={() => notify("All activity opened")} type="button">View all <ArrowUpRight size={11} /></button>
                </div>
                {visibleActivities.length ? (
                  <table className="cpd-activity-table">
                    <thead><tr><th>Account</th><th>Activity</th><th>Status</th><th>When</th></tr></thead>
                    <tbody>
                      {visibleActivities.map(({ initials, name, action, status, time }) => (
                        <tr key={name}>
                          <td><div className="cpd-contact"><span className="cpd-contact-avatar">{initials}</span>{name}</div></td>
                          <td>{action}</td>
                          <td><span className="cpd-status"><span className="cpd-status-dot" />{status}</span></td>
                          <td>{time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div style={{ display: "grid", minHeight: 120, placeItems: "center", color: "var(--cpd-ink-faint)", fontSize: 10 }}>
                    No activity matches “{search}”.
                  </div>
                )}
              </section>
            </div>
          </div>
        </main>
      </div>
      {toast ? <div className="cpd-toast"><Check size={14} />{toast}</div> : null}
    </div>
  );
}

export default ExecutiveDashboardPolished;