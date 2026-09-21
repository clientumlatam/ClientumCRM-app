import React, { useMemo, useState } from 'react';
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
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Activity, ActiveTab, Opportunity, StageId } from '../../types';
import { STAGES } from '../../data/initialData';
import './ExecutiveDashboardPolished.css';

type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number }>;

const navItems: Array<{ label: string; icon: IconComponent; tab: ActiveTab; count?: string }> = [
  { label: 'Overview', icon: LayoutDashboard, tab: 'dashboard' },
  { label: 'Inbox', icon: Mail, tab: 'activityInbox' },
  { label: 'Contacts', icon: UsersRound, tab: 'people' },
  { label: 'Pipeline', icon: BriefcaseBusiness, tab: 'opportunities' },
  { label: 'Calendar', icon: CalendarDays, tab: 'calendar' },
  { label: 'Reports', icon: BarChart3, tab: 'analytics' },
];

const stageColors: Record<string, string> = {
  lead: '#82aeea',
  discovery: '#36d2b4',
  qualified: '#a895e8',
  proposal: '#f3b661',
  negotiation: '#ed897f',
  won: '#36d2b4',
  lost: '#71818d',
};

const money = (amount: number) =>
  `$ ${Math.round(amount).toLocaleString('es-AR')}`;

const compactMoney = (amount: number) => {
  if (amount >= 1_000_000) return `$ ${(amount / 1_000_000).toFixed(1).replace('.', ',')} M`;
  if (amount >= 1_000) return `$ ${(amount / 1_000).toFixed(0)} mil`;
  return money(amount);
};

const dateOnly = (value: string) => new Date(`${value.slice(0, 10)}T00:00:00`);

const getInitials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

const relativeTime = (value: string) => {
  const delta = Date.now() - new Date(value).getTime();
  const minutes = Math.round(delta / 60000);
  if (minutes < 1) return 'ahora';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.round(hours / 24);
  return `hace ${days} d`;
};

const getStageLabel = (stage: StageId) =>
  STAGES.find((config) => config.id === stage)?.name || stage;

type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  icon: IconComponent;
  coral: boolean;
  tab: ActiveTab;
  record?: { type: 'opportunity' | 'task'; id: string };
};

