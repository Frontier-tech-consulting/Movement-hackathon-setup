"use client";

import { useState } from "react";
import * as Progress from "@radix-ui/react-progress";
import { Check } from "lucide-react";
import type { WizardState, WizardStep } from "@/types/clawbot";

const STEPS = [
    { label: "Setup", description: "Configure ClawBot" },
    { label: "Browse", description: "Pick ecosystem apps" },
    { label: "Build", description: "Generate skills" },
    { label: "Register", description: "Deploy on-chain" },
] as const;

interface WizardLayoutProps {
    children: React.ReactNode;
    currentStep: WizardStep;
}

export function WizardLayout({ children, currentStep }: WizardLayoutProps) {
    const progressValue = ((currentStep - 1) / (STEPS.length - 1)) * 100;

    return (
        <div className="max-w-3xl mx-auto w-full">
            {/* Step indicator */}
            <div className="mb-8">
                {/* Step bubbles */}
                <div className="flex items-center justify-between mb-3 relative">
                    {/* Progress track */}
                    <div className="absolute left-0 right-0 top-4 h-0.5 bg-border -z-10" />
                    <Progress.Root
                        className="absolute left-0 top-4 h-0.5 bg-border overflow-hidden -z-10"
                        style={{ right: 0 }}
                        value={progressValue}
                    >
                        <Progress.Indicator
                            className="h-full bg-primary transition-all duration-700 ease-out"
                            style={{ width: `${progressValue}%` }}
                        />
                    </Progress.Root>

                    {STEPS.map((step, idx) => {
                        const stepNum = (idx + 1) as WizardStep;
                        const isComplete = currentStep > stepNum;
                        const isCurrent = currentStep === stepNum;

                        return (
                            <div key={step.label} className="flex flex-col items-center gap-1.5">
                                <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${isComplete
                                            ? "bg-primary border-primary text-primary-foreground"
                                            : isCurrent
                                                ? "bg-background border-primary text-primary shadow-lg shadow-primary/20"
                                                : "bg-background border-border text-muted-foreground"
                                        }`}
                                >
                                    {isComplete ? (
                                        <Check className="h-3.5 w-3.5" />
                                    ) : (
                                        <span>{stepNum}</span>
                                    )}
                                </div>
                                <div className="text-center hidden sm:block">
                                    <p
                                        className={`text-xs font-semibold ${isCurrent ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"}`}
                                    >
                                        {step.label}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content */}
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                {children}
            </div>
        </div>
    );
}

// Custom hook for wizard state management
export function useWizardState(): [WizardState, {
    setStep: (step: WizardStep) => void;
    updateConfig: (config: Partial<WizardState["config"]>) => void;
    setApps: (apps: WizardState["selectedApps"]) => void;
    setSkills: (skills: WizardState["skills"]) => void;
}] {
    const [state, setState] = useState<WizardState>({
        currentStep: 1,
        config: {},
        selectedApps: [],
        skills: [],
        registration: {},
    });

    const setStep = (step: WizardStep) =>
        setState((prev) => ({ ...prev, currentStep: step }));

    const updateConfig = (config: Partial<WizardState["config"]>) =>
        setState((prev) => ({ ...prev, config: { ...prev.config, ...config } }));

    const setApps = (apps: WizardState["selectedApps"]) =>
        setState((prev) => ({ ...prev, selectedApps: apps }));

    const setSkills = (skills: WizardState["skills"]) =>
        setState((prev) => ({ ...prev, skills }));

    return [state, { setStep, updateConfig, setApps, setSkills }];
}
