import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Workflow,
  Plus,
  Play,
  Sparkles,
  CheckSquare,
  MessageSquare,
  Zap,
  Trash2,
  Trophy,
  UserPlus,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2,
  AlertCircle,
  Sliders,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Move,
  Layout,
  Compass,
  Layers
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { WorkflowRule, WorkflowNode, WorkflowConnection } from '../../types';
import {
  computeAutoLayout,
  ensureConnections,
  LaidOutNode,
  LaidOutConnection,
  LaidOutStage,
  LayoutResult
} from './flowAutoLayout';
import { FlowNodeCard } from './FlowNodeCard';
import { FlowConnectionLine } from './FlowConnectionLine';
import { AddNodeModal, PresetNodeTemplate } from './AddNodeModal';

export const WorkflowsView: React.FC = () => {
  const {
    workflows,
    addWorkflow,
    updateWorkflow,
    toggleWorkflow,
    deleteWorkflow,
    showToast,
    triggerConfetti
  } = useCRM();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [isNewWfModalOpen, setIsNewWfModalOpen] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Auto-Layout & Canvas Configuration
  const [direction, setDirection] = useState<'LR' | 'TB'>('LR');
  const [autoLayoutEnabled, setAutoLayoutEnabled] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Add Node Modal State
  const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);
  const [addNodeTarget, setAddNodeTarget] = useState<{
    parentNodeId?: string;
    insertBetween?: { fromId: string; toId: string };
    parentTitle?: string;
  } | undefined>(undefined);

  // Dragging state for freeform node movement
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragCurrentPos, setDragCurrentPos] = useState<{ x: number; y: number } | null>(null);

  // New Workflow Form State
  const [wfName, setWfName] = useState('');
  const [wfDescription, setWfDescription] = useState('');
  const [wfTrigger, setWfTrigger] = useState<WorkflowRule['triggerType']>('record_created');
  const [wfTarget, setWfTarget] = useState<WorkflowRule['targetObject']>('person');

  // Canvas viewport container ref
  const canvasRef = useRef<HTMLDivElement>(null);

  const selectedWf = useMemo(() => {
    return workflows.find((w) => w.id === selectedWorkflowId) || workflows[0];
  }, [workflows, selectedWorkflowId]);

  // Compute Layout Result using the Auto-Layout Algorithm
  const layoutResult: LayoutResult = useMemo(() => {
    if (!selectedWf) {
      return {
        nodes: [],
        connections: [],
        stages: [],
        canvasSize: { width: 900, height: 600 },
      };
    }

    // Pass nodes & connections through the DAG stage-organizer
    const conns = ensureConnections(selectedWf.nodes, selectedWf.connections);
    const result = computeAutoLayout(selectedWf.nodes, conns, {
      direction,
      nodeWidth: 270,
      nodeHeight: 115,
      stageGap: 140,
      nodeGap: 45,
      padding: { x: 60, y: 70 },
    });

    // If currently dragging a node, override its coordinates for live line-stretching
    if (draggingNodeId && dragCurrentPos) {
      const draggedNode = result.nodes.find((n) => n.id === draggingNodeId);
      if (draggedNode) {
        draggedNode.x = dragCurrentPos.x;
        draggedNode.y = dragCurrentPos.y;

        // Recompute connections attached to the dragged node
        result.connections = result.connections.map((c) => {
          if (c.fromNodeId === draggingNodeId || c.toNodeId === draggingNodeId) {
            const s = result.nodes.find((n) => n.id === c.fromNodeId) || draggedNode;
            const t = result.nodes.find((n) => n.id === c.toNodeId) || draggedNode;

            const p0 = direction === 'LR'
              ? { x: s.x + s.width, y: s.y + s.height / 2 }
              : { x: s.x + s.width / 2, y: s.y + s.height };
            const p3 = direction === 'LR'
              ? { x: t.x, y: t.y + t.height / 2 }
              : { x: t.x + t.width / 2, y: t.y };

            const delta = direction === 'LR' ? Math.max(30, (p3.x - p0.x) * 0.45) : Math.max(30, (p3.y - p0.y) * 0.45);
            const p1 = direction === 'LR' ? { x: p0.x + delta, y: p0.y } : { x: p0.x, y: p0.y + delta };
            const p2 = direction === 'LR' ? { x: p3.x - delta, y: p3.y } : { x: p3.x, y: p3.y - delta };

            return {
              ...c,
              path: `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`,
              sourcePoint: p0,
              targetPoint: p3,
              midPoint: { x: Math.round((p0.x + p3.x) / 2), y: Math.round((p0.y + p3.y) / 2) },
            };
          }
          return c;
        });
      }
    }

    return result;
  }, [selectedWf, direction, draggingNodeId, dragCurrentPos]);

  // Handle Drag Start
  const handleDragStart = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const node = layoutResult.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    setDraggingNodeId(nodeId);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
    setDragCurrentPos({ x: node.x, y: node.y });
  };

  // Window drag movement and drop listener
  useEffect(() => {
    if (!draggingNodeId) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(20, Math.round((e.clientX - dragOffset.x) / zoom));
      const newY = Math.max(20, Math.round((e.clientY - dragOffset.y) / zoom));
      setDragCurrentPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (draggingNodeId && selectedWf) {
        // Drop handling: When node is moved, organize stages and connection lines
        if (autoLayoutEnabled) {
          // If auto-layout is enabled, determine the target stage based on dropped position
          const droppedPos = dragCurrentPos;
          if (droppedPos) {
            // Find which stage column or sequence slot the node was dropped near
            const targetStageIndex = Math.max(
              0,
              direction === 'LR'
                ? Math.round((droppedPos.x - 60) / (270 + 140))
                : Math.round((droppedPos.y - 70) / (115 + 140))
            );

            // Reorganize workflow nodes based on new stage index
            const updatedNodes = selectedWf.nodes.map((n) => {
              if (n.id === draggingNodeId) {
                return {
                  ...n,
                  stageIndex: targetStageIndex,
                  position: droppedPos,
                };
              }
              return n;
            });

            // Sort nodes by their newly assigned stages
            updatedNodes.sort((a, b) => (a.stageIndex ?? 0) - (b.stageIndex ?? 0));

            // Rebuild connections so the stages connect cleanly
            const updatedConnections = ensureConnections(updatedNodes);

            updateWorkflow({
              ...selectedWf,
              nodes: updatedNodes,
              connections: updatedConnections,
            });

            showToast('Auto-layout: Etapas y líneas reorganizadas limpiamente', 'success');
          }
        } else {
          // Just save manual position
          const updatedNodes = selectedWf.nodes.map((n) => {
            if (n.id === draggingNodeId && dragCurrentPos) {
              return { ...n, position: dragCurrentPos };
            }
            return n;
          });
          updateWorkflow({ ...selectedWf, nodes: updatedNodes });
        }
      }

      setDraggingNodeId(null);
      setDragCurrentPos(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingNodeId, dragOffset, dragCurrentPos, zoom, autoLayoutEnabled, selectedWf, direction]);

  // Explicit Trigger: Force Auto-Layout Reorganization
  const handleTriggerAutoLayout = () => {
    if (!selectedWf) return;

    // Reset explicit manual offsets and recompute clean stages & connections
    const reorderedNodes = [...selectedWf.nodes];
    const connections = ensureConnections(reorderedNodes);

    // Run auto-layout
    const freshLayout = computeAutoLayout(reorderedNodes, connections, {
      direction,
      nodeWidth: 270,
      nodeHeight: 115,
      stageGap: 140,
      nodeGap: 45,
      padding: { x: 60, y: 70 },
    });

    const updatedNodes = freshLayout.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.description,
      config: n.config,
      icon: n.icon,
      position: { x: n.x, y: n.y },
      stageIndex: n.stageIndex,
    }));

    updateWorkflow({
      ...selectedWf,
      nodes: updatedNodes,
      connections,
    });

    showToast('⚡ Flujo y conexiones reorganizados con algoritmo de auto-layout', 'success');
  };

  // Add New Node to Flow
  const handleAddNode = (
    template: PresetNodeTemplate,
    targetInfo?: { parentNodeId?: string; insertBetween?: { fromId: string; toId: string } }
  ) => {
    if (!selectedWf) return;

    const newNodeId = `node-${Date.now()}`;
    const newNode: WorkflowNode = {
      id: newNodeId,
      type: template.type,
      title: template.title,
      description: template.description,
      config: template.config,
      icon: template.icon,
      branchLabel: template.branchLabel,
      status: 'idle',
    };

    let updatedNodes = [...selectedWf.nodes, newNode];
    let currentConns = ensureConnections(selectedWf.nodes, selectedWf.connections);
    let updatedConns: WorkflowConnection[] = [];

    if (targetInfo?.insertBetween) {
      // Split connection A -> B into A -> NewNode -> B
      const { fromId, toId } = targetInfo.insertBetween;
      updatedConns = currentConns
        .filter((c) => !(c.fromNodeId === fromId && c.toNodeId === toId))
        .concat([
          {
            id: `conn-${fromId}-${newNodeId}`,
            fromNodeId: fromId,
            toNodeId: newNodeId,
            status: 'idle',
          },
          {
            id: `conn-${newNodeId}-${toId}`,
            fromNodeId: newNodeId,
            toNodeId: toId,
            status: 'idle',
          },
        ]);
    } else if (targetInfo?.parentNodeId) {
      // Branch from parent
      updatedConns = [
        ...currentConns,
        {
          id: `conn-${targetInfo.parentNodeId}-${newNodeId}`,
          fromNodeId: targetInfo.parentNodeId,
          toNodeId: newNodeId,
          label: template.branchLabel || (template.type === 'condition' ? 'Bifurcación' : undefined),
          branch: template.branchLabel?.toLowerCase().includes('no') ? 'false' : template.branchLabel?.toLowerCase().includes('si') ? 'true' : 'default',
          status: 'idle',
        },
      ];
    } else {
      // Append to the end of the pipeline
      const lastNode = selectedWf.nodes[selectedWf.nodes.length - 1];
      if (lastNode) {
        updatedConns = [
          ...currentConns,
          {
            id: `conn-${lastNode.id}-${newNodeId}`,
            fromNodeId: lastNode.id,
            toNodeId: newNodeId,
            status: 'idle',
          },
        ];
      }
    }

    // Immediately run auto-layout algorithm to organize stages and lines cleanly
    const freshLayout = computeAutoLayout(updatedNodes, updatedConns, {
      direction,
      nodeWidth: 270,
      nodeHeight: 115,
      stageGap: 140,
      nodeGap: 45,
      padding: { x: 60, y: 70 },
    });

    const positionedNodes = freshLayout.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      description: n.description,
      config: n.config,
      icon: n.icon,
      position: { x: n.x, y: n.y },
      stageIndex: n.stageIndex,
    }));

    updateWorkflow({
      ...selectedWf,
      nodes: positionedNodes,
      connections: updatedConns,
    });

    setSelectedNodeId(newNodeId);
    showToast(`Etapa "${template.title}" agregada y alineada en el flujo`, 'success');
  };

  // Move Stage order (Shift left / right)
  const handleMoveStage = (nodeId: string, dir: 'prev' | 'next') => {
    if (!selectedWf) return;

    const idx = selectedWf.nodes.findIndex((n) => n.id === nodeId);
    if (idx === -1) return;

    const targetIdx = dir === 'prev' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= selectedWf.nodes.length) return;

    const reordered = [...selectedWf.nodes];
    const [moved] = reordered.splice(idx, 1);
    reordered.splice(targetIdx, 0, moved);

    // Rebuild connections and compute auto-layout cleanly
    const newConns = ensureConnections(reordered);
    const freshLayout = computeAutoLayout(reordered, newConns, { direction });

    updateWorkflow({
      ...selectedWf,
      nodes: freshLayout.nodes.map((n) => ({
        ...n,
        position: { x: n.x, y: n.y },
      })),
      connections: newConns,
    });

    showToast('Etapa reposicionada: diagrama auto-organizado', 'info');
  };

  // Duplicate Node
  const handleDuplicateNode = (nodeId: string) => {
    if (!selectedWf) return;
    const original = selectedWf.nodes.find((n) => n.id === nodeId);
    if (!original) return;

    const clone: WorkflowNode = {
      ...original,
      id: `node-${Date.now()}`,
      title: `${original.title} (Copia)`,
      status: 'idle',
    };

    const updatedNodes = [...selectedWf.nodes, clone];
    const newConns = ensureConnections(updatedNodes, [
      ...(selectedWf.connections || []),
      {
        id: `conn-${original.id}-${clone.id}`,
        fromNodeId: original.id,
        toNodeId: clone.id,
        label: 'Paralelo',
        branch: 'default',
        status: 'idle',
      },
    ]);

    const freshLayout = computeAutoLayout(updatedNodes, newConns, { direction });

    updateWorkflow({
      ...selectedWf,
      nodes: freshLayout.nodes.map((n) => ({ ...n, position: { x: n.x, y: n.y } })),
      connections: newConns,
    });

    showToast('Etapa duplicada y acomodada en el flujo', 'success');
  };

  // Delete Node
  const handleDeleteNode = (nodeId: string) => {
    if (!selectedWf) return;

    const updatedNodes = selectedWf.nodes.filter((n) => n.id !== nodeId);
    const updatedConns = (selectedWf.connections || []).filter(
      (c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId
    );

    const freshConns = ensureConnections(updatedNodes, updatedConns);
    const freshLayout = computeAutoLayout(updatedNodes, freshConns, { direction });

    updateWorkflow({
      ...selectedWf,
      nodes: freshLayout.nodes.map((n) => ({ ...n, position: { x: n.x, y: n.y } })),
      connections: freshConns,
    });

    if (selectedNodeId === nodeId) setSelectedNodeId(null);
    showToast('Etapa eliminada y líneas reconectadas', 'info');
  };

  // Test Run Simulation
  const handleRunSimulation = () => {
    if (!selectedWf || selectedWf.nodes.length === 0) return;
    setIsSimulating(true);
    setSimulationLogs(['[00:00.01] 🚀 Iniciando simulación del flujo automatizado...']);

    // Set all nodes to idle
    const nodesCopy = selectedWf.nodes.map((n) => ({ ...n, status: 'idle' as const }));
    updateWorkflow({ ...selectedWf, nodes: nodesCopy });

    // Step through each node sequentially
    selectedWf.nodes.forEach((node, index) => {
      setTimeout(() => {
        // Mark current node as running
        const runningCopy = selectedWf.nodes.map((n, i) =>
          i === index ? { ...n, status: 'running' as const } : n
        );
        updateWorkflow({ ...selectedWf, nodes: runningCopy });

        setSimulationLogs((prev) => [
          ...prev,
          `[00:0${index + 1}.20] ⚡ Ejecutando Etapa ${index + 1}: ${node.title} (${node.type.toUpperCase()})`,
        ]);

        // Complete step
        setTimeout(() => {
          const successCopy = selectedWf.nodes.map((n, i) =>
            i <= index ? { ...n, status: 'success' as const } : n
          );
          updateWorkflow({ ...selectedWf, nodes: successCopy });

          setSimulationLogs((prev) => [
            ...prev,
            `[00:0${index + 1}.85]  Etapa ${index + 1} completada exitosamente`,
          ]);

          // End of simulation
          if (index === selectedWf.nodes.length - 1) {
            setIsSimulating(false);
            triggerConfetti();
            showToast('¡Flujo de trabajo probado con éxito!', 'success');
          }
        }, 600);
      }, (index + 1) * 900);
    });
  };

  // Create New Workflow
  const handleCreateWorkflow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wfName) return;

    const initialNodes: WorkflowNode[] = [
      {
        id: 'n1',
        type: 'trigger',
        title: `Trigger: ${wfTrigger.replace('_', ' ').toUpperCase()}`,
        description: `Dispara cuando ${wfTarget} emite un evento`,
        config: {},
        icon: 'Zap',
        stageIndex: 0,
      },
      {
        id: 'n2',
        type: 'action',
        title: 'Calificación Inteligente Gemini IA',
        description: 'Evalúa la intención y asigna puntaje comercial',
        config: {},
        icon: 'Sparkles',
        stageIndex: 1,
      },
      {
        id: 'n3',
        type: 'action',
        title: 'Enviar Mensaje WhatsApp Automático',
        description: 'Despacha plantilla personalizada por ClientumCRM',
        config: {},
        icon: 'MessageSquare',
        stageIndex: 2,
      },
    ];

    const initialConns = ensureConnections(initialNodes);
    const layout = computeAutoLayout(initialNodes, initialConns, { direction });

    const created = addWorkflow({
      name: wfName,
      description: wfDescription || 'Flujo automatizado ClientumCRM',
      isActive: true,
      triggerType: wfTrigger,
      targetObject: wfTarget,
      nodes: layout.nodes.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        description: n.description,
        config: n.config,
        icon: n.icon,
        position: { x: n.x, y: n.y },
        stageIndex: n.stageIndex,
      })),
      connections: initialConns,
    });

    setSelectedWorkflowId(created.id);
    setIsNewWfModalOpen(false);
    setWfName('');
    setWfDescription('');
    showToast('Nuevo flujo creado con auto-layout aplicado', 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#07090e] text-[#d4daf0] select-none">
      {/* Top Banner Header */}
      <div className="px-6 py-3.5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#182032] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c1018] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shadow-inner">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[var(--text-primary,#0f172a)] dark:text-white tracking-tight">
                Editor Visual de Flujos & Automatizaciones
              </h1>
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                Auto-Layout DAG Engine
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted,#64748b)] dark:text-slate-400">
              Diseña etapas, bifurcaciones de decisión, agentes IA y webhooks con reorganización automática de líneas y etapas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewWfModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Flujo</span>
          </button>
        </div>
      </div>

      {/* Main Studio Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Sidebar: Workflow List */}
        <div className="w-72 border-r border-[var(--border-subtle,#e2e8f0)] dark:border-[#182032] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0d14] p-3 flex flex-col gap-2 shrink-0 overflow-y-auto">
          <div className="flex items-center justify-between px-2 pt-1 pb-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)]">
              Flujos Activos ({workflows.length})
            </span>
          </div>

          {workflows.map((wf) => {
            const isSelected = wf.id === selectedWorkflowId;
            return (
              <div
                key={wf.id}
                onClick={() => setSelectedWorkflowId(wf.id)}
                className={`w-full p-3 rounded-xl text-left cursor-pointer transition-all border ${ isSelected ? 'bg-[var(--bg-card,#ffffff)] dark:bg-[#151c2b] border-cyan-500/40 text-[var(--text-primary,#0f172a)] dark:text-white shadow-lg' : 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0f131f] border-[var(--border-subtle,#e2e8f0)] dark:border-[#182030] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-slate-200 hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#131926]' }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs truncate text-[var(--text-primary,#0f172a)] dark:text-white">{wf.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWorkflow(wf.id);
                    }}
                    className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold transition-all cursor-pointer ${ wf.isActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-[var(--text-muted,#64748b)] dark:text-slate-400' }`}
                  >
                    {wf.isActive ? 'ACTIVO' : 'PAUSADO'}
                  </button>
                </div>

                <p className="text-[11px] text-[var(--text-muted,#64748b)] dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                  {wf.description}
                </p>

                <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] pt-1.5 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1a2233]">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                    {wf.nodes.length} etapas
                  </span>
                  <span className="uppercase text-[9px] font-mono px-1.5 py-0.5 rounded bg-[var(--bg-card,#ffffff)] dark:bg-[#171e2e] text-[var(--text-secondary,#475569)] dark:text-slate-300">
                    {wf.targetObject}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Canvas Area */}
        {selectedWf ? (
          <div className="flex-1 flex flex-col min-w-0 bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#06080d] overflow-hidden relative">
            {/* Canvas Interactive Toolbar */}
            <div className="px-5 py-2.5 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#182032] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0c1018] flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-xs font-bold text-[var(--text-primary,#0f172a)] dark:text-white flex items-center gap-2">
                    <span>{selectedWf.name}</span>
                    <span className="text-[11px] font-normal text-[var(--text-muted,#64748b)] dark:text-slate-400">
                      ({selectedWf.nodes.length} etapas · {layoutResult.stages.length} columnas organizadas)
                    </span>
                  </h2>
                </div>

                {/* Auto-Layout Active Indicator */}
                <div className="flex items-center gap-2 pl-3 border-l border-[var(--border-subtle,#e2e8f0)] dark:border-[#1f283d]">
                  <button
                    onClick={() => setAutoLayoutEnabled(!autoLayoutEnabled)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all border ${ autoLayoutEnabled ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' : 'bg-[var(--bg-card,#ffffff)] dark:bg-[#151c2b] text-[var(--text-muted,#64748b)] dark:text-slate-400 border-[var(--border-subtle,#e2e8f0)] dark:border-[#222b3f]' }`}
                    title="Reorganiza automáticamente las etapas y líneas al agregar o mover cualquier nodo"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Auto-Layout: {autoLayoutEnabled ? 'Activo' : 'Manual'}</span>
                  </button>

                  <button
                    onClick={handleTriggerAutoLayout}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-bold cursor-pointer transition-all active:scale-95"
                    title="Ejecutar algoritmo de auto-layout para alinear etapas y curvas"
                  >
                    <RefreshCw className="w-3 h-3 text-cyan-400" />
                    <span>Reorganizar Flujo</span>
                  </button>
                </div>
              </div>

              {/* View Controls & Action Buttons */}
              <div className="flex items-center gap-2">
                {/* Orientation Selector: LR vs TB */}
                <div className="flex items-center bg-[var(--bg-card,#ffffff)] dark:bg-[#131926] p-0.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20293d]">
                  <button
                    onClick={() => setDirection('LR')}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${ direction === 'LR' ? 'bg-cyan-500 text-black shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
                    title="Disposición Horizontal (Izquierda a Derecha)"
                  >
                    ↔ Horizontal
                  </button>
                  <button
                    onClick={() => setDirection('TB')}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold cursor-pointer transition-all ${ direction === 'TB' ? 'bg-cyan-500 text-black shadow-sm' : 'text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-white' }`}
                    title="Disposición Vertical (Arriba a Abajo)"
                  >
                    ↕ Vertical
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-[var(--bg-card,#ffffff)] dark:bg-[#131926] px-1 py-0.5 rounded-lg border border-[var(--border-subtle,#e2e8f0)] dark:border-[#20293d]">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.6, z - 0.1))}
                    className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white cursor-pointer"
                    title="Reducir zoom"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono text-[var(--text-secondary,#475569)] dark:text-slate-300 px-1">
                    {Math.round(zoom * 100)}%
                  </span>
                  <button
                    onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
                    className="p-1 rounded text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-[var(--text-primary,#0f172a)] dark:hover:text-white cursor-pointer"
                    title="Aumentar zoom"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoom(1)}
                    className="px-1 text-[10px] text-[var(--text-muted,#64748b)] dark:text-slate-400 hover:text-cyan-300 font-semibold cursor-pointer"
                    title="Restablecer zoom a 100%"
                  >
                    100%
                  </button>
                </div>

                {/* Add Node Button */}
                <button
                  onClick={() => {
                    setAddNodeTarget(undefined);
                    setIsAddNodeModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#151c2c] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#1f283d] text-cyan-300 border border-cyan-500/30 text-xs font-semibold cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Etapa</span>
                </button>

                {/* Run Test Simulation Button */}
                <button
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Play className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Simulando...' : 'Probar Flujo'}</span>
                </button>

                {/* Delete Workflow */}
                <button
                  onClick={() => deleteWorkflow(selectedWf.id)}
                  className="p-1.5 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#141a26] hover:bg-rose-500/20 hover:text-rose-300 text-[var(--text-muted,#64748b)] dark:text-slate-400 transition-colors cursor-pointer"
                  title="Eliminar flujo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Canvas Scrollable Viewport */}
            <div
              ref={canvasRef}
              className="flex-1 overflow-auto relative p-8 cursor-default bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#07090e]"
              style={{
                backgroundImage: `radial-gradient(#1a2233 1px, transparent 1px)`,
                backgroundSize: '24px 24px',
              }}
            >
              {/* Scaled Flow Graph Workspace */}
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top left',
                  width: `${layoutResult.canvasSize.width}px`,
                  height: `${layoutResult.canvasSize.height}px`,
                  position: 'relative',
                }}
              >
                {/* SVG Visual Stage Lanes & Columns (Rendered under nodes) */}
                {layoutResult.stages.map((stage) => (
                  <div
                    key={`stage-${stage.index}`}
                    style={{
                      position: 'absolute',
                      left: `${stage.bounds.x}px`,
                      top: `${stage.bounds.y}px`,
                      width: `${stage.bounds.width}px`,
                      height: `${stage.bounds.height}px`,
                    }}
                    className="rounded-2xl border border-[var(--border-subtle,#e2e8f0)] dark:border-[#141b2b] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0a0d16]/60 backdrop-blur-xs p-3.5 pointer-events-none transition-all duration-300"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#141b2a]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-cyan-300">
                          Etapa {stage.index + 1}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-[var(--text-muted)]">
                        {stage.nodeIds.length} {stage.nodeIds.length === 1 ? 'bloque' : 'bloques'}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 truncate">
                      {stage.name}
                    </p>
                    <p className="text-[9px] text-[var(--text-muted)] truncate">
                      {stage.subtitle}
                    </p>
                  </div>
                ))}

                {/* SVG Connection Lines & Curved Paths */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  style={{ zIndex: 15 }}
                >
                  <defs>
                    <marker
                      id="arrowhead-default"
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#0ea5e9" />
                    </marker>
                    <marker
                      id="arrowhead-true"
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981" />
                    </marker>
                    <marker
                      id="arrowhead-false"
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="6"
                      markerHeight="6"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 1 L 10 5 L 0 9 z" fill="#f43f5e" />
                    </marker>
                  </defs>

                  {layoutResult.connections.map((conn) => (
                    <FlowConnectionLine
                      key={conn.id}
                      connection={conn}
                      isSimulating={isSimulating}
                      onInsertNodeBetween={(connId, fromId, toId) => {
                        setAddNodeTarget({
                          insertBetween: { fromId, toId },
                          parentTitle: `Conexión entre ${fromId} y ${toId}`,
                        });
                        setIsAddNodeModalOpen(true);
                      }}
                    />
                  ))}
                </svg>

                {/* Flow Node Cards */}
                {layoutResult.nodes.map((node) => (
                  <FlowNodeCard
                    key={node.id}
                    node={node}
                    direction={direction}
                    isSelected={selectedNodeId === node.id}
                    isSimulating={isSimulating}
                    onSelect={(id) => setSelectedNodeId(id)}
                    onDelete={handleDeleteNode}
                    onDuplicate={handleDuplicateNode}
                    onMoveStage={handleMoveStage}
                    onAddChildNode={(parentNodeId) => {
                      setAddNodeTarget({
                        parentNodeId,
                        parentTitle: node.title,
                      });
                      setIsAddNodeModalOpen(true);
                    }}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>
            </div>

            {/* Bottom Real-time Simulation Console */}
            {simulationLogs.length > 0 && (
              <div className="border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#182032] bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#080b12] p-3 max-h-44 overflow-y-auto shrink-0 font-mono text-xs z-30">
                <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-[var(--border-subtle,#e2e8f0)] dark:border-[#141a29]">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    Terminal de Ejecución en Vivo
                  </span>
                  <button
                    onClick={() => setSimulationLogs([])}
                    className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary,#475569)] dark:hover:text-slate-300 cursor-pointer"
                  >
                    Limpiar
                  </button>
                </div>
                <div className="space-y-1">
                  {simulationLogs.map((log, i) => (
                    <div key={i} className="text-[var(--text-secondary,#475569)] dark:text-slate-300 text-[11px] leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-center text-[var(--text-muted)]">
            <div>
              <Workflow className="w-12 h-12 mx-auto text-[var(--text-secondary)] mb-3" />
              <h3 className="text-sm font-bold text-[var(--text-secondary,#475569)] dark:text-slate-300">Ningún flujo seleccionado</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">Selecciona un flujo del panel lateral o crea uno nuevo.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Add Node Catalog */}
      <AddNodeModal
        isOpen={isAddNodeModalOpen}
        onClose={() => {
          setIsAddNodeModalOpen(false);
          setAddNodeTarget(undefined);
        }}
        onAddNode={handleAddNode}
        targetInfo={addNodeTarget}
      />

      {/* Modal: New Workflow */}
      {isNewWfModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#0d1017] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#1e2538] rounded-2xl shadow-2xl p-6 text-xs text-[var(--text-primary,#0f172a)] dark:text-slate-200">
            <h3 className="text-sm font-bold text-[var(--text-primary,#0f172a)] dark:text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Crear Nuevo Flujo Automatizado
            </h3>
            <p className="text-[var(--text-muted,#64748b)] dark:text-slate-400 mb-4">
              El motor de auto-layout organizará las etapas y líneas automáticamente a medida que construyas el flujo.
            </p>

            <form onSubmit={handleCreateWorkflow} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Nombre del Flujo</label>
                <input
                  type="text"
                  placeholder="ej. Calificación Instantánea & Bienvenida WhatsApp"
                  value={wfName}
                  onChange={(e) => setWfName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#131824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21293d] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-emerald-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Descripción</label>
                <textarea
                  placeholder="Resumen del objetivo del flujo..."
                  value={wfDescription}
                  onChange={(e) => setWfDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#131824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21293d] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-emerald-500 h-16 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Tipo de Disparador</label>
                  <select
                    value={wfTrigger}
                    onChange={(e) => setWfTrigger(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#131824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21293d] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-emerald-500 text-xs cursor-pointer"
                  >
                    <option value="record_created">Registro Creado</option>
                    <option value="stage_changed">Etapa Cambiada</option>
                    <option value="field_updated">Campo Modificado</option>
                    <option value="schedule">Programación Cron</option>
                    <option value="webhook">Webhook HTTP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[var(--text-secondary,#475569)] dark:text-slate-300 mb-1">Objeto Principal</label>
                  <select
                    value={wfTarget}
                    onChange={(e) => setWfTarget(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#131824] border border-[var(--border-subtle,#e2e8f0)] dark:border-[#21293d] text-[var(--text-primary,#0f172a)] dark:text-white focus:outline-none focus:border-emerald-500 text-xs cursor-pointer"
                  >
                    <option value="person">Contactos / Leads</option>
                    <option value="opportunity">Oportunidades / Deals</option>
                    <option value="company">Empresas B2B</option>
                    <option value="whatsapp">Inbox WhatsApp</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border-subtle,#e2e8f0)] dark:border-[#1b2234]">
                <button
                  type="button"
                  onClick={() => setIsNewWfModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-[var(--bg-card,#ffffff)] dark:bg-[#182030] hover:bg-[var(--bg-card-hover,#f1f5f9)] dark:hover:bg-[#202a3f] text-[var(--text-secondary,#475569)] dark:text-slate-300 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md cursor-pointer"
                >
                  Crear y Organizar Flujo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
