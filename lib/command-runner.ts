import { spawn } from "child_process"
import type { ErrorCode } from "@/types/generation"

export interface CommandError {
  code: ErrorCode
  message: string
  details?: string
}

export interface CommandResult {
  success: boolean
  error?: CommandError
}

/**
 * Runs a command with streaming output
 * @param command The command to run (e.g., 'npm', 'mkdir')
 * @param args Arguments to pass to the command
 * @param cwd Current working directory
 * @param onOutput Callback for each line of output
 * @param timeoutMs Timeout in milliseconds (default: 10 minutes)
 */
export function runCommand(
  command: string,
  args: string[],
  cwd: string,
  onOutput: (output: string) => void,
  timeoutMs: number = 10 * 60 * 1000 // 10 minutes
): Promise<CommandResult> {
  return new Promise((resolve) => {
    try {
      const child = spawn(command, args, {
        cwd,
        stdio: ["pipe", "pipe", "pipe"],
        shell: process.platform === "win32", // Use shell on Windows for cross-platform compatibility
      })

      let timedOut = false
      const timeout = setTimeout(() => {
        timedOut = true
        child.kill()
      }, timeoutMs)

      child.stdout?.on("data", (data) => {
        const output = data.toString()
        if (output.trim()) {
          onOutput(output)
        }
      })

      child.stderr?.on("data", (data) => {
        const output = data.toString()
        if (output.trim()) {
          onOutput(output)
        }
      })

      child.on("error", (error) => {
        clearTimeout(timeout)

        if (timedOut) {
          resolve({
            success: false,
            error: {
              code: "TIMEOUT",
              message: `Command timed out after ${timeoutMs / 1000} seconds`,
              details: `Command: ${command} ${args.join(" ")}`,
            },
          })
        } else if (error.code === "ENOENT") {
          resolve({
            success: false,
            error: {
              code: "COMMAND_FAILED",
              message: `Command not found: ${command}`,
              details: `Make sure ${command} is installed and in your PATH`,
            },
          })
        } else {
          resolve({
            success: false,
            error: {
              code: "COMMAND_FAILED",
              message: `Failed to execute command: ${error.message}`,
            },
          })
        }
      })

      child.on("close", (code) => {
        clearTimeout(timeout)

        if (timedOut) {
          resolve({
            success: false,
            error: {
              code: "TIMEOUT",
              message: "Command execution timed out",
            },
          })
        } else if (code !== 0) {
          resolve({
            success: false,
            error: {
              code: "COMMAND_FAILED",
              message: `Command failed with exit code ${code}`,
              details: `Command: ${command} ${args.join(" ")}`,
            },
          })
        } else {
          resolve({
            success: true,
          })
        }
      })
    } catch (error) {
      resolve({
        success: false,
        error: {
          code: "COMMAND_FAILED",
          message: error instanceof Error ? error.message : "Unknown error running command",
        },
      })
    }
  })
}

/**
 * Runs a command with streaming output and collects all output
 */
export async function runCommandWithOutput(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs?: number
): Promise<{ success: boolean; output: string; error?: CommandError }> {
  const output: string[] = []

  const result = await runCommand(command, args, cwd, (line) => {
    output.push(line)
  }, timeoutMs)

  return {
    ...result,
    output: output.join("\n"),
  }
}
