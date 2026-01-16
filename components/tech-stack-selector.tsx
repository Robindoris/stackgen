"use client"

import { cn } from "@/lib/utils"
import type { TechStack } from "@/components/stack-generator"
import { Check } from "lucide-react"

interface TechStackSelectorProps {
  selected: TechStack | null
  onSelect: (stack: TechStack) => void
}

const stacks = [
  {
    id: "nextjs" as TechStack,
    name: "Next.js",
    description: "React framework with App Router, server components, and API routes",
    icon: (
      <svg viewBox="0 0 180 180" fill="none" className="h-10 w-10">
        <mask
          id="mask0_408_134"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="180"
          height="180"
        >
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask="url(#mask0_408_134)">
          <circle cx="90" cy="90" r="90" fill="black" />
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="url(#paint0_linear_408_134)"
          />
          <rect x="115" y="54" width="12" height="72" fill="url(#paint1_linear_408_134)" />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_408_134"
            x1="109"
            y1="116.5"
            x2="144.5"
            y2="160.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_408_134"
            x1="121"
            y1="54"
            x2="120.799"
            y2="106.875"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
    features: ["TypeScript", "App Router", "Server Actions", "API Routes"],
  },
  {
    id: "php" as TechStack,
    name: "PHP",
    description: "Classic PHP setup with modern structure and Tailwind integration",
    icon: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <path
          fill="#6181B6"
          d="M64 33.039C30.26 33.039 2.906 46.901 2.906 64S30.26 94.961 64 94.961 125.094 81.099 125.094 64 97.74 33.039 64 33.039zM48.103 70.032c-1.458 1.364-3.077 1.927-4.86 2.507-1.783.581-4.052.461-6.811.461h-6.253l-1.733 10h-7.301l6.515-34H41.7c4.224 0 7.305 1.215 9.242 3.432 1.937 2.217 2.519 5.364 1.747 9.337-.319 1.637-.856 3.159-1.614 4.515-.759 1.357-1.75 2.624-2.972 3.748zm21.311 0c-1.458 1.364-3.076 1.927-4.86 2.507-1.782.581-4.051.461-6.81.461h-6.253l-1.733 10h-7.301l6.514-34h14.041c4.224 0 7.305 1.215 9.241 3.432 1.938 2.217 2.52 5.364 1.748 9.337-.319 1.637-.856 3.159-1.614 4.515-.759 1.357-1.75 2.624-2.973 3.748zm40.631-5.908h-7.245l-.996 5.954c-.098.584-.138 1.074-.124 1.47.014.396.107.715.28.958.173.243.413.411.722.505.308.094.691.14 1.148.14h3.584l-.931 4.846h-5.423c-1.715 0-3.03-.151-3.945-.453-.916-.302-1.567-.763-1.953-1.384-.387-.621-.569-1.397-.546-2.328.023-.93.169-2.015.439-3.253l1.024-6.455h-3.584l.931-4.846h3.584l1.366-8.166h7.245l-1.366 8.166h7.245l-.855 4.846z"
        />
        <path
          fill="#fff"
          d="M49.049 54.477c-.584-1.266-1.821-1.899-3.711-1.899h-4.919l-2.468 14H43.7c1.262 0 2.353-.24 3.274-.721.921-.481 1.666-1.123 2.237-1.928.57-.805.993-1.72 1.269-2.746.276-1.025.386-2.073.333-3.142-.053-1.07-.389-2.298-.764-3.564zm19.088 0c-.584-1.266-1.82-1.899-3.71-1.899h-4.919l-2.468 14h5.749c1.261 0 2.353-.24 3.273-.721.921-.481 1.666-1.123 2.238-1.928.57-.805.993-1.72 1.268-2.746.276-1.025.387-2.073.334-3.142-.054-1.07-.39-2.298-.765-3.564z"
        />
      </svg>
    ),
    features: ["Composer", "PSR-4 Autoloading", "MVC Structure", "Modern PHP 8+"],
  },
  {
    id: "html" as TechStack,
    name: "Vanilla HTML5",
    description: "Pure HTML5 with CSS and minimal JavaScript for simple projects",
    icon: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z" />
        <path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z" />
        <path
          fill="#EBEBEB"
          d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z"
        />
        <path
          fill="#fff"
          d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z"
        />
      </svg>
    ),
    features: ["Semantic HTML", "CSS Variables", "No Build Step", "Lightweight"],
  },
]

export function TechStackSelector({ selected, onSelect }: TechStackSelectorProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stacks.map((stack) => (
        <button
          key={stack.id}
          onClick={() => onSelect(stack.id)}
          className={cn(
            "relative p-6 rounded-lg border-2 text-left transition-all hover:border-accent/50",
            selected === stack.id ? "border-accent bg-accent/10" : "border-border bg-secondary/50",
          )}
        >
          {selected === stack.id && (
            <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-accent flex items-center justify-center">
              <Check className="h-4 w-4 text-accent-foreground" />
            </div>
          )}
          <div className="mb-4">{stack.icon}</div>
          <h3 className="font-semibold text-lg mb-2">{stack.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">{stack.description}</p>
          <div className="flex flex-wrap gap-2">
            {stack.features.map((feature) => (
              <span key={feature} className="text-xs px-2 py-1 rounded bg-background text-muted-foreground">
                {feature}
              </span>
            ))}
          </div>
        </button>
      ))}
    </div>
  )
}
