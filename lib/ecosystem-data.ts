import type { EcosystemApp } from "@/types/clawbot";

// Curated list of Movement Network ecosystem applications
// Source: movementnetwork.xyz/ecosystem + research
export const ECOSYSTEM_APPS: EcosystemApp[] = [
    // DeFi / DEX
    {
        id: "meridian-dex",
        name: "Meridian DEX",
        description:
            "Automated market maker (AMM) DEX built natively on Movement Network with concentrated liquidity pools.",
        category: "DEX",
        website: "https://meridian.xyz",
        tags: ["AMM", "Liquidity", "Swap", "Move"],
        skillContext:
            "Meridian DEX is an AMM on Movement Network. It supports token swaps, liquidity provision, and concentrated liquidity positions. The main actions are: getQuote(tokenIn, tokenOut, amount), swap(tokenIn, tokenOut, amount, slippage), addLiquidity(tokenA, tokenB, amountA, amountB), getPoolInfo(poolId).",
    },
    {
        id: "echelon-market",
        name: "Echelon Market",
        description:
            "Decentralized lending and borrowing protocol on Movement Network with isolated risk pools.",
        category: "Lending",
        website: "https://echelon.market",
        tags: ["Lending", "Borrowing", "Collateral", "Interest"],
        skillContext:
            "Echelon Market is a lending protocol on Movement Network. Main actions: supply(asset, amount), borrow(asset, amount), repay(asset, amount), withdraw(asset, amount), getHealthFactor(address), getInterestRate(asset).",
    },
    {
        id: "aries-markets",
        name: "Aries Markets",
        description:
            "Composable money market protocol enabling leveraged trading and yield strategies on Movement.",
        category: "Lending",
        website: "https://ariesmarkets.xyz",
        tags: ["Money Market", "Leverage", "Yield", "DeFi"],
        skillContext:
            "Aries Markets is a money market on Movement. Supports lending, borrowing, and leveraged positions. Functions: deposit(token, amount), borrow(token, amount), repay(token, amount), getApy(token), getLeveragePosition(address).",
    },
    {
        id: "poseidon-finance",
        name: "Poseidon Finance",
        description:
            "Perpetuals and derivatives trading platform built on Movement Network with up to 20x leverage.",
        category: "DeFi",
        website: "https://poseidon.finance",
        tags: ["Perps", "Derivatives", "Leverage", "Trading"],
        skillContext:
            "Poseidon Finance is a perpetuals trading platform on Movement. Key actions: openPosition(market, side, size, leverage), closePosition(positionId), getMarketPrice(market), getFundingRate(market), getPositions(address).",
    },
    {
        id: "movementswap",
        name: "MovementSwap",
        description:
            "Native DEX aggregator on Movement Network that routes swaps across all liquidity sources for best price.",
        category: "DEX",
        website: "https://movementswap.xyz",
        tags: ["Aggregator", "Swap", "Best Price", "Router"],
        skillContext:
            "MovementSwap is a DEX aggregator on Movement Network. Routes through multiple DEX pools for optimal pricing. Functions: getBestRoute(tokenIn, tokenOut, amount), executeSwap(route, slippage), getSupportedTokens(), getTokenPrice(token).",
    },
    {
        id: "celeste-bridge",
        name: "Celeste Bridge",
        description:
            "Cross-chain bridge connecting Movement Network to Ethereum, BSC, Arbitrum, and Optimism.",
        category: "Bridge",
        website: "https://celestebridge.xyz",
        tags: ["Bridge", "Cross-chain", "ETH", "L2"],
        skillContext:
            "Celeste Bridge enables cross-chain asset transfers to/from Movement Network. Functions: bridge(asset, amount, targetChain, recipient), getStatus(txHash), getSupportedChains(), getEstimatedTime(fromChain, toChain).",
    },
    {
        id: "movement-nft",
        name: "Movement NFT Marketplace",
        description:
            "Primary NFT marketplace on Movement Network supporting Move-native NFT standards with low fees.",
        category: "NFT",
        website: "https://movementnft.xyz",
        tags: ["NFT", "Marketplace", "Digital Assets", "Collectibles"],
        skillContext:
            "Movement NFT Marketplace is the main NFT platform on Movement. Key actions: listNFT(tokenId, price), buyNFT(tokenId), makeOffer(tokenId, amount), getCollectionStats(collection), getFloorPrice(collection), getUserNFTs(address).",
    },
    {
        id: "aptin-finance",
        name: "Aptin Finance",
        description:
            "Decentralized stablecoin and liquidity protocol for Movement Network with CDP mechanics.",
        category: "DeFi",
        website: "https://aptin.io",
        tags: ["Stablecoin", "CDP", "Collateral", "Mint"],
        skillContext:
            "Aptin Finance is a stablecoin protocol on Movement. Users can mint stablecoins by depositing collateral. Functions: depositCollateral(asset, amount), mintStablecoin(amount), redeemCollateral(amount), getLiquidationRatio(), getCollateralRatio(address).",
    },
    {
        id: "movement-liquid-staking",
        name: "MovementStake",
        description:
            "Liquid staking protocol for MOVE tokens, providing stMOVE tokens while maintaining staking rewards.",
        category: "DeFi",
        website: "https://movementstake.xyz",
        tags: ["Staking", "Liquid Staking", "MOVE", "Yield"],
        skillContext:
            "MovementStake provides liquid staking for MOVE tokens. Functions: stake(amount), unstake(stAmount), getExchangeRate(), getAPY(), getStakingRewards(address), claimRewards().",
    },
    {
        id: "momentum-launchpad",
        name: "Momentum Launchpad",
        description:
            "Fair-launch token launchpad on Movement Network for new DeFi and protocol projects.",
        category: "DeFi",
        website: "https://momentumlaunchpad.xyz",
        tags: ["Launchpad", "IDO", "Fair Launch", "New Projects"],
        skillContext:
            "Momentum Launchpad hosts token launches on Movement Network. Functions: getUpcomingLaunches(), participate(projectId, amount), claimTokens(projectId), getProjectInfo(projectId), getMyAllocations(address).",
    },
    {
        id: "move-gaming",
        name: "MovePlay Gaming",
        description:
            "On-chain gaming platform on Movement Network with provably fair mechanics and NFT assets.",
        category: "Gaming",
        website: "https://moveplay.xyz",
        tags: ["Gaming", "Play-to-Earn", "NFT", "On-chain"],
        skillContext:
            "MovePlay is a gaming platform on Movement. Key actions: getGames(), joinGame(gameId), getLeaderboard(gameId), claimRewards(gameId), mintGameAsset(gameId, assetType), getPlayerStats(address).",
    },
    {
        id: "move-rwa",
        name: "RealityMove RWA",
        description:
            "Real-world asset tokenization platform on Movement Network for tokenized treasuries and real estate.",
        category: "RWA",
        website: "https://realitymove.xyz",
        tags: ["RWA", "Tokenization", "Treasuries", "Real Estate"],
        skillContext:
            "RealityMove tokenizes real-world assets on Movement Network. Functions: getRWAAssets(), investInAsset(assetId, amount), getYield(assetId), redeemAsset(assetId, amount), getPortfolio(address).",
    },
    {
        id: "movegov",
        name: "MoveGov DAO",
        description:
            "On-chain governance platform for Movement Network protocols enabling community proposals and voting.",
        category: "DAO",
        website: "https://movegov.xyz",
        tags: ["DAO", "Governance", "Voting", "Proposals"],
        skillContext:
            "MoveGov enables on-chain governance on Movement. Functions: getProposals(), vote(proposalId, support), createProposal(title, description, actions), getVotingPower(address), getProposalStatus(proposalId).",
    },
    {
        id: "zkbridge-movement",
        name: "zkBridge Movement",
        description:
            "Zero-knowledge proof bridge for trustless cross-chain message passing to/from Movement Network.",
        category: "Bridge",
        website: "https://zkbridge.com",
        tags: ["ZK Proof", "Bridge", "Cross-chain", "Trustless"],
        skillContext:
            "zkBridge Movement provides ZK-proof based bridging. Functions: sendMessage(targetChain, message), bridgeToken(token, amount, targetChain), verifyProof(proof), getBridgeStatus(txHash).",
    },
    {
        id: "movement-stable",
        name: "MoveStable",
        description:
            "Stablecoin liquidity pools optimized for low slippage on Movement Network, similar to Curve Finance.",
        category: "DEX",
        website: "https://movestable.xyz",
        tags: ["Stablecoin", "Low Slippage", "Liquidity Pool", "Stable Swap"],
        skillContext:
            "MoveStable is a stablecoin AMM on Movement. Optimal for USDC/USDT/DAI swaps with minimal slippage. Functions: swap(stableIn, stableOut, amount), addLiquidity(amounts), removeLiquidity(lpAmount), getVirtualPrice(), getPoolInfo().",
    },
    {
        id: "movement-order-book",
        name: "OrderBook DEX",
        description:
            "Fully on-chain order book exchange on Movement Network leveraging Move's resource model for fairness.",
        category: "DEX",
        website: "https://orderbook.move",
        tags: ["Order Book", "CEX-like", "Limit Orders", "On-chain"],
        skillContext:
            "OrderBook DEX is an on-chain order book exchange on Movement. Functions: placeLimitOrder(market, side, price, amount), cancelOrder(orderId), getOrderBook(market, depth), getOpenOrders(address), getTradeHistory(market).",
    },
    {
        id: "move-social",
        name: "MoveLink Social",
        description:
            "Decentralized social graph and content platform on Movement Network with SocialFi mechanics.",
        category: "Social",
        website: "https://movelink.xyz",
        tags: ["Social", "SocialFi", "Content", "Creator"],
        skillContext:
            "MoveLink is a decentralized social platform on Movement. Functions: createProfile(username, bio), follow(address), post(content), getFollowers(address), getTimeline(address), collectPost(postId).",
    },
    {
        id: "move-vault",
        name: "MoveVault",
        description:
            "Yield aggregator and auto-compounding vault protocol on Movement Network maximizing DeFi returns.",
        category: "DeFi",
        website: "https://movevault.xyz",
        tags: ["Yield", "Auto-compound", "Vault", "Optimizer"],
        skillContext:
            "MoveVault automatically compounds DeFi yields on Movement. Functions: depositToVault(vaultId, amount), withdrawFromVault(vaultId, shares), getVaults(), getAPY(vaultId), getUserShares(address, vaultId), harvestYield(vaultId).",
    },
    {
        id: "move-id",
        name: "MoveID",
        description:
            "Decentralized identity and naming service on Movement Network, mapping readable names to addresses.",
        category: "Infrastructure",
        website: "https://moveid.xyz",
        tags: ["Identity", "Naming", "DNS", "Profile"],
        skillContext:
            "MoveID provides decentralized identity on Movement Network. Functions: registerName(name), resolveName(name), getAddress(name), setProfile(name, metadata), transferName(name, newOwner), lookupAddress(address).",
    },
    {
        id: "movement-oracle",
        name: "Movement Oracle",
        description:
            "Decentralized price oracle network providing reliable, manipulation-resistant data feeds for Movement.',",
        category: "Infrastructure",
        website: "https://movement.oracle.xyz",
        tags: ["Oracle", "Price Feed", "Data", "Infrastructure"],
        skillContext:
            "Movement Oracle provides on-chain price feeds. Functions: getPrice(asset), getHistoricalPrice(asset, timestamp), getPrices(assets), getLatestRound(asset), isStale(asset).",
    },
    {
        id: "move-insurance",
        name: "MoveShield Insurance",
        description:
            "Decentralized insurance protocol on Movement Network covering smart contract and depeg risks.",
        category: "DeFi",
        website: "https://moveshield.xyz",
        tags: ["Insurance", "Risk", "Protection", "DeFi"],
        skillContext:
            "MoveShield provides DeFi insurance on Movement. Functions: getCoverages(), buyCoverage(protocol, amount, period), claimInsurance(coverageId, evidence), getCoverageStatus(coverageId), getPremiumQuote(protocol, amount).",
    },
    {
        id: "move-nft-launchpad",
        name: "MintMove NFT Launchpad",
        description:
            "NFT collection launchpad on Movement Network for artists and projects to mint and sell NFTs.",
        category: "NFT",
        website: "https://mintmove.xyz",
        tags: ["NFT", "Launchpad", "Mint", "Collections"],
        skillContext:
            "MintMove is an NFT launchpad on Movement Network. Functions: getUpcomingMints(), mintNFT(collectionId, quantity), getCollectionInfo(collectionId), getMyNFTs(address), getWhitelistStatus(collectionId, address).",
    },
    {
        id: "aptos-move-defi",
        name: "PancakeMove",
        description:
            "Multi-chain DEX expanded to Movement Network with yield farming and syrup pools.",
        category: "DEX",
        website: "https://pancakeswap.finance",
        tags: ["DEX", "Farming", "Yield", "AMM"],
        skillContext:
            "PancakeMove is an AMM DEX on Movement Network with farming rewards. Functions: swap(tokenIn, tokenOut, amount), addLiquidity(tokenA, tokenB), stakeFarm(farmId, amount), harvestFarm(farmId), getActiveFarms(), getTokenInfo(token).",
    },
    {
        id: "movement-perp",
        name: "MovePerp",
        description:
            "Decentralized perpetual futures exchange on Movement Network with deep liquidity and low fees.",
        category: "DeFi",
        website: "https://moveperp.xyz",
        tags: ["Perps", "Futures", "Leverage", "Trading"],
        skillContext:
            "MovePerp is a perp DEX on Movement. Functions: openLong(market, size, leverage, collateral), openShort(market, size, leverage, collateral), closePosition(positionId), getMarkPrice(market), getPositions(address), getPnL(positionId).",
    },
    {
        id: "movement-multisig",
        name: "MoveMultisig",
        description:
            "Multi-signature wallet and treasury management solution built on Movement Network's resource model.",
        category: "Infrastructure",
        website: "https://movemultisig.xyz",
        tags: ["Multisig", "Treasury", "DAO", "Security"],
        skillContext:
            "MoveMultisig provides multi-signature wallets on Movement. Functions: createSafe(owners, threshold), proposeTransaction(safeId, to, data, value), approveTransaction(safeId, txId), executeTransaction(safeId, txId), getSafeInfo(safeId), getPendingTxs(safeId).",
    },
    {
        id: "move-derivatives",
        name: "Synthetix Move",
        description:
            "Synthetic asset protocol on Movement Network enabling exposure to stocks, commodities, and indices.",
        category: "DeFi",
        website: "https://synthetix.move",
        tags: ["Synthetics", "Derivatives", "Stocks", "Commodities"],
        skillContext:
            "Synthetix Move provides synthetic assets on Movement. Functions: mintSynth(asset, amount), burnSynth(asset, amount), exchangeSynth(fromAsset, toAsset, amount), getExchangeRate(fromAsset, toAsset), getSupportedAssets().",
    },
    {
        id: "move-prediction",
        name: "MoveBet Prediction",
        description:
            "Decentralized prediction market on Movement Network for crypto prices, sports, and world events.",
        category: "DeFi",
        website: "https://movebet.xyz",
        tags: ["Prediction", "Betting", "Oracle", "Markets"],
        skillContext:
            "MoveBet is a prediction market on Movement. Functions: getMarkets(), createMarket(question, endTime, resolver), bet(marketId, outcome, amount), resolveMarket(marketId, outcome), claimWinnings(marketId), getMarketOdds(marketId).",
    },
    {
        id: "movement-token-factory",
        name: "MoveFactory",
        description:
            "Token and NFT creation factory on Movement Network — deploy fungible assets and collections in minutes.",
        category: "Infrastructure",
        website: "https://movefactory.xyz",
        tags: ["Token Creation", "NFT Factory", "Deploy", "No-code"],
        skillContext:
            "MoveFactory allows easy deployment of tokens and NFT collections on Movement. Functions: createToken(name, symbol, supply, decimals), createNFTCollection(name, description, maxSupply), mintTokens(tokenId, amount, recipient), burnTokens(tokenId, amount).",
    },
    {
        id: "movement-analytics",
        name: "MoveScope Analytics",
        description:
            "On-chain analytics and portfolio tracking platform for Movement Network with real-time dashboards.",
        category: "Infrastructure",
        website: "https://movescope.xyz",
        tags: ["Analytics", "Portfolio", "Dashboard", "Tracking"],
        skillContext:
            "MoveScope provides analytics for Movement Network. Functions: getPortfolio(address), getTokenAnalytics(token), getProtocolStats(protocol), getTopTokens(limit), getRecentTransactions(address), getPriceHistory(token, period).",
    },
    {
        id: "movement-yield-farming",
        name: "MoveHarvest",
        description:
            "Yield farming aggregator that auto-routes liquidity to highest-yielding farms on Movement Network.",
        category: "DeFi",
        website: "https://moveharvest.xyz",
        tags: ["Yield Farming", "Aggregator", "Auto-route", "Liquidity"],
        skillContext:
            "MoveHarvest aggregates yield farming opportunities on Movement. Functions: getFarms(sortBy), depositToFarm(farmId, amount), withdrawFromFarm(farmId, amount), claimRewards(farmId), getExpectedYield(farmId, amount, period), rebalancePortfolio(targetAllocations).",
    },
];

export function getAppsByCategory(category?: string): EcosystemApp[] {
    if (!category || category === "All") return ECOSYSTEM_APPS;
    return ECOSYSTEM_APPS.filter((app) => app.category === category);
}

export const ALL_CATEGORIES = [
    "All",
    "DEX",
    "DeFi",
    "Lending",
    "NFT",
    "Gaming",
    "Infrastructure",
    "Bridge",
    "RWA",
    "Social",
    "DAO",
] as const;
