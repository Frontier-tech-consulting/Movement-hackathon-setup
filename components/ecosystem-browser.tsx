"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ECOSYSTEM_APPS, ALL_CATEGORIES } from "@/lib/ecosystem-data";
import type { EcosystemApp } from "@/types/clawbot";
import { CheckCircle2, Search, Globe } from "lucide-react";

interface EcosystemBrowserProps {
    onNext: (apps: EcosystemApp[]) => void;
    onBack: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
    DEX: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    DeFi: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    Lending: "bg-green-500/10 text-green-500 border-green-500/20",
    NFT: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    Gaming: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    Infrastructure: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    Bridge: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    RWA: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    Social: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    DAO: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
};

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

export function EcosystemBrowser({ onNext, onBack }: EcosystemBrowserProps) {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState<EcosystemApp[]>([]);

    const MAX_SELECTION = 3;

    const filtered = ECOSYSTEM_APPS.filter((app) => {
        const matchesCategory =
            selectedCategory === "All" || app.category === selectedCategory;
        const q = search.toLowerCase();
        const matchesSearch =
            !q ||
            app.name.toLowerCase().includes(q) ||
            app.description.toLowerCase().includes(q) ||
            app.tags.some((t) => t.toLowerCase().includes(q));
        return matchesCategory && matchesSearch;
    });

    const toggleApp = (app: EcosystemApp) => {
        setSelected((prev) => {
            const exists = prev.find((a) => a.id === app.id);
            if (exists) return prev.filter((a) => a.id !== app.id);
            if (prev.length >= MAX_SELECTION) return prev; // max 3
            return [...prev, app];
        });
    };

    const isSelected = (app: EcosystemApp) => selected.some((a) => a.id === app.id);

    return (
        <div className="space-y-5">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                    Browse Movement Ecosystem
                </h2>
                <p className="text-muted-foreground">
                    Select up to{" "}
                    <span className="text-primary font-semibold">{MAX_SELECTION} apps</span> to
                    build AI skills for
                </p>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search ecosystem apps..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {ALL_CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${selectedCategory === cat
                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                            : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
                            }`}
                    >
                        {cat !== "All" && (
                            <span className="mr-1">{CATEGORY_ICONS[cat] ?? ""}</span>
                        )}
                        {cat}
                    </button>
                ))}
            </div>

            {/* Selection Status */}
            {selected.length > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-sm text-primary font-medium">
                        {selected.length}/{MAX_SELECTION} selected:{" "}
                        {selected.map((a) => a.name).join(", ")}
                    </span>
                </div>
            )}

            {/* App Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[480px] overflow-y-auto pr-1">
                {filtered.map((app) => {
                    const sel = isSelected(app);
                    const disabled = !sel && selected.length >= MAX_SELECTION;
                    return (
                        <button
                            key={app.id}
                            onClick={() => !disabled && toggleApp(app)}
                            disabled={disabled}
                            className={`text-left p-4 rounded-xl border transition-all duration-200 group relative ${sel
                                ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                                : disabled
                                    ? "border-border bg-muted/30 opacity-40 cursor-not-allowed"
                                    : "border-border hover:border-primary/50 hover:bg-accent/50 bg-card"
                                }`}
                        >
                            {sel && (
                                <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-primary" />
                            )}
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <span className="text-xl">{CATEGORY_ICONS[app.category]}</span>
                                    <div>
                                        <p className="font-semibold text-sm text-foreground leading-tight">
                                            {app.name}
                                        </p>
                                        <Badge
                                            variant="outline"
                                            className={`text-[10px] mt-0.5 px-1.5 py-0 ${CATEGORY_COLORS[app.category] ?? ""}`}
                                        >
                                            {app.category}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                    {app.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {app.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                {app.website && (
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                        <Globe className="h-2.5 w-2.5" />
                                        {new URL(app.website).hostname}
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            <p className="text-xs text-center text-muted-foreground">
                Showing {filtered.length} of {ECOSYSTEM_APPS.length} ecosystem apps
            </p>

            {/* Navigation */}
            <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={onBack} className="flex-1">
                    ← Back
                </Button>
                <Button
                    onClick={() => onNext(selected)}
                    disabled={selected.length === 0}
                    className="flex-1 bg-primary hover:bg-primary/90"
                >
                    Build Skills for {selected.length > 0 ? selected.length : ""} App
                    {selected.length !== 1 ? "s" : ""} →
                </Button>
            </div>
        </div>
    );
}
