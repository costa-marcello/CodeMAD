import { test, expect, mock } from "bun:test"
import path from "path"

// Mock BunProc and default plugins to prevent actual installations during tests
mock.module("../../src/bun/index", () => ({
  BunProc: {
    install: async (pkg: string, _version?: string) => {
      // Return package name without version for mocking
      const lastAtIndex = pkg.lastIndexOf("@")
      return lastAtIndex > 0 ? pkg.substring(0, lastAtIndex) : pkg
    },
    run: async () => {
      throw new Error("BunProc.run should not be called in tests")
    },
    which: () => process.execPath,
    InstallFailedError: class extends Error {},
  },
}))

const mockPlugin = () => ({})
mock.module("opencode-copilot-auth", () => ({ default: mockPlugin }))
mock.module("opencode-anthropic-auth", () => ({ default: mockPlugin }))
mock.module("@gitlab/opencode-gitlab-auth", () => ({ default: mockPlugin }))

import { tmpdir } from "../fixture/fixture"
import { Instance } from "../../src/project/instance"
import { Provider } from "../../src/provider/provider"
import { Env } from "../../src/env"

// Test that Chinese provider packages can be imported
test("zhipu-ai-provider can be imported", async () => {
  const { createZhipu } = await import("zhipu-ai-provider")
  expect(createZhipu).toBeDefined()
  expect(typeof createZhipu).toBe("function")
})

test("vercel-minimax-ai-provider can be imported", async () => {
  const { createMinimax } = await import("vercel-minimax-ai-provider")
  expect(createMinimax).toBeDefined()
  expect(typeof createMinimax).toBe("function")
})

// Test Moonshot provider configuration
test("moonshot provider configured via opencode.json", async () => {
  await using tmp = await tmpdir({
    init: async (dir) => {
      await Bun.write(
        path.join(dir, "opencode.json"),
        JSON.stringify({
          $schema: "https://opencode.ai/config.json",
          provider: {
            moonshot: {
              npm: "@ai-sdk/openai-compatible",
              name: "Moonshot AI (Kimi)",
              env: ["MOONSHOT_API_KEY"],
              api: "https://api.moonshot.cn/v1",
              models: {
                "kimi-k2.5": {
                  name: "Kimi K2.5",
                  tool_call: true,
                  limit: {
                    context: 256000,
                    output: 128000,
                  },
                },
              },
              options: {
                apiKey: "test-moonshot-key",
              },
            },
          },
        }),
      )
    },
  })
  await Instance.provide({
    directory: tmp.path,
    fn: async () => {
      const providers = await Provider.list()
      expect(providers["moonshot"]).toBeDefined()
      expect(providers["moonshot"].name).toBe("Moonshot AI (Kimi)")
      expect(providers["moonshot"].models["kimi-k2.5"]).toBeDefined()
      expect(providers["moonshot"].models["kimi-k2.5"].limit.context).toBe(256000)
      expect(providers["moonshot"].models["kimi-k2.5"].api.npm).toBe("@ai-sdk/openai-compatible")
    },
  })
})

// Test Zhipu provider configuration
test("zhipu provider configured via opencode.json", async () => {
  await using tmp = await tmpdir({
    init: async (dir) => {
      await Bun.write(
        path.join(dir, "opencode.json"),
        JSON.stringify({
          $schema: "https://opencode.ai/config.json",
          provider: {
            zhipu: {
              npm: "zhipu-ai-provider",
              name: "Zhipu AI (GLM)",
              env: ["ZHIPU_API_KEY"],
              api: "https://open.bigmodel.cn/api/paas/v4",
              models: {
                "glm-4.7": {
                  name: "GLM 4.7",
                  tool_call: true,
                  limit: {
                    context: 200000,
                    output: 128000,
                  },
                },
              },
              options: {
                apiKey: "test-zhipu-key",
              },
            },
          },
        }),
      )
    },
  })
  await Instance.provide({
    directory: tmp.path,
    fn: async () => {
      const providers = await Provider.list()
      expect(providers["zhipu"]).toBeDefined()
      expect(providers["zhipu"].name).toBe("Zhipu AI (GLM)")
      expect(providers["zhipu"].models["glm-4.7"]).toBeDefined()
      expect(providers["zhipu"].models["glm-4.7"].limit.context).toBe(200000)
      expect(providers["zhipu"].models["glm-4.7"].api.npm).toBe("zhipu-ai-provider")
    },
  })
})

// Test MiniMax provider configuration
test("minimax provider configured via opencode.json", async () => {
  await using tmp = await tmpdir({
    init: async (dir) => {
      await Bun.write(
        path.join(dir, "opencode.json"),
        JSON.stringify({
          $schema: "https://opencode.ai/config.json",
          provider: {
            minimax: {
              npm: "vercel-minimax-ai-provider",
              name: "MiniMax",
              env: ["MINIMAX_API_KEY"],
              api: "https://api.minimax.io/v1",
              models: {
                "MiniMax-M2.1": {
                  name: "MiniMax M2.1",
                  tool_call: true,
                  limit: {
                    context: 200000,
                    output: 65536,
                  },
                },
              },
              options: {
                apiKey: "test-minimax-key",
              },
            },
          },
        }),
      )
    },
  })
  await Instance.provide({
    directory: tmp.path,
    fn: async () => {
      const providers = await Provider.list()
      expect(providers["minimax"]).toBeDefined()
      expect(providers["minimax"].name).toBe("MiniMax")
      expect(providers["minimax"].models["MiniMax-M2.1"]).toBeDefined()
      expect(providers["minimax"].models["MiniMax-M2.1"].limit.output).toBe(65536)
    },
  })
})

