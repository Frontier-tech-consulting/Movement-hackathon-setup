"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Loader2, CheckCircle2, ExternalLink, Bot, Zap } from "lucide-react";
import { toast } from "sonner";
import type { EcosystemApp, SkillSpec, AgentRegistration } from "@/types/clawbot";

interface AgentRegistryProps {
    selectedApps: EcosystemApp[];
    skills: SkillSpec[];
    config: {
        instanceUrl?: string;
        mode?: string;
    };
    onBack: () => void;
}

const MOVEMENT_TESTNET_EXPLORER = "https://explorer.movementnetwork.xyz/txn";

export function AgentRegistry({
    selectedApps,
    skills,
    config,
    onBack,
}: AgentRegistryProps) {
    const { account, signAndSubmitTransaction } = useWallet();
    const [agentName, setAgentName] = useState("My ClawBot Agent");
    const [instanceUrl, setInstanceUrl] = useState(
        config.instanceUrl || "http://localhost:3284"
    );
    const [isRegistering, setIsRegistering] = useState(false);
    const [registration, setRegistration] = useState<Partial<AgentRegistration>>({});
    const [txHash, setTxHash] = useState<string | null>(null);

    const completedSkills = skills.filter((s) => s.status === "done");
    const metadataUri = JSON.stringify({
        agent: agentName,
        deployedAt: new Date().toISOString(),
        apps: selectedApps.map((a) => a.id),
        skills: completedSkills.map((s) => s.appName),
        instanceUrl,
    });

    const handleRegister = async () => {
        if (!account) {
            toast.error("Please connect your wallet first");
            return;
        }

        setIsRegistering(true);
        try {
            // 1. Get transaction payload from API
            const res = await fetch("/api/registry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: agentName,
                    instanceUrl,
                    skillsCount: completedSkills.length,
                    metadataUri,
                    walletAddress: account.address.toString(),
                }),
            });

            const { transactionPayload, agentInfo } = await res.json();

            setRegistration(agentInfo);

            // 2. Submit to blockchain via wallet
            const result = await signAndSubmitTransaction({
                data: {
                    function: transactionPayload.function,
                    typeArguments: transactionPayload.typeArguments,
                    functionArguments: transactionPayload.functionArguments,
                },
            });

            const hash = (result as { hash: string }).hash;
            setTxHash(hash);
            toast.success("🎉 Agent registered on Movement Testnet!");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            console.error(err);
            // Transaction might still work even if registry contract isn't deployed yet
            toast.error(`Registration failed: ${message}`);
        } finally {
            setIsRegistering(false);
        }
    };

    return (
        <div className="space-y-5">
            <div className="text-center space-y-2">
                <div className="flex justify-center mb-3">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Bot className="h-8 w-8 text-primary" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Register Your Agent</h2>
                <p className="text-muted-foreground">
                    Register your ClawBot on Movement Testnet&apos;s{" "}
                    <span className="text-primary font-mono text-sm">agentRegistry</span>{" "}
                    contract
                </p>
            </div>

            {/* Agent Summary */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Zap className="h-4 w-4 text-primary" />
                        Agent Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-2xl font-bold text-primary">
                                {selectedApps.length}
                            </p>
                            <p className="text-xs text-muted-foreground">Ecosystem Apps</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary">
                                {completedSkills.length}
                            </p>
                            <p className="text-xs text-muted-foreground">Skills Built</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary">
                                {config.mode === "remote" ? "☁️" : "🖥️"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {config.mode === "remote" ? "Cloud" : "Local"} Deploy
                            </p>
                        </div>
                    </div>

                    {/* Skills list */}
                    {completedSkills.length > 0 && (
                        <div className="mt-4 space-y-1.5">
                            {completedSkills.map((s) => (
                                <div
                                    key={s.appId}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                >
                                    <CheckCircle2 className="h-3 w-3 text-green-500 shrink-0" />
                                    <span className="font-medium text-foreground">{s.appName}</span>
                                    <span>skill ready</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Agent Config */}
            {!txHash && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Agent Details</CardTitle>
                        <CardDescription>
                            This metadata will be stored on-chain in the agentRegistry
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-1.5">
                            <Label>Agent Name</Label>
                            <Input
                                value={agentName}
                                onChange={(e) => setAgentName(e.target.value)}
                                placeholder="My ClawBot Agent"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label>OpenClaw Instance URL</Label>
                            <Input
                                value={instanceUrl}
                                onChange={(e) => setInstanceUrl(e.target.value)}
                                placeholder="http://localhost:3284"
                            />
                            <p className="text-xs text-muted-foreground">
                                The URL where your OpenClaw Gateway is running
                            </p>
                        </div>

                        {account && (
                            <div className="p-3 rounded-lg bg-muted/50">
                                <p className="text-xs text-muted-foreground">Connected Wallet</p>
                                <p className="font-mono text-xs mt-0.5 truncate text-foreground">
                                    {account.address.toString()}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Success State */}
            {txHash && (
                <Card className="border-green-500/30 bg-green-500/5">
                    <CardContent className="pt-6 space-y-4 text-center">
                        <div className="flex justify-center">
                            <div className="h-14 w-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-7 w-7 text-green-500" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">
                                Agent Registered! 🎉
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                Your ClawBot is now on Movement Testnet
                            </p>
                        </div>

                        <div className="p-3 rounded-lg bg-muted/50 text-left space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">Transaction Hash</p>
                                <p className="font-mono text-xs break-all text-foreground">{txHash}</p>
                            </div>
                            {registration.name && (
                                <div>
                                    <p className="text-xs text-muted-foreground">Agent Name</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {registration.name}
                                    </p>
                                </div>
                            )}
                        </div>

                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={() =>
                                window.open(`${MOVEMENT_TESTNET_EXPLORER}/${txHash}`, "_blank")
                            }
                        >
                            <ExternalLink className="h-4 w-4" />
                            View on Explorer
                        </Button>
                    </CardContent>
                </Card>
            )}

            <div className="flex gap-3 pt-2">
                {!txHash && (
                    <Button variant="outline" onClick={onBack} className="flex-1">
                        ← Back
                    </Button>
                )}
                {!txHash ? (
                    <Button
                        onClick={handleRegister}
                        disabled={isRegistering || !account || !agentName.trim()}
                        className="flex-1 bg-primary hover:bg-primary/90 gap-2"
                    >
                        {isRegistering ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Registering on-chain...
                            </>
                        ) : (
                            <>
                                <Bot className="h-4 w-4" />
                                Register Agent on Testnet
                            </>
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={() => window.location.reload()}
                        className="flex-1 bg-primary hover:bg-primary/90"
                    >
                        Build Another Agent ↩
                    </Button>
                )}
            </div>

            {!account && (
                <p className="text-center text-xs text-destructive">
                    ⚠️ Connect your wallet to register on-chain
                </p>
            )}
        </div>
    );
}
