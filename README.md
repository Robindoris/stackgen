# StackGen

A modern project boilerplate generator that helps developers quickly scaffold new projects with their preferred tech stack. Select from Next.js, PHP, or Vanilla HTML5, configure your project settings, and get comprehensive setup instructions and project structure templates instantly.

## 🚀 Features

- **Multi-Stack Support**: Generate boilerplates for Next.js, PHP, or Vanilla HTML5
- **Interactive Configuration**: User-friendly web interface for project setup
- **Instant Setup Instructions**: Get terminal commands and configuration guides
- **Project Templates**: Pre-configured project structures for each stack
- **Sample Code**: Starter code snippets for quick development kickoff
- **Prerequisites Guide**: Clear documentation of required tools and dependencies

## 📋 Prerequisites

Before running StackGen, ensure you have the following installed on your system:

### Required

- **Node.js**: v18.17 or higher
  - [Download Node.js](https://nodejs.org/)
  - Verify installation: `node --version`

- **npm**: v9 or higher (comes with Node.js)
  - Verify installation: `npm --version`

### Optional (depending on generated stack)

- **Git**: v2.37 or higher (for version control)
  - [Download Git](https://git-scm.com/)

- **PHP** (for PHP stack generation): v8.0 or higher
  - [Download PHP](https://www.php.net/downloads.php)
  - Verify installation: `php --version`

- **Composer** (for PHP stack generation): v2.0 or higher
  - [Download Composer](https://getcomposer.org/)
  - Verify installation: `composer --version`

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Robindoris/stackgen.git
   cd stackgen
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000` in your web browser

## 📦 Tech Stack

- **Framework**: Next.js 16.0.10 with React 19.2.0
- **Styling**: Tailwind CSS v4.1.9 with PostCSS
- **UI Components**: shadcn/ui (collection of Radix UI components)
- **Language**: TypeScript 5
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts

## 📁 Project Structure

```
stackgen/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Home page (main entry point)
│   └── globals.css              # Global Tailwind styles
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── stack-generator.tsx      # Main form component
│   ├── tech-stack-selector.tsx  # Tech stack selection UI
│   ├── generated-output.tsx     # Setup instructions display
│   ├── header.tsx               # Navigation header
│   └── theme-provider.tsx       # Theme context setup
├── hooks/
│   ├── use-mobile.ts            # Mobile detection hook
│   └── use-toast.ts             # Toast notification hook
├── lib/
│   └── utils.ts                 # Utility functions (cn, etc.)
├── public/                      # Static assets
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── next.config.ts               # Next.js configuration
```

## 🎯 How to Use

1. **Enter Project Details**
   - Specify your project name
   - Define storage path for generated files

2. **Select Tech Stack**
   - Choose from Next.js, PHP, or Vanilla HTML5
   - View stack features and requirements

3. **Generate Configuration**
   - Get setup commands for your terminal
   - View CSS configuration requirements
   - See project structure template
   - Access starter code snippets

4. **Follow Setup Instructions**
   - Copy generated commands into your terminal
   - Configure CSS based on provided setup
   - Create project structure as shown
   - Use starter code as foundation

## 🔨 Development Commands

```bash
# Start development server (runs on localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 🎨 Supported Tech Stacks

### Next.js
- TypeScript support
- Next.js App Router
- Server Actions & API Routes
- Tailwind CSS integration
- Tailwind CSS v4 with CSS-based config

### PHP
- Composer package management
- PSR-4 autoloading
- MVC structure template
- Namespace support

### Vanilla HTML5
- Semantic HTML markup
- CSS Variables for theming
- No build step required
- Lightweight and fast

## 🔒 Environment Variables

Create a `.env.local` file in the project root if needed:

```bash
# Example (currently not required for basic functionality)
# Add any future environment variables here
```

## 🌐 Deployment

This project can be deployed to:

- **Vercel**: Recommended for Next.js projects
  ```bash
  npm install -g vercel
  vercel
  ```

- **Traditional Hosting**: Export as static site if needed
  ```bash
  npm run build
  npm start
  ```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests to help improve StackGen.

## 💡 Support

- 📖 [GitHub Repository](https://github.com/Robindoris/stackgen)
- 🐛 [Report Issues](https://github.com/Robindoris/stackgen/issues)
- 💬 [Discussions](https://github.com/Robindoris/stackgen/discussions)

---

**StackGen** - Scaffold projects faster, focus on building. 🚀
