"use client";

import { AI_MODELS, type AIModel } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelSelectorProps {
  value: AIModel;
  onChange: (model: AIModel) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as AIModel)}>
      <SelectTrigger className="w-[200px] border-gray-200 bg-white text-sm rounded-full shadow-none outline-none focus:ring-0 focus:ring-offset-0 focus:border-gray-200 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-gray-200 focus-visible:outline-none">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-white border-gray-200 rounded-xl">
        {AI_MODELS.map((model) => (
          <SelectItem
            key={model.id}
            value={model.id}
            className="text-sm hover:bg-gray-50 focus:bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  model.provider === "openai"
                    ? "bg-green-500"
                    : "bg-orange-500"
                }`}
              />
              {model.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
