"use client";

import { useState, useEffect, useCallback } from "react";

interface Source {
  id: string;
  type: string;
  name: string;
  syncedAt: string | null;
  createdAt: string;
  _count: { documents: number };
}

export function useSources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/sources");
      if (res.ok) {
        setSources(await res.json());
      } else {
        setError("Failed to fetch sources");
      }
    } catch {
      setError("Failed to fetch sources");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const deleteSource = async (id: string) => {
    await fetch(`/api/sources?id=${id}`, { method: "DELETE" });
    setSources((prev) => prev.filter((s) => s.id !== id));
  };

  return { sources, loading, error, refetch: fetchSources, deleteSource };
}
