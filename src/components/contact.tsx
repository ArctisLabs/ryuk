"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-300">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            className="bg-zinc-900/70 border-zinc-700/50 focus:border-purple-500 focus:ring-purple-500/20 placeholder-gray-500 text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-300">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="bg-zinc-900/70 border-zinc-700/50 focus:border-purple-500 focus:ring-purple-500/20 placeholder-gray-500 text-white"
            required
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="message" className="text-sm font-medium text-gray-300">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Type your message here"
            className="bg-zinc-900/70 border-zinc-700/50 focus:border-purple-500 focus:ring-purple-500/20 placeholder-gray-500 text-white min-h-[150px]"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </span>
          ) : (
            "Send Message"
          )}
        </Button>
      </div>
    </form>
  )
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at center, #fff 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container mx-auto px-4 py-16 space-y-16 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-purple-950/50 text-purple-500 text-sm mb-4">
            Memory
          </div>
          <h1 className="text-5xl font-bold tracking-tight">
            Never Loose <span className="text-purple-500">Information</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Keep track of all your meetings and what was discussed. Import events quickly with our Google Calendar and
            Outlook integrations.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-2xl bg-zinc-950/50 p-8 backdrop-blur-sm border border-zinc-800/50 relative overflow-hidden">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}