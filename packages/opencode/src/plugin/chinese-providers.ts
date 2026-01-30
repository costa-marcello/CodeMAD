import type { Hooks, PluginInput } from "@codemad/plugin"

/**
 * Auth plugin for Chinese LLM providers (Moonshot, Zhipu, MiniMax).
 * Provides API key authentication methods for each provider.
 */

export async function MoonshotAuthPlugin(_input: PluginInput): Promise<Hooks> {
  return {
    auth: {
      provider: "moonshot",
      async loader(getAuth, _provider) {
        const auth = await getAuth()
        if (auth.type !== "api") return {}
        return { apiKey: auth.key }
      },
      methods: [
        {
          label: "Enter API Key",
          type: "api",
        },
      ],
    },
  }
}

export async function ZhipuAuthPlugin(_input: PluginInput): Promise<Hooks> {
  return {
    auth: {
      provider: "zhipu",
      async loader(getAuth, _provider) {
        const auth = await getAuth()
        if (auth.type !== "api") return {}
        return { apiKey: auth.key }
      },
      methods: [
        {
          label: "Enter API Key",
          type: "api",
        },
      ],
    },
  }
}

export async function MiniMaxAuthPlugin(_input: PluginInput): Promise<Hooks> {
  return {
    auth: {
      provider: "minimax",
      async loader(getAuth, _provider) {
        const auth = await getAuth()
        if (auth.type !== "api") return {}
        return { apiKey: auth.key }
      },
      methods: [
        {
          label: "Enter API Key",
          type: "api",
        },
      ],
    },
  }
}