export const ExecutiveDashboardPolished: React.FC = () => {
  const {
    activeTab,
    opportunities,
    companies,
    people,
    tasks,
    activities,
    currentUser,
    setActiveTab,
    setSelectedRecord,
    openNewRecordModal,
    showToast,
    isOnline,
    isSyncPending,
  } = useCRM();

  const [search, setSearch] = useState('');
  const [rangeDays, setRangeDays] = useState<30 | 90>(30);
  const [toast, setToast] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const notify = (message: string) => {
    setToast(message);
    showToast(message, 'info');
    window.setTimeout(() => setToast(''), 2400);
  };

  const activeDeals = useMemo(
    () => opportunities.filter(({ stage }) => stage !== 'won' && stage !== 'lost'),
    [opportunities],
  );
  const wonDeals = useMemo(
    () => opportunities.filter(({ stage }) => stage === 'won'),
    [opportunities],
  );
  const decidedDeals = useMemo(
    () => opportunities.filter(({ stage }) => stage === 'won' || stage === 'lost'),
    [opportunities],
  );
  const pipelineTotal = activeDeals.reduce((total, deal) => total + deal.amount, 0);
  const wonTotal = wonDeals.reduce((total, deal) => total + deal.amount, 0);
  const weightedPipeline = activeDeals.reduce(
    (total, deal) => total + deal.amount * (deal.probability / 100),
    0,
  );
  const winRate = decidedDeals.length
    ? Math.round((wonDeals.length / decidedDeals.length) * 1000) / 10
    : null;
  const averageCycleDays = opportunities.length
    ? Math.round(
        opportunities.reduce((total, opportunity) => {
          const days =
            (dateOnly(opportunity.closeDate).getTime() -
              dateOnly(opportunity.createdAt).getTime()) /
            86400000;
          return total + Math.max(0, days);
        }, 0) / opportunities.length,
      )
    : null;

  const overdueTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return tasks.filter(
      (task) => task.status !== 'Completed' && dateOnly(task.dueDate) <= today,
    );
  }, [tasks]);

  const staleOpportunities = useMemo(() => {
    const now = Date.now();
    return activeDeals
      .filter(
        (deal) =>
          (now - new Date(deal.updatedAt || deal.createdAt).getTime()) / 86400000 >= 1,
      )
      .sort((left, right) => right.amount - left.amount);
  }, [activeDeals]);

  const pipeline = useMemo(
    () =>
      STAGES.filter(({ id }) => id !== 'lost').map((stage) => {
        const value = opportunities
          .filter((deal) => deal.stage === stage.id)
          .reduce((total, deal) => total + deal.amount, 0);
        return { ...stage, value };
      }),
    [opportunities],
  );
  const maxPipelineStage = Math.max(...pipeline.map(({ value }) => value), 1);

  const attentionItems = useMemo<AttentionItem[]>(() => {
    const taskItems: AttentionItem[] = overdueTasks.slice(0, 2).map((task) => ({
      id: `task-${task.id}`,
      title: task.targetName || task.title,
      detail: `Tarea vencida · ${task.dueDate.slice(0, 10)}`,
      icon: CircleAlert,
      coral: true,
      tab: 'tasks',
      record: { type: 'task', id: task.id },
    }));
    const staleItems: AttentionItem[] = staleOpportunities
      .slice(0, Math.max(0, 3 - taskItems.length))
      .map((deal) => ({
        id: `deal-${deal.id}`,
        title: deal.companyName || deal.name,
        detail: `Sin seguimiento reciente · ${compactMoney(deal.amount)}`,
        icon: Clock3,
        coral: false,
        tab: 'opportunities',
        record: { type: 'opportunity', id: deal.id },
      }));
    return [...taskItems, ...staleItems];
  }, [overdueTasks, staleOpportunities]);

  const revenueTrend = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - rangeDays);
    const buckets = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + Math.round((rangeDays * index) / 6));
      return {
        label: date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
        value: 0,
      };
    });

    wonDeals.forEach((deal) => {
      const closeDate = dateOnly(deal.closeDate);
      if (closeDate < start || closeDate > end) return;
      const position = Math.min(
        6,
        Math.max(0, Math.round(((closeDate.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 6)),
      );
      buckets[position].value += deal.amount;
    });
    return buckets;
  }, [rangeDays, wonDeals]);

  const chartMax = Math.max(...revenueTrend.map(({ value }) => value), 1);
  const chartPoints = revenueTrend.map(({ value }, index) => ({
    x: (index / Math.max(revenueTrend.length - 1, 1)) * 700,
    y: 150 - (value / chartMax) * 112,
  }));
  const chartLine = chartPoints.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
  const chartArea = chartLine ? `${chartLine} L700 170 L0 170 Z` : '';

  const activityRows = useMemo(
    () =>
      activities
        .slice()
        .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
        .slice(0, 8)
        .map((activity: Activity) => {
          const target =
            opportunities.find((deal) => deal.id === activity.targetId) ||
            companies.find((company) => company.id === activity.targetId) ||
            people.find((person) => person.id === activity.targetId);
          const targetName = target && 'name' in target ? target.name : undefined;
          const targetCompanyName = target && 'companyName' in target ? target.companyName : undefined;
          const name = targetName || targetCompanyName || activity.title;
          return {
            id: activity.id,
            initials: getInitials(String(name)),
            name: String(name),
            action: activity.title,
            status: activity.type === 'stage_change' ? 'Stage updated' : activity.type,
            time: relativeTime(activity.createdAt),
          };
        }),
    [activities, companies, opportunities, people],
  );

  const visibleActivities = activityRows.filter((row) =>
    `${row.name} ${row.action} ${row.status}`.toLowerCase().includes(search.toLowerCase()),
  );

  const activeNav = navItems.find(({ tab }) => tab === activeTab)?.label || 'Overview';
  const userName = currentUser?.name || 'Equipo Clientum';
  const userRole = currentUser?.role || 'Revenue workspace';

  const handleNav = (label: string, tab: ActiveTab) => {
    setActiveTab(tab);
    notify(`${label} seleccionado`);
  };

  const openAttentionItem = (item: AttentionItem) => {
    setActiveTab(item.tab);
    if (item.record) setSelectedRecord(item.record);
    notify(`${item.title} abierto`);
  };

  return (
    <div className={`cpd-shell ${collapsed ? 'is-compact' : ''}`}>
      <div className="cpd-app">
        <aside className="cpd-sidebar">
          <div className="cpd-brand">
            <div className="cpd-brand-mark"><Zap size={16} strokeWidth={2.5} /></div>
            <div>
              <div className="cpd-brand-name">clientum</div>
              <div className="cpd-brand-sub">revenue workspace</div>
            </div>
          </div>

          <nav className="cpd-nav" aria-label="Navegación principal">
            <div className="cpd-nav-label">Workspace</div>
            {navItems.map(({ label, icon: Icon, tab, count }) => (
              <button
                className={`cpd-nav-button ${activeNav === label ? 'is-active' : ''}`}
                key={label}
                onClick={() => handleNav(label, tab)}
                type="button"
              >
                <Icon size={15} strokeWidth={1.8} />
                <span>{label}</span>
                {count ? <span className="cpd-nav-count">{count}</span> : null}
              </button>
            ))}
            <div className="cpd-nav-label cpd-nav-label-manage">Manage</div>
            <button className="cpd-nav-button" onClick={() => handleNav('Automations', 'automation')} type="button">
              <Settings2 size={15} strokeWidth={1.8} />
              <span>Automations</span>
            </button>
            <button className="cpd-nav-button" onClick={() => handleNav('Settings', 'settings')} type="button">
              <PanelLeftClose size={15} strokeWidth={1.8} />
              <span>Workspace settings</span>
            </button>
          </nav>

          <div className="cpd-sidebar-foot">
            <div className="cpd-sidebar-foot-row">
              <div className="cpd-avatar">{getInitials(userName)}</div>
              <div>
                <div className="cpd-user-name">{userName}</div>
                <div className="cpd-user-role">{userRole}</div>
              </div>
              <button aria-label="Abrir menú de usuario" className="cpd-top-icon cpd-user-menu" onClick={() => notify('Menú de cuenta abierto')} type="button">
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </aside>

        <main className="cpd-main">
          <header className="cpd-topbar">
            <div className="cpd-breadcrumb"><span>Workspace</span><span>/</span><strong>{activeNav}</strong></div>
            <div className="cpd-top-actions">
              <label className="cpd-search">
                <Search size={14} />
                <input aria-label="Buscar actividad" onChange={(event) => setSearch(event.target.value)} placeholder="Buscar workspace" value={search} />
                <span className="cpd-key"><Command size={9} /></span>
              </label>
              <button aria-label="Ver notificaciones" className="cpd-top-icon" onClick={() => handleNav('Inbox', 'activityInbox')} type="button">
                <Bell size={15} strokeWidth={1.8} />
              </button>
              <button aria-label="Crear nuevo trato" className="cpd-top-add" onClick={() => openNewRecordModal('opportunity')} type="button">
                <Plus size={16} strokeWidth={2.3} />
              </button>
            </div>
          </header>

          <div className="cpd-content">
            <div className="cpd-header">
              <div>
                <div className="cpd-eyebrow">
                  <span className={`cpd-live-dot ${!isOnline || isSyncPending ? 'is-warning' : ''}`} />
                  {isSyncPending ? 'Sync en progreso' : isOnline ? 'Live revenue pulse' : 'Modo offline'}
                </div>
                <h1 className="cpd-title">Buen día, {userName.split(' ')[0]}.</h1>
                <div className="cpd-subtitle">Esto es lo que se movió en tu workspace.</div>
              </div>
              <div className="cpd-header-actions">
                <button className="cpd-select" onClick={() => setCollapsed(!collapsed)} type="button">
                  <Filter size={13} /> {collapsed ? 'Vista completa' : 'Vista compacta'} <ChevronDown size={12} />
                </button>
                <button className="cpd-primary-button" onClick={() => openNewRecordModal('opportunity')} type="button">
                  <Plus size={13} /> Nuevo trato
                </button>
              </div>
            </div>

            <section aria-label="Indicadores clave" className="cpd-kpis">
              {[
                { label: 'Pipeline activo', value: compactMoney(pipelineTotal), note: compactMoney(Math.round(weightedPipeline)), detail: 'ponderado', icon: CircleDollarSign, highlight: true },
                { label: 'Ganado', value: compactMoney(wonTotal), note: String(wonDeals.length), detail: 'negocios cerrados', icon: Target },
                { label: 'Oportunidades abiertas', value: String(activeDeals.length), note: String(decidedDeals.length), detail: 'decididas', icon: BriefcaseBusiness },
                { label: 'Ciclo promedio', value: averageCycleDays === null ? '—' : `${averageCycleDays}d`, note: overdueTasks.length ? String(overdueTasks.length) : '0', detail: 'tareas vencidas', icon: Clock3 },
              ].map(({ label, value, note, detail, icon: Icon, highlight }) => (
                <article className={`cpd-kpi ${highlight ? 'is-highlight' : ''}`} key={label}>
                  <div className="cpd-kpi-top"><span>{label}</span><div className="cpd-kpi-icon"><Icon size={14} strokeWidth={1.8} /></div></div>
                  <strong className="cpd-kpi-value">{value}</strong>
                  <div className="cpd-kpi-note"><ArrowUpRight size={11} /> {note} <span>{detail}</span></div>
                </article>
              ))}
            </section>

            <div className="cpd-grid">
              <section className="cpd-panel">
                <div className="cpd-panel-head">
                  <div><div className="cpd-panel-title">Movimiento de ingresos</div><div className="cpd-panel-meta">Negocios ganados en el período seleccionado</div></div>
                  <button className="cpd-select" onClick={() => setRangeDays(rangeDays === 30 ? 90 : 30)} type="button">
                    Últimos {rangeDays} días <ChevronDown size={11} />
                  </button>
                </div>
                <div className="cpd-chart-wrap">
                  <div className="cpd-chart-summary">
                    <div className="cpd-chart-total">{compactMoney(wonTotal)} <small>{winRate === null ? 'Sin datos decididos' : `${winRate}% win rate`}</small></div>
                    <div className="cpd-legend"><span className="cpd-legend-item"><span className="cpd-legend-dot" style={{ background: '#36d2b4' }} /> Ganado</span><span className="cpd-legend-item"><span className="cpd-legend-dot" style={{ background: '#71818d' }} /> Período</span></div>
                  </div>
                  {wonTotal > 0 ? (
                    <svg aria-label="Evolución de ingresos ganados" className="cpd-chart" role="img" viewBox="0 0 700 186">
                      <defs><linearGradient id="cpd-area" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#36d2b4" stopOpacity=".22" /><stop offset="100%" stopColor="#36d2b4" stopOpacity="0" /></linearGradient></defs>
                      {[26, 66, 106, 146].map((y) => <line className="cpd-chart-grid" key={y} x1="0" x2="700" y1={y} y2={y} />)}
                      <path className="cpd-chart-area" d={chartArea} />
                      <path className="cpd-chart-line" d={chartLine} />
                      {chartPoints.map(({ x, y }) => <circle className="cpd-chart-point" cx={x} cy={y} key={x} r="4" />)}
                      {revenueTrend.map(({ label }, index) => <text className="cpd-chart-label" key={`${label}-${index}`} textAnchor={index === 0 ? 'start' : index === 6 ? 'end' : 'middle'} x={chartPoints[index].x} y="184">{label}</text>)}
                    </svg>
                  ) : (
                    <div className="cpd-empty-chart"><CircleDollarSign size={17} /> Todavía no hay negocios ganados en este período.</div>
                  )}
                </div>
                <div className="cpd-pipeline">
                  {pipeline.map(({ id, name, value }) => (
                    <div className="cpd-pipeline-row" key={id}>
                      <div className="cpd-stage"><span className="cpd-stage-dot" style={{ background: stageColors[id] || '#82aeea' }} />{name}</div>
                      <div className="cpd-bar" style={{ '--bar-color': stageColors[id] || '#82aeea' } as React.CSSProperties}><span style={{ width: `${Math.max(value ? 8 : 0, (value / maxPipelineStage) * 100)}%` }} /></div>
                      <div className="cpd-pipeline-value">{compactMoney(value)}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="cpd-panel cpd-attention">
                <div className="cpd-panel-head">
                  <div><div className="cpd-panel-title">Necesita atención</div><div className="cpd-panel-meta">{overdueTasks.length} tareas vencidas · {staleOpportunities.length} negocios sin seguimiento</div></div>
                  <button aria-label="Actualizar cola de atención" className="cpd-panel-link" onClick={() => notify('Cola de atención actualizada')}><MoreHorizontal size={16} /></button>
                </div>
                <div className="cpd-attention-list">
                  {attentionItems.length ? attentionItems.map((item) => {
                    const Icon = item.icon;
                    return <div className="cpd-attention-item" key={item.id}><div className={`cpd-attention-icon ${item.coral ? 'is-coral' : ''}`}><Icon size={14} strokeWidth={1.8} /></div><div className="cpd-attention-copy"><strong>{item.title}</strong><span>{item.detail}</span></div><button aria-label={`Abrir ${item.title}`} className="cpd-attention-action" onClick={() => openAttentionItem(item)}><ArrowUpRight size={13} /></button></div>;
                  }) : <div className="cpd-empty-attention"><CheckCircle2 size={17} /> Todo está al día.</div>}
                </div>
                <div className="cpd-signal"><div className="cpd-eyebrow" style={{ fontSize: 8 }}><Sparkles size={12} /> Señal del copilot</div><p>Revisá primero los negocios con mayor monto y más días sin contacto.</p><button className="cpd-panel-link" onClick={() => handleNav('Pipeline', 'opportunities')}>Abrir pipeline <ArrowUpRight size={11} /></button></div>
              </section>

              <section className="cpd-panel cpd-activity">
                <div className="cpd-panel-head"><div><div className="cpd-panel-title">Actividad reciente</div><div className="cpd-panel-meta">{visibleActivities.length} actualizaciones en tu workspace</div></div><button className="cpd-panel-link" onClick={() => handleNav('Inbox', 'activityInbox')}>Ver todo <ArrowUpRight size={11} /></button></div>
                {visibleActivities.length ? (
                  <div className="cpd-activity-scroll"><table className="cpd-activity-table"><thead><tr><th>Cuenta</th><th>Actividad</th><th>Estado</th><th>Cuándo</th></tr></thead><tbody>{visibleActivities.map(({ id, initials, name, action, status, time }) => <tr key={id}><td><div className="cpd-contact"><span className="cpd-contact-avatar">{initials}</span>{name}</div></td><td>{action}</td><td><span className="cpd-status"><span className="cpd-status-dot" />{status}</span></td><td>{time}</td></tr>)}</tbody></table></div>
                ) : <div className="cpd-empty-activity">{search ? `No hay actividad que coincida con “${search}”.` : 'Todavía no hay actividad registrada.'}</div>}
              </section>
            </div>
          </div>
        </main>
      </div>
      {toast ? <div className="cpd-toast"><Check size={14} />{toast}</div> : null}
    </div>
  );
};

export default ExecutiveDashboardPolished;