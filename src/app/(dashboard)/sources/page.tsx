"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plug,
  RefreshCw,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Upload,
  FileUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function NotionLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M6.017 4.313l55.333 -4.087c6.797 -0.583 8.543 -0.19 12.817 2.917l17.663 12.443c2.913 2.14 3.883 2.723 3.883 5.053v68.243c0 4.277 -1.553 6.807 -6.99 7.193L24.467 99.967c-4.08 0.193 -6.023 -0.39 -8.16 -3.113L3.3 79.94c-2.333 -3.113 -3.3 -5.443 -3.3 -8.167V11.113c0 -3.497 1.553 -6.413 6.017 -6.8z" />
      <path d="M61.35 0.227l-55.333 4.087C1.553 4.7 0 7.617 0 11.113v60.66c0 2.723 0.967 5.053 3.3 8.167l13.007 16.913c2.137 2.723 4.08 3.307 8.16 3.113l64.257 -3.89c5.433 -0.387 6.99 -2.917 6.99 -7.193V20.64c0 -2.21 -0.873 -2.847 -3.443 -4.733L74.167 3.143c-4.273 -3.107 -6.02 -3.5 -12.817 -2.917zM25.92 19.523c-5.247 0.353 -6.437 0.433 -9.417 -1.99L8.927 11.507c-0.77 -0.78 -0.383 -1.753 1.557 -1.947l53.193 -3.887c4.467 -0.39 6.793 1.167 8.54 2.527l9.123 6.61c0.39 0.197 1.36 1.36 0.193 1.36l-54.933 3.307 -0.68 0.047zM19.803 88.3V30.367c0 -2.53 0.777 -3.697 3.103 -3.893L86 22.78c2.14 -0.193 3.107 1.167 3.107 3.693v57.547c0 2.53 -0.39 4.67 -3.883 4.863l-60.377 3.5c-3.493 0.193 -5.043 -0.97 -5.043 -4.083zm59.6 -54.827c0.387 1.75 0 3.5 -1.75 3.7l-2.91 0.577v42.773c-2.527 1.36 -4.853 2.137 -6.797 2.137 -3.107 0 -3.883 -0.973 -6.21 -3.887l-19.03 -29.94v28.967l6.02 1.363s0 3.5 -4.857 3.5l-13.39 0.777c-0.39 -0.78 0 -2.723 1.357 -3.11l3.497 -0.97v-38.3L30.48 40.667c-0.39 -1.75 0.58 -4.277 3.3 -4.473l14.367 -0.967 19.8 30.327v-26.83l-5.047 -0.58c-0.39 -2.143 1.163 -3.7 3.103 -3.89l13.4 -0.78z" fill="white" />
    </svg>
  );
}

function SlackLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  );
}

interface Source {
  id: string;
  type: string;
  name: string;
  syncedAt: string | null;
  createdAt: string;
  _count: { documents: number };
}

export default function SourcesPage() {
  return (
    <Suspense>
      <SourcesContent />
    </Suspense>
  );
}

function SourcesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const autoSyncTriggered = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const fetchSources = useCallback(async () => {
    try {
      const res = await fetch("/api/sources");
      if (res.ok) {
        setSources(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch sources:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  // Auto-sync on first connection
  useEffect(() => {
    const syncId = searchParams.get("sync");
    if (!syncId || autoSyncTriggered.current || loading || sources.length === 0) return;
    autoSyncTriggered.current = true;

    const source = sources.find((s) => s.id === syncId);
    if (source && !source.syncedAt) {
      // Clear sync param from URL
      router.replace("/sources", { scroll: false });
      handleSync(source);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sources, loading]);

  async function handleSync(source: Source) {
    setSyncing(source.id);
    setMessage(null);
    try {
      const endpoint =
        source.type === "notion"
          ? "/api/sources/notion/sync"
          : "/api/sources/slack/sync";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceId: source.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessage({
          type: "success",
          text: `Synced ${data.pagesProcessed || data.channelsProcessed} items, created ${data.chunksCreated} chunks`,
        });
        fetchSources();
      } else {
        setMessage({ type: "error", text: "Sync failed. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Sync failed. Please try again." });
    } finally {
      setSyncing(null);
    }
  }

  async function handleUpload(files: FileList) {
    setUploading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      for (const file of Array.from(files)) {
        formData.append("files", file);
      }
      const res = await fetch("/api/sources/file/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        setMessage({
          type: "success",
          text: `Uploaded ${data.filesProcessed} file(s), created ${data.chunksCreated} chunks`,
        });
        fetchSources();
      } else {
        const data = await res.json().catch(() => null);
        setMessage({
          type: "error",
          text: data?.error || "Upload failed. Please try again.",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/sources?id=${id}`, { method: "DELETE" });
      setSources((prev) => prev.filter((s) => s.id !== id));
      setMessage({ type: "success", text: "Source disconnected" });
    } catch {
      setMessage({ type: "error", text: "Failed to disconnect source" });
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Sources</h1>
          <p className="text-sm text-gray-500 mt-1">
            Connect external services to enhance your AI with relevant context
          </p>
        </div>

        {/* Status message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm max-w-lg ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connect buttons */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Add a source
          </h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/sources/notion/connect"
              className="liquid-glass rounded-2xl px-5 py-4 flex items-center gap-3 group transition-all hover:shadow-md w-64"
            >
              <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                <NotionLogo className="w-5 h-5 text-black" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900">Notion</h3>
                <p className="text-xs text-gray-400">Pages & databases</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
            </a>

            <a
              href="/api/sources/slack/connect"
              className="liquid-glass rounded-2xl px-5 py-4 flex items-center gap-3 group transition-all hover:shadow-md w-64"
            >
              <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                <SlackLogo className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900">Slack</h3>
                <p className="text-xs text-gray-400">Messages & channels</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
            </a>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="liquid-glass rounded-2xl px-5 py-4 flex items-center gap-3 group transition-all hover:shadow-md w-64 text-left cursor-pointer disabled:opacity-50"
            >
              <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                {uploading ? (
                  <Loader2 className="w-5 h-5 text-white animate-spin" />
                ) : (
                  <Upload className="w-5 h-5 text-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-gray-900">
                  {uploading ? "Uploading..." : "Upload Files"}
                </h3>
                <p className="text-xs text-gray-400">PDF, Markdown, Text</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.md,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleUpload(e.target.files);
                }
              }}
            />
          </div>
        </div>

        {/* Connected sources */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Connected Sources
          </h2>

          {loading ? (
            <div className="py-12">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : sources.length === 0 ? (
            <div className="text-center py-12">
              <Plug className="w-7 h-7 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-400">
                No sources connected yet.
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-w-2xl">
              <AnimatePresence>
                {sources.map((source) => (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="liquid-glass rounded-2xl p-4 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center flex-shrink-0">
                      {source.type === "notion" ? (
                        <NotionLogo className="w-5 h-5 text-black" />
                      ) : source.type === "file" ? (
                        <FileUp className="w-5 h-5 text-white" />
                      ) : (
                        <SlackLogo className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-900 truncate">
                          {source.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] border-gray-200 rounded-full text-gray-500"
                        >
                          {source.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                        <span>{source._count.documents} docs</span>
                        {source.syncedAt && (
                          <span>
                            Synced{" "}
                            {new Date(source.syncedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {source.type !== "file" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSync(source)}
                          disabled={syncing === source.id}
                          className="h-8 w-8 text-gray-400 hover:text-gray-900 rounded-full"
                        >
                          {syncing === source.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(source.id)}
                        className="h-8 w-8 text-gray-400 hover:text-red-500 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
