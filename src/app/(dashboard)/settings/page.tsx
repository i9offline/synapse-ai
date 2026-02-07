"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="h-full overflow-y-auto">
      <div className="px-8 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Profile
          </h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-5 flex items-center gap-4 max-w-md">
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-white">
                {session?.user?.name?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900">
                {session?.user?.name}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{session?.user?.email}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
