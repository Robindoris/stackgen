import { promises as fs } from "fs"
import path from "path"
import { runCommand, runCommandWithOutput } from "./command-runner"
import type { TechStack } from "@/components/stack-generator"
import type { GenerationError } from "@/types/generation"

export interface GenerationProgress {
  phase: string
  output: string
}

export type OnProgress = (progress: GenerationProgress) => void

/**
 * Generates a Next.js project with Tailwind CSS v4 and shadcn/ui
 */
export async function generateNextJsProject(
  projectPath: string,
  appName: string,
  onProgress: OnProgress
): Promise<{ success: boolean; error?: GenerationError }> {
  try {
    const parentDir = path.dirname(projectPath)

    onProgress({
      phase: "creating",
      output: `Creating directory structure at ${projectPath}...`,
    })

    // Create project using create-next-app
    onProgress({
      phase: "installing",
      output: `Running npx create-next-app@latest ${appName}...`,
    })

    const createNextResult = await runCommand(
      "npx",
      [
        "create-next-app@latest",
        appName,
        "--typescript",
        "--tailwind",
        "--eslint",
        "--app",
        "--src-dir",
        '--import-alias="@/*"',
        "--yes",
        "--skip-install",
      ],
      parentDir,
      (output) => {
        onProgress({ phase: "creating", output })
      }
    )

    if (!createNextResult.success) {
      return {
        success: false,
        error: {
          code: "COMMAND_FAILED",
          message: "Failed to create Next.js project",
          details: createNextResult.error?.details,
        },
      }
    }

    // Install dependencies
    onProgress({
      phase: "installing",
      output: "Installing npm dependencies (this may take a few minutes)...",
    })

    const npmInstallResult = await runCommand(
      "npm",
      ["install"],
      projectPath,
      (output) => {
        onProgress({ phase: "installing", output })
      }
    )

    if (!npmInstallResult.success) {
      return {
        success: false,
        error: {
          code: "COMMAND_FAILED",
          message: "Failed to install npm dependencies",
          details: npmInstallResult.error?.details,
        },
      }
    }

    // Initialize shadcn/ui
    onProgress({
      phase: "configuring",
      output: "Initializing shadcn/ui components...",
    })

    const shadcnResult = await runCommand(
      "npx",
      ["shadcn-ui@latest", "init", "-d", "--yes"],
      projectPath,
      (output) => {
        onProgress({ phase: "configuring", output })
      }
    )

    if (!shadcnResult.success) {
      onProgress({
        phase: "configuring",
        output: "Note: shadcn/ui initialization had issues, but project is still usable",
      })
    }

    onProgress({
      phase: "complete",
      output: `✓ Next.js project created successfully at ${projectPath}`,
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Unknown error generating Next.js project",
      },
    }
  }
}

/**
 * Generates a PHP project with Tailwind CSS v4
 */
