import { StackGenerator } from "@/components/stack-generator"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Start building in seconds</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Generate your project boilerplate with Tailwind CSS v4 and shadcn/ui pre-configured. Choose your tech stack
            and get started instantly.
          </p>
        </div>
        <StackGenerator />
      </div>
    </main>
  )
}
