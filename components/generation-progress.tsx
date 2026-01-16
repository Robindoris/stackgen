"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle2, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface GenerationProgressProps {
  isGenerating: boolean
  phase: string | null
  output: string[]
  error: string | null
  onAbort: () => void
}

const phaseConfig = {
  validating: { icon: Loader2, label: "Validating", color: "text-blue-500" },
  creating: { icon: Loader2, label: "Creating", color: "text-blue-500" },
  installing: { icon: Loader2, label: "Installing", color: "text-yellow-500" },
  configuring: { icon: Loader2, label: "Configuring", color: "text-purple-500" },
  building: { icon: Loader2, label: "Building", color: "text-cyan-500" },
  complete: { icon: CheckCircle2, label: "Complete", color: "text-green-500" },
  failed: { icon: AlertTriangle, label: "Failed", color: "text-red-500" },
}

export function GenerationProgress({
  isGenerating,
  phase,
  output,
  error,
  onAbort,
}: GenerationProgressProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    const scrollElement = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]")
    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight
    }
  }, [output])

  const currentPhaseConfig = phase && phaseConfig[phase as keyof typeof phaseConfig]
  const PhaseIcon = currentPhaseConfig?.icon || Loader2

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <PhaseIcon
              className={cn(
                "h-6 w-6",
                currentPhaseConfig?.color || "text-muted-foreground",
                isGenerating && "animate-spin"
              )}
            />
            <div>
              <CardTitle className="text-lg">
                {currentPhaseConfig?.label || "Generating Project"}
              </CardTitle>
              <CardDescription>
                {phase && phase.charAt(0).toUpperCase() + phase.slice(1)}
              </CardDescription>
            </div>
          </div>
          {isGenerating && (
            <Button variant="outline" size="sm" onClick={onAbort} className="text-red-500 hover:text-red-600">
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea ref={scrollAreaRef} className="h-80 w-full rounded-lg border border-border bg-background p-4">
          <div className="font-mono text-sm space-y-1">
            {output.length === 0 ? (
              <div className="text-muted-foreground">Waiting for output...</div>
            ) : (
              output.map((line, i) => (
                <div key={i} className="text-foreground break-words whitespace-pre-wrap">
                  {line}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {error && (
          <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-600">Generation Failed</h3>
                <p className="text-sm text-red-600/90 mt-2 whitespace-pre-wrap break-words font-mono">{error}</p>
              </div>
            </div>
          </div>
        )}

        {phase === "complete" && !error && (
          <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-green-600">Project Created Successfully!</h3>
                <p className="text-sm text-green-600/80 mt-1">
                  Your project is ready to use. You can now open it in your terminal or editor.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
