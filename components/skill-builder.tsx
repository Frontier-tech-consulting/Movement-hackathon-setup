"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Copy, Download, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { EcosystemApp, SkillSpec } from "@/types/clawbot";

interface SkillBuilderProps {
    selectedApps: EcosystemApp[];
    onNext: (skills: SkillSpec[]) => void;
    onBack: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
    DEX: "🔄",
    DeFi: "💎",
    Lending: "🏦",
    NFT: "🖼️",
    Gaming: "🎮",
    Infrastructure: "⚙️",
    Bridge: "🌉",
    RWA: "🏢",
    Social: "💬",
    DAO: "🗳️",
};

export function SkillBuilder({ selectedApps, onNext, onBack }: SkillBuilderProps) {
    const [skills, setSkills] = useState<SkillSpec[]>(
        selectedApps.map((app) => ({
            appId: app.id,
            appName: app.name,
            userPrompt: "",
            status: "idle" as const,
        }))
    );
    const abortControllers = useRef<Record<string, AbortController>>({});

    const updateSkill = (appId: string, updates: Partial<SkillSpec>) => {
        setSkills((prev) =>
            prev.map((s) => (s.appId === appId ? { ...s, ...updates } : s))
        );
    };

    const generateSkill = async (app: EcosystemApp, skill: SkillSpec) => {
        if (!skill.userPrompt.trim()) {
            toast.error("Please describe what you want this skill to do");
            return;
        }

        const controller = new AbortController();
        abortControllers.current[app.id] = controller;

        updateSkill(app.id, { status: "generating", generatedSkillMd: "" });

        try {
            const res = await fetch("/api/skill-builder", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ app, prompt: skill.userPrompt }),
                signal: controller.signal,
            });

            if (!res.ok || !res.body) throw new Error("Stream failed");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });

                // Parse Vercel AI data stream format (prefixed lines)
                const lines = chunk.split("\n");
                for (const line of lines) {
                    if (line.startsWith("0:")) {
                        try {
                            const text = JSON.parse(line.slice(2));
                            accumulated += text;
                            updateSkill(app.id, { generatedSkillMd: accumulated });
                        } catch {
                            // skip non-JSON lines
                        }
                    }
                }
            }

            updateSkill(app.id, { status: "done" });
            toast.success(`✨ Skill generated for ${app.name}!`);
        } catch (err: unknown) {
            if (err instanceof Error && err.name === "AbortError") return;
            updateSkill(app.id, { status: "error" });
            toast.error(`Failed to generate skill for ${app.name}`);
        }
    };

    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard!");
    };

    const downloadSkill = (appName: string, content: string) => {
        const slug = appName.toLowerCase().replace(/\s+/g, "-");
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SKILL.md`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Downloaded SKILL.md for ${appName}`);
        // suppress unused variable warning
        void slug;
    };

    const allDone = skills.every((s) => s.status === "done");
    const anyDone = skills.some((s) => s.status === "done");

    return (
        <div className="space-y-5">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Build AI Skills</h2>
                <p className="text-muted-foreground">
                    Describe what you want each skill to do. The AI will generate a production-ready{" "}
                    <code className="text-primary font-mono text-xs bg-primary/10 px-1.5 py-0.5 rounded">
                        SKILL.md
                    </code>{" "}
                    file.
                </p>
            </div>

            <div className="space-y-4">
                {skills.map((skill, i) => {
                    const app = selectedApps[i];
                    if (!app) return null;

                    return (
                        <Card
                            key={skill.appId}
                            className={`transition-all duration-300 ${skill.status === "done"
                                    ? "border-green-500/40 bg-green-500/5"
                                    : skill.status === "generating"
                                        ? "border-primary/40 bg-primary/5"
                                        : "border-border"
                                }`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{CATEGORY_ICONS[app.category]}</span>
                                        <div>
                                            <CardTitle className="text-base flex items-center gap-2">
                                                {app.name}
                                                {skill.status === "done" && (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                )}
                                            </CardTitle>
                                            <CardDescription className="text-xs mt-0.5">
                                                {app.category} · {app.tags.slice(0, 2).join(" · ")}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            skill.status === "done"
                                                ? "default"
                                                : skill.status === "generating"
                                                    ? "secondary"
                                                    : "outline"
                                        }
                                        className={`text-xs ${skill.status === "done" ? "bg-green-500 text-white" : ""}`}
                                    >
                                        {skill.status === "idle"
                                            ? "Ready"
                                            : skill.status === "generating"
                                                ? "Generating..."
                                                : skill.status === "done"
                                                    ? "Complete"
                                                    : "Error"}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                {/* Prompt Input */}
                                <div className="space-y-2">
                                    <Textarea
                                        placeholder={`Describe what you want this skill to do for ${app.name}...\n\nE.g. "Help me check token swap rates, find the best pools, and execute swaps with slippage protection"`}
                                        value={skill.userPrompt}
                                        onChange={(e) =>
                                            updateSkill(skill.appId, { userPrompt: e.target.value })
                                        }
                                        disabled={skill.status === "generating"}
                                        rows={3}
                                        className="resize-none text-sm"
                                    />
                                    <Button
                                        size="sm"
                                        onClick={() => generateSkill(app, skill)}
                                        disabled={
                                            skill.status === "generating" || !skill.userPrompt.trim()
                                        }
                                        className="w-full gap-2 bg-primary hover:bg-primary/90"
                                    >
                                        {skill.status === "generating" ? (
                                            <>
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                Generating SKILL.md...
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="h-3.5 w-3.5" />
                                                Generate Skill
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Generated output */}
                                {(skill.generatedSkillMd || skill.status === "generating") && (
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-xs font-mono text-muted-foreground">
                                                    SKILL.md
                                                </span>
                                                {skill.status === "done" && skill.generatedSkillMd && (
                                                    <div className="flex gap-1.5">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                copyToClipboard(skill.generatedSkillMd!)
                                                            }
                                                            className="h-6 px-2 text-xs gap-1"
                                                        >
                                                            <Copy className="h-3 w-3" />
                                                            Copy
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() =>
                                                                downloadSkill(app.name, skill.generatedSkillMd!)
                                                            }
                                                            className="h-6 px-2 text-xs gap-1"
                                                        >
                                                            <Download className="h-3 w-3" />
                                                            Download
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            <pre className="text-xs bg-muted/50 rounded-lg p-3 overflow-x-auto max-h-60 overflow-y-auto border border-border font-mono whitespace-pre-wrap leading-relaxed">
                                                {skill.generatedSkillMd || (
                                                    <span className="animate-pulse text-muted-foreground">
                                                        Generating your skill...
                                                    </span>
                                                )}
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onBack} className="flex-1">
                    ← Back
                </Button>
                <Button
                    onClick={() => onNext(skills)}
                    disabled={!anyDone}
                    className="flex-1 bg-primary hover:bg-primary/90"
                >
                    Register Agent →
                </Button>
            </div>
            {!allDone && anyDone && (
                <p className="text-xs text-center text-muted-foreground">
                    You can proceed with {skills.filter((s) => s.status === "done").length}{" "}
                    completed skill(s)
                </p>
            )}
        </div>
    );
}
