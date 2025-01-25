"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"

interface TechnologyGroup {
  title: string
  options: string[][]
}

const technologyGroups: TechnologyGroup[] = [
  {
    title: "Frontend ",
    options: [
      ["Nextjs", "React"],
      ["Vue.js", "Html"],
    ],
  },
  {
    title: "Backend",
    options: [
      ["Nextjs", "Nodejs"],
      ["Go", "Rust"],
    ],
  },
  {
    title: "Database",
    options: [
      ["Mongo", "SQL"],
      ["Postgres", ""],
    ],
  },
  {
    title: "AI",
    options: [
      ["Geminin", "Gpt"],
      ["Claude", "Others"],
    ],
  },
  {
    title: "File Storage",
    options: [
      ["Uploadthing", ""],
      ["Cloudinary", ""],
    ],
  },

]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [openGroups, setOpenGroups] = useState<string[]>([])

  const toggleSidebar = () => setIsOpen((prev) => !prev)

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => (prev.includes(title) ? prev.filter((group) => group !== title) : [...prev, title]))
  }

  if (!isOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 rounded-full p-2 bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
        aria-label="Open Sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>
    )
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out overflow-hidden z-40">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Image src="/placeholder.svg?height=40&width=40" alt="Logo" width={40} height={40} className="rounded-lg" />
          <span className="text-xl font-bold">Tech Stack</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Close Sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="p-4 space-y-2">
        {technologyGroups.map((group) => (
          <div key={group.title} className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 last:border-b-0">
            <button
              onClick={() => toggleGroup(group.title)}
              className="flex items-center justify-between w-full text-left py-2 px-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="font-medium">{group.title}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${openGroups.includes(group.title) ? "rotate-180" : ""}`}
              />
            </button>
            {openGroups.includes(group.title) && (
              <div className="grid grid-cols-2 gap-1 mt-2">
                {group.options.map((row, rowIndex) =>
                  row.map(
                    (option, colIndex) =>
                      option && (
                        <a
                          key={`${rowIndex}-${colIndex}`}
                          href="#"
                          className="py-1 px-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {option}
                        </a>
                      ),
                  ),
                )}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

