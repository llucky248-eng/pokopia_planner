"use client";

import { useCallback } from "react";
import { ChecklistState } from "@/types";
import { LOCAL_STORAGE_CHECKLIST_KEY } from "@/lib/constants";
import { DEFAULT_CHECKLIST } from "@/data/checklist-data";
import { useLocalStorage } from "./useLocalStorage";

const DEFAULT_STATE: ChecklistState = { entries: DEFAULT_CHECKLIST };

export function useChecklist() {
  const [state, setState] = useLocalStorage<ChecklistState>(LOCAL_STORAGE_CHECKLIST_KEY, DEFAULT_STATE);

  const toggleItem = useCallback(
    (id: string) => {
      setState((prev) => ({
        entries: prev.entries.map((e) => (e.id === id ? { ...e, checked: !e.checked } : e)),
      }));
    },
    [setState]
  );

  const resetAll = useCallback(() => {
    setState(DEFAULT_STATE);
  }, [setState]);

  const getProgress = useCallback(
    (category: string) => {
      const items = state.entries.filter((e) => e.category === category);
      const checked = items.filter((e) => e.checked).length;
      return { checked, total: items.length };
    },
    [state.entries]
  );

  const overallProgress = useCallback(() => {
    const checked = state.entries.filter((e) => e.checked).length;
    return { checked, total: state.entries.length };
  }, [state.entries]);

  return { state, toggleItem, resetAll, getProgress, overallProgress };
}
