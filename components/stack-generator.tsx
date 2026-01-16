"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { TechStackSelector } from "@/components/tech-stack-selector"
import { GeneratedOutput } from "@/components/generated-output"
import { GenerationProgress } from "@/components/generation-progress"
import { Folder, Sparkles } from "lucide-react"
import { toast } from "sonner"

export type TechStack = "nextjs" | "php" | "html"

export function StackGenerator() {
  const [appName, setAppName] = useState("")
  const [storagePath, setStoragePath] = useState("")
  const [selectedStack, setSelectedStack] = useState<TechStack | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGenerated, setIsGenerated] = useState(false)
  const [generationPhase, setGenerationPhase] = useState<string | null>(null)
  const [generationOutput, setGenerationOutput] = useState<string[]>([])
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [projectPath, setProjectPath] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleGenerate = async () => {
    if (!appName || !storagePath || !selectedStack) return

    setIsGenerating(true)
    setGenerationPhase("validating")
    setGenerationOutput([])
    setGenerationError(null)
    abortControllerRef.current = new AbortController()

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appName,
          storagePath,
          stack: selectedStack,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        try {
          const errorData = await response.json()
          const errorMsg = errorData.error?.message || `HTTP ${response.status}`
          const details = errorData.error?.details ? `: ${errorData.error.details}` : ""
          throw new Error(errorMsg + details)
        } catch (parseError) {
          throw new Error(`Failed to generate project (HTTP ${response.status})`)
        }
      }

      // Handle Server-Sent Events
      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              setGenerationPhase(data.phase)
              setGenerationOutput((prev) => [...prev, data.output])

              if (data.phase === "complete" && data.success) {
                setProjectPath(data.projectPath)
                setIsGenerating(false)
                setIsGenerated(true)
                toast.success("Project generated successfully!")
              } else if (data.phase === "failed" || !data.success) {
                setGenerationError(data.error?.message || data.output)
                setIsGenerating(false)
                toast.error("Generation failed")
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e)
            }
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        setGenerationError("Generation cancelled by user")
        toast.info("Generation cancelled")
      } else {
        const message = error instanceof Error ? error.message : "Unknown error"
        setGenerationError(message)
        toast.error(message)
      }
      setIsGenerating(false)
    } finally {
      abortControllerRef.current = null
    }
  }

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    setIsGenerating(false)
  }

  const handleReset = () => {
    setIsGenerated(false)
    setIsGenerating(false)
    setGenerationPhase(null)
    setGenerationOutput([])
    setGenerationError(null)
    setProjectPath(null)
    setAppName("")
    setStoragePath("")
    setSelectedStack(null)
  }

  const isValid = appName.trim() && storagePath.trim() && selectedStack

  return (
    <div className="max-w-4xl mx-auto">
      {isGenerating ? (
        <GenerationProgress
          isGenerating={isGenerating}
          phase={generationPhase}
          output={generationOutput}
          error={generationError}
          onAbort={handleAbort}
        />
      ) : !isGenerated ? (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Configure Your Project
            </CardTitle>
            <CardDescription>Set up your new project with your preferred tech stack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="appName">Project Name</Label>
                <Input
                  id="appName"
                  placeholder="my-awesome-app"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="bg-secondary border-border"
                />
                <p className="text-xs text-muted-foreground">Use lowercase letters, numbers, and hyphens</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storagePath">Storage Location</Label>
                <div className="relative">
                  <Folder className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="storagePath"
                    placeholder="~/Desktop or /Users/username/path"
                    value={storagePath}
                    onChange={(e) => setStoragePath(e.target.value)}
                    className="bg-secondary border-border pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStoragePath("~/Desktop")}
                    className="text-xs h-auto py-1"
                  >
                    ~/Desktop
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStoragePath("~/Downloads")}
                    className="text-xs h-auto py-1"
                  >
                    ~/Downloads
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setStoragePath("~/Projects")}
                    className="text-xs h-auto py-1"
                  >
                    ~/Projects
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Enter full path or click a suggested location</p>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Select Tech Stack</Label>
              <TechStackSelector selected={selectedStack} onSelect={setSelectedStack} />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!isValid}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <GeneratedOutput
          appName={appName}
          storagePath={storagePath}
          stack={selectedStack!}
          projectPath={projectPath}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
