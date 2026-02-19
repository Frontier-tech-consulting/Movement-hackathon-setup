import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { NextRequest } from "next/server";

export const maxDuration = 60;

const anthropic = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { app, prompt } = body;

    if (!app || !prompt) {
        return new Response(JSON.stringify({ error: "app and prompt are required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const systemPrompt = `You are an expert AI skill builder for OpenClaw, a self-hosted AI agent framework.
You create SKILL.md files in the Anthropic Skills format for DeFi and Web3 applications.

A SKILL.md file follows this exact format:
---
name: <skill-name-kebab-case>
description: <one-line description of what this skill enables>
version: 1.0.0
author: ClawBot Skill Builder
tags: [<tag1>, <tag2>, <tag3>]
---

# <Skill Name>

## Overview
<2-3 sentence description of what this skill enables the AI agent to do>

## Capabilities
<bullet list of specific actions this skill enables>

## Protocol Context
<Technical details about the protocol the agent needs to know>

## Instructions
<Detailed step-by-step instructions for how the AI agent should use this skill>

## Examples
<3-5 example prompts and how the agent should handle them>

## Error Handling
<Common errors and how to handle them>

Generate ONLY the SKILL.md content, nothing else. Make it production-quality, specific, and actionable.`;

    const userMessage = `Create a SKILL.md for the following Movement Network application:

**App Name**: ${app.name}
**Category**: ${app.category}
**Description**: ${app.description}
**Tags**: ${app.tags.join(", ")}
**Protocol Context**: ${app.skillContext}

**User's Custom Instructions / Skill Focus**:
${prompt}

Generate a comprehensive SKILL.md that enables an OpenClaw AI agent to interact with this protocol on Movement Network.`;

    const result = streamText({
        model: anthropic("claude-opus-4-5"),
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
        maxOutputTokens: 2000,
    });

    return result.toTextStreamResponse();
}
