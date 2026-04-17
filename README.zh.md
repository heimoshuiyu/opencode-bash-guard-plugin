# OpenCode Bash Guard 插件

一个 [OpenCode](https://opencode.ai) 插件，用于拦截 bash 命令并将 AI 智能体重定向到专用工具。当智能体尝试通过 bash 工具运行 `grep`、`cat`、`sed` 等命令时，此插件会阻止调用并建议使用合适的专用工具——提高准确性和效率。

## 功能

- **命令拦截** — 阻止有更好专用工具替代方案的 bash 命令。
- **智能重定向** — 明确告诉智能体应该使用哪个工具。
- **绕过机制** — 在命令末尾添加 `# confirm` 可强制通过 bash 执行。

## 重定向规则

| 命令   | 重定向到       | 原因               |
| ------ | -------------- | ------------------ |
| `grep` | `Grep`         | 专用内容搜索工具   |
| `rg`   | `Grep`         | 专用内容搜索工具   |
| `cat`  | `Read`         | 专用文件读取工具   |
| `sed`  | `Edit`         | 专用文件编辑工具   |
| `find` | `Grep or Glob` | 文件搜索工具       |
| `cd`   | `workdir` 参数 | 使用 bash 的 `workdir` 参数代替 |

## 安装

在 [OpenCode 配置文件](https://opencode.ai/docs/config/) 中添加插件：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-bash-guard-plugin"]
}
```

OpenCode 会在下次运行时自动安装插件。

## 使用

插件自动生效，无需配置。当 AI 智能体尝试执行被拦截的命令时，会收到如下错误提示：

```
Command starts with 'cat'. Use the `Read` tool instead.

Tip: If you really want to use this tool, add a "# confirm" comment at the end of the command and run it again.
```

### 绕过守卫

要强制通过 bash 执行命令，在末尾添加 `# confirm`：

```bash
cat /etc/hosts  # confirm
```

## 工作原理

插件使用 OpenCode 的 `tool.execute.before` 钩子，在 bash 工具执行之前触发。它检查命令内容，如果匹配重定向规则，则抛出带有引导信息的错误——导致工具调用失败，智能体会转而尝试推荐的工具。

## 许可证

MIT
