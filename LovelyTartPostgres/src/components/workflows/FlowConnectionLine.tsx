import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { LaidOutConnection } from './flowAutoLayout';

interface FlowConnectionLineProps {
  connection: LaidOutConnection;
  isSimulating: boolean;
  onInsertNodeBetween: (connectionId: string, fromNodeId: string, toNodeId: string) => void;
  onDeleteConnection?: (connectionId: string) => void;
}

export const FlowConnectionLine: React.FC<FlowConnectionLineProps> = ({
  connection,
  isSimulating,
  onInsertNodeBetween,
  onDeleteConnection,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!connection.path) return null;

  const isTrueBranch = connection.branch === 'true';
  const isFalseBranch = connection.branch === 'false';

  // Path styling
  let strokeColor = '#0ea5e9'; // Cyan/sky default
  let glowColor = 'rgba(14, 165, 233, 0.4)';
  let chipBg = 'bg-[var(--bg-canvas,#f8fafc)] dark:bg-[#101b2b] text-cyan-300 border-cyan-500/30';

  if (isTrueBranch) {
    strokeColor = '#10b981'; // Emerald
    glowColor = 'rgba(16, 185, 129, 0.4)';
    chipBg = 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40';
  } else if (isFalseBranch) {
    strokeColor = '#f43f5e'; // Rose
    glowColor = 'rgba(244, 63, 94, 0.4)';
    chipBg = 'bg-rose-950/90 text-rose-300 border-rose-500/40';
  }

  return (
    <g
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible wide hitbox for easy hovering */}
      <path
        d={connection.path}
        fill="none"
        stroke="transparent"
        strokeWidth={22}
      />

      {/* Outer subtle glow */}
      <path
        d={connection.path}
        fill="none"
        stroke={glowColor}
        strokeWidth={isHovered ? 5 : 3}
        className="transition-all duration-200"
      />

      {/* Main Crisp Connection Path */}
      <path
        d={connection.path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isHovered ? 2.5 : 1.8}
        strokeDasharray={isFalseBranch ? '4 4' : undefined}
        markerEnd={`url(#arrowhead-${connection.branch || 'default'})`}
        className="transition-all duration-200"
      />

      {/* Signal / Flow Animated Pulse along the path during simulation */}
      {isSimulating && (
        <circle r={3.5} fill="#ffffff" filter="drop-shadow(0 0 4px #38bdf8)">
          <animateMotion
            path={connection.path}
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Midpoint Interactive Widget (Label + Quick Add Node Button) */}
      <foreignObject
        x={connection.midPoint.x - 45}
        y={connection.midPoint.y - 14}
        width={90}
        height={28}
        className="overflow-visible pointer-events-auto"
      >
        <div className="flex items-center justify-center gap-1">
          {/* Label Chip if defined */}
          {connection.label ? (
            <span
              className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase border shadow-md ${chipBg}`}
            >
              {connection.label}
            </span>
          ) : null}

          {/* Quick Insert (+) Button on hover */}
          <button
            title="Insertar nueva etapa en esta conexión"
            onClick={(e) => {
              e.stopPropagation();
              onInsertNodeBetween(connection.id, connection.fromNodeId, connection.toNodeId);
            }}
            className={`w-5 h-5 rounded-full bg-[var(--bg-card,#ffffff)] dark:bg-[#111728] border border-cyan-400/60 hover:bg-cyan-500 hover:text-black text-cyan-300 flex items-center justify-center shadow-lg transition-all cursor-pointer ${ isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-75' }`}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </foreignObject>
    </g>
  );
};
