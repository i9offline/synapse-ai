"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Plug,
  Settings,
  Plus,
  Trash2,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

const navItems = [
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/sources", icon: Plug, label: "Sources" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [pathname]);

  async function fetchConversations() {
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }

  async function handleNewChat() {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const conv = await res.json();
        router.push(`/chat/${conv.id}`);
        fetchConversations();
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  }

  async function handleDeleteConversation(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`/api/conversations?id=${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (pathname === `/chat/${id}`) {
        router.push("/chat");
      }
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-white flex flex-col border-r border-gray-200 overflow-hidden"
    >
      {/* Logo & Collapse */}
      <div className="flex items-center justify-between p-4 min-h-[64px]">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Logo size={36} className="flex-shrink-0" />
              <span className="font-bold text-gray-900 text-lg font-[family-name:var(--font-sora)] tracking-tight">SynapseAI</span>
            </motion.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-gray-900 flex-shrink-0"
        >
          {collapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* New Chat */}
      <div className="px-3 mb-2">
        <Button
          onClick={handleNewChat}
          className={cn(
            "w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full",
            collapsed ? "px-2" : ""
          )}
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span className="ml-2">New Chat</span>}
        </Button>
      </div>

      {/* Nav Items */}
      <div className="px-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Conversations */}
      {!collapsed && (
        <div className="flex-1 mt-4 overflow-hidden">
          <div className="px-4 mb-2">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Conversations
            </span>
          </div>
          <ScrollArea className="flex-1 px-3">
            <AnimatePresence>
              {conversations.map((conv) => {
                const isActive = pathname === `/chat/${conv.id}`;
                return (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <Link href={`/chat/${conv.id}`}>
                      <div
                        className={cn(
                          "group flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 mb-1",
                          isActive
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        <span className="text-sm truncate flex-1">
                          {conv.title}
                        </span>
                        <button
                          onClick={(e) =>
                            handleDeleteConversation(conv.id, e)
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </ScrollArea>
        </div>
      )}

      {/* User */}
      <div className="p-3 mt-auto border-t border-gray-200">
        <div
          className={cn(
            "flex items-center gap-3 px-3 py-2",
            collapsed ? "justify-center" : ""
          )}
        >
          <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {session?.user?.name?.[0]?.toUpperCase() || "?"}
            </span>
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {session?.user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className="text-gray-400 hover:text-red-500 flex-shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}
