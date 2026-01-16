import { NextRequest } from "next/server"
import { z } from "zod"
import { sanitizePath, validateGenerationInputs, sanitizeAppName } from "@/lib/path-validator"
import { generateProject } from "@/lib/project-generator"
import type { TechStack } from "@/components/stack-generator"

// Request validation schema
const generateRequestSchema = z.object({
  appName: z.string().min(1, "App name is required"),
  storagePath: z.string().min(1, "Storage path is required"),
  stack: z.enum(["nextjs", "php", "html"]),
})

type GenerateRequest = z.infer<typeof generateRequestSchema>

/**
 * Sends a Server-Sent Event
 */
function sendEvent(controller: ReadableStreamDefaultController, data: unknown) {
  const message = `data: ${JSON.stringify(data)}\n\n`
  controller.enqueue(new TextEncoder().encode(message))
}

/**
 * Main API route handler for project generation
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: unknown
    try {
      body = await request.json()
    } catch {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid JSON in request body",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Validate request schema
    let validatedData: GenerateRequest
    try {
      validatedData = generateRequestSchema.parse(body)
    } catch (error) {
      const zodError = error as z.ZodError
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "INVALID_REQUEST",
            message: "Invalid request parameters",
            details: zodError.errors.map((e) => e.message).join(", "),
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    const { appName, storagePath, stack } = validatedData

    // Sanitize app name
    const sanitizedAppName = sanitizeAppName(appName)

    // Validate inputs
    const validationResult = await validateGenerationInputs(storagePath, sanitizedAppName)
    if (!validationResult.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: validationResult.error,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Build full project path
    let projectPath: string
    try {
      projectPath = sanitizePath(storagePath, sanitizedAppName)
    } catch (error) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            code: "INVALID_PATH",
            message: error instanceof Error ? error.message : "Invalid path",
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Stream response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send start event
          sendEvent(controller, {
            phase: "validating",
            output: "Starting project generation...",
            timestamp: Date.now(),
          })

          // Generate project with progress streaming
          const result = await generateProject(
            projectPath,
            sanitizedAppName,
            stack as TechStack,
            (progress) => {
              sendEvent(controller, {
                phase: progress.phase,
                output: progress.output,
                timestamp: Date.now(),
              })
            }
          )

          if (result.success) {
            // Send success event
            sendEvent(controller, {
              phase: "complete",
              output: "Project generation completed successfully",
              projectPath,
              success: true,
              timestamp: Date.now(),
            })
          } else {
            // Send error event
            sendEvent(controller, {
              phase: "failed",
              output: `Error: ${result.error?.message}`,
              error: result.error,
              success: false,
              timestamp: Date.now(),
            })
          }

          controller.close()
        } catch (error) {
          // Send error event
          sendEvent(controller, {
            phase: "failed",
            output: error instanceof Error ? error.message : "Unknown error",
            error: {
              code: "UNKNOWN_ERROR",
              message: error instanceof Error ? error.message : "An unknown error occurred",
            },
            success: false,
            timestamp: Date.now(),
          })

          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: error instanceof Error ? error.message : "Unknown server error",
        },
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