// Test that Chinese providers can be loaded from environment variables
test("moonshot provider uses api key from env variable", async () => {
  await using tmp = await tmpdir({
    init: async (dir) => {
      await Bun.write(
        path.join(dir, "opencode.json"),
        JSON.stringify({
          $schema: "https://opencode.ai/config.json",
          provider: {
            moonshot: {
              npm: "@ai-sdk/openai-compatible",
              name: "Moonshot AI (Kimi)",
              env: ["MOONSHOT_API_KEY"],
              api: "https://api.moonshot.cn/v1",
              models: {
                "kimi-k2.5": {
                  name: "Kimi K2.5",
                  tool_call: true,
                  limit: { context: 256000, output: 128000 },
                },
              },
            },
          },
        }),
      )
    },
  })
  await Instance.provide({
    directory: tmp.path,
    init: async () => {
      Env.set("MOONSHOT_API_KEY", "test-moonshot-env-key")
    },
    fn: async () => {
      const providers = await Provider.list()
      expect(providers["moonshot"]).toBeDefined()
      // Key is populated from env variable
      expect(providers["moonshot"].key).toBe("test-moonshot-env-key")
    },
  })
})

test("zhipu provider uses api key from env variable", async () => {
  await using tmp = await tmpdir({
    init: async (dir) => {
      await Bun.write(
        path.join(dir, "opencode.json"),
        JSON.stringify({
          $schema: "https://opencode.ai/config.json",
          provider: {
            zhipu: {
              npm: "zhipu-ai-provider",
              name: "Zhipu AI (GLM)",
              env: ["ZHIPU_API_KEY"],
              api: "https://open.bigmodel.cn/api/paas/v4",
              models: {
                "glm-4.7": {
                  name: "GLM 4.7",
                  tool_call: true,
                  limit: { context: 200000, output: 128000 },
                },
              },
            },
          },
        }),
      )
    },
  })
  await Instance.provide({
    directory: tmp.path,
    init: async () => {
      Env.set("ZHIPU_API_KEY", "test-zhipu-env-key")
    },
    fn: async () => {
      const providers = await Provider.list()
      expect(providers["zhipu"]).toBeDefined()
      // Key is populated from env variable
      expect(providers["zhipu"].key).toBe("test-zhipu-env-key")
    },
  })
})

// Test that all three Chinese providers can coexist
test("all three Chinese providers can be configured simultaneously", async () => {
  await using tmp = await tmpdir({
    init: async (dir) => {
      await Bun.write(
        path.join(dir, "opencode.json"),
        JSON.stringify({
          $schema: "https://opencode.ai/config.json",
          provider: {
            moonshot: {
              npm: "@ai-sdk/openai-compatible",
              name: "Moonshot AI",
              env: ["MOONSHOT_API_KEY"],
              api: "https://api.moonshot.cn/v1",
              models: {
                "kimi-k2.5": {
                  name: "Kimi K2.5",
                  tool_call: true,
                  limit: { context: 256000, output: 128000 },
                },
              },
              options: { apiKey: "moonshot-key" },
            },
            zhipu: {
              npm: "zhipu-ai-provider",
              name: "Zhipu AI",
              env: ["ZHIPU_API_KEY"],
              api: "https://open.bigmodel.cn/api/paas/v4",
              models: {
                "glm-4.7": {
                  name: "GLM 4.7",
                  tool_call: true,
                  limit: { context: 200000, output: 128000 },
                },
              },
              options: { apiKey: "zhipu-key" },
            },
            minimax: {
              npm: "vercel-minimax-ai-provider",
              name: "MiniMax",
              env: ["MINIMAX_API_KEY"],
              api: "https://api.minimax.io/v1",
              models: {
                "MiniMax-M2.1": {
                  name: "MiniMax M2.1",
                  tool_call: true,
                  limit: { context: 200000, output: 65536 },
                },
              },
              options: { apiKey: "minimax-key" },
            },
          },
        }),
      )
    },
  })
  await Instance.provide({
    directory: tmp.path,
    fn: async () => {
      const providers = await Provider.list()
      expect(providers["moonshot"]).toBeDefined()
      expect(providers["zhipu"]).toBeDefined()
      expect(providers["minimax"]).toBeDefined()
      expect(Object.keys(providers)).toContain("moonshot")
      expect(Object.keys(providers)).toContain("zhipu")
      expect(Object.keys(providers)).toContain("minimax")
    },
  })
})

// Test regional endpoint configuration
test("zhipu provider supports regional endpoint override", async () => {
  await using tmp = await tmpdir({
    init: async (dir) => {
      await Bun.write(
        path.join(dir, "opencode.json"),
        JSON.stringify({
          $schema: "https://opencode.ai/config.json",
          provider: {
            zhipu: {
              npm: "zhipu-ai-provider",
              name: "Zhipu AI (Global)",
              env: ["ZHIPU_API_KEY"],
              api: "https://api.z.ai/api/paas/v4", // Global endpoint
              models: {
                "glm-4.7": {
                  name: "GLM 4.7",
                  tool_call: true,
                  limit: { context: 200000, output: 128000 },
                },
              },
              options: {
                apiKey: "test-key",
                baseURL: "https://api.z.ai/api/paas/v4",
              },
            },
          },
        }),
      )
    },
  })
  await Instance.provide({
    directory: tmp.path,
    fn: async () => {
      const providers = await Provider.list()
      expect(providers["zhipu"]).toBeDefined()
      expect(providers["zhipu"].options.baseURL).toBe("https://api.z.ai/api/paas/v4")
    },
  })
})
