/**
 * Chinese LLM Provider Authentication
 *
 * This module provides convenience functions for managing API keys
 * for Chinese LLM providers (Moonshot, Zhipu, MiniMax).
 *
 * It wraps the core Auth module which stores credentials securely
 * in ~/.local/share/opencode/auth.json with 0o600 permissions.
 *
 * Usage:
 *   import { saveApiKey, getApiKey, hasApiKey } from './chinese-providers'
 *   await saveApiKey('moonshot', 'sk-...')
 *   const key = await getApiKey('moonshot')
 */

import { Auth } from "./index"
import { Env } from "../env"

export type ChineseProvider = "moonshot" | "zhipu" | "minimax"

/**
 * Environment variable mapping for Chinese providers
 * Used as fallback when no stored API key exists
 */
export const ENV_VAR_MAP: Record<ChineseProvider, string> = {
  moonshot: "MOONSHOT_API_KEY",
  zhipu: "ZHIPU_API_KEY",
  minimax: "MINIMAX_API_KEY",
}

/**
 * Provider display names for UI
 */
export const PROVIDER_NAMES: Record<ChineseProvider, string> = {
  moonshot: "Moonshot AI (Kimi)",
  zhipu: "Zhipu AI (GLM)",
  minimax: "MiniMax",
}

/**
 * Provider website URLs for API key registration
 */
export const PROVIDER_URLS: Record<ChineseProvider, string> = {
  moonshot: "https://platform.moonshot.ai",
  zhipu: "https://open.bigmodel.cn",
  minimax: "https://platform.minimax.io",
}

/**
 * Save API key for a Chinese provider
 * Stores securely in auth.json with 0o600 permissions
 */
export async function saveApiKey(provider: ChineseProvider, apiKey: string): Promise<void> {
  await Auth.set(provider, {
    type: "api",
    key: apiKey,
  })
}

/**
 * Get API key for a Chinese provider
 * Checks stored credentials first, then environment variable
 */
export async function getApiKey(provider: ChineseProvider): Promise<string | undefined> {
  // Check stored credentials first
  const auth = await Auth.get(provider)
  if (auth?.type === "api") {
    return auth.key
  }

  // Fallback to environment variable
  return Env.get(ENV_VAR_MAP[provider])
}

/**
 * Check if API key exists for a Chinese provider
 * Returns true if either stored or in environment
 */
export async function hasApiKey(provider: ChineseProvider): Promise<boolean> {
  const key = await getApiKey(provider)
  return key !== undefined && key !== ""
}

/**
 * Remove stored API key for a Chinese provider
 */
export async function clearApiKey(provider: ChineseProvider): Promise<void> {
  await Auth.remove(provider)
}

/**
 * Get all Chinese providers with their API key status
 */
export async function getProviderStatus(): Promise<
  Array<{
    id: ChineseProvider
    name: string
    url: string
    hasKey: boolean
    source: "stored" | "env" | "none"
  }>
> {
  const providers: ChineseProvider[] = ["moonshot", "zhipu", "minimax"]

  return Promise.all(
    providers.map(async (id) => {
      const auth = await Auth.get(id)
      const envKey = Env.get(ENV_VAR_MAP[id])

      let source: "stored" | "env" | "none"
      if (auth?.type === "api") {
        source = "stored"
      } else if (envKey) {
        source = "env"
      } else {
        source = "none"
      }

      return {
        id,
        name: PROVIDER_NAMES[id],
        url: PROVIDER_URLS[id],
        hasKey: source !== "none",
        source,
      }
    }),
  )
}
