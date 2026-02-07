"use client";

import { motion } from "framer-motion";
import { ExternalLink, FileText, Hash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Citation } from "@/types";

interface SourceCitationProps {
  citations: Citation[];
}

export function SourceCitations({ citations }: SourceCitationProps) {
  if (!citations || citations.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-2 mt-3"
    >
      <span className="text-xs text-gray-400 mr-1">Sources:</span>
      <TooltipProvider>
        {citations.map((citation, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className="border-gray-200 bg-white text-xs cursor-pointer hover:bg-gray-50 transition-colors gap-1 rounded-full text-gray-600"
              >
                {citation.sourceType === "notion" ? (
                  <FileText className="w-3 h-3 text-gray-500" />
                ) : (
                  <Hash className="w-3 h-3 text-gray-500" />
                )}
                {citation.documentTitle}
                {citation.url && (
                  <ExternalLink className="w-2.5 h-2.5 ml-1 text-gray-400" />
                )}
              </Badge>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="bg-white border-gray-200 max-w-sm rounded-xl shadow-lg"
            >
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-900">
                  {citation.sourceName} - {citation.documentTitle}
                </p>
                <p className="text-xs text-gray-500">
                  {citation.chunk}...
                </p>
                <p className="text-xs text-gray-700 font-medium">
                  Relevance: {Math.round(citation.score * 100)}%
                </p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </motion.div>
  );
}
