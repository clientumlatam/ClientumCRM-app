import { WorkflowNode, WorkflowConnection } from '../../types';

export interface LayoutOptions {
  direction?: 'LR' | 'TB'; // LR = Left-to-Right (Columns), TB = Top-to-Bottom (Rows)
  nodeWidth?: number;
  nodeHeight?: number;
  stageGap?: number; // Distance between stage lanes
  nodeGap?: number; // Distance between sibling nodes in the same stage
  padding?: { x: number; y: number };
}

export interface LaidOutNode extends WorkflowNode {
  x: number;
  y: number;
  width: number;
  height: number;
  stageIndex: number;
  depth: number;
}

export interface LaidOutConnection extends WorkflowConnection {
  path: string;
  sourcePoint: { x: number; y: number };
  targetPoint: { x: number; y: number };
  midPoint: { x: number; y: number };
  arrowAngle: number; // Angle in degrees for arrowhead
  branchType: 'default' | 'true' | 'false' | 'fallback';
}

export interface LaidOutStage {
  index: number;
  name: string;
  subtitle: string;
  nodeIds: string[];
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface LayoutResult {
  nodes: LaidOutNode[];
  connections: LaidOutConnection[];
  stages: LaidOutStage[];
  canvasSize: { width: number; height: number };
}

// Default stage names based on depth / index
const DEFAULT_STAGE_NAMES = [
  { name: 'Disparador & Entrada', subtitle: 'Evento inicial o webhook' },
  { name: 'Filtrado & Enriquecimiento IA', subtitle: 'Validación y scoring' },
  { name: 'Lógica & Bifurcación', subtitle: 'Reglas condicionales' },
  { name: 'Acciones en CRM', subtitle: 'Actualización y tareas' },
  { name: 'Mensajería & Notificación', subtitle: 'WhatsApp, Email y alertas' },
  { name: 'Facturación & ERP', subtitle: 'Cierre, comprobantes y webhook' },
  { name: 'Post-Venta & Fidelización', subtitle: 'Encuestas y seguimiento' },
];

/**
 * Normalizes connections: if none provided or missing links, derives linear/branch connections
 */
export function ensureConnections(
  nodes: WorkflowNode[],
  existingConnections?: WorkflowConnection[]
): WorkflowConnection[] {
  if (existingConnections && existingConnections.length > 0) {
    // Validate that existing connections refer to real nodes
    const nodeIds = new Set(nodes.map((n) => n.id));
    const valid = existingConnections.filter((c) => nodeIds.has(c.fromNodeId) && nodeIds.has(c.toNodeId));
    if (valid.length > 0) return valid;
  }

  // If nodes have parentId or nextIds, build from them
  const built: WorkflowConnection[] = [];
  const connectedTargets = new Set<string>();

  nodes.forEach((node, idx) => {
    if (node.parentId && nodes.some((n) => n.id === node.parentId)) {
      built.push({
        id: `conn-${node.parentId}-${node.id}`,
        fromNodeId: node.parentId,
        toNodeId: node.id,
        label: node.branchLabel || (node.type === 'condition' ? 'Evaluar' : undefined),
        branch: node.branchLabel?.toLowerCase().includes('no') ? 'false' : node.branchLabel?.toLowerCase().includes('si') ? 'true' : 'default',
        status: 'idle',
      });
      connectedTargets.add(node.id);
    }
  });

  // If no parent links, construct default sequential stages
  if (built.length === 0 && nodes.length > 1) {
    for (let i = 0; i < nodes.length - 1; i++) {
      const fromNode = nodes[i];
      const toNode = nodes[i + 1];
      built.push({
        id: `conn-${fromNode.id}-${toNode.id}`,
        fromNodeId: fromNode.id,
        toNodeId: toNode.id,
        label: fromNode.type === 'condition' ? 'Si cumple' : undefined,
        branch: fromNode.type === 'condition' ? 'true' : 'default',
        status: 'idle',
      });
    }
  }

  return built;
}

/**
 * Main Auto-Layout Algorithm
 * - Topologically ranks nodes into stages (layers)
 * - Orders sibling nodes within stages using barycenter heuristics
 * - Computes clean coordinates with collision avoidance and symmetric centering
 * - Computes smooth Bézier curves with arrowheads and label anchors
 */
export function computeAutoLayout(
  nodes: WorkflowNode[],
  connections: WorkflowConnection[],
  options: LayoutOptions = {}
): LayoutResult {
  const {
    direction = 'LR',
    nodeWidth = 270,
    nodeHeight = 115,
    stageGap = 130,
    nodeGap = 45,
    padding = { x: 50, y: 50 },
  } = options;

  if (nodes.length === 0) {
    return {
      nodes: [],
      connections: [],
      stages: [],
      canvasSize: { width: 800, height: 600 },
    };
  }

  const conns = ensureConnections(nodes, connections);

  // 1. Build Adjacency Graph
  const nodeMap = new Map<string, WorkflowNode>(nodes.map((n) => [n.id, n]));
  const forwardAdj = new Map<string, string[]>();
  const reverseAdj = new Map<string, string[]>();

  nodes.forEach((n) => {
    forwardAdj.set(n.id, []);
    reverseAdj.set(n.id, []);
  });

  conns.forEach((c) => {
    if (forwardAdj.has(c.fromNodeId) && reverseAdj.has(c.toNodeId)) {
      forwardAdj.get(c.fromNodeId)!.push(c.toNodeId);
      reverseAdj.get(c.toNodeId)!.push(c.fromNodeId);
    }
  });

  // 2. Compute Depth / Stage Assignment (Longest-path DAG layering)
  const nodeDepth = new Map<string, number>();

  // Roots: nodes with in-degree 0 (or triggers)
  const roots = nodes.filter((n) => {
    const parents = reverseAdj.get(n.id) || [];
    return parents.length === 0 || n.type === 'trigger';
  });

  // If no root found (e.g. cycle), use first node
  const initialRoots = roots.length > 0 ? roots : [nodes[0]];

  // BFS / Longest path to assign depths
  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = initialRoots.map((r) => ({ id: r.id, depth: 0 }));

  initialRoots.forEach((r) => nodeDepth.set(r.id, 0));

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    visited.add(id);

    const children = forwardAdj.get(id) || [];
    for (const childId of children) {
      const currentChildDepth = nodeDepth.get(childId) ?? 0;
      const newChildDepth = Math.max(currentChildDepth, depth + 1);
      nodeDepth.set(childId, newChildDepth);

      if (!visited.has(childId)) {
        queue.push({ id: childId, depth: newChildDepth });
      }
    }
  }

