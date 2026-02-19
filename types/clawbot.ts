// ClawBot Skill Builder — Shared Types

export type DeploymentMode = "local" | "remote";

export interface OpenClawConfig {
    mode: DeploymentMode;
    instanceUrl: string;
    gatewayToken: string;
    anthropicApiKey?: string;
    openaiApiKey?: string;
    geminiApiKey?: string;
    channels: {
        telegram: boolean;
        telegramToken?: string;
        discord: boolean;
        discordToken?: string;
        slack: boolean;
        slackToken?: string;
    };
    // Remote/Ansible mode
    ansible?: {
        host: string;
        user: string;
        sshKeyPath: string;
    };
}

export type EcosystemCategory =
    | "DeFi"
    | "DEX"
    | "Lending"
    | "NFT"
    | "Gaming"
    | "Infrastructure"
    | "RWA"
    | "Bridge"
    | "Social"
    | "DAO";

export interface EcosystemApp {
    id: string;
    name: string;
    description: string;
    category: EcosystemCategory;
    website?: string;
    logo?: string;
    tags: string[];
    contractAddress?: string;
    // Pre-filled skill context
    skillContext: string;
}

export interface SkillSpec {
    appId: string;
    appName: string;
    userPrompt: string;
    generatedSkillMd?: string;
    status: "idle" | "generating" | "done" | "error";
}

export interface AgentRegistration {
    name: string;
    instanceUrl: string;
    skillsCount: number;
    metadataUri: string;
    walletAddress?: string;
    txHash?: string;
}

export interface AnsibleInventory {
    host: string;
    user: string;
    sshKeyPath: string;
    gatewayToken: string;
    apiKey: string;
    channels: Record<string, boolean>;
}

// Wizard step state
export type WizardStep = 1 | 2 | 3 | 4;

export interface WizardState {
    currentStep: WizardStep;
    config: Partial<OpenClawConfig>;
    selectedApps: EcosystemApp[];
    skills: SkillSpec[];
    registration: Partial<AgentRegistration>;
}
