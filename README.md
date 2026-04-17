# OpenCode Bash Guard Plugin

An [OpenCode](https://opencode.ai) plugin that intercepts bash commands and redirects the AI agent to use specialized tools instead. When the agent tries to run commands like `grep`, `cat`, or `sed` through the bash tool, this plugin blocks the call and suggests the appropriate dedicated tool — improving accuracy and efficiency.

[中文文档](./README.zh.md)

## Features

- **Command interception** — Blocks bash commands that have better dedicated tool alternatives.
- **Smart redirect** — Tells the agent exactly which tool to use instead.
- **Bypass mechanism** — Append `# confirm` to any command to force execution through bash.

## Redirect Rules

| Command | Redirected To | Reason |
| ------- | ------------- | ------ |
| `grep`  | `grep`        | Purpose-built content search |
| `rg`    | `grep`        | Purpose-built content search |
| `cat`   | `read or grep` | Dedicated file reading/search tools |
| `sed`   | `edit`        | Dedicated file editing tool |
| `find`  | `grep or glob` | File search tools |
| `cd`    | `workdir` param | Use bash's `workdir` parameter instead |

## Setup

Add the plugin to your [OpenCode config](https://opencode.ai/docs/config/):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-bash-guard-plugin"]
}
```

OpenCode will automatically install the plugin on next run.

## Usage

The plugin works automatically — no configuration needed. When the AI agent attempts a blocked command, it receives an error message like:

```
Command starts with 'cat'. You have dedicated tools available. Use the `read` or `grep` tool instead of running shell commands.

Tip: If you really want to use this tool, add a "# confirm" comment at the end of the command and run it again.
```

### Bypassing the Guard

To force a command through bash, add `# confirm` at the end:

```bash
cat /etc/hosts  # confirm
```

## How It Works

The plugin uses OpenCode's `tool.execute.before` hook, which fires before the bash tool executes. It inspects the command, and if it matches a redirect rule, throws an error with guidance — causing the tool call to fail and the agent to try the recommended tool instead.

## License

MIT
