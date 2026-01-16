import { promises as fs } from "fs"
import path from "path"
import type { ErrorCode } from "@/types/generation"

export interface ValidationResult {
  valid: boolean
  error?: {
    code: ErrorCode
    message: string
  }
}

/**
 * Expands ~ to home directory
 */
function expandHome(filePath: string): string {
  if (filePath.startsWith("~")) {
    const home = process.env.HOME || process.env.USERPROFILE || ""
    return filePath.replace("~", home)
  }
  return filePath
}

/**
 * Sanitizes app name to prevent injection attacks
 * Only allows lowercase letters, numbers, and hyphens
 * Must start with a letter
 */
export function sanitizeAppName(name: string): string {
  // Remove any characters that aren't lowercase letters, numbers, or hyphens
  let sanitized = name.toLowerCase().replace(/[^a-z0-9-]/g, "")

  // Remove leading/trailing hyphens
  sanitized = sanitized.replace(/^-+|-+$/g, "")

  return sanitized
}

/**
 * Validates and sanitizes the full path to prevent directory traversal
 */
export function sanitizePath(userPath: string, appName: string): string {
  // Expand home directory
  const expandedPath = expandHome(userPath)

  // Normalize the base path
  const normalizedBase = path.resolve(expandedPath)

  // Join with app name
  const fullPath = path.join(normalizedBase, appName)

  // Ensure fullPath doesn't escape normalizedBase (prevent ../ traversal)
  const resolvedPath = path.resolve(fullPath)

  if (!resolvedPath.startsWith(normalizedBase)) {
    throw new Error("Invalid path: directory traversal detected")
  }

  return resolvedPath
}

/**
 * Validates that the storage path is valid and writable
 */
export async function validateStoragePath(userPath: string): Promise<ValidationResult> {
  try {
    const expandedPath = expandHome(userPath)
    const resolvedPath = path.resolve(expandedPath)

    // Check if path exists
    try {
      await fs.access(resolvedPath)
    } catch {
      return {
        valid: false,
        error: {
          code: "PATH_NOT_FOUND",
          message: `Storage path does not exist: ${expandedPath}`,
        },
      }
    }

    // Check if it's a directory
    const stat = await fs.stat(resolvedPath)
    if (!stat.isDirectory()) {
      return {
        valid: false,
        error: {
          code: "INVALID_PATH",
          message: `Storage path is not a directory: ${expandedPath}`,
        },
      }
    }

    // Check if writable
    try {
      await fs.access(resolvedPath, fs.constants.W_OK)
    } catch {
      return {
        valid: false,
        error: {
          code: "PATH_NOT_WRITABLE",
          message: `No write permissions for path: ${expandedPath}`,
        },
      }
    }

    return { valid: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error validating path"
    return {
      valid: false,
      error: {
        code: "INVALID_PATH",
        message,
      },
    }
  }
}

/**
 * Validates app name format
 */
export function validateAppName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      valid: false,
      error: {
        code: "INVALID_APP_NAME",
        message: "App name cannot be empty",
      },
    }
  }

  if (!/^[a-z]/.test(name.toLowerCase())) {
    return {
      valid: false,
      error: {
        code: "INVALID_APP_NAME",
        message: "App name must start with a letter",
      },
    }
  }

  if (!/^[a-z0-9-]+$/i.test(name)) {
    return {
      valid: false,
      error: {
        code: "INVALID_APP_NAME",
        message: "App name can only contain letters, numbers, and hyphens",
      },
    }
  }

  return { valid: true }
}

/**
 * Validates that the target project directory doesn't already exist
 */
export async function validateProjectDoesNotExist(projectPath: string): Promise<ValidationResult> {
  try {
    await fs.access(projectPath)
    // If we get here, the path exists
    return {
      valid: false,
      error: {
        code: "DIRECTORY_EXISTS",
        message: `Directory already exists: ${projectPath}`,
      },
    }
  } catch (error) {
    // Path doesn't exist, which is what we want
    return { valid: true }
  }
}

/**
 * Validates all inputs before project generation
 */
export async function validateGenerationInputs(
  storagePath: string,
  appName: string
): Promise<ValidationResult> {
  // Validate app name first (no async needed)
  const nameValidation = validateAppName(appName)
  if (!nameValidation.valid) {
    return nameValidation
  }

  // Validate storage path exists and is writable
  const pathValidation = await validateStoragePath(storagePath)
  if (!pathValidation.valid) {
    return pathValidation
  }

  // Build full path and check it doesn't exist
  try {
    const fullPath = sanitizePath(storagePath, appName)
    const existsValidation = await validateProjectDoesNotExist(fullPath)
    if (!existsValidation.valid) {
      return existsValidation
    }
  } catch (error) {
    return {
      valid: false,
      error: {
        code: "INVALID_PATH",
        message: error instanceof Error ? error.message : "Invalid path",
      },
    }
  }

  return { valid: true }
}
