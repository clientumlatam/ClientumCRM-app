import React from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { PublicRoutePath } from './publicRoutes';

export interface PublicSearchItem {
  title: string;
  category: string;
  path: PublicRoutePath;
  desc: string;
}

interface PublicSearchDialogProps {
  isOpen: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onClose: () => void;
  onSelect: (path: PublicRoutePath) => void;
  items: PublicSearchItem[];
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const PublicSearchDialog: React.FC<PublicSearchDialogProps> = ({
  isOpen,
  query,
  onQueryChange,
  onClose,
  onSelect,
  items,
  inputRef,
}) => {
  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();
  const results = normalizedQuery
    ? items.filter((item) =>
        [item.title, item.desc, item.category].some((value) =>
          value.toLowerCase().includes(normalizedQuery),
        ),
      )
    : items.slice(0, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-20 backdrop-blur-xs">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-200 p-3.5">
          <Search className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Escribe para buscar cualquier módulo, industria o herramienta..."
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none sm:text-sm"
            aria-label="Buscar en el sitio público"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#64748b] dark:text-white dark:text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Cerrar búsqueda"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="max-h-[380px] space-y-1 overflow-y-auto p-2">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#64748b] dark:text-white dark:text-slate-400">
            {normalizedQuery ? `Resultados (${results.length})` : 'Sugerencias Populares'}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748b] dark:text-white dark:text-slate-400">
              No se encontraron resultados para &quot;{query}&quot;. Prueba con &quot;AFIP&quot;, &quot;WhatsApp&quot;,
              &quot;Agro&quot; o &quot;Precios&quot;.
            </div>
          ) : (
            results.map((item) => (
              <button
                type="button"
                key={item.path}
                onClick={() => onSelect(item.path)}
                className="group flex w-full items-center justify-between rounded-xl border border-transparent p-2.5 text-left transition-all hover:border-blue-200 hover:bg-blue-50/70"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-900 group-hover:text-blue-700">
                    <span>{item.title}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-normal text-slate-600">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-500">{item.desc}</p>
                </div>
                <ArrowRight className="ml-2 h-4 w-4 shrink-0 text-[#475569] dark:text-white dark:text-slate-300 group-hover:text-blue-600" aria-hidden="true" />
              </button>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-2.5 text-[10px] text-slate-500">
          <span>
            Presiona <strong>ESC</strong> para cerrar
          </span>
          <span>Clientum Suite Latam</span>
        </div>
      </div>
    </div>
  );
};