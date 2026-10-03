import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Activity,
  Phone,
  Mail,
  Calendar,
  FileText,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Zap,
  Clock,
  User,
  Search,
  Filter,
  Plus,
  Radio,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  X,
  MessageSquare,
  Bot,
  RefreshCw,
  TrendingUp,
  Tag,
  ShieldCheck,
  ExternalLink,
  PhoneCall,
  Video,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import {
  db,
  subscribeToUserSubcollection,
  saveUserSubcollectionRecord,
  isLiveFirebaseReady,
  handleFirestoreError,
  OperationType,
} from '../../firebase';
import { collection, onSnapshot, query, orderBy, limit as firestoreLimit } from 'firebase/firestore';
import { Activity as CRMActivity, Opportunity } from '../../types';

export type ActivityCategory = 'all' | 'deal_update' | 'user_interaction' | 'system_event';

export type ActivityItemType =
  | 'stage_change'
  | 'call'
  | 'email'
  | 'meeting'
  | 'note'
  | 'voice_note'
  | 'deal_created'
  | 'deal_won'
  | 'deal_lost'
  | 'ai_insight'
  | 'webhook_event'
  | 'workflow_trigger'
  | 'whatsapp';

export interface FeedItem {
  id: string;
  category: 'deal_update' | 'user_interaction' | 'system_event';
  type: ActivityItemType;
  title: string;
  description: string;
  author: string;
  authorRole?: string;
  targetName?: string;
  targetType?: 'opportunity' | 'company' | 'person';
  targetId?: string;
  timestamp: string;
  relativeTime: string;
  meta?: Record<string, any>;
  flagged?: boolean;
  source: 'firestore' | 'crm_context' | 'system';
}

interface RecentActivityProps {
  className?: string;
  maxItems?: number;
  showControls?: boolean;
  title?: string;
  subtitle?: string;
  onSelectRecord?: (record: any, type: 'opportunity' | 'company' | 'person') => void;
}

/**
 * Calculates human-readable relative time (e.g., "Hace 5 min", "Hace 2h", "Ayer")
 */
