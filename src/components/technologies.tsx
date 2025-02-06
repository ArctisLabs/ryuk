"use client";

import {useState} from 'react'

export default function Technologies(){
  return (
    <section className="py-20 px-4 bg-black/50 w-[70%]">
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

const categories = ["Frontend", "Backend", "Database", "AI", "Blockchain", "Authentications"] as const

type Category = (typeof categories)[number]

interface Platform {
  name: string
  category: Category
  description: string
  color: string
}

const platforms: Platform[] = [
  { name: "98 Finance", category: "Frontend", description: "DeFi Platform", color: "bg-purple-500" },
  { name: "Nova Protocol", category: "Frontend", description: "Trading Platform", color: "bg-blue-500" },
  { name: "RocketFi", category: "Frontend", description: "Yield Farming", color: "bg-red-500" },
  { name: "EcoSphere", category: "Frontend", description: "NFT Platform", color: "bg-indigo-500" },
  { name: "Global Bank", category: "Backend", description: "Banking", color: "bg-blue-400" },
  { name: "InstituteFi", category: "Backend", description: "Research Institute", color: "bg-yellow-400" },
  { name: "Meta Exchange", category: "AI", description: "DEX", color: "bg-green-500" },
  { name: "Nexus Chain", category: "Database", description: "Blockchain", color: "bg-yellow-500" },
  { name: "SecureWallet", category: "Authentications", description: "Hardware Wallet", color: "bg-gray-500" },
  { name: "ValidateNet", category: "Blockchain", description: "Staking Service", color: "bg-green-400" },
  { name: "ChainLink", category: "Database", description: "Oracle Network", color: "bg-blue-600" },
  { name: "CryptoTrade", category: "AI", description: "Centralized Exchange", color: "bg-purple-400" },
]

function EcosystemCategories() {
  const [activeCategory, setActiveCategory] = useState<Category | "View all">("Frontend")

  const filteredPlatforms =
    activeCategory === "View all" ? platforms : platforms.filter((platform) => platform.category === activeCategory)

  return (
    <>
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
          <button
            className={`pb-2 ${
              activeCategory === "View all"
                ? "text-purple-500 border-b-2 border-purple-500"
                : "text-gray-400 hover:text-purple-500"
            }`}
            onClick={() => setActiveCategory("View all")}
          >
            View all
          </button>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {filteredPlatforms.map((platform, index) => (
          <div
            key={index}
            className="group relative bg-gradient-to-br from-purple-900/20 to-purple-600/20 p-6 rounded-lg hover:bg-purple-500/10 transition-colors"
          >
            <div className={`w-16 h-16 ${platform.color} rounded-2xl mb-4 overflow-hidden`}>
              
            </div>
            <h3 className="text-sm font-medium text-white mb-1">{platform.name}</h3>
            <p className="text-xs text-gray-400">{platform.description}</p>
            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors rounded-lg" />
          </div>
        ))}
      </div>
    </>
  )
}