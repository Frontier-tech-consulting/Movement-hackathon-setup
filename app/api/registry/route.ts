import { NextRequest, NextResponse } from "next/server";

// Movement testnet agentRegistry module
// If you have a deployed contract address, set AGENT_REGISTRY_ADDRESS in .env
// Otherwise this returns the tx payload for the user to sign with their wallet
const AGENT_REGISTRY_ADDRESS =
    process.env.AGENT_REGISTRY_ADDRESS ||
    "0x1"; // Placeholder — replace with actual deployed address

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, instanceUrl, skillsCount, metadataUri, walletAddress } = body;

        if (!name || !instanceUrl) {
            return NextResponse.json(
                { error: "name and instanceUrl are required" },
                { status: 400 }
            );
        }

        // Build the Move transaction payload for the wallet to sign
        // This follows the @aptos-labs/ts-sdk payload format for entry functions
        const transactionPayload = {
            function: `${AGENT_REGISTRY_ADDRESS}::agent_registry::register_agent`,
            typeArguments: [],
            functionArguments: [
                // name: vector<u8> — encoded as UTF-8 bytes array
                Array.from(new TextEncoder().encode(name)),
                // instance_url: vector<u8>
                Array.from(new TextEncoder().encode(instanceUrl)),
                // skills_count: u64
                skillsCount,
                // metadata_uri: vector<u8>
                Array.from(new TextEncoder().encode(metadataUri || "")),
            ],
        };

        // Movement testnet RPC
        const MOVEMENT_TESTNET_RPC =
            process.env.MOVEMENT_RPC_URL ||
            "https://aptos.testnet.porto.movementlabs.xyz/v1";

        return NextResponse.json({
            transactionPayload,
            nodeUrl: MOVEMENT_TESTNET_RPC,
            registryAddress: AGENT_REGISTRY_ADDRESS,
            agentInfo: {
                name,
                instanceUrl,
                skillsCount,
                metadataUri,
                walletAddress,
                registeredAt: new Date().toISOString(),
            },
        });
    } catch (err) {
        console.error("[registry]", err);
        return NextResponse.json(
            { error: "Failed to build registry transaction" },
            { status: 500 }
        );
    }
}
