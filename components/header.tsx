import { Terminal } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-6 w-6 text-accent" />
          <span className="font-semibold text-lg">StackGen</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="https://github.com/Robindoris/stackgen#readme" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Docs
          </a>
          <a href="https://github.com/Robindoris/stackgen" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  )
}
