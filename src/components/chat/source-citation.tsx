"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, FileText, FileUp, Hash, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Citation } from "@/types";

const VISIBLE_COUNT = 3;

interface SourceCitationProps {
  citations: Citation[];
}

function CitationBadge({ citation }: { citation: Citation }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="border-gray-200 bg-white text-xs cursor-pointer hover:bg-gray-50 transition-colors gap-1 rounded-full text-gray-600"
        >
          {citation.sourceType === "notion" ? (
            <FileText className="w-3 h-3 text-gray-500" />
          ) : citation.sourceType === "file" ? (
            <FileUp className="w-3 h-3 text-gray-500" />
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
  );
}

export function SourceCitations({ citations }: SourceCitationProps) {
  const [expanded, setExpanded] = useState(false);

  if (!citations || citations.length === 0) return null;

  const hasMore = citations.length > VISIBLE_COUNT;
  const visible = expanded ? citations : citations.slice(0, VISIBLE_COUNT);
  const hiddenCount = citations.length - VISIBLE_COUNT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap items-center gap-2 mt-3"
    >
      <span className="text-xs text-gray-400 mr-1">Sources:</span>
      <TooltipProvider>
        <AnimatePresence initial={false}>
          {visible.map((citation, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index >= VISIBLE_COUNT ? (index - VISIBLE_COUNT) * 0.05 : 0 }}
            >
              <CitationBadge citation={citation} />
            </motion.div>
          ))}
        </AnimatePresence>
      </TooltipProvider>
      {hasMore && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          {expanded ? "Show less" : `+${hiddenCount} more`}
          {expanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      )}
    </motion.div>
  );
}
