import { useState, useEffect, useCallback, useMemo } from 'react';
import { TableColumnConfig } from '../types';
import { useCRM } from '../context/CRMContext';

export function useTableColumns(tableKey: string, defaultColumns: TableColumnConfig[]) {
  const storageKey = `clientum_columns_${tableKey}`;
  const { currentUser, updateCurrentUser } = useCRM();

  const [columns, setColumns] = useState<TableColumnConfig[]>(() => {
    // 1. Try reading from currentUser profile preferences first
    if (currentUser?.preferences?.tableColumns?.[tableKey]) {
      const userCols = currentUser.preferences.tableColumns[tableKey];
      const merged = defaultColumns.map((defCol, idx) => {
        const savedCol = userCols.find((p: TableColumnConfig) => p.id === defCol.id);
        if (savedCol) {
          return {
            ...defCol,
            visible: savedCol.visible,
            order: savedCol.order ?? idx,
            width: savedCol.width ?? defCol.width,
          };
        }
        return { ...defCol, order: idx };
      });
      return merged.sort((a, b) => a.order - b.order);
    }

    // 2. Fallback to localStorage
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: TableColumnConfig[] = JSON.parse(saved);
        // Merge with defaultColumns in case new columns were added to the code
        const merged = defaultColumns.map((defCol, idx) => {
          const savedCol = parsed.find((p) => p.id === defCol.id);
          if (savedCol) {
            return {
              ...defCol,
              visible: savedCol.visible,
              order: savedCol.order ?? idx,
              width: savedCol.width ?? defCol.width,
            };
          }
          return { ...defCol, order: idx };
        });
        return merged.sort((a, b) => a.order - b.order);
      }
    } catch {
      // Fallback to defaults
    }
    return defaultColumns.map((col, idx) => ({ ...col, order: idx }));
  });

  // Save changes to localStorage and user profile preferences
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(columns));
      
      // Update currentUser preferences if different
      if (currentUser?.id && updateCurrentUser) {
        const currentPrefs = currentUser.preferences || {};
        const currentTablePrefs = currentPrefs.tableColumns || {};
        if (JSON.stringify(currentTablePrefs[tableKey]) !== JSON.stringify(columns)) {
          updateCurrentUser({
            preferences: {
              ...currentPrefs,
              tableColumns: {
                ...currentTablePrefs,
                [tableKey]: columns,
              },
            },
          });
        }
      }
    } catch (e) {
      console.warn('Failed to save table columns preferences', e);
    }
  }, [columns, storageKey, currentUser?.id, tableKey, updateCurrentUser]);

  const toggleColumn = useCallback((columnId: string) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === columnId) {
          return { ...col, visible: !col.visible };
        }
        return col;
      })
    );
  }, []);

  const moveColumn = useCallback((columnId: string, direction: 'up' | 'down') => {
    setColumns((prev) => {
      const index = prev.findIndex((c) => c.id === columnId);
      if (index === -1) return prev;
      if (direction === 'up' && index === 0) return prev;
      if (direction === 'down' && index === prev.length - 1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const newCols = [...prev];
      const temp = newCols[index];
      newCols[index] = newCols[targetIndex];
      newCols[targetIndex] = temp;

      return newCols.map((c, idx) => ({ ...c, order: idx }));
    });
  }, []);

  const setAllVisibility = useCallback((visible: boolean) => {
    setColumns((prev) => prev.map((col) => ({ ...col, visible })));
  }, []);

  const resetToDefault = useCallback(() => {
    const reset = defaultColumns.map((col, idx) => ({ ...col, order: idx }));
    setColumns(reset);
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  }, [defaultColumns, storageKey]);

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => col.visible).sort((a, b) => a.order - b.order);
  }, [columns]);

  const isColumnVisible = useCallback(
    (columnId: string) => {
      const col = columns.find((c) => c.id === columnId);
      return col ? col.visible : true;
    },
    [columns]
  );

  return {
    columns,
    visibleColumns,
    toggleColumn,
    moveColumn,
    setAllVisibility,
    resetToDefault,
    isColumnVisible,
  };
}
