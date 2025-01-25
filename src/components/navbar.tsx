'use client'

import { anta } from './ui/fonts';
import * as React from "react"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  return (
      <header className="fixed top-3 border bg-cyan-900/10 backdrop-blur-3xl border-white/10 w-[70%] h-14 pl-3 pr-3 rounded-lg z-50">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 mr-8">
            {/* <Image src="/logo.svg" alt="mainlogo" height={20} width={20} className="text-green-400"/> */}
            <span className={`font-semibold text-xl ${anta.className}`}>BOLT</span>
          </div>
          
          <nav className="flex items-center gap-6 text-sm">          
            <Link href="/" className="text-gray-400 hover:text-white">
              Pricing
            </Link>
            
            <Link href="/" className="text-gray-400 hover:text-white">
              Documentation
            </Link>
            
            {/* <Link href="/" className="text-gray-400 hover:text-white">
              GitHub
            </Link> */}
          </nav>
          
          <div className="ml-auto flex items-center gap-2">
              <button
            className="bg-gradient-to-br from-violet-600/30 to-blue-700/10 text-white border-0 hover:from-purple-5 h-10 rounded-md"
          >
            <Link href="/sign-in" className="px-4 py-2">
              Sign In
            </Link>
          </button>
          <div className='bg-black backdrop-blur-lg w-10 h-10 p-3 rounded-lg'>
            <Link href={"https://x.com/kuiperprotocol"}>
            <Image src="/twitter.svg" alt="twitter" height={30} width={30}/>
            </Link>
          </div>
          </div>
        </div>
      </header>
  )
}