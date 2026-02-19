"use client";

import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { WalletSelectionModal } from "@/components/wallet-selection-modal";
import { WizardLayout, useWizardState } from "@/components/wizard-layout";
import { ClawbotSetup } from "@/components/clawbot-setup";
import { EcosystemBrowser } from "@/components/ecosystem-browser";
import { SkillBuilder } from "@/components/skill-builder";
import { AgentRegistry } from "@/components/agent-registry";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Bot, Sparkles, Zap, Network } from "lucide-react";

export default function Home() {
  const { account, connected } = useWallet();
  const [wizardState, { setStep, updateConfig, setApps, setSkills }] =
    useWizardState();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {!connected ? (
          /* ── Landing / Connect ───────────────────────────────────────── */
          <div className="max-w-2xl mx-auto text-center space-y-10 py-12">
            {/* Hero */}
            <div className="space-y-5">
              <div className="relative flex justify-center">
                <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute -top-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>

              <div>
                <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">
                  ClawBot
                  <br />
                  <span className="text-primary">Skill Builder</span>
                </h1>
                <p className="mt-4 text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
                  Deploy your personal AI agent on the Movement Network ecosystem.
                  Build, customize, and register on-chain in minutes.
                </p>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-3 text-left">
              {[
                {
                  icon: <Bot className="h-5 w-5 text-primary" />,
                  title: "OpenClaw Instance",
                  desc: "Configure your personal AI agent with Docker or Ansible",
                },
                {
                  icon: <Network className="h-5 w-5 text-primary" />,
                  title: "Movement Ecosystem",
                  desc: "Pick DeFi apps to build specialized skills for",
                },
                {
                  icon: <Zap className="h-5 w-5 text-primary" />,
                  title: "On-chain Registry",
                  desc: "Register your agent on Movement Testnet",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    {f.icon}
                  </div>
                  <p className="font-semibold text-sm text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                </div>
              ))}
            </div>

            <WalletSelectionModal>
              <Button
                size="lg"
                className="text-lg px-10 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-3"
              >
                <Bot className="h-5 w-5" />
                Connect Wallet to Start Building
              </Button>
            </WalletSelectionModal>

            <p className="text-xs text-muted-foreground">
              Connects to Movement Testnet (Chain ID: 250) · Powered by OpenClaw + Anthropic
            </p>
          </div>
        ) : (
          /* ── Wizard ───────────────────────────────────────────────────── */
          <WizardLayout currentStep={wizardState.currentStep}>
            {wizardState.currentStep === 1 && (
              <ClawbotSetup
                onNext={(config) => {
                  updateConfig(config);
                  setStep(2);
                }}
              />
            )}

            {wizardState.currentStep === 2 && (
              <EcosystemBrowser
                onNext={(apps) => {
                  setApps(apps);
                  setStep(3);
                }}
                onBack={() => setStep(1)}
              />
            )}

            {wizardState.currentStep === 3 && (
              <SkillBuilder
                selectedApps={wizardState.selectedApps}
                onNext={(skills) => {
                  setSkills(skills);
                  setStep(4);
                }}
                onBack={() => setStep(2)}
              />
            )}

            {wizardState.currentStep === 4 && (
              <AgentRegistry
                selectedApps={wizardState.selectedApps}
                skills={wizardState.skills}
                config={{
                  instanceUrl: wizardState.config.instanceUrl,
                  mode: wizardState.config.mode,
                }}
                onBack={() => setStep(3)}
              />
            )}
          </WizardLayout>
        )}
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between text-xs text-muted-foreground">
          <p>ClawBot Skill Builder · ETH Denver 2025</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/openclaw/openclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              OpenClaw ↗
            </a>
            <a
              href="https://movementnetwork.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Movement ↗
            </a>
            <a
              href="https://anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Anthropic ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