  // Assign depths to any disconnected nodes
  nodes.forEach((n, idx) => {
    if (!nodeDepth.has(n.id)) {
      nodeDepth.set(n.id, n.stageIndex !== undefined ? n.stageIndex : idx);
    }
  });

  // 3. Group Nodes by Stage Layer
  const maxDepth = Math.max(...Array.from(nodeDepth.values()), 0);
  const stagesMap = new Map<number, string[]>();

  for (let d = 0; d <= maxDepth; d++) {
    stagesMap.set(d, []);
  }

  nodes.forEach((n) => {
    const d = nodeDepth.get(n.id) ?? 0;
    if (!stagesMap.has(d)) stagesMap.set(d, []);
    stagesMap.get(d)!.push(n.id);
  });

  // Filter out empty stages and compact stage indices
  const compactedStages: Array<{ stageIndex: number; nodeIds: string[] }> = [];
  let currentStageIdx = 0;
  for (let d = 0; d <= maxDepth; d++) {
    const ids = stagesMap.get(d) || [];
    if (ids.length > 0) {
      compactedStages.push({ stageIndex: currentStageIdx, nodeIds: ids });
      currentStageIdx++;
    }
  }

  // 4. Position Nodes
  // We'll calculate positions stage by stage
  const laidOutNodesMap = new Map<string, LaidOutNode>();

  // Determine stage dimensions & centerlines
  const totalStages = compactedStages.length;

  // Track max height/width for canvas bounds
  let maxStageCrossDim = 0;

