import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { access } from "node:fs/promises";
import { resolve } from "node:path";

export default function (pi: ExtensionAPI) {
  pi.on("tool_result", async (event, ctx) => {
    if (event.toolName !== "write" && event.toolName !== "edit") return;

    const path = event.input?.path;
    console.log('path: ', path);
    if (typeof path !== "string" || !/\.(ts|tsx)$/.test(path)) return;

    try {
      await access(resolve(ctx.cwd, "tsconfig.json"));
    } catch {
      return;
    }

    try {
      const result = await pi.exec("bun", ["tsc", "--noEmit", "--pretty", "false", "--project", "tsconfig.json"], {
        cwd: ctx.cwd,
        timeout: 20000,
        signal: ctx.signal,
      });

      if (result.code !== 0) {
        const output = (result.stdout || result.stderr || "").trim();
        return {
          content: [
            ...(event.content || []),
            { type: "text", text: `\n\n---\nTypeScript errors:\n${output}` },
          ],
        };
      }
    } catch {
      // tsc unavailable or crashed silently, do not block the agent
    }
  });
}