export async function generatePhpProject(
  projectPath: string,
  appName: string,
  onProgress: OnProgress
): Promise<{ success: boolean; error?: GenerationError }> {
  try {
    onProgress({
      phase: "creating",
      output: `Creating PHP project structure at ${projectPath}...`,
    })

    // Create project directory
    await fs.mkdir(projectPath, { recursive: true })

    // Create subdirectories
    await Promise.all([
      fs.mkdir(path.join(projectPath, "public", "css"), { recursive: true }),
      fs.mkdir(path.join(projectPath, "src", "css"), { recursive: true }),
      fs.mkdir(path.join(projectPath, "src", "Controllers"), { recursive: true }),
      fs.mkdir(path.join(projectPath, "src", "Models"), { recursive: true }),
      fs.mkdir(path.join(projectPath, "src", "Views"), { recursive: true }),
    ])

    onProgress({
      phase: "configuring",
      output: "Creating configuration files...",
    })

    // Create package.json
    const packageJson = {
      name: appName,
      version: "1.0.0",
      description: `PHP project with Tailwind CSS v4`,
      scripts: {
        build: "tailwindcss -i ./src/css/input.css -o ./public/css/styles.css",
        watch: "tailwindcss -i ./src/css/input.css -o ./public/css/styles.css --watch",
      },
      devDependencies: {
        tailwindcss: "^4.1.9",
        "@tailwindcss/cli": "^4.1.9",
      },
    }

    await fs.writeFile(path.join(projectPath, "package.json"), JSON.stringify(packageJson, null, 2))

    // Create input.css
    const inputCss = `@import "tailwindcss";

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

    await fs.writeFile(path.join(projectPath, "src", "css", "input.css"), inputCss)

    // Create sample index.php
    const indexPhp = `<!DOCTYPE html>
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
        Your PHP app with Tailwind CSS v4
      </p>
      <button class="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90">
        Get Started
      </button>
    </div>
  </main>
</body>
</html>`

    await fs.writeFile(path.join(projectPath, "public", "index.php"), indexPhp)

    onProgress({
      phase: "installing",
      output: "Installing npm dependencies...",
    })

    // Install npm dependencies
    const npmInstallResult = await runCommand(
      "npm",
      ["install"],
      projectPath,
      (output) => {
        onProgress({ phase: "installing", output })
      }
    )

    if (!npmInstallResult.success) {
      return {
        success: false,
        error: {
          code: "COMMAND_FAILED",
          message: "Failed to install npm dependencies",
          details: npmInstallResult.error?.details,
        },
      }
    }

    onProgress({
      phase: "building",
      output: "Building Tailwind CSS...",
    })

    // Build Tailwind CSS
    const buildResult = await runCommand(
      "npm",
      ["run", "build"],
      projectPath,
      (output) => {
        onProgress({ phase: "building", output })
      }
    )

    if (!buildResult.success) {
      onProgress({
        phase: "building",
        output: "Note: Tailwind build had issues, you can run 'npm run build' manually later",
      })
    }

    onProgress({
      phase: "complete",
      output: `✓ PHP project created successfully at ${projectPath}`,
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Unknown error generating PHP project",
      },
    }
  }
}

/**
 * Generates a Vanilla HTML5 project with Tailwind CSS v4
 */
export async function generateHtmlProject(
  projectPath: string,
  appName: string,
  onProgress: OnProgress
): Promise<{ success: boolean; error?: GenerationError }> {
  try {
    onProgress({
      phase: "creating",
      output: `Creating HTML project structure at ${projectPath}...`,
    })

    // Create project directory and subdirectories
    await fs.mkdir(projectPath, { recursive: true })
    await Promise.all([
      fs.mkdir(path.join(projectPath, "css"), { recursive: true }),
      fs.mkdir(path.join(projectPath, "js"), { recursive: true }),
      fs.mkdir(path.join(projectPath, "images"), { recursive: true }),
    ])

    onProgress({
      phase: "configuring",
      output: "Creating configuration files...",
    })

    // Create package.json
    const packageJson = {
      name: appName,
      version: "1.0.0",
      description: `HTML5 project with Tailwind CSS v4`,
      scripts: {
        build: "tailwindcss -i ./css/input.css -o ./css/output.css",
        watch: "tailwindcss -i ./css/input.css -o ./css/output.css --watch",
      },
      devDependencies: {
        tailwindcss: "^4.1.9",
        "@tailwindcss/cli": "^4.1.9",
      },
    }

    await fs.writeFile(path.join(projectPath, "package.json"), JSON.stringify(packageJson, null, 2))

    // Create input.css
    const inputCss = `@import "tailwindcss";

/* Custom styles below */`

    await fs.writeFile(path.join(projectPath, "css", "input.css"), inputCss)

    // Create sample index.html
    const indexHtml = `<!DOCTYPE html>
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
        Your HTML5 app with Tailwind CSS v4
      </p>
      <button class="bg-white text-slate-950 px-4 py-2 rounded hover:bg-slate-100 transition-colors">
        Get Started
      </button>
    </div>
  </main>
  <script src="./js/main.js"><\/script>
</body>
</html>`

    await fs.writeFile(path.join(projectPath, "index.html"), indexHtml)

    // Create sample main.js
    const mainJs = `// Main JavaScript file
console.log('Hello from ${appName}!');`

    await fs.writeFile(path.join(projectPath, "js", "main.js"), mainJs)

    onProgress({
      phase: "installing",
      output: "Installing npm dependencies...",
    })

    // Install npm dependencies
    const npmInstallResult = await runCommand(
      "npm",
      ["install"],
      projectPath,
      (output) => {
        onProgress({ phase: "installing", output })
      }
    )

    if (!npmInstallResult.success) {
      return {
        success: false,
        error: {
          code: "COMMAND_FAILED",
          message: "Failed to install npm dependencies",
          details: npmInstallResult.error?.details,
        },
      }
    }

    onProgress({
      phase: "building",
      output: "Building Tailwind CSS...",
    })

    // Build Tailwind CSS
    const buildResult = await runCommand(
      "npm",
      ["run", "build"],
      projectPath,
      (output) => {
        onProgress({ phase: "building", output })
      }
    )

    if (!buildResult.success) {
      onProgress({
        phase: "building",
        output: "Note: Tailwind build had issues, you can run 'npm run build' manually later",
      })
    }

    onProgress({
      phase: "complete",
      output: `✓ HTML5 project created successfully at ${projectPath}`,
    })

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: {
        code: "UNKNOWN_ERROR",
        message: error instanceof Error ? error.message : "Unknown error generating HTML project",
      },
    }
  }
}

/**
 * Main entry point for project generation
 */
export async function generateProject(
  projectPath: string,
  appName: string,
  stack: TechStack,
  onProgress: OnProgress
): Promise<{ success: boolean; error?: GenerationError }> {
  switch (stack) {
    case "nextjs":
      return generateNextJsProject(projectPath, appName, onProgress)
    case "php":
      return generatePhpProject(projectPath, appName, onProgress)
    case "html":
      return generateHtmlProject(projectPath, appName, onProgress)
    default:
      return {
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: `Unknown tech stack: ${stack}`,
        },
      }
  }
}
