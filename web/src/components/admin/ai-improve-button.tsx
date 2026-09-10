"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function AiImproveButton({
  fieldKey,
  value,
  onAccept,
  tone = "premium",
  disabled,
}: {
  fieldKey: string;
  value: string;
  onAccept: (suggestion: string) => void;
  tone?: "premium" | "warm" | "shorter";
  disabled?: boolean;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  async function improve() {
    if (!value.trim()) {
      toast({
        title: "Add text first",
        description: "Write a draft before asking AI to improve it.",
        tone: "error",
      });
      return;
    }
    setLoading(true);
    setSuggestion(null);
    try {
      const res = await fetch("/api/admin/ai/improve-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fieldKey, currentText: value, tone }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        suggestion?: string;
        error?: string;
        disabled?: boolean;
      };
      if (!res.ok) {
        toast({
          title: data.disabled ? "AI not configured" : "Improve failed",
          description:
            data.error ?? "Unable to improve copy. Check GROQ_API_KEY.",
          tone: "error",
        });
        return;
      }
      if (data.suggestion) setSuggestion(data.suggestion);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-2 flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          loading={loading}
          disabled={disabled}
          onClick={improve}
        >
          Improve with AI
        </Button>
      </div>
      {suggestion ? (
        <div className="rounded-[var(--radius-md)] border border-border bg-surface p-3">
          <p className="mb-2 text-xs uppercase tracking-widest text-text-muted">
            Suggestion
          </p>
          <p className="whitespace-pre-wrap text-sm text-text">{suggestion}</p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="charcoal"
              onClick={() => {
                onAccept(suggestion);
                setSuggestion(null);
                toast({ title: "Suggestion applied", tone: "success" });
              }}
            >
              Accept
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setSuggestion(null)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