  // First pass: arrange nodes within each stage
  compactedStages.forEach(({ stageIndex, nodeIds }) => {
    // Sort nodes within stage using parent barycenter to minimize line crossings
    nodeIds.sort((aId, bId) => {
      const aParents = reverseAdj.get(aId) || [];
      const bParents = reverseAdj.get(bId) || [];

      const getAverageParentCross = (parents: string[]) => {
        if (parents.length === 0) return 0;
        const sum = parents.reduce((acc, pId) => {
          const parentNode = laidOutNodesMap.get(pId);
          if (!parentNode) return acc;
          return acc + (direction === 'LR' ? parentNode.y : parentNode.x);
        }, 0);
        return sum / parents.length;
      };

      const aAvg = getAverageParentCross(aParents);
      const bAvg = getAverageParentCross(bParents);

      // Prioritize condition branches
      const aNode = nodeMap.get(aId);
      const bNode = nodeMap.get(bId);
      if (aNode?.branchLabel?.toLowerCase().includes('si') && bNode?.branchLabel?.toLowerCase().includes('no')) {
        return -1;
      }
      if (aNode?.branchLabel?.toLowerCase().includes('no') && bNode?.branchLabel?.toLowerCase().includes('si')) {
        return 1;
      }

      return aAvg - bAvg;
    });

    const count = nodeIds.length;
    const stageCrossTotal = count * (direction === 'LR' ? nodeHeight : nodeWidth) + (count - 1) * nodeGap;
    if (stageCrossTotal > maxStageCrossDim) {
      maxStageCrossDim = stageCrossTotal;
    }
  });

  // Desired center line in the cross axis
  const crossCenter = padding.y + maxStageCrossDim / 2;

  // Second pass: compute exact X and Y coordinates
  compactedStages.forEach(({ stageIndex, nodeIds }) => {
    const count = nodeIds.length;

    if (direction === 'LR') {
      // Horizontal flow (Left-to-Right columns)
      const x = padding.x + stageIndex * (nodeWidth + stageGap);

      // Centered stack for this column
      const columnHeight = count * nodeHeight + (count - 1) * nodeGap;
      const startY = Math.max(padding.y, crossCenter - columnHeight / 2);

      nodeIds.forEach((nodeId, idxInStage) => {
        const rawNode = nodeMap.get(nodeId)!;
        const y = startY + idxInStage * (nodeHeight + nodeGap);

        laidOutNodesMap.set(nodeId, {
          ...rawNode,
          x,
          y,
          width: nodeWidth,
          height: nodeHeight,
          stageIndex,
          depth: stageIndex,
        });
      });
    } else {
      // Vertical flow (Top-to-Bottom rows)
      const y = padding.y + stageIndex * (nodeHeight + stageGap);

      const rowWidth = count * nodeWidth + (count - 1) * nodeGap;
      const startX = Math.max(padding.x, crossCenter - rowWidth / 2);

      nodeIds.forEach((nodeId, idxInStage) => {
        const rawNode = nodeMap.get(nodeId)!;
        const x = startX + idxInStage * (nodeWidth + nodeGap);

        laidOutNodesMap.set(nodeId, {
          ...rawNode,
          x,
          y,
          width: nodeWidth,
          height: nodeHeight,
          stageIndex,
          depth: stageIndex,
        });
      });
    }
  });

  const finalNodes: LaidOutNode[] = Array.from(laidOutNodesMap.values());

  // 5. Compute Stage Boundary Metadata (For Stage Column / Row visual lanes)
  const laidOutStages: LaidOutStage[] = compactedStages.map(({ stageIndex, nodeIds }) => {
    const stageNodes = nodeIds.map((id) => laidOutNodesMap.get(id)!).filter(Boolean);
    const minX = Math.min(...stageNodes.map((n) => n.x));
    const maxX = Math.max(...stageNodes.map((n) => n.x + n.width));
    const minY = Math.min(...stageNodes.map((n) => n.y));
    const maxY = Math.max(...stageNodes.map((n) => n.y + n.height));

    const defaultInfo = DEFAULT_STAGE_NAMES[stageIndex] || {
      name: `Etapa ${stageIndex + 1}`,
      subtitle: 'Ejecución automatizada',
    };

    const firstNode = stageNodes[0];
    const customStageName = firstNode?.stageName || defaultInfo.name;

    if (direction === 'LR') {
      return {
        index: stageIndex,
        name: customStageName,
        subtitle: defaultInfo.subtitle,
        nodeIds,
        bounds: {
          x: minX - 16,
          y: Math.min(padding.y - 10, minY - 35),
          width: nodeWidth + 32,
          height: Math.max(maxStageCrossDim + 70, maxY - minY + 70),
        },
      };
    } else {
      return {
        index: stageIndex,
        name: customStageName,
        subtitle: defaultInfo.subtitle,
        nodeIds,
        bounds: {
          x: Math.min(padding.x - 10, minX - 35),
          y: minY - 16,
          width: Math.max(maxStageCrossDim + 70, maxX - minX + 70),
          height: nodeHeight + 32,
        },
      };
    }
  });

