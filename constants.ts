import { type Address } from "viem";
import { type ChainName, getChain } from "./utils/chains";

// Target chain
export const PUB_CHAIN_NAME = (process.env.NEXT_PUBLIC_CHAIN_NAME ?? "holesky") as ChainName;
export const PUB_CHAIN = getChain(PUB_CHAIN_NAME);
export const PUB_CHAIN_BLOCK_EXPLORER =
  process.env.NEXT_PUBLIC_CHAIN_BLOCK_EXPLORER ?? PUB_CHAIN.blockExplorers?.default.url;
export const PUB_CONTRACTS_DEPLOYMENT_BLOCK = BigInt(process.env.NEXT_PUBLIC_PUB_CONTRACTS_DEPLOYMENT_BLOCK ?? "0");

// ENS target chain
export const PUB_ENS_CHAIN_NAME = (process.env.NEXT_PUBLIC_ENS_CHAIN_NAME ?? "mainnet") as ChainName;
export const PUB_ENS_CHAIN = getChain(PUB_ENS_CHAIN_NAME);

// Contracts
export const PUB_DAO_ADDRESS = (process.env.NEXT_PUBLIC_DAO_ADDRESS ?? "") as Address;
export const PUB_MULTISIG_PLUGIN_ADDRESS = (process.env.NEXT_PUBLIC_MULTISIG_PLUGIN_ADDRESS ?? "") as Address;

export const PUB_MAIN_ESCROW_CONTRACT = (process.env.NEXT_PUBLIC_MAIN_ESCROW_CONTRACT ?? "") as Address;
export const PUB_MAIN_TOKEN_CONTRACT = (process.env.NEXT_PUBLIC_MAIN_TOKEN_CONTRACT ?? "") as Address;
export const PUB_MAIN_TOKEN_NAME = (process.env.NEXT_PUBLIC_MAIN_TOKEN_NAME ?? "") as Address;

export const PUB_SECONDARY_ESCROW_CONTRACT = (process.env.NEXT_PUBLIC_SECONDARY_ESCROW_CONTRACT ?? "") as Address;
export const PUB_SECONDARY_TOKEN_CONTRACT = (process.env.NEXT_PUBLIC_SECONDARY_TOKEN_CONTRACT ?? "") as Address;
export const PUB_SECONDARY_TOKEN_NAME = (process.env.NEXT_PUBLIC_SECONDARY_TOKEN_NAME ?? "") as Address;

// Network and services
export const PUB_ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? "";

export const PUB_WEB3_ENDPOINT = process.env.NEXT_PUBLIC_WEB3_URL_PREFIX ?? "";
export const PUB_WEB3_ENS_ENDPOINT = (process.env.NEXT_PUBLIC_WEB3_ENS_URL_PREFIX ?? "") + PUB_ALCHEMY_API_KEY;

export const PUB_ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? "";

export const PUB_WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID ?? "";

export const PUB_USE_BLOCK_TIMESTAMP = process.env.NEXT_PUBLIC_USE_BLOCK_TIMESTAMP === "true";

// IFPS
export const PUB_IPFS_ENDPOINTS = process.env.NEXT_PUBLIC_IPFS_ENDPOINTS ?? "";
export const PUB_PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT ?? "";

// General
export const PUB_APP_NAME = "Tenderize Governance Hub";
export const PUB_APP_NAME_SHORT = "Tenderize";
export const PUB_APP_DESCRIPTION = "The place for all things Tenderize Governance.";
export const PUB_PROJECT_LOGO = "/tenderize-horizontal-logo-yellow.svg";

export const PUB_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
export const PUB_SOCIAL_IMAGE = process.env.NEXT_PUBLIC_SOCIAL_IMAGE ?? `${PUB_BASE_URL}/og`;
export const PUB_TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL ?? "https://t.me/tenderizeofficial";
export const PUB_X_HANDLE = process.env.NEXT_PUBLIC_X_HANDLE ?? "@tenderize_me";

export const PUB_PROJECT_URL = process.env.NEXT_PUBLIC_PROJECT_URL ?? "https://www.tenderize.me/";
export const PUB_GOV_FORUM_URL = process.env.NEXT_PUBLIC_GOV_FORUM_URL ?? "https://discord.gg/WXR5VBttP5";
export const PUB_DEV_PAGE_URL = process.env.NEXT_PUBLIC_DEV_PAGE_URL ?? "https://github.com/Tenderize";
export const PUB_BLOG_URL = "https://www.tenderize.me/#blog";
export const PUB_STAKING_LEARN_MORE_URL = "https://www.tenderize.me/#whitepaper";
export const PUB_VE_TOKENS_LEARN_MORE_URL = "https://www.tenderize.me/#overview";
export const PUB_SWAP_TOKENS_URL = process.env.NEXT_PUBLIC_GET_REWARDS_URL ?? "https://app.tenderize.me/swap";

export const PUB_WALLET_ICON =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_ICON ??
  "https://cdn.prod.website-files.com/64c906a6ed3c4d809558853b/64d0b11158be9cdd5c89a2fe_webc.png";

export const PUB_EPOCH_DURATION = 1000 * 60 * 60 * 24 * 7 * 2;
export const PUB_WARMUP_DAYS = 3;
