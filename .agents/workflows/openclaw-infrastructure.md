---
description: Setup and deploy OpenClaw infrastructure (Docker local or Ansible remote) with skill building on Movement Network
---

# OpenClaw Infrastructure Setup Workflow

This workflow orchestrates the full setup of a personal OpenClaw ClawBot instance
and deploys AI skills for Movement Network ecosystem applications.

## Prerequisites Check

Check that required tools are installed:

```bash
# Check Docker
docker --version

# Check Ansible (for remote deployments)
ansible --version

# Check Movement CLI (for contract interactions)
movement --version || echo "Install from: https://docs.movementnetwork.xyz/devs/movementcli#testnet"
```

## Step 1: Clone OpenClaw Repos

```bash
# Clone core OpenClaw
git clone https://github.com/openclaw/openclaw.git ~/.openclaw-src

# Clone Ansible playbooks (for remote/cloud deployments)
git clone https://github.com/openclaw/openclaw-ansible.git ~/.openclaw-ansible
```

## Step 2: Configure Environment

Copy and edit the environment file:

```bash
cp ~/.openclaw-src/.env.example ~/.openclaw/.env
```

Minimum required variables in `~/.openclaw/.env`:
```env
OPENCLAW_GATEWAY_TOKEN=<generate with: openssl rand -hex 32>
ANTHROPIC_API_KEY=sk-ant-...
# OR
OPENAI_API_KEY=sk-...

# Optional channels
TELEGRAM_BOT_TOKEN=...
DISCORD_BOT_TOKEN=...
```

## Step 3A: Local Docker Setup

// turbo
```bash
cd ~/.openclaw-src
cp docker-compose.yml ~/openclaw-docker-compose.yml
docker compose -f ~/openclaw-docker-compose.yml up -d
```

Verify the gateway is running:
```bash
docker compose -f ~/openclaw-docker-compose.yml ps
curl http://localhost:3284/health
```

## Step 3B: Remote/Cloud Ansible Setup

Edit the Ansible inventory file at `~/.openclaw-ansible/inventory.yml`:

```yaml
all:
  hosts:
    myserver:
      ansible_host: YOUR_SERVER_IP
      ansible_user: ubuntu
      ansible_ssh_private_key_file: ~/.ssh/id_rsa
  vars:
    openclaw_gateway_token: "{{ lookup('env', 'OPENCLAW_GATEWAY_TOKEN') }}"
    anthropic_api_key: "{{ lookup('env', 'ANTHROPIC_API_KEY') }}"
    openclaw_channels:
      telegram: true
      discord: false
```

Run the playbook:

```bash
cd ~/.openclaw-ansible
ansible-galaxy install -r requirements.yml
ansible-playbook -i inventory.yml playbook.yml --extra-vars "@vars.yml"
```

The playbook will:
1. Install Docker + Docker Compose on the remote host
2. Configure UFW firewall (ports 80, 443, 22 only; 3284 localhost only)
3. Set up Fail2ban for SSH protection
4. Deploy OpenClaw Gateway as a systemd service
5. Configure auto-updates (unattended-upgrades)

## Step 4: Install Skills

After the gateway is running, install Movement Network skills:

```bash
# Clone Anthropic skills template
git clone https://github.com/anthropics/skills.git /tmp/anthropic-skills

# Create Movement Network skills directory
mkdir -p ~/.openclaw/skills

# Copy any generated SKILL.md files from the ClawBot Skill Builder UI
cp /path/to/generated-skill/SKILL.md ~/.openclaw/skills/<app-name>/SKILL.md
```

## Step 5: Verify Gateway

```bash
# Local
curl -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" http://localhost:3284/api/status

# Remote (via SSH tunnel)
ssh -L 3284:localhost:3284 ubuntu@YOUR_SERVER_IP
curl -H "Authorization: Bearer $OPENCLAW_GATEWAY_TOKEN" http://localhost:3284/api/status
```

## Step 6: Register Agent on Movement Testnet

This step is handled by the ClawBot Skill Builder UI (Step 4 of the wizard).
The UI will call the `agentRegistry` Move module on Movement testnet (Chain ID: 250)
and register the agent with its metadata (name, instance URL, skills count).

Required: Wallet connected to Movement Testnet with MOVE tokens for gas.

## Troubleshooting

- **Gateway not starting**: Check `docker compose logs` or `journalctl -u openclaw-gateway`
- **Ansible SSH errors**: Ensure `~/.ssh/id_rsa.pub` is in `~/.ssh/authorized_keys` on remote host
- **Firewall issues**: DOCKER-USER chain must be configured before Docker installation (handled by playbook)
- **Skills not loading**: Ensure `SKILL.md` files are in the correct directory under `~/.openclaw/skills/<skill-name>/`
