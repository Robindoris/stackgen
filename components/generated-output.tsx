"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { TechStack } from "@/components/stack-generator"
import { ArrowLeft, Copy, Check, Terminal, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface GeneratedOutputProps {
  appName: string
  storagePath: string
  stack: TechStack
  projectPath: string | null
  onReset: () => void
}

export function GeneratedOutput({ appName, storagePath, stack, projectPath, onReset }: GeneratedOutputProps) {
  const [copiedCommand, setCopiedCommand] = useState(false)
  const [copiedStructure, setCopiedStructure] = useState(false)
  const [copiedCss, setCopiedCss] = useState(false)

  const fullPath = `${storagePath}/${appName}`.replace(/\/+/g, "/")

  const getSetupCommand = () => {
    switch (stack) {
      case "nextjs":
        return `cd "${storagePath}"
npx create-next-app@latest ${appName} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd ${appName}
npx shadcn@latest init -d`
      case "php":
        return `cd "${storagePath}"
mkdir ${appName} && cd ${appName}

# Initialize npm and install Tailwind CSS v4
npm init -y
npm install -D tailwindcss @tailwindcss/cli

# Create folder structure
mkdir -p public/css src/css

# Create the input CSS file (see CSS tab for content)
# Then run Tailwind to build:
npx @tailwindcss/cli -i ./src/css/input.css -o ./public/css/styles.css --watch`
      case "html":
        return `cd "${storagePath}"
mkdir ${appName} && cd ${appName}

# Initialize npm and install Tailwind CSS v4
npm init -y
npm install -D tailwindcss @tailwindcss/cli

# Create folder structure
mkdir -p css js images

# Create the input CSS file (see CSS tab for content)
# Then run Tailwind to build:
npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css --watch`
    }
  }

  const getCssSetup = () => {
    switch (stack) {
      case "nextjs":
        return `/* src/app/globals.css - Already configured by create-next-app */
@import "tailwindcss";`
      case "php":
        return `/* src/css/input.css */
@import "tailwindcss";

/* Custom styles below */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --border: 0 0% 89.8%;
  }
  
  body {
    @apply bg-background text-foreground;
  }
}`
      case "html":
        return `/* css/input.css */
@import "tailwindcss";

/* Custom styles below */`
    }
  }

  const getPrerequisites = () => {
    switch (stack) {
      case "nextjs":
        return ["Node.js 18.17+", "npm or pnpm"]
      case "php":
        return ["Node.js 18.17+", "PHP 8.2+ (optional, for backend)", "Composer (optional, for PHP dependencies)"]
      case "html":
        return ["Node.js 18.17+"]
    }
  }

  const getProjectStructure = () => {
    switch (stack) {
      case "nextjs":
        return `${appName}/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       └── ...
│   └── lib/
│       └── utils.ts
├── public/
├── components.json
├── tsconfig.json
└── package.json`
      case "php":
        return `${appName}/
├── public/
│   ├── index.php
│   └── css/
│       └── styles.css (generated)
├── src/
│   ├── css/
│   │   └── input.css
│   ├── Controllers/
│   ├── Models/
│   └── Views/
├── composer.json (optional)
└── package.json`
      case "html":
        return `${appName}/
├── index.html
├── css/
│   ├── input.css
│   └── output.css (generated)
├── js/
│   └── main.js
├── images/
└── package.json`
    }
  }

  const getSampleCode = () => {
    switch (stack) {
      case "nextjs":
        return `// src/app/page.tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to ${appName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Your Next.js app with Tailwind v4 and shadcn/ui
          </p>
          <Button>Get Started</Button>
        </CardContent>
      </Card>
    </main>
  )
}`
      case "php":
        return `<!-- public/index.php -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <link href="./css/styles.css" rel="stylesheet">
</head>
<body class="min-h-screen bg-background text-foreground">
  <main class="container mx-auto px-4 py-12">
    <div class="max-w-md mx-auto bg-card rounded-lg border p-6">
      <h1 class="text-2xl font-bold mb-4">Welcome to ${appName}</h1>
      <p class="text-muted-foreground mb-4">
        Your PHP app with Tailwind v4
      </p>
      <button class="bg-primary text-primary-foreground px-4 py-2 rounded">
        Get Started
      </button>
    </div>
  </main>
</body>
</html>`
      case "html":
        return `<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${appName}</title>
  <link href="./css/output.css" rel="stylesheet">
</head>
<body class="min-h-screen bg-slate-950 text-white">
  <main class="container mx-auto px-4 py-12">
    <div class="max-w-md mx-auto bg-slate-900 rounded-lg border border-slate-800 p-6">
      <h1 class="text-2xl font-bold mb-4">Welcome to ${appName}</h1>
      <p class="text-slate-400 mb-4">
        Your HTML5 app with Tailwind v4
      </p>
      <button class="bg-white text-slate-950 px-4 py-2 rounded hover:bg-slate-100">
        Get Started
      </button>
    </div>
  </main>
  <script src="./js/main.js"></script>
</body>
</html>`
    }
  }

  const copyToClipboard = async (text: string, type: "command" | "structure" | "css") => {
    await navigator.clipboard.writeText(text)
    if (type === "command") {
      setCopiedCommand(true)
      setTimeout(() => setCopiedCommand(false), 2000)
    } else if (type === "structure") {
      setCopiedStructure(true)
      setTimeout(() => setCopiedStructure(false), 2000)
    } else {
      setCopiedCss(true)
      setTimeout(() => setCopiedCss(false), 2000)
    }
  }

  const stackNames = {
    nextjs: "Next.js",
    php: "PHP",
    html: "Vanilla HTML5",
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onReset} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Start Over
      </Button>

      {projectPath && (
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Project Created Successfully!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your {stackNames[stack]} project has been created at:
                </p>
                <code className="text-xs bg-background rounded px-2 py-1 block break-all text-accent">
                  {projectPath}
                </code>
                <p className="text-sm text-muted-foreground mt-3">
                  To get started, open a terminal and run: <code className="text-accent">cd "{projectPath}"</code>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-amber-500/10 border-amber-500/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">Prerequisites</h3>
              <p className="text-sm text-muted-foreground">
                Make sure you have installed: {getPrerequisites().join(", ")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-accent" />
            {appName}
          </CardTitle>
          <CardDescription>
            {stackNames[stack]} project at <code className="text-accent">{fullPath}</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="commands" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-secondary">
              <TabsTrigger value="commands">Commands</TabsTrigger>
              <TabsTrigger value="css">CSS Setup</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="sample">Sample</TabsTrigger>
            </TabsList>
            <TabsContent value="commands" className="mt-4">
              <div className="relative">
                <pre className="bg-background rounded-lg p-4 overflow-x-auto text-sm font-mono border border-border">
                  {getSetupCommand()}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(getSetupCommand(), "command")}
                >
                  {copiedCommand ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Run these commands in your terminal. For PHP/HTML, create the CSS file first (see CSS Setup tab).
              </p>
            </TabsContent>
            <TabsContent value="css" className="mt-4">
              <div className="relative">
                <pre className="bg-background rounded-lg p-4 overflow-x-auto text-sm font-mono border border-border">
                  {getCssSetup()}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(getCssSetup(), "css")}
                >
                  {copiedCss ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Tailwind CSS v4 uses CSS-based configuration. Create this file before running the build command.
              </p>
            </TabsContent>
            <TabsContent value="structure" className="mt-4">
              <div className="relative">
                <pre className="bg-background rounded-lg p-4 overflow-x-auto text-sm font-mono border border-border">
                  {getProjectStructure()}
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(getProjectStructure(), "structure")}
                >
                  {copiedStructure ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="sample" className="mt-4">
              <pre className="bg-background rounded-lg p-4 overflow-x-auto text-sm font-mono border border-border">
                {getSampleCode()}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
