"use client";

import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { SpaceBetweenHorizontallyIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Artifact {
  message: string;
  code: string;
  language: string;
  content: string;
}

interface Message {
  text: string;
  isUser: boolean;
  artifacts?: Artifact[];
  vulnerabilities_found: boolean;
  vulnerabilities_list: string[];
  recommendations: string;
}

interface TechnologyOption {
  name: string;
  iconPath: string;
}

interface TechnologyGroup {
  title: string;
  options: TechnologyOption[][];
}

const technologyGroups: TechnologyGroup[] = [
  {
    title: "Frontend ",
    options: [
      [
        { name: "Next", iconPath: "/icons/nextjs.svg" },
        { name: "React", iconPath: "/icons/react.svg" },
        { name: "Vue", iconPath: "/icons/vue.svg" },
        { name: "Angular", iconPath: "/icons/angular.svg" },
        { name: "Html", iconPath: "/icons/html.svg" }
      ],
    ]
  },
  {
    title: "Backend",
    options: [
      [
        { name: "Next", iconPath: "/icons/nextjs.svg" },
        { name: "Node", iconPath: "/icons/nodejs.svg" },
        { name: "Rust", iconPath: "/icons/rust.svg" },
        { name: "Python ", iconPath: "/icons/python.svg" },
      ],
    ]
  },
  {
    title: "Database",
    options: [
      [
        { name: "Mongo", iconPath: "/icons/mongodb.svg" },
        { name: "Postgres", iconPath: "/icons/postgresql.svg" },
        { name: "Supabase", iconPath: "/icons/supabase.svg" },
        { name: "Redis", iconPath: "/icons/redis.svg" },
        { name: "Firebase", iconPath: "/icons/firebase.svg" },
      ],
    ]
  },
  {
    title: "AI",
    options: [
      [
        { name: "Gpt", iconPath: "/icons/chatgpt.svg" },
        { name: "Claude", iconPath: "/icons/claude.png" },
        { name: "Gemini", iconPath: "/icons/gemini.png" },
      ],
    ]
  },
  {
    title: "File Storage",
    options: [
      [
        { name: "Uploadthing", iconPath: "/icons/uploadthing.svg" },
        { name: "AWS", iconPath: "/icons/aws.svg" },
        { name: "Cloudinary", iconPath: "/icons/cloudinaryy.png" },
        { name: "Firebase", iconPath: "/icons/firebase.svg" },
      ],
    ]
  },
  {
    title: "Authentication",
    options: [
      [
        { name: "Clerk", iconPath: "/icons/clerk.png" },
        { name: "Supanbase", iconPath:"/icons/supabase.svg" },
        { name: "Next Auth", iconPath: "/icons/nextjs.svg" },
        { name: "Firebase", iconPath: "/icons/firebase.svg" }
      ],
    ]
  },
  {
    title: "Payments",
    options: [
      [
        { name: "Stripe", iconPath: "/icons/stripe.svg"},
        { name: "PayPal", iconPath: "/icons/paypal.svg" }
      ],
    ]
  },
  {
    title: "Blockchain",
    options: [
      [
        { name: "Solana", iconPath: "/icons/solana.png" },
        { name: "Ethereum", iconPath: "/icons/eth.svg" }
      ],
    ]
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [activeArtifacts, setActiveArtifacts] = useState<Artifact[] | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title)
        ? prev.filter((group) => group !== title)
        : [...prev, title]
    );
  };

  const IconRenderer = ({ iconPath, className = "h-4 w-4" }: { iconPath: string; className?: string }) => {
    if (!iconPath) return null;
    
    return (
      <Image
        src={iconPath || "/placeholder.svg"}
        alt="icon"
        width={52}
        height={52}
        className={className}
      />
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      text: inputValue,
      isUser: true,
      vulnerabilities_found: false,
      vulnerabilities_list: [],
      recommendations: "",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: inputValue,
          temperature: 0.7,
          max_tokens: 2048,
          top_p: 0.9,
          frequency_penalty: 0.5,
          num_docs: 3,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();

      const vulnerabilities_found =
        data.auditor_report?.vulnerabilities_found || false;
      const vulnerabilities_list =
        data.auditor_report?.vulnerabilities_list || [];
      const recommendations = data.auditor_report?.recommendations || [];

      const aiMessage: Message = {
        text: data.message || "Here is my response:",
        isUser: false,
        artifacts: data.final_code?.artifacts || [],
        vulnerabilities_found,
        vulnerabilities_list,
        recommendations,
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (aiMessage.artifacts && aiMessage.artifacts.length > 0) {
        setActiveArtifacts(aiMessage.artifacts);
        setIsRightPanelOpen(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut({ callbackUrl: "/sign-in" });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderArtifact = (artifact: Artifact) => (
    <div key={artifact.message} className="p-4 bg-gray-800 rounded-lg mt-2">
      <p className="text-gray-300 mb-2">{artifact.message}</p>
      <pre className="bg-gray-900 p-4 rounded overflow-x-auto text-white">
        <code className={`language-${artifact.language}`}>{artifact.code}</code>
      </pre>
    </div>
  );

  return (
    <div className="flex h-screen">
      <aside
        className={`${
          isOpen ? "w-60" : "w-0"
        } flex flex-col relative transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-gradient-to-b bg-gray-700/10 rounded-r-2xl" />
        <div className="absolute inset-0 rounded-r-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.07)] backdrop-blur-sm" />

        <nav className="flex-1 relative z-10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-2 "
              aria-label="Close Sidebar"
            >
              <SpaceBetweenHorizontallyIcon  className="h-5 w-5" />
            </button>
          </div>
          {isOpen && (
            <ScrollArea className="h-[calc(100vh-6rem)] px-4">
              <div className="space-y-2">
                {technologyGroups.map((group) => (
                  <div
                    key={group.title}
                    className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-2 last:border-b-0"
                  >
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="flex items-center justify-between w-full text-left py-2 px-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="font-medium">{group.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openGroups.includes(group.title) ? "rotate-180" : ""
                        }`}
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
                                  className="py-1 px-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 flex gap-2 text-center"
                                >
                                  <IconRenderer iconPath={option.iconPath} />
                                  {option.name}
                                </a>
                              )
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </nav>
      </aside>

      {/* middle area */}
      <div className="flex-1 flex relative">
        <div
          className={`${
            isRightPanelOpen ? "w-[50%]" : "w-full"
          } transition-all duration-300 p-4 flex flex-col`}
        >
          <ScrollArea className="flex-grow mb-4">
            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-4 ${
                    msg.isUser ? "bg-blue-600" : "bg-gray-700"
                  } rounded-lg`}
                >
                  <p>{msg.text}</p>
                  {msg.vulnerabilities_found && (
                    <div className="mt-2">
                      <h3 className="font-semibold">Vulnerabilities:</h3>
                      <ul>
                        {msg.vulnerabilities_list.map((vul, i) => (
                          <li key={i}>{vul}</li>
                        ))}
                      </ul>
                      <p className="mt-2 text-green-500">
                        <h3 className="font-semibold">Recommendations:</h3>
                        {msg.recommendations}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </ScrollArea>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="text-md"
            />
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gray-700"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>

        <div
          className={`${
            isRightPanelOpen ? "w-[50%]" : "w-0"
          } transition-all duration-300 overflow-hidden bg-gray-700/50 text-white flex flex-col`}
        >
          <div className="p-4 flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Code Output</h2>
            </div>
            <ScrollArea className="flex-1">
              {activeArtifacts && activeArtifacts.length > 0 ? (
                activeArtifacts.map(renderArtifact)
              ) : (
                <p>No code to display.</p>
              )}
            </ScrollArea>
          </div>
        </div>
        <button
          onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          className="absolute top-4 right-0 transform -translate-x-1/2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors z-10"
          aria-label={
            isRightPanelOpen ? "Close right panel" : "Open right panel"
          }
        >
          {isRightPanelOpen ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>
    </div>
  );
}
