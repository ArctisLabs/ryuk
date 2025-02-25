"use client";

import {useState} from 'react'

export default function Technologies(){
  return (
    <section className="my-20 py-20 px-4 bg-black/50 w-[85%]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Discover
                <br />
                the <span className="text-purple-500">ecosystem</span>
              </h2>
            </div>
            <p className="text-gray-400 max-w-lg">
              Exchange is powered by a global network of developers, Blockchain, builders, Backend and partners.
              Explore the fastest growing community powering a new world of finance.
            </p>
          </div>

          <EcosystemCategories />
        </div>
      </section>
  )
}

const categories = ["Frontend", "Backend", "Database", "AI", "File Storage", "Authentications", "Payments"] as const

type Category = (typeof categories)[number]

interface Platform {
  name: string
  category: Category
  logo: string
}

const platforms: Platform[] = [
  { name: "Nextjs", category: "Frontend", logo: "icons/nextjs.svg" },
  { name: "React", category: "Frontend", logo: "icons/react.svg" },
  { name: "Vue", category: "Frontend", logo: "icons/vue.svg" },
  { name: "Angular", category: "Frontend", logo: "icons/angular.svg" },
  { name: "HTML", category: "Frontend", logo: "icons/html.svg" },
  { name: "Nextjs", category: "Backend", logo: "icons/nextjs.svg" },
  { name: "Node", category: "Backend", logo: "icons/nodejs.svg" },
  { name: "Rust", category: "Backend", logo: "icons/rust.svg" },
  { name: "Python", category: "Backend", logo: "icons/python.svg" },
  { name: "Mongo", category: "Database", logo: "icons/mongodb.svg" },
  { name: "Postgres", category: "Database", logo: "icons/postgresql.svg" },
  { name: "Supabase", category: "Database", logo: "icons/supabase.svg" },
  { name: "Redis", category: "Database", logo: "icons/redis.svg" },
  { name: "Firebase", category: "Database", logo: "icons/firebase.svg" },
  { name: "ChatGpt", category: "AI", logo: "icons/chatgpt.svg" },
  { name: "Claude", category: "AI", logo: "icons/claude.png" },
  { name: "Gemini", category: "AI", logo: "icons/gemini.png" },
  { name: "Grok", category: "AI", logo: "icons/grok.png" },
  { name: "Uploadthing", category: "File Storage", logo: "icons/uploadthing.svg" },
  { name: "AWS", category: "File Storage", logo: "icons/aws.svg" },
  { name: "Cloudinary", category: "File Storage", logo: "icons/cloudinaryy.png" },
  { name: "Firebase", category: "File Storage", logo: "icons/firebase.svg" },
  { name: "Clerk", category: "Authentications", logo: "icons/clerk.png  " },
  { name: "Supabase", category: "Authentications", logo: "icons/supabase.svg" },
  { name: "Next Auth", category: "Authentications", logo: "icons/nextjs.svg" },
  { name: "Firebase", category: "Authentications", logo: "icons/firebase.svg" },
  { name: "Stripe", category: "Payments", logo: "icons/stripe.svg" },
  { name: "Paypal", category: "Payments", logo: "icons/paypal.svg" },
]

function EcosystemCategories() {
  const [activeCategory, setActiveCategory] = useState<Category | "View all">("Frontend")

  const filteredPlatforms =
    activeCategory === "View all" ? platforms : platforms.filter((platform) => platform.category === activeCategory)

  return (
    <section>
      {/* Categories */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex space-x-8 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              className={`pb-2 ${
                activeCategory === category
                  ? "text-purple-500 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-purple-500"
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredPlatforms.map((platform, index) => (
          <div
            key={index}
            className="group relative bg-gradient-to-br from-purple-900/20 to-purple-600/20 p-6 rounded-lg hover:bg-purple-500/10 transition-colors flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 mb-4 overflow-hidden flex items-center justify-center">
              <img 
                src={`${platform.logo.toLowerCase()}`} 
                alt={`${platform.name} logo`}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-sm font-medium text-white mb-1 text-center">{platform.name}</h3>
            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors rounded-lg" />
          </div>
        ))}
      </div>
    </section>
  )
}