function getRelativeTime(isoString: string): string {
  if (!isoString) return 'Reciente';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Reciente';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 30) return 'Ahora mismo';
  if (diffInSeconds < 60) return `Hace ${diffInSeconds}s`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `Hace ${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Ayer';
  if (diffInDays < 7) return `Hace ${diffInDays}d`;

  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  className = '',
  maxItems = 50,
  showControls = true,
  title = 'Feed de Actividad Reciente',
  subtitle = 'Monitoreo en tiempo real de interacciones, eventos del sistema y cambios de etapa en Firestore',
  onSelectRecord,
}) => {
  const {
    activities: crmActivities,
    opportunities,
    people,
    companies,
    currentUser,
    addActivity,
    setSelectedRecord,
    setActiveTab,
    showToast,
  } = useCRM();

  // Firestore & Realtime state
  const [firestoreRawActivities, setFirestoreRawActivities] = useState<any[]>([]);
  const [firestoreSystemEvents, setFirestoreSystemEvents] = useState<any[]>([]);
  const [isFirestoreLive, setIsFirestoreLive] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string | null>(null);

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState<ActivityCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFlagged, setOnlyFlagged] = useState(false);
  const [flaggedIds, setFlaggedIds] = useState<Record<string, boolean>>({});

  // Modals & Drawers
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedFeedItem, setSelectedFeedItem] = useState<FeedItem | null>(null);

  // Quick Activity Form state
  const [newType, setNewType] = useState<ActivityItemType>('note');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTargetType, setNewTargetType] = useState<'opportunity' | 'company' | 'person'>('opportunity');
  const [newTargetId, setNewTargetId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Subscribe to Firestore 'activities' subcollection in Real-Time
  useEffect(() => {
    if (!currentUser?.id || !isLiveFirebaseReady) {
      setIsFirestoreLive(false);
      return;
    }

    let isMounted = true;
    const userId = currentUser.id;

    // Use subscribeToUserSubcollection helper from firebase.ts
    const unsubscribeActivities = subscribeToUserSubcollection(
      userId,
      'activities',
      (items) => {
        if (!isMounted) return;
        setFirestoreRawActivities(items);
        setIsFirestoreLive(true);
        setLastSyncedTime(new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      },
      (err) => {
        console.warn('Firestore activities subscription fallback:', err);
        if (isMounted) setIsFirestoreLive(false);
      }
    );

    // Also subscribe to root system_events or user-level system_events if available
    const systemEventsPath = `users/${userId}/system_events`;
    let unsubscribeSystemEvents = () => {};
    try {
      const colRef = collection(db, 'users', userId, 'system_events');
      const q = query(colRef, firestoreLimit(25));
      unsubscribeSystemEvents = onSnapshot(
        q,
        (snapshot) => {
          if (!isMounted) return;
          const events = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setFirestoreSystemEvents(events);
        },
        (err) => {
          if (err?.code === 'permission-denied') {
            handleFirestoreError(err, OperationType.GET, systemEventsPath);
          }
        }
      );
    } catch {
      // Fallback gracefully if collection does not exist
    }

    return () => {
      isMounted = false;
      unsubscribeActivities();
      unsubscribeSystemEvents();
    };
  }, [currentUser?.id]);

  // Toggle Flagged item
  const toggleFlagged = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFlaggedIds((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      showToast(next[id] ? 'Actividad marcada como destacada' : 'Marcador removido', 'info');
      return next;
    });
  }, [showToast]);

  // Build Unified Chronological Feed Items from Firestore + CRM Context
  const feedItems = useMemo<FeedItem[]>(() => {
    const itemsMap = new Map<string, FeedItem>();

    // A. Process Firestore Activities
    firestoreRawActivities.forEach((act) => {
      const targetName =
        act.targetName ||
        (act.targetType === 'opportunity'
          ? opportunities.find((o) => o.id === act.targetId)?.name
          : act.targetType === 'company'
          ? companies.find((c) => c.id === act.targetId)?.name
          : (() => {
              const p = people.find((p) => p.id === act.targetId);
              return p ? `${p.firstName} ${p.lastName}`.trim() : undefined;
            })());

      let category: FeedItem['category'] = 'user_interaction';
      if (act.type === 'stage_change' || act.type === 'deal_created' || act.type === 'deal_won' || act.type === 'deal_lost') {
        category = 'deal_update';
      } else if (act.type === 'ai_insight' || act.type === 'webhook_event' || act.type === 'workflow_trigger') {
        category = 'system_event';
      }

      const isoTime = act.createdAt || new Date().toISOString();

      itemsMap.set(act.id, {
        id: act.id,
        category,
        type: act.type || 'note',
        title: act.title || 'Interacción registrada',
        description: act.content || act.notes || '',
        author: act.author || 'Usuario CRM',
        authorRole: act.authorRole || 'Comercial',
        targetName,
        targetType: act.targetType,
        targetId: act.targetId,
        timestamp: isoTime,
        relativeTime: getRelativeTime(isoTime),
        meta: act.meta || {},
        flagged: Boolean(flaggedIds[act.id]),
        source: 'firestore',
      });
    });

    // B. Process CRM Context Activities (Merge & Deduplicate)
    crmActivities.forEach((act) => {
      if (!itemsMap.has(act.id)) {
        const targetName =
          act.targetType === 'opportunity'
            ? opportunities.find((o) => o.id === act.targetId)?.name
            : act.targetType === 'company'
            ? companies.find((c) => c.id === act.targetId)?.name
            : (() => {
                const p = people.find((p) => p.id === act.targetId);
                return p ? `${p.firstName} ${p.lastName}`.trim() : undefined;
              })();

        let category: FeedItem['category'] = 'user_interaction';
        if (act.type === 'stage_change') {
          category = 'deal_update';
        } else if (act.type === 'ai_insight') {
          category = 'system_event';
        }

        const isoTime = act.createdAt || new Date().toISOString();

        itemsMap.set(act.id, {
          id: act.id,
          category,
          type: act.type || 'note',
          title: act.title || 'Interacción registrada',
          description: act.content || '',
          author: act.author || 'Equipo Comercial',
          targetName,
          targetType: act.targetType,
          targetId: act.targetId,
          timestamp: isoTime,
          relativeTime: getRelativeTime(isoTime),
          meta: act.meta || {},
          flagged: Boolean(flaggedIds[act.id]),
          source: 'crm_context',
        });
      }
    });

    // C. Process Opportunities (Deal Updates: Stage Changes, Deals Won/Lost, Deals Created)
    opportunities.forEach((opp) => {
      // Deal Creation Event
      const creationId = `deal_created_${opp.id}`;
      const isWon = opp.stage === 'won';
      const isLost = opp.stage === 'lost';
      if (!itemsMap.has(creationId) && opp.createdAt) {
        itemsMap.set(creationId, {
          id: creationId,
          category: 'deal_update',
          type: isWon ? 'deal_won' : isLost ? 'deal_lost' : 'deal_created',
          title: isWon ? `¡Negocio Ganado! $${opp.amount.toLocaleString('es-AR')}` : `Negocio Creado: ${opp.name}`,
          description: `Negocio "${opp.name}" ingresó en la etapa "${opp.stage}". Valor: $${opp.amount.toLocaleString('es-AR')} ARS.`,
          author: opp.assignedTo || 'Sistema CRM',
          targetName: opp.companyName || opp.contactName || opp.name,
          targetType: 'opportunity',
          targetId: opp.id,
          timestamp: opp.createdAt,
          relativeTime: getRelativeTime(opp.createdAt),
          meta: {
            amount: opp.amount,
            stage: opp.stage,
            probability: opp.probability,
          },
          flagged: Boolean(flaggedIds[creationId]),
          source: 'crm_context',
        });
      }

      // Deal Stage Change if updatedAt differs
      if (opp.updatedAt && opp.updatedAt !== opp.createdAt) {
        const updateId = `deal_updated_${opp.id}_${opp.updatedAt.slice(0, 16)}`;
        if (!itemsMap.has(updateId)) {
          itemsMap.set(updateId, {
            id: updateId,
            category: 'deal_update',
            type: 'stage_change',
            title: `Actualización de Etapa: ${opp.name}`,
            description: `El negocio avanzó a la etapa "${opp.stage}" (${opp.probability}% probabilidad).`,
            author: opp.assignedTo || 'Ejecutivo de Ventas',
            targetName: opp.name,
            targetType: 'opportunity',
            targetId: opp.id,
            timestamp: opp.updatedAt,
            relativeTime: getRelativeTime(opp.updatedAt),
            meta: {
              amount: opp.amount,
              stage: opp.stage,
            },
            flagged: Boolean(flaggedIds[updateId]),
            source: 'crm_context',
          });
        }
      }
    });

    // D. Process Firestore System Events
    firestoreSystemEvents.forEach((sysEv) => {
      const evId = sysEv.id || `sysev_${Date.now()}`;
      if (!itemsMap.has(evId)) {
        const isoTime = sysEv.createdAt || sysEv.timestamp || new Date().toISOString();
        itemsMap.set(evId, {
          id: evId,
          category: 'system_event',
          type: sysEv.type || 'webhook_event',
          title: sysEv.title || 'Evento de Sistema / Webhook',
          description: sysEv.description || sysEv.message || 'Notificación automática procesada.',
          author: sysEv.author || 'Clientum System Bot',
          targetName: sysEv.targetName,
          targetType: sysEv.targetType,
          targetId: sysEv.targetId,
          timestamp: isoTime,
          relativeTime: getRelativeTime(isoTime),
          meta: sysEv.meta || sysEv.payload || {},
          flagged: Boolean(flaggedIds[evId]),
          source: 'firestore',
        });
      }
    });

    // Convert map values to array and sort strictly descending by timestamp
    const allItems = Array.from(itemsMap.values());
    allItems.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return allItems;
  }, [firestoreRawActivities, crmActivities, opportunities, firestoreSystemEvents, flaggedIds, companies, people]);

  // Filtered feed according to active filters
  const filteredFeed = useMemo(() => {
    return feedItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Flagged filter
      if (onlyFlagged && !item.flagged) {
        return false;
      }

      // Text search
      if (searchQuery.trim()) {
        const queryLower = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(queryLower);
        const matchesDesc = item.description.toLowerCase().includes(queryLower);
        const matchesAuthor = item.author.toLowerCase().includes(queryLower);
        const matchesTarget = item.targetName?.toLowerCase().includes(queryLower);
        if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesTarget) {
          return false;
        }
      }

      return true;
    }).slice(0, maxItems);
  }, [feedItems, activeCategory, onlyFlagged, searchQuery, maxItems]);

  // Handle Quick Activity Submission
  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Ingresá un título para la actividad', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const actId = `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const targetRecordName =
        newTargetType === 'opportunity'
          ? opportunities.find((o) => o.id === newTargetId)?.name
          : newTargetType === 'company'
          ? companies.find((c) => c.id === newTargetId)?.name
          : (() => {
              const p = people.find((p) => p.id === newTargetId);
              return p ? `${p.firstName} ${p.lastName}`.trim() : undefined;
            })();

      const newActPayload: CRMActivity = {
        id: actId,
        type: newType as any,
        title: newTitle.trim(),
        content: newContent.trim(),
        author: currentUser?.name || 'Vendedor',
        targetType: newTargetType,
        targetId: newTargetId || (opportunities[0]?.id || ''),
        createdAt: new Date().toISOString(),
      };

      // 1. Write to local CRMContext state
      addActivity(newActPayload);

      // 2. Write directly to Firestore if user authenticated
      if (currentUser?.id) {
        await saveUserSubcollectionRecord(currentUser.id, 'activities', actId, {
          ...newActPayload,
          targetName: targetRecordName || '',
        });
      }

      showToast('Interacción registrada exitosamente en Firestore', 'success');
      setIsLogModalOpen(false);
      setNewTitle('');
      setNewContent('');
    } catch (err: any) {
      console.error('Error al registrar actividad:', err);
      showToast('Error al guardar en Firestore', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for rendering icons with styling
  const getActivityIcon = (type: ActivityItemType, category: ActivityCategory) => {
    switch (type) {
      case 'call':
        return <Phone className="w-4 h-4 text-blue-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-sky-500" />;
      case 'meeting':
        return <Calendar className="w-4 h-4 text-indigo-500" />;
      case 'stage_change':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'deal_created':
        return <Tag className="w-4 h-4 text-teal-500" />;
      case 'deal_won':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'deal_lost':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case 'ai_insight':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'webhook_event':
      case 'workflow_trigger':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-500" />;
      case 'note':
      default:
        return <FileText className="w-4 h-4 text-slate-400 dark:text-slate-400" />;
    }
  };

  const getCategoryBadgeClass = (category: FeedItem['category']) => {
    switch (category) {
      case 'deal_update':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'system_event':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20';
      case 'user_interaction':
      default:
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className={`bg-[var(--bg-card)] dark:bg-[#0f172a] rounded-2xl border border-[var(--border-subtle)] dark:border-slate-800 shadow-sm overflow-hidden ${className}`}>
      {/* Header Section */}
      <div className="p-5 border-b border-[var(--border-subtle)] dark:border-slate-800/80 bg-gradient-to-r from-[var(--bg-muted)]/40 to-transparent dark:from-slate-900/60 dark:to-slate-900/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center shadow-xs">
                <Activity size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--text-primary)] dark:text-white flex items-center gap-2">
                  {title}
                  {/* Realtime Pulse Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      isFirestoreLive
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      {isFirestoreLive && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          isFirestoreLive ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                    </span>
                    {isFirestoreLive ? 'Firestore Live' : 'Sincronizado'}
                  </span>
                </h2>
                <p className="text-xs text-[var(--text-muted)] dark:text-slate-400 mt-0.5">
                  {subtitle}
                </p>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {lastSyncedTime && (
              <span className="text-[11px] text-[var(--text-muted)] dark:text-slate-500 hidden sm:inline">
                Última act: {lastSyncedTime}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>Registrar Interacción</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        {showControls && (
          <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]/60 dark:border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
              {[
                { id: 'all', label: 'Todos', count: feedItems.length },
                {
                  id: 'deal_update',
                  label: 'Negocios',
                  count: feedItems.filter((i) => i.category === 'deal_update').length,
                },
                {
                  id: 'user_interaction',
                  label: 'Interacciones',
                  count: feedItems.filter((i) => i.category === 'user_interaction').length,
                },
                {
                  id: 'system_event',
                  label: 'Eventos Sistema',
                  count: feedItems.filter((i) => i.category === 'system_event').length,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id as ActivityCategory)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeCategory === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-[var(--bg-muted)] dark:bg-slate-800/80 text-[var(--text-secondary)] dark:text-slate-300 hover:text-[var(--text-primary)] dark:hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                      activeCategory === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search Input & Flag Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-52">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] dark:text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar actividad..."
                  className="w-full bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[var(--text-primary)] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setOnlyFlagged(!onlyFlagged)}
                title="Filtrar destacados"
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  onlyFlagged
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                    : 'bg-[var(--bg-muted)] dark:bg-slate-800 border-[var(--border-subtle)] dark:border-slate-700 text-[var(--text-muted)] dark:text-slate-400 hover:text-[var(--text-primary)] dark:hover:text-white'
                }`}
              >
                {onlyFlagged ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feed List Container */}
      <div className="p-5">
        {filteredFeed.length > 0 ? (
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-subtle)] dark:before:bg-slate-800">
            {filteredFeed.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedFeedItem(item)}
                className="relative group cursor-pointer transition-all hover:translate-x-1"
              >
                {/* Timeline Icon Node */}
                <div className="absolute -left-6 top-1 transform -translate-x-1/2 w-6 h-6 rounded-full bg-[var(--bg-card)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-700 flex items-center justify-center shadow-2xs group-hover:border-blue-500 group-hover:scale-110 transition-all">
                  {getActivityIcon(item.type, item.category)}
                </div>

                {/* Card Container */}
                <div className="p-3.5 rounded-xl border border-[var(--border-subtle)] dark:border-slate-800/80 bg-[var(--bg-card)] dark:bg-slate-900/40 hover:bg-[var(--bg-muted)]/50 dark:hover:bg-slate-800/50 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Category Badge */}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {item.category === 'deal_update'
                            ? 'Negocio'
                            : item.category === 'system_event'
                            ? 'Sistema'
                            : 'Interacción'}
                        </span>

                        {/* Title */}
                        <h4 className="text-xs font-semibold text-[var(--text-primary)] dark:text-slate-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </h4>

                        {/* Target Name Tag */}
                        {item.targetName && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.targetId && item.targetType && onSelectRecord) {
                                onSelectRecord(
                                  { id: item.targetId, name: item.targetName },
                                  item.targetType
                                );
                              } else {
                                setActiveTab('opportunities');
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--bg-muted)] dark:bg-slate-800 text-[var(--text-secondary)] dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            <ExternalLink size={9} />
                            <span className="truncate max-w-[120px]">{item.targetName}</span>
                          </span>
                        )}
                      </div>

                      {/* Content Description */}
                      {item.description && (
                        <p className="text-xs text-[var(--text-secondary)] dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}

                      {/* Meta details footer */}
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-[var(--text-muted)] dark:text-slate-500">
                        <span className="flex items-center gap-1">
                          <User size={11} />
                          <span>{item.author}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{item.relativeTime}</span>
                        </span>
                        {item.source === 'firestore' && (
                          <>
                            <span>•</span>
                            <span className="text-[10px] text-emerald-500 font-medium">
                              Firestore
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Flag Bookmark Action */}
                    <button
                      type="button"
                      onClick={(e) => toggleFlagged(item.id, e)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        item.flagged
                          ? 'text-amber-500 bg-amber-500/10'
                          : 'text-[var(--text-muted)] dark:text-slate-600 hover:text-amber-500'
                      }`}
                    >
                      {item.flagged ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-muted)] dark:bg-slate-800 flex items-center justify-center text-[var(--text-muted)] dark:text-slate-400 mb-3">
              <Activity size={20} />
            </div>
            <p className="text-xs font-semibold text-[var(--text-primary)] dark:text-slate-200">
              No hay actividades registradas en este filtro
            </p>
            <p className="text-[11px] text-[var(--text-muted)] dark:text-slate-400 mt-1 max-w-xs">
              {searchQuery
                ? `No encontramos resultados para "${searchQuery}". Proba cambiando tu busqueda.`
                : 'Registra una nueva interacción o actualiza un negocio para generar actividad.'}
            </p>
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="mt-4 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Registrar primera actividad
            </button>
          </div>
        )}
      </div>

      {/* Modal: Quick Activity Logger */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--bg-card)] dark:bg-[#0f172a] rounded-2xl border border-[var(--border-subtle)] dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] dark:border-slate-800 bg-[var(--bg-muted)]/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Plus size={16} />
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                  Registrar Nueva Interacción
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="p-5 space-y-4">
              {/* Type selector */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] dark:text-slate-300 mb-1.5">
                  Tipo de Actividad
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'note', label: 'Nota', icon: FileText },
                    { id: 'call', label: 'Llamada', icon: Phone },
                    { id: 'email', label: 'Email', icon: Mail },
                    { id: 'meeting', label: 'Reunión', icon: Calendar },
                  ].map((t) => {
                    const IconComp = t.icon;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setNewType(t.id as ActivityItemType)}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          newType === t.id
                            ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-500 font-semibold'
                            : 'bg-[var(--bg-muted)] dark:bg-slate-900/60 border-[var(--border-subtle)] dark:border-slate-800 text-[var(--text-secondary)] dark:text-slate-400'
                        }`}
                      >
                        <IconComp size={16} />
                        <span className="text-[11px]">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] dark:text-slate-300 mb-1">
                  Título de la actividad *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Llamada de seguimiento comercial con cliente..."
                  className="w-full bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {/* Target record selector */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] dark:text-slate-300 mb-1">
                    Vincular a
                  </label>
                  <select
                    value={newTargetType}
                    onChange={(e) =>
                      setNewTargetType(e.target.value as 'opportunity' | 'company' | 'person')
                    }
                    className="w-full bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-[var(--text-primary)] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="opportunity">Negocio</option>
                    <option value="company">Empresa</option>
                    <option value="person">Contacto / Persona</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] dark:text-slate-300 mb-1">
                    Registro
                  </label>
                  <select
                    value={newTargetId}
                    onChange={(e) => setNewTargetId(e.target.value)}
                    className="w-full bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 rounded-xl px-2.5 py-2 text-xs text-[var(--text-primary)] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="">-- Seleccionar registro --</option>
                    {newTargetType === 'opportunity' &&
                      opportunities.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name} (${o.amount.toLocaleString('es-AR')})
                        </option>
                      ))}
                    {newTargetType === 'company' &&
                      companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    {newTargetType === 'person' &&
                      people.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.firstName} {p.lastName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Notes content */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] dark:text-slate-300 mb-1">
                  Notas / Detalles
                </label>
                <textarea
                  rows={3}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Escribí los detalles o compromisos acordados..."
                  className="w-full bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 rounded-xl p-3 text-xs text-[var(--text-primary)] dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 custom-scrollbar"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border-subtle)] dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--text-muted)] dark:text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  <span>Guardar en Firestore</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer: Feed Item Details */}
      {selectedFeedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--bg-card)] dark:bg-[#0f172a] border-l border-[var(--border-subtle)] dark:border-slate-800 h-full overflow-y-auto p-6 space-y-6 animate-in slide-in-from-right">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center">
                  {getActivityIcon(selectedFeedItem.type, selectedFeedItem.category)}
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 dark:text-blue-400">
                    {selectedFeedItem.category}
                  </span>
                  <h3 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                    Detalle de Actividad
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFeedItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)] dark:text-white">
                  {selectedFeedItem.title}
                </h4>
                <p className="text-xs text-[var(--text-muted)] dark:text-slate-400 mt-1">
                  {selectedFeedItem.relativeTime} ({new Date(selectedFeedItem.timestamp).toLocaleString('es-AR')})
                </p>
              </div>

              {selectedFeedItem.targetName && (
                <div className="p-3 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800">
                  <span className="text-[10px] font-semibold text-[var(--text-muted)] dark:text-slate-500 uppercase">
                    Registro Vinculado
                  </span>
                  <p className="text-xs font-bold text-[var(--text-primary)] dark:text-slate-200 mt-0.5">
                    {selectedFeedItem.targetName}
                  </p>
                </div>
              )}

              {selectedFeedItem.description && (
                <div>
                  <h5 className="text-xs font-semibold text-[var(--text-secondary)] dark:text-slate-300 mb-1">
                    Descripción / Contenido
                  </h5>
                  <div className="p-3.5 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-900/60 border border-[var(--border-subtle)] dark:border-slate-800 text-xs text-[var(--text-primary)] dark:text-slate-200 leading-relaxed whitespace-pre-line">
                    {selectedFeedItem.description}
                  </div>
                </div>
              )}

              {/* Author & Source */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-900/60 border border-[var(--border-subtle)] dark:border-slate-800">
                  <span className="text-[10px] text-[var(--text-muted)] dark:text-slate-500">Autor</span>
                  <p className="font-semibold text-[var(--text-primary)] dark:text-slate-200 mt-0.5">
                    {selectedFeedItem.author}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-900/60 border border-[var(--border-subtle)] dark:border-slate-800">
                  <span className="text-[10px] text-[var(--text-muted)] dark:text-slate-500">Origen de datos</span>
                  <p className="font-semibold text-emerald-500 mt-0.5 capitalize">
                    {selectedFeedItem.source}
                  </p>
                </div>
              </div>

              {/* Metadata JSON object if available */}
              {selectedFeedItem.meta && Object.keys(selectedFeedItem.meta).length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-[var(--text-secondary)] dark:text-slate-300 mb-1">
                    Metadatos adicionales
                  </h5>
                  <pre className="p-3 rounded-xl bg-[var(--bg-muted)] dark:bg-slate-900 border border-[var(--border-subtle)] dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 overflow-x-auto">
                    {JSON.stringify(selectedFeedItem.meta, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={(e) => toggleFlagged(selectedFeedItem.id, e)}
                className="px-3.5 py-2 rounded-xl border border-[var(--border-subtle)] dark:border-slate-700 text-xs font-medium text-[var(--text-secondary)] dark:text-slate-300 hover:text-amber-500 flex items-center gap-1.5 cursor-pointer"
              >
                {selectedFeedItem.flagged ? <BookmarkCheck size={14} className="text-amber-500" /> : <Bookmark size={14} />}
                <span>{selectedFeedItem.flagged ? 'Destacado' : 'Marcar destacado'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFeedItem(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
