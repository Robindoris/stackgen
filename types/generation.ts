import type { TechStack } from "@/components/stack-generator"

// Request types
export interface GenerateProjectRequest {
  appName: string
  storagePath: string
  stack: TechStack
}

// Progress types
export type GenerationPhase =
  | "validating"
  | "creating"
  | "installing"
  | "configuring"
  | "building"
  | "complete"
  | "failed"

export interface ProgressEvent {
  phase: GenerationPhase
  output: string
  progress?: number
  timestamp: number
}

export interface GenerationState {
  isGenerating: boolean
  phase: GenerationPhase | null
  output: string[]
  error: string | null
  projectPath: string | null
}

// Error types
export type ErrorCode =
  | "INVALID_PATH"
  | "PATH_NOT_FOUND"
  | "PATH_NOT_WRITABLE"
  | "INVALID_APP_NAME"
  | "DIRECTORY_EXISTS"
  | "COMMAND_FAILED"
  | "PERMISSION_DENIED"
  | "TIMEOUT"
  | "UNKNOWN_ERROR"

export interface GenerationError {
  code: ErrorCode
  message: string
  details?: string
}

// Response types
export interface GenerationResponse {
  success: boolean
  projectPath?: string
  error?: GenerationError
}
