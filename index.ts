import type { PluginInput, PluginOptions, Plugin, Hooks } from "@opencode-ai/plugin"

const REDIRECTS: Record<string, string> = {
  grep: "grep",
  rg: "grep",
  cat: "read or grep",
  sed: "edit",
  find: "grep or glob",
  cd: "workdir",
}

const CONFIRM_RE = /#\s*confirm\s*$/i

function guard(command: string): string | null {
  const trimmed = command.trimStart()
  if (CONFIRM_RE.test(trimmed)) return null

  const match = trimmed.match(/^[^\s]+/)
  const name = match ? match[0] : ""
  const tool = REDIRECTS[name]
  if (!tool) return null

  if (tool === "read or grep") {
    return (
      `Command starts with '${name}'. You have dedicated tools available. Use the \`read\` or \`grep\` tool instead of running shell commands.\n\n` +
      `Tip: If you really want to use this tool, add a "# confirm" comment at the end of the command and run it again.`
    )
  }
  if (tool === "grep or glob") {
    return (
      `Command starts with 'find'. You have dedicated tools available. Use the \`grep\` or \`glob\` tool instead of running shell commands.\n\n` +
      `Tip: If you really want to use this tool, add a "# confirm" comment at the end of the command and run it again.`
    )
  }
  if (tool === "workdir") {
    return (
      `Command starts with '${name}'. You have a dedicated way to change directories. Use the bash tool's \`workdir\` parameter to specify the working directory instead of running 'cd'.\n\n` +
      `Tip: If you really want to use this tool, add a "# confirm" comment at the end of the command and run it again.`
    )
  }
  return (
    `Command starts with '${name}'. You have a dedicated \`${tool}\` tool available. Use it instead of running shell commands.\n\n` +
    `Tip: If you really want to use this tool, add a "# confirm" comment at the end of the command and run it again.`
  )
}

export default {
  id: "bash-guard",
  async server(input: PluginInput, options?: PluginOptions): Promise<Hooks> {
    return {
      "tool.execute.before": async (input, output) => {
        if (input.tool !== "bash") return
        const command: string | undefined = output.args.command
        if (!command) return
        const msg = guard(command)
        if (msg) throw new Error(msg)
      },
    }
  },
} satisfies { id: string; server: Plugin }
