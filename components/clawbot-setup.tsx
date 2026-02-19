"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import * as Tabs from "@radix-ui/react-tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Download, Eye, EyeOff, Server, Laptop } from "lucide-react";
import { toast } from "sonner";
import type { OpenClawConfig } from "@/types/clawbot";

interface ClawbotSetupProps {
    onNext: (config: Partial<OpenClawConfig>) => void;
}

export function ClawbotSetup({ onNext }: ClawbotSetupProps) {
    const [mode, setMode] = useState<"local" | "remote">("local");
    const [showAnthropicKey, setShowAnthropicKey] = useState(false);
    const [showOpenAIKey, setShowOpenAIKey] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [config, setConfig] = useState<Partial<OpenClawConfig>>({
        mode: "local",
        instanceUrl: "http://localhost:3284",
        gatewayToken: "",
        anthropicApiKey: "",
        openaiApiKey: "",
        channels: {
            telegram: false,
            discord: false,
            slack: false,
        },
        ansible: {
            host: "",
            user: "ubuntu",
            sshKeyPath: "~/.ssh/id_rsa",
        },
    });

    const handleChannelToggle = (
        channel: "telegram" | "discord" | "slack",
        value: boolean
    ) => {
        setConfig((prev) => ({
            ...prev,
            channels: { ...prev.channels!, [channel]: value },
        }));
    };

    const handleDownload = async () => {
        setGenerating(true);
        try {
            const res = await fetch("/api/openclaw/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...config, mode }),
            });
            const data = await res.json();

            // Download .env file
            const envBlob = new Blob([data.envFile], { type: "text/plain" });
            const envUrl = URL.createObjectURL(envBlob);
            const envAnchor = document.createElement("a");
            envAnchor.href = envUrl;
            envAnchor.download = ".env";
            envAnchor.click();
            URL.revokeObjectURL(envUrl);

            // Download openclaw.json
            const jsonBlob = new Blob([data.openclawJson], { type: "application/json" });
            const jsonUrl = URL.createObjectURL(jsonBlob);
            const jsonAnchor = document.createElement("a");
            jsonAnchor.href = jsonUrl;
            jsonAnchor.download = "openclaw.json";
            jsonAnchor.click();
            URL.revokeObjectURL(jsonUrl);

            if (mode === "remote" && data.ansibleVars) {
                const ansibleBlob = new Blob([data.ansibleVars], { type: "text/plain" });
                const ansibleUrl = URL.createObjectURL(ansibleBlob);
                const ansibleAnchor = document.createElement("a");
                ansibleAnchor.href = ansibleUrl;
                ansibleAnchor.download = "vars.yml";
                ansibleAnchor.click();
                URL.revokeObjectURL(ansibleUrl);
            }

            toast.success("Config files downloaded! Follow the README to start OpenClaw.");
        } catch {
            toast.error("Failed to generate config");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                    Configure Your ClawBot Instance
                </h2>
                <p className="text-muted-foreground">
                    Set up your personal OpenClaw AI agent — runs locally with Docker or remotely
                    via Ansible.
                </p>
            </div>

            {/* Mode Tabs */}
            <Tabs.Root
                value={mode}
                onValueChange={(v) => {
                    setMode(v as "local" | "remote");
                    setConfig((prev) => ({ ...prev, mode: v as "local" | "remote" }));
                }}
            >
                <Tabs.List className="grid w-full grid-cols-2 rounded-xl bg-muted p-1">
                    <Tabs.Trigger
                        value="local"
                        className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground"
                    >
                        <Laptop className="h-4 w-4" />
                        Local (Docker)
                    </Tabs.Trigger>
                    <Tabs.Trigger
                        value="remote"
                        className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground"
                    >
                        <Server className="h-4 w-4" />
                        Remote (Ansible)
                    </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="local" className="mt-4 space-y-4">
                    <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                        <CardContent className="pt-4">
                            <p className="text-sm text-muted-foreground">
                                Runs OpenClaw in Docker on your machine. After downloading the config,
                                run:{" "}
                                <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
                                    docker compose up -d
                                </code>
                            </p>
                        </CardContent>
                    </Card>
                </Tabs.Content>

                <Tabs.Content value="remote" className="mt-4 space-y-4">
                    <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                        <CardContent className="pt-4 space-y-3">
                            <p className="text-sm text-muted-foreground mb-3">
                                Deploy OpenClaw to a remote VPS via Ansible (Debian/Ubuntu). The
                                playbook configures Docker, UFW firewall, and systemd automatically.
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="col-span-2 space-y-1">
                                    <Label className="text-xs">Server Host / IP</Label>
                                    <Input
                                        placeholder="192.168.1.100 or myserver.example.com"
                                        value={config.ansible?.host || ""}
                                        onChange={(e) =>
                                            setConfig((prev) => ({
                                                ...prev,
                                                ansible: { ...prev.ansible!, host: e.target.value },
                                            }))
                                        }
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">SSH User</Label>
                                    <Input
                                        placeholder="ubuntu"
                                        value={config.ansible?.user || ""}
                                        onChange={(e) =>
                                            setConfig((prev) => ({
                                                ...prev,
                                                ansible: { ...prev.ansible!, user: e.target.value },
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs">SSH Key Path</Label>
                                <Input
                                    placeholder="~/.ssh/id_rsa"
                                    value={config.ansible?.sshKeyPath || ""}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            ansible: { ...prev.ansible!, sshKeyPath: e.target.value },
                                        }))
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>
                </Tabs.Content>
            </Tabs.Root>

            {/* API Keys */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Model Provider</CardTitle>
                    <CardDescription>Set at least one API key for the AI model</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-sm">Anthropic API Key</Label>
                        <div className="relative">
                            <Input
                                type={showAnthropicKey ? "text" : "password"}
                                placeholder="sk-ant-..."
                                value={config.anthropicApiKey || ""}
                                onChange={(e) =>
                                    setConfig((prev) => ({ ...prev, anthropicApiKey: e.target.value }))
                                }
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showAnthropicKey ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-sm">OpenAI API Key (optional)</Label>
                        <div className="relative">
                            <Input
                                type={showOpenAIKey ? "text" : "password"}
                                placeholder="sk-..."
                                value={config.openaiApiKey || ""}
                                onChange={(e) =>
                                    setConfig((prev) => ({ ...prev, openaiApiKey: e.target.value }))
                                }
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showOpenAIKey ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Channels */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Chat Channels</CardTitle>
                    <CardDescription>
                        Connect your ClawBot to messaging platforms
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {(["telegram", "discord", "slack"] as const).map((ch) => (
                        <div key={ch} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-lg">
                                    {ch === "telegram" ? "✈️" : ch === "discord" ? "🎮" : "💼"}
                                </div>
                                <Label className="capitalize font-medium text-sm">{ch}</Label>
                            </div>
                            <Switch
                                checked={config.channels?.[ch] ?? false}
                                onCheckedChange={(v) => handleChannelToggle(ch, v)}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={handleDownload}
                    disabled={generating}
                    className="flex-1 gap-2"
                >
                    <Download className="h-4 w-4" />
                    {generating ? "Generating..." : "Download Config Files"}
                </Button>
                <Button
                    onClick={() => onNext({ ...config, mode })}
                    className="flex-1 bg-primary hover:bg-primary/90"
                >
                    Continue →
                </Button>
            </div>
        </div>
    );
}