  // 6. Compute Connection Lines (Smooth Bezier curves with arrows and midpoint anchors)
  const laidOutConnections: LaidOutConnection[] = conns.map((conn) => {
    const source = laidOutNodesMap.get(conn.fromNodeId);
    const target = laidOutNodesMap.get(conn.toNodeId);

    if (!source || !target) {
      return {
        ...conn,
        path: '',
        sourcePoint: { x: 0, y: 0 },
        targetPoint: { x: 0, y: 0 },
        midPoint: { x: 0, y: 0 },
        arrowAngle: 0,
        branchType: conn.branch || 'default',
      };
    }

    let p0: { x: number; y: number };
    let p3: { x: number; y: number };
    let p1: { x: number; y: number };
    let p2: { x: number; y: number };
    let arrowAngle = 0;

    if (direction === 'LR') {
      // Source exit: right center of source node
      p0 = { x: source.x + source.width, y: source.y + source.height / 2 };
      // Target entry: left center of target node
      p3 = { x: target.x, y: target.y + target.height / 2 };

      const deltaX = p3.x - p0.x;
      const deltaY = p3.y - p0.y;

      if (deltaX >= 20) {
        // Standard forward flow
        const curvature = Math.max(40, deltaX * 0.48);
        p1 = { x: p0.x + curvature, y: p0.y };
        p2 = { x: p3.x - curvature, y: p3.y };
      } else {
        // Backwards or loop connection
        const loopClearance = 80;
        p1 = { x: p0.x + loopClearance, y: p0.y + (deltaY >= 0 ? 50 : -50) };
        p2 = { x: p3.x - loopClearance, y: p3.y + (deltaY >= 0 ? -50 : 50) };
      }

      arrowAngle = 0; // Pointing right into target
    } else {
      // Top-to-Bottom
      p0 = { x: source.x + source.width / 2, y: source.y + source.height };
      p3 = { x: target.x + target.width / 2, y: target.y };

      const deltaY = p3.y - p0.y;

      if (deltaY >= 20) {
        const curvature = Math.max(40, deltaY * 0.48);
        p1 = { x: p0.x, y: p0.y + curvature };
        p2 = { x: p3.x, y: p3.y - curvature };
      } else {
        const loopClearance = 80;
        p1 = { x: p0.x + 50, y: p0.y + loopClearance };
        p2 = { x: p3.x - 50, y: p3.y - loopClearance };
      }

      arrowAngle = 90; // Pointing down into target
    }

    // Cubic Bézier formula to find exact midpoint (t = 0.5)
    const t = 0.5;
    const midX =
      Math.pow(1 - t, 3) * p0.x +
      3 * Math.pow(1 - t, 2) * t * p1.x +
      3 * (1 - t) * Math.pow(t, 2) * p2.x +
      Math.pow(t, 3) * p3.x;
    const midY =
      Math.pow(1 - t, 3) * p0.y +
      3 * Math.pow(1 - t, 2) * t * p1.y +
      3 * (1 - t) * Math.pow(t, 2) * p2.y +
      Math.pow(t, 3) * p3.y;

    const path = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

    return {
      ...conn,
      path,
      sourcePoint: p0,
      targetPoint: p3,
      midPoint: { x: Math.round(midX), y: Math.round(midY) },
      arrowAngle,
      branchType: conn.branch || 'default',
    };
  });

  // Calculate canvas bounding size with generous margin
  const allMaxX = Math.max(...finalNodes.map((n) => n.x + n.width), 1000);
  const allMaxY = Math.max(...finalNodes.map((n) => n.y + n.height), 700);

  return {
    nodes: finalNodes,
    connections: laidOutConnections,
    stages: laidOutStages,
    canvasSize: {
      width: Math.max(allMaxX + 120, 1100),
      height: Math.max(allMaxY + 120, 750),
    },
  };
}
