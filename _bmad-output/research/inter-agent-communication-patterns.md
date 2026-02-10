# Inter-Agent Communication Patterns Research

**Research Date:** 2026-02-10
**Context:** CodeMAD multi-agent AI coding platform with git worktree isolation

---

## 1. Claude Code Agent Teams Architecture (Feb 2026)

### Overview

Agent Teams is a research preview feature in Claude Code (Opus 4.6) that enables multiple Claude instances to work simultaneously on different aspects of a project. These are independent Claude Code sessions that can communicate and coordinate directly.

**Key Sources:**
- [Anthropic releases Opus 4.6 with new 'agent teams' | TechCrunch](https://techcrunch.com/2026/02/05/anthropic-releases-opus-4-6-with-new-agent-teams/)
- [Breaking: Opus 4.6 and Agent Teams - by Robert Matsuoka](https://hyperdev.matsuoka.com/p/article-opus-46-and-agent-teams)
- [Claude Opus 4.6: Agent Teams, 1M Context & Effort Tuning - ClaudeWorld](https://claude-world.com/articles/claude-opus-4-6/)

### Core Architecture

**Lead-Teammate Model:**
- A lead agent orchestrates work, spawns teammates, and synthesises results
- Lead agents do NOT implement - they only coordinate
- Teammate agents work independently on separate tasks assigned to them
- Each agent has its own context window (1M tokens in beta for Opus 4.6)

**Message Passing Protocol:**
The system uses a `SendMessage` tool with distinct message types:

1. **type: "message"** - Direct message to a single specific teammate (MUST specify recipient)
2. **type: "broadcast"** - Send same message to ALL teammates (expensive, use sparingly)
3. **type: "shutdown_request"** - Request a teammate to gracefully shut down
4. **type: "shutdown_response"** - Respond to shutdown request (approve/reject)
5. **type: "plan_approval_response"** - Approve or reject a teammate's plan

**Automatic Message Delivery:**
- Messages from teammates are automatically delivered to recipients
- If agent is busy (mid-turn), messages queue and deliver when turn ends
- UI shows brief notification with sender's name when messages wait
- No manual inbox checking needed

### Task List Coordination

The system provides task management tools that all teammates can access:

**TaskCreate:** Create new tasks with:
- `subject`: Brief, actionable title in imperative form
- `description`: Detailed description with context and acceptance criteria
- `activeForm`: Present continuous form shown while task is in_progress
- All tasks created with status `pending`

**TaskUpdate:** Modify tasks with:
- `status`: pending → in_progress → completed (or deleted)
- `owner`: Assign to specific agent by name
- `addBlocks`/`addBlockedBy`: Set up task dependencies
- Mark tasks completed with this tool, NOT by sending status messages

**TaskList:** View all tasks with:
- Summary of each task (id, subject, status, owner, blockedBy)
- Agents check this after completing tasks to find next work
- **Critical pattern:** Prefer tasks in ID order (lowest first) when multiple available

**TaskGet:** Retrieve full task details by ID

### Context Management Strategy

**How the lead stays under 120k tokens:**
- Lead delegates implementation to teammates
- Teammates load CLAUDE.md but NOT the lead's conversation history
- Lead receives summaries/conclusions from teammates, not raw data
- Teammates handle file reading, implementation details, test runs
- Lead synthesises results from multiple teammates

**Spawn Prompt Template:**
Every teammate spawn includes four elements:
```
Goal:    [What to achieve]
Context: [Relevant files, patterns, decisions]
Scope:   [Which files to own, what NOT to touch]
Output:  [Expected deliverable format]
```

### Idle/Wake Patterns

**Idle State:**
- Teammates go idle after every turn (normal and expected)
- Idle does NOT mean done or unavailable
- Agents can receive messages while idle
- System sends automatic idle notifications when turn ends

**Wake Pattern:**
- Sending message to idle teammate wakes them up
- They process message normally
- Going idle immediately after sending message is standard flow

### File Ownership and Conflict Prevention

**Critical Pattern:**
- Assign file ownership during team spawn
- Two teammates on same file causes overwrites
- Each teammate gets exclusive scope of files to touch
- Spawn prompt explicitly lists "what NOT to touch"

**Proven at Scale:**
Anthropic demonstrated a 16-agent team writing a 100,000-line Rust C compiler capable of compiling Linux kernel on x86, ARM, and RISC-V, proving the architecture scales to massive codebases.

**Sources:**
- [Introducing Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6)
- [Anthropic's Building a C Compiler](https://www.anthropic.com/engineering/building-c-compiler)

---

## 2. Git Worktree Agent Coordination Patterns

### Core Concept

Git worktrees allow multiple working directories from a single repository, each operating independently while sharing the same Git history. This solves workflow challenges for multi-agent systems by giving each AI agent its own isolated workspace.

**Key Sources:**
- [Git Worktrees: The Secret Weapon for Running Multiple AI Coding Agents in Parallel | Medium](https://medium.com/@mabd.dev/git-worktrees-the-secret-weapon-for-running-multiple-ai-coding-agents-in-parallel-e9046451eb96)
- [How Git Worktrees Changed My AI Agent Workflow | Nx Blog](https://nx.dev/blog/git-worktrees-ai-agents)
- [Running Multiple AI Agents at Once Using Git Worktrees | Medium](https://medium.com/design-bootcamp/running-multiple-ai-agents-at-once-using-git-worktrees-57759e001d7a)

### Benefits for AI Agents

**Isolation Benefits:**
- AI agents don't mix up different features or changes
- Achieve specialised focus on assigned tasks
- Work on different services without interference
- Each agent gets own branch and workspace

**Shared History:**
- All worktrees share same Git history
- Changes committed in any worktree immediately available to all others
- Can merge between worktrees like normal branches

### Merge Coordination Patterns

**Typical Workflow:**
1. Create worktree per agent with unique branch
2. Agent works independently in isolated directory
3. Agent commits changes to their branch
4. Coordinate merge back to main branch

**Conflict Detection:**
Before merging, run:
```bash
git fetch origin main
git merge-base HEAD origin/main  # Find common ancestor
git diff origin/main...HEAD       # See what would merge
```

**Dependency Ordering:**
- Agent B needs Agent A's changes: Agent A merges first, then Agent B rebases
- Use task dependencies (blockedBy/blocks) to enforce ordering
- Lead agent coordinates merge sequence

### Tools and Frameworks

**Worktrunk:**
CLI for git worktree management designed for running AI agents in parallel. Three core commands make worktrees as easy as branches.

**ccswarm:**
Multi-agent orchestration system using Claude Code with Git worktree isolation and specialised AI agents for collaborative development.
- [GitHub - nwiizo/ccswarm](https://github.com/nwiizo/ccswarm)

**multi-agent-workflow-kit:**
Allows running multiple AI coding agents simultaneously, each with own git branch and workspace, supervised in single tmux session.
- [GitHub - laris-co/multi-agent-workflow-kit](https://github.com/laris-co/multi-agent-workflow-kit)

**Sources:**
- [Parallel AI Coding with Git Worktrees and Custom Claude Code Commands | Agent Interviews](https://docs.agentinterviews.com/blog/parallel-ai-coding-with-gitworktrees/)
- [Supercharging Development: Using Git Worktree & AI Agents | Medium](https://medium.com/@mike-welsh/supercharging-development-using-git-worktree-ai-agents-4486916435cb)
- [Worktrunk](https://worktrunk.dev/)

### Use Cases

**Parallel Feature Development:**
Single developer orchestrating multiple AI agents building entire sprint's worth of features simultaneously.

**Parallel Solution Exploration:**
Leverage non-deterministic nature of LLMs as feature - explore multiple solution paths simultaneously, choose best result.

**Separate Concerns:**
- One agent implements feature in worktree A
- Another reviews and refactors existing code in worktree B
- Third runs tests and fixes bugs in worktree C

---

## 3. MCP-Based Agent Communication

### MCP Protocol Overview

Model Context Protocol (MCP) is an open standard developed by Anthropic that enables AI models to integrate with external systems in a standardised way. MCP acts like a universal toolbelt, giving agents a predictable way to understand available tools, how to use them, and what to do with responses.

**Key Sources:**
- [Can You Build Agent2Agent Communication on MCP? Yes! - Microsoft for Developers](https://developer.microsoft.com/blog/can-you-build-agent2agent-communication-on-mcp-yes)
- [Open Protocols for Agent Interoperability Part 1: Inter-Agent Communication on MCP | AWS Open Source Blog](https://aws.amazon.com/blogs/opensource/open-protocols-for-agent-interoperability-part-1-inter-agent-communication-on-mcp/)

### Agent-to-Agent Communication with MCP

**Micro-Service Architecture:**
Agents exposed as MCP servers provide micro-service-like architecture that decouples agents from each other. Single orchestrator agent can coordinate multiple specialist agents across different servers using same MCP protocol primitives.

**Enhanced Capabilities for Inter-Agent Communication:**
- **Resource notifications:** Agents notify each other when resources change
- **Elicitation/sampling:** Request input or decisions from other agents
- **Resumable streams:** Long-running operations can be paused and resumed
- **Persistent resources:** Shared state that multiple agents can access

**Sources:**
- [Creating your own Agent to Agent communication with Model Context Protocol | CAMEL-AI](https://www.camel-ai.org/blogs/creating-your-own-agent-to-agent-communication-with-model-context-protocol)
- [Enabling Agent-to-Agent Interactions through MCP | Medium](https://yia333.medium.com/enabling-agent-to-agent-interactions-through-mcp-3f2a3ea3ab85)

### MCP and Message Brokers

Combining MCP with message brokers like RabbitMQ and ActiveMQ creates powerful Agentic AI applications. MCP handles tool access and resource management, while message brokers handle event distribution and queuing.

**Source:**
- [Message brokers and MCP - Just another protocol or more? | MQ Summit](https://mqsummit.com/talks/message_brokers_and_MCP/)

### MCP vs A2A (Complementary Protocols)

**MCP:** Model Context Protocol
- Focuses on model-context integration
- Agent-to-tool interactions
- Resource access and management

**A2A:** Agent-to-Agent Protocol (Google/Microsoft backed)
- Focuses on agent-to-agent collaboration
- Agent discovery (find other agents' capabilities)
- Message exchange between agents

**Working Together:**
An AI system can use both protocols: MCP for accessing tools internally to perform specific functions, then A2A to communicate with other specialised agents to orchestrate complex workflows.

**Sources:**
- [MCP vs A2A: A Guide to AI Agent Communication Protocols | Auth0 Blog](https://auth0.com/blog/mcp-vs-a2a/)
- [MCP, ACP, A2A, Oh my! — WorkOS Guides](https://workos.com/blog/mcp-acp-a2a-oh-my)
- [Google's Agent-to-Agent (A2A) and Anthropic's Model Context Protocol (MCP) | Gravitee Blog](https://www.gravitee.io/blog/googles-agent-to-agent-a2a-and-anthropics-model-context-protocol-mcp)

### Survey of Agent Interoperability Protocols

Academic research paper surveying MCP, ACP (Agent Communication Protocol), A2A, and ANP (Agent Network Protocol):
- [[2505.02279] A survey of agent interoperability protocols | arXiv](https://arxiv.org/abs/2505.02279)

---

## 4. Event-Driven Agent Coordination Patterns

### NATS vs Redis Pub/Sub

**Key Sources:**
- [Automate Redis Pub/Sub with NATS for AI Event Streaming | SparkCo](https://sparkco.ai/blog/automate-redis-pubsub-with-nats-for-ai-event-streaming)
- [What NATS Redis Actually Does and When to Use It | Hoop Blog](https://hoop.dev/blog/what-nats-redis-actually-does-and-when-to-use-it/)
- [Event-Driven Systems with NATS and Jetstream | James Carr](https://james-carr.org/posts/2026-01-21-nats-jetstream-building-reliable-messaging/)

### Core NATS

**Pure Pub/Sub:**
- Fire-and-forget semantics
- If subscriber isn't connected when message published, it's gone
- Perfect for real-time updates where missing a message doesn't matter
- Extremely low latency

**TypeScript Support:**
Official clients available in Go, Rust, JavaScript (Node and Web), TypeScript (Deno), Python, Java, C#, C, Ruby, Elixir, and CLI.
- [NATS.io – Cloud Native, Open Source, High-performance Messaging](https://nats.io/)

### NATS JetStream

**Persistence Layer:**
JetStream adds:
- **Streams:** Durable message stores
- **Consumers:** Stateful views of streams
- Messages persist even if subscribers offline
- Replay historical messages
- Guaranteed delivery semantics

### NATS + Redis Integration

**Hybrid Architecture:**
Integrating Redis Pub/Sub with NATS offers powerful architecture for automated event streaming:
- NATS handles low-latency messaging
- Redis handles persistence, analytics, session data that must survive restarts
- Applications publish events through NATS JetStream
- Redis provides durable state synchronisation

**Agent-Driven Workflows:**
As AI-driven services produce streams of events in milliseconds, NATS and Redis ensure agent-driven workflows stay consistent while keeping ephemeral state manageable.

**Sources:**
- [Go for Event-Driven Architecture: Designing Pub/Sub Systems with NATS and Redis Streams | Level Up Coding](https://levelup.gitconnected.com/go-for-event-driven-architecture-designing-pub-sub-systems-with-nats-and-redis-streams-1adcd10b5fa0)
- [GitHub - damiancipolat/Redis_PUBSUB_node: Event sourcing using redis pub/sub with docker and nodejs + TypeScript](https://github.com/damiancipolat/Redis_PUBSUB_node)

### When to Use Each

| Scenario | Recommendation | Reason |
|----------|---------------|--------|
| Real-time agent notifications | Core NATS | Lowest latency, fire-and-forget |
| Task queue with guarantees | NATS JetStream | Durability, replay capability |
| Session state persistence | Redis | Survives restarts, fast lookups |
| Event history analysis | NATS JetStream + Redis | Stream processing + persistent analytics |

---

## 5. Shared Context Without Shared Context Windows

### Core Challenge

How do agents share discoveries without filling each other's context windows?

**Key Source:**
- [Architecting efficient context-aware multi-agent framework for production | Google Developers Blog](https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/)

### Solution Patterns

#### 1. Summary-Based Communication

**Principle:** Send conclusions, not raw data.

Agents summarise completed work phases and store essential information in external memory before proceeding to new tasks. When context limits approach, agents can spawn fresh subagents with clean contexts while maintaining continuity through careful handoffs.

**Compression Methods:**
- **Selective:** Preserve key points only
- **Abstractive:** Rewrite content more concisely
- **Knowledge distillation:** Extract general patterns from specific data

**Sources:**
- [Advancing Multi-Agent Systems Through Model Context Protocol | Medium](https://medium.com/@EleventhHourEnthusiast/advancing-multi-agent-systems-through-model-context-protocol-architecture-implementation-and-5846564bc1ff)
- [Advancing Multi-Agent Systems Through Model Context Protocol | arXiv](https://arxiv.org/html/2504.21030v1)

#### 2. Shared Artifact Stores

**Artifacts as Persistent Results:**
Artifacts are immutable results produced by remote agents, designed for scenarios involving binary or large data. Artifacts provide dedicated mechanism for persisting larger blobs without cluttering session state.

**Scoping:**
- **Session-scope:** Associated with specific app, user, and session IDs
- **User-scope:** Prefix "user:" makes artifacts accessible from any session belonging to that user within app

**Communication Pattern:**
Agents write results to artifacts that other agents can read. Artifacts remain external to context windows but accessible when needed.

**Sources:**
- [Artifacts - Agent Development Kit | Google ADK](https://google.github.io/adk-docs/artifacts/)
- [Architecting Smarter Multi-Agent Systems with Context Engineering | OneReach](https://onereach.ai/blog/smarter-context-engineering-multi-agent-systems/)

#### 3. Shared Context Repositories

**Centralised/Distributed Stores:**
Shared context repositories act as centralised or distributed stores with MCP interfaces, letting agents with right permissions retrieve common context.

**Resource Format:**
Communication leverages standardised resource formats to package and transfer context directly from one agent to another as part of task delegation or collaborative workflows.

**Benefits:**
- Passing task-specific context during handoffs
- Reducing latency for time-critical operations
- Presenting unified experience to user while agents collaborate

**Source:**
- [How ACP Enables Interoperable Agent Communication? | AIMultiple Research](https://research.aimultiple.com/agent-communication-protocol/)

#### 4. Decision Logs

**Query-Based Access:**
Instead of pushing all information to all agents, maintain decision logs that agents can query when relevant:
- "Why was approach X chosen?"
- "What constraints apply to module Y?"
- "What patterns are established in this codebase?"

Agents pull information as needed rather than receiving everything upfront.

---

## 6. Real-World Multi-Agent Coding Systems

### Devin AI

**Multi-Agent Coordination:**
Later revisions of Devin gained multi-agent operation capability, where one AI agent dispatches tasks to other AI agents.

**Key Sources:**
- [Agent-Native Development: A Deep Dive into Devin 2.0's Technical Design | Medium](https://medium.com/@takafumi.endo/agent-native-development-a-deep-dive-into-devin-2-0s-technical-design-3451587d23c0)
- [Devin 2.0 Explained: Features, Use Cases, and How It Compares | Analytics Vidhya](https://www.analyticsvidhya.com/blog/2025/04/devin-2-0/)

#### Dual-Agent System Architecture

**Planner Agent:**
- High-level analysis and task deconstruction
- Conceptual understanding and strategy development
- Analyses requirements documents, interprets user intent
- Outputs detailed roadmap for implementation

**Executor Agent:**
- Responsible for implementation
- Code generation, test runs, problem fixing
- Provides feedback on implementation details and potential problems
- Feedback triggers strategy adjustments by planner

**Collaboration Mechanism:**
Continuous dialogue loop: planner issues task descriptions and acceptance criteria, executor provides feedback, which triggers planner adjustments.

#### Parallel Agent Execution

In Devin 2.0, you can spin up multiple parallel Devins, each with own interactive, cloud-based IDE. Enables multitasking, tackling numerous tasks concurrently, stepping in to steer when needed.

**Cloud-Based Coordination:**
Each session runs in isolated virtual machine. Each task runs in isolated VM without conflict between sessions. Enables efficient coordination of multiple agents working simultaneously.

**Sources:**
- [Cognition | Devin 2.0](https://cognition.ai/blog/devin-2)
- [Coding Agents 101: The Art of Actually Getting Things Done | Devin](https://devin.ai/agents101)

---

### Windsurf Cascade

**Multi-Agent Architecture:**
Windsurf, now part of Cognition AI ecosystem, introduced revolutionary Cascade Engine. Unlike standard LLM implementations treating code as static text, Cascade uses graph-based reasoning system to map entire codebase's logic and dependencies.

**Key Sources:**
- [Windsurf Review 2026: The AI IDE Redefining Coding Workflows | Second Talent](https://www.secondtalent.com/resources/windsurf-review/)
- [Windsurf Wave 13: Free SWE-1.5, Parallel Agents Escalate AI IDE War | byteiota](https://byteiota.com/windsurf-wave-13-free-swe-1-5-parallel-agents-escalate-ai-ide-war/)

#### Parallel Agent Execution (Wave 13)

**First-Class Multi-Agent Support:**
Run multiple Cascade AI agents simultaneously without conflicts. Spawn five different agents working on five separate bugs at once, monitor side-by-side through multi-pane interface.

**Coordination:**
Cascade multi-agent system assigns agents to frontend, backend, testing, documentation simultaneously. Agents coordinate dependencies and share implementation context.

#### Planning and Context Management

**Specialised Planning Agent:**
Built-in planning capabilities improve performance for longer tasks. In background, specialised planning agent continuously refines long-term plan while selected model focuses on short-term actions based on that plan.

**Hybrid Indexing:**
- Native AST parsing extracts symbol graphs and dependency structure
- Semantic embeddings and RAG supply contextual snippets to models
- Persistent "Memories" capture style, patterns, project-specific signals as long-lived vectors and metadata
- System continuously refines suggestions across sessions

**Sources:**
- [Cascade | Windsurf](https://windsurf.com/cascade)
- [Windsurf - Cascade | Docs](https://docs.windsurf.com/windsurf/cascade/cascade)

---

### Cursor AI

**Background Agents:**
Asynchronous remote agents in Cursor that operate in remote environment, allowing spawning tasks that edit and run code independently in background, which you can review and merge into main codebase.

**Key Sources:**
- [Using Cursor Background Agents for Asynchronous Coding | Steve Kinney](https://stevekinney.com/courses/ai-development/cursor-background-agents)
- [Using Cursor background agents | madewithlove blog](https://madewithlove.com/blog/using-cursor-background-agents/)

#### Parallel Execution

**Cloud-Based Concurrency:**
Background agents enable multiple agents to run concurrently in cloud, each working on isolated tasks while you stay focused on core logic. Create and run multiple background agents in parallel to tackle different tasks or compare results from various models simultaneously.

#### Role-Based Architecture

**Cursor 2.0 Pattern:**
Orchestrate agentic behaviours through role-based prompts inside IDE with repo context. Think of one assistant wearing distinct, persistent "hats" (planner, backend, testing), coordinating through diffs and human review gates.

**Design Principles:**
- **Role Clarity:** Assign explicit agent responsibilities
- **Responsibility Focus:** Design each role for single-objective concentration
- **Synchronisation Mechanisms:** Establish regular judgement checkpoints
- **Reset Mechanisms:** Prevent error accumulation through periodic clean restarts

**Sources:**
- [Cursor 2.0 Multi-Agent Suite Explained with Real Use Cases | Skywork AI](https://skywork.ai/blog/vibecoding/cursor-2-0-multi-agent-suite/)
- [Cursor 2.0: Agent-First Architecture Complete Guide | Digital Applied](https://www.digitalapplied.com/blog/cursor-2-0-agent-first-architecture-guide)

#### Git Worktrees for Isolation

Cursor uses Git worktrees to isolate parallel agents, with each agent operating in own working directory linked to same repository but on different branch.

#### Scale Achievement

Cursor demonstrated that multiple coordinated agents can automate projects traditionally requiring human teams months to complete, achieving automation at scale.

**Stress Test:**
Cursor's OpenAI-powered agents built and ran a browser from scratch, demonstrating capability for massive parallel coordination.

**Sources:**
- [Cursor's OpenAI-powered agents built and ran a browser | Fortune](https://fortune.com/2026/01/23/cursor-built-web-browser-with-swarm-ai-agents-powered-openai/)
- [Background Agents in Cursor: Cloud-Powered Coding at Scale | Decoupled Logic](https://decoupledlogic.com/2025/05/29/background-agents-in-cursor-cloud-powered-coding-at-scale/)

#### Practical Use Cases

Cursor's background agents feature lets Pro users spin up cloud-based environments that clone repo, complete small tasks in parallel, and create PRs without touching local setup.

**Source:**
- [Cursor Agents Hands-on Review | Zack Proser](https://zackproser.com/blog/cursor-agents-review)

---

### SWE-agent and OpenHands

**OpenHands SDK Architecture:**
The OpenHands Software Agent SDK bridges gap between rapid local prototyping and production deployment for software engineering agents through stateless, event-sourced, and composable architecture spanning four packages (SDK, Tools, Workspace, Server).

**Key Sources:**
- [The OpenHands Software Agent SDK: A Composable and Extensible Foundation | arXiv](https://arxiv.org/abs/2511.03690)
- [The OpenHands Software Agent SDK | arXiv PDF](https://arxiv.org/pdf/2511.03690)

#### Event-Sourcing Pattern

**Core Architecture:**
At V1's core lies event-sourcing pattern treating all interactions as immutable events appended to log. At base, Event provides immutable structure (ID, timestamp, source) with type-safe serialisation via discriminated unions.

**Modularity:**
Separation addresses key production concerns:
- **sdk:** Lightweight for diverse integration scenarios
- **tools:** Isolates slow-running tool tests from core SDK changes
- **workspace:** Provides optional sandboxing implementations without bloating core
- **agent_server:** Generic API server usable with or without containers

Benefits: Independent testing, selective dependency management, incremental release cycles.

#### Multi-Agent Architecture

**Delegation Approach:**
OpenHands is framework with connected agents where each agent has prompts and actions. Uses delegation approach where one agent passes tasks to next.

**Features:**
Supports multi-agent collaboration, human interaction, and rigorous benchmarking across various tasks.

**Source:**
- [OpenHands Agent Framework | Emergent Mind](https://www.emergentmind.com/topics/openhands-agent-framework)

#### Specialised Agent Decomposition (HyperAgent Example)

**Four Specialised Agents:**
- **Planner Agent:** Interprets human prompts and coordinates other agents
- **Navigator Agent:** Handles information retrieval
- **Code Editor Agent:** Performs code modification
- **Executor Agent:** Validates solutions through shell interaction

**Source:**
- [SWE-EVO: Benchmarking Coding Agents | arXiv](https://www.arxiv.org/pdf/2512.18470v1)

#### Performance

**SWE-Bench Verified:**
SDK achieves 72% resolution rate using Claude Sonnet 4.5 with extended thinking.

**GAIA:**
Achieves 67.9% accuracy with Claude Sonnet 4.5, demonstrating effective multi-step reasoning and tool use.

**Unique Features:**
16 additional features including native remote execution, production server with sandboxing, model-agnostic multi-LLM routing across 100+ providers.

**Sources:**
- [OpenHands Software Agent SDK | arXiv HTML](https://arxiv.org/html/2511.03690v1)
- [Software Agent SDK - OpenHands Docs](https://docs.openhands.dev/sdk)

---

## 7. Multi-Agent Framework Comparisons

### CrewAI vs LangGraph vs AutoGen

**Key Sources:**
- [LangGraph vs CrewAI: Let's Learn About the Differences | ZenML Blog](https://www.zenml.io/blog/langgraph-vs-crewai)
- [CrewAI vs LangGraph vs AutoGen: Choosing the Right Multi-Agent AI Framework | DataCamp](https://www.datacamp.com/tutorial/crewai-vs-langgraph-vs-autogen)

### Agent Communication Patterns

#### LangGraph

**Graph-Based Workflow:**
Adopts graph-based workflow design treating agent interactions as nodes in directed graph. Provides exceptional flexibility for complex decision-making pipelines with conditional logic, branching workflows, and dynamic adaptation.

#### CrewAI

**Sequential Task Flow:**
Facilitates clear flow of information where output of preceding task serves as context for subsequent task. Each task within sequential process has agent explicitly assigned to it.

### Emerging Interoperability Standards (2026)

**A2A Protocol:**
Google and Microsoft jointly back Agent2Agent (A2A) protocol for agent-to-agent communication. Enables agents built on different frameworks to discover each other's capabilities and exchange messages.

**MCP Protocol:**
Anthropic's Model Context Protocol focuses on model-context integration. Positions both LangGraph and CrewAI to benefit from emerging standards.

**Complementary Design:**
MCP handles agent-to-tool interactions while A2A focuses on agent-to-agent collaboration.

**Sources:**
- [Top 7 Agentic AI Frameworks in 2026: LangChain, CrewAI, and Beyond | AlphaMatch](https://www.alphamatch.ai/blog/top-agentic-ai-frameworks-2026)
- [AutoGen vs CrewAI vs LangGraph Agent Framework Comparison 2026 | Vocal Media](https://vocal.media/journal/auto-gen-vs-crew-ai-vs-lang-graph-agent-framework-comparison-2026)

### Production Deployment Patterns

**Common Journey:**
Many organisations follow "prototype with CrewAI, productionise with LangGraph" journey. Leverage CrewAI's rapid setup for proof-of-concept work before migrating to LangGraph's stateful architecture for production deployments.

**Sources:**
- [Agent Orchestration 2026: LangGraph, CrewAI & AutoGen Guide | Iterathon](https://iterathon.tech/blog/ai-agent-orchestration-frameworks-2026)
- [14 AI Agent Frameworks Compared: LangChain, LangGraph, CrewAI, OpenAI SDK, and More | Softcery](https://softcery.com/lab/top-14-ai-agent-frameworks-of-2025-a-founders-guide-to-building-smarter-systems)

---

## 8. Key Takeaways for CodeMAD

### Architecture Recommendations

#### 1. Message Passing Protocol (Follow Claude Code Model)

**Implement SendMessage-style tool with message types:**
- Direct messages to specific agents (most common)
- Broadcast to all (use sparingly - expensive)
- Shutdown requests/responses
- Plan approval workflow

**Automatic delivery:**
- Queue messages when recipient busy
- Deliver when turn ends
- UI notifications for waiting messages

#### 2. Task List Coordination

**Shared task store accessible to all agents:**
- TaskCreate, TaskUpdate, TaskList, TaskGet operations
- Task ownership (owner field)
- Task dependencies (blocks/blockedBy)
- Status progression: pending → in_progress → completed
- **Critical:** Prefer tasks in ID order when multiple available

#### 3. Git Worktree Isolation (Already Planned)

**Per-agent worktree with merge coordination:**
- Each agent gets exclusive branch and working directory
- Shared git history across all worktrees
- File ownership prevents conflicts
- Lead coordinates merge sequence based on task dependencies

**Tools to investigate:**
- Worktrunk CLI for worktree management
- ccswarm patterns for specialised agents
- multi-agent-workflow-kit for tmux coordination

#### 4. MCP as Communication Backbone

**Use MCP servers for:**
- Agent-to-agent message broker (resource notifications, sampling)
- Shared context repositories with permission controls
- Tool access for agents
- Persistent resources across agents

**Complement with A2A for:**
- Agent discovery (find capabilities)
- Direct agent-to-agent messaging
- Framework interoperability

#### 5. Event Bus for Coordination

**NATS JetStream for guaranteed delivery:**
- Task assignments
- Status updates
- Dependency notifications
- Merge coordination events

**Core NATS for real-time:**
- Progress updates
- Idle/wake notifications
- Non-critical status broadcasts

**Redis for:**
- Session state persistence
- Shared decision logs
- Agent artifact store

#### 6. Context Management Strategy

**Keep lead agent context minimal:**
- Lead receives summaries, not raw data
- Teammates load project instructions but NOT lead's history
- Spawn prompts include: Goal, Context, Scope, Output format
- Agents write to shared artifacts for cross-agent access

**Summary-based communication:**
- Agents send conclusions and key findings
- Compress via selective, abstractive, or knowledge distillation methods
- Query-based access to decision logs instead of pushing everything

#### 7. Planning Agent Pattern (From Windsurf/Devin)

**Separate planning from execution:**
- Planning agent continuously refines long-term plan
- Execution agents focus on short-term actions
- Continuous dialogue loop for feedback and adjustment
- Planning agent coordinates merge sequence and dependency ordering

### Implementation Priority

**Phase 1 (MVP):**
1. Message passing protocol (SendMessage tool with types)
2. Shared task list (TaskCreate, TaskUpdate, TaskList, TaskGet)
3. Git worktree per agent with manual merge coordination
4. Basic idle/wake patterns

**Phase 2 (Enhanced):**
5. MCP-based message broker and context repositories
6. NATS JetStream for guaranteed event delivery
7. Automated merge coordination with conflict detection
8. Summary-based communication with artifact stores

**Phase 3 (Advanced):**
9. Planning agent with continuous refinement
10. A2A protocol integration for framework interoperability
11. Advanced context management with knowledge distillation
12. Multi-model coordination (different LLMs for different agent types)

---

## Sources Summary

All claims in this research document are supported by the following sources:

### Claude Code Agent Teams
- [Anthropic releases Opus 4.6 with new 'agent teams' | TechCrunch](https://techcrunch.com/2026/02/05/anthropic-releases-opus-4-6-with-new-agent-teams/)
- [Breaking: Opus 4.6 and Agent Teams](https://hyperdev.matsuoka.com/p/article-opus-46-and-agent-teams)
- [Introducing Claude Opus 4.6](https://www.anthropic.com/news/claude-opus-4-6)
- [Claude Opus 4.6: Agent Teams, 1M Context & Effort Tuning](https://claude-world.com/articles/claude-opus-4-6/)
- [Building a C Compiler - Anthropic](https://www.anthropic.com/engineering/building-c-compiler)

### Git Worktree Coordination
- [Git Worktrees: The Secret Weapon for Running Multiple AI Coding Agents in Parallel](https://medium.com/@mabd.dev/git-worktrees-the-secret-weapon-for-running-multiple-ai-coding-agents-in-parallel-e9046451eb96)
- [How Git Worktrees Changed My AI Agent Workflow](https://nx.dev/blog/git-worktrees-ai-agents)
- [GitHub - nwiizo/ccswarm](https://github.com/nwiizo/ccswarm)
- [GitHub - laris-co/multi-agent-workflow-kit](https://github.com/laris-co/multi-agent-workflow-kit)
- [Worktrunk](https://worktrunk.dev/)

### MCP Protocol
- [Can You Build Agent2Agent Communication on MCP? Yes!](https://developer.microsoft.com/blog/can-you-build-agent2agent-communication-on-mcp-yes)
- [Open Protocols for Agent Interoperability Part 1: Inter-Agent Communication on MCP](https://aws.amazon.com/blogs/opensource/open-protocols-for-agent-interoperability-part-1-inter-agent-communication-on-mcp/)
- [Creating your own Agent to Agent communication with Model Context Protocol](https://www.camel-ai.org/blogs/creating-your-own-agent-to-agent-communication-with-model-context-protocol)
- [MCP vs A2A: A Guide to AI Agent Communication Protocols](https://auth0.com/blog/mcp-vs-a2a/)
- [arXiv: A survey of agent interoperability protocols](https://arxiv.org/abs/2505.02279)

### Event-Driven Coordination
- [Automate Redis Pub/Sub with NATS for AI Event Streaming](https://sparkco.ai/blog/automate-redis-pubsub-with-nats-for-ai-event-streaming)
- [What NATS Redis Actually Does and When to Use It](https://hoop.dev/blog/what-nats-redis-actually-does-and-when-to-use-it/)
- [Event-Driven Systems with NATS and Jetstream](https://james-carr.org/posts/2026-01-21-nats-jetstream-building-reliable-messaging/)
- [NATS.io](https://nats.io/)

### Shared Context Patterns
- [Advancing Multi-Agent Systems Through Model Context Protocol](https://arxiv.org/html/2504.21030v1)
- [Architecting efficient context-aware multi-agent framework for production](https://developers.googleblog.com/architecting-efficient-context-aware-multi-agent-framework-for-production/)
- [Artifacts - Agent Development Kit](https://google.github.io/adk-docs/artifacts/)
- [How ACP Enables Interoperable Agent Communication?](https://research.aimultiple.com/agent-communication-protocol/)

### Real-World Systems
- [Agent-Native Development: A Deep Dive into Devin 2.0's Technical Design](https://medium.com/@takafumi.endo/agent-native-development-a-deep-dive-into-devin-2-0s-technical-design-3451587d23c0)
- [Windsurf Review 2026: The AI IDE Redefining Coding Workflows](https://www.secondtalent.com/resources/windsurf-review/)
- [Using Cursor Background Agents for Asynchronous Coding](https://stevekinney.com/courses/ai-development/cursor-background-agents)
- [The OpenHands Software Agent SDK](https://arxiv.org/abs/2511.03690)

### Framework Comparisons
- [LangGraph vs CrewAI: Let's Learn About the Differences](https://www.zenml.io/blog/langgraph-vs-crewai)
- [CrewAI vs LangGraph vs AutoGen: Choosing the Right Multi-Agent AI Framework](https://www.datacamp.com/tutorial/crewai-vs-langgraph-vs-autogen)
- [Top 7 Agentic AI Frameworks in 2026](https://www.alphamatch.ai/blog/top-agentic-ai-frameworks-2026)
