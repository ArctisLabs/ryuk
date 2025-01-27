"use client";

import type React from "react";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CodeXml,
  FileIcon,
  LogOut,
  Moon,
  Send,
  Sun,
} from "lucide-react";
import { SpaceBetweenHorizontallyIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/theme-comp";
import { toast } from "sonner";
import Link from "next/link";
import { anta } from "@/components/ui/fonts";

interface Artifact {
  filename: string;
  content: string;
  language: string;
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
    title: "Frontend",
    options: [
      [
        { name: "Nextjs", iconPath: "/icons/nextjs.svg" },
        { name: "React", iconPath: "/icons/react.svg" },
        { name: "Vue", iconPath: "/icons/vue.svg" },
        { name: "Angular", iconPath: "/icons/angular.svg" },
        { name: "Html", iconPath: "/icons/html.svg" },
      ],
    ],
  },
  {
    title: "Backend",
    options: [
      [
        { name: "Nextjs", iconPath: "/icons/nextjs.svg" },
        { name: "Node", iconPath: "/icons/nodejs.svg" },
        { name: "Rust", iconPath: "/icons/rust.svg" },
        { name: "Python", iconPath: "/icons/python.svg" },
      ],
    ],
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
    ],
  },
  {
    title: "AI",
    options: [
      [
        { name: "Gpt", iconPath: "/icons/chatgpt.svg" },
        { name: "Claude", iconPath: "/icons/claude.png" },
        { name: "Gemini", iconPath: "/icons/gemini.png" },
        { name: "Grok", iconPath: "/icons/grok.png" },
      ],
    ],
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
    ],
  },
  {
    title: "Authentication",
    options: [
      [
        { name: "Clerk", iconPath: "/icons/clerk.png" },
        { name: "Supabase", iconPath: "/icons/supabase.svg" },
        { name: "Next Auth", iconPath: "/icons/nextjs.svg" },
        { name: "Firebase", iconPath: "/icons/firebase.svg" },
      ],
    ],
  },
  {
    title: "Payments",
    options: [
      [
        { name: "Stripe", iconPath: "/icons/stripe.svg" },
        { name: "PayPal", iconPath: "/icons/paypal.svg" },
      ],
    ],
  },
  {
    title: "Blockchain",
    options: [
      [
        { name: "Solana", iconPath: "/icons/solana.png" },
        { name: "Ethereum", iconPath: "/icons/eth.svg" },
      ],
    ],
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
  const { setTheme } = useTheme();
  const [selectedFile, setSelectedFile] = useState(0);

  const [selectedTech, setSelectedTech] = useState({
    frontend: "",
    backend: "",
    database: "",
    ai: "",
    fileStorage: "",
    authentication: "",
    payments: "",
    blockchain: "",
  });

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) =>
      prev.includes(title)
        ? prev.filter((group) => group !== title)
        : [...prev, title]
    );
  };

  const handleTechSelect = (groupTitle: string, optionName: string) => {
    const key = groupTitle.toLowerCase().trim();
    setSelectedTech((prev) => ({
      ...prev,
      [key]: optionName,
    }));
    toast.success(`Selected ${optionName} for ${groupTitle}`);
  };

  const validateTechStack = () => {
    const requiredTech = ["frontend", "backend", "database"];
    const missing = requiredTech.filter(
      (tech) => !selectedTech[tech as keyof typeof selectedTech]
    );

    if (missing.length > 0) {
      const errorMsg = `Please select required technologies: ${missing.join(
        ", "
      )}`;
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }
    return true;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Code copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy code");
      console.error("Copy failed:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      toast.error("Please enter what you want to build");
      return;
    }
    if (!validateTechStack()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selectedTech,
          prompt: inputValue,
          temperature: 0.7,
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();

      const userMessage: Message = {
        text: `Tech Stack:\n${Object.entries(selectedTech)
          .filter(([_, v]) => v)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")}\n\nPrompt: ${inputValue}`,
        isUser: true,
        vulnerabilities_found: false,
        vulnerabilities_list: [],
        recommendations: "",
      };

      const aiMessage: Message = {
        text: data.message || "Here's your generated code:",
        isUser: false,
        artifacts: data.final_code?.artifacts || [],
        vulnerabilities_found:
          data.auditor_report?.vulnerabilities_found || false,
        vulnerabilities_list: data.auditor_report?.vulnerabilities_list || [],
        recommendations: data.auditor_report?.recommendations || "",
      };

      setMessages((prev) => [...prev, userMessage, aiMessage]);

      if (data.final_code?.artifacts?.length > 0) {
        setActiveArtifacts(data.final_code.artifacts);
        setIsRightPanelOpen(true);
      }

      setInputValue("");
      toast.success("Code generated successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
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
      toast.error("Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const renderTechnologyOption = (
    option: TechnologyOption,
    groupTitle: string
  ) => {
    const key = groupTitle.toLowerCase().trim() as keyof typeof selectedTech;
    const isSelected = selectedTech[key] === option.name;

    return (
      <button
        onClick={() => handleTechSelect(groupTitle, option.name)}
        className={`py-1 px-2 text-sm rounded-md flex gap-2 items-center transition-all
          ${
            isSelected
              ? "bg-blue-500 text-white dark:bg-blue-600"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
      >
        <Image
          src={option.iconPath}
          alt={option.name}
          width={16}
          height={16}
          className="h-4 w-4"
        />
        <span>{option.name}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen">
      <aside
        className={`${
          isOpen ? "w-60" : "w-14"
        } flex flex-col relative transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-gradient-to-b bg-gray-700/10 rounded-r-2xl" />
        <div className="absolute inset-0 rounded-r-2xl border border-white/10 shadow-[0_0_90px_rgba(255,255,255,0.07)] backdrop-blur-sm" />

        <nav className="flex-1 relative z-10">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={toggleSidebar}
              className="rounded-lg p-1"
              aria-label="Toggle Sidebar"
            >
              <SpaceBetweenHorizontallyIcon className="h-5 w-5" />
            </button>
          </div>

          {isOpen ? (
            <ScrollArea className="h-[calc(100vh-8rem)] px-4">
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
                              option &&
                              renderTechnologyOption(option, group.title)
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-col space-y-2 text-center">
                {["B","O", "L", "T","A", "I"].map((letter, index) => (
                  <span
                    key={index}
                    className={`text-2xl font-semibold tracking-tighter bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent ${anta.className}`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <LogOut className="mt-[20rem] w-5 h-5" />
            </div>
          )}

          <div className="relative flex items-center mt-3">
            <Button
              variant="secondary"
              size="icon"
              className="bg-gray-600 w-[90%] h-[40px] ml-3 hover:bg-gray-500 text-white"
              onClick={() => setIsLogoutPopupOpen(!isLogoutPopupOpen)}
            >
              <div className="flex items-center space-x-2 mb-4 mt-3">
                {session?.user?.image && (
                  <img
                    src={session.user.image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div>
                  <p className="text-xs font-semibold">{session?.user?.name}</p>
                  <p className="text-xs text-gray-300">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
            </Button>

            {isLogoutPopupOpen && (
              <div className="absolute bottom-full mb-2 left-3 bg-[#1c1c1c] text-white rounded-lg shadow-lg w-[280px] z-50">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    {session?.user?.image && (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-lg"
                      />
                    )}
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">
                        {session?.user?.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {session?.user?.email}
                      </p>
                      <p className="text-xs text-gray-400">Free</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm font-normal text-gray-300 hover:text-gray-100"
                    >
                      Billing
                    </Button>
                    <Link href={"/settings"}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm font-normal text-gray-300 hover:text-gray-100"
                      >
                        Settings
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm font-normal text-red-400 hover:text-red-300"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </Button>
                  </div>

                  <div className="pt-2 border-t border-gray-800">
                    <p className="text-xs text-gray-400 mb-2">Preferences</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-sm text-gray-300">Theme</span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0 bg-white text-black"
                            onClick={() => setTheme("light")}
                          >
                            <Sun className="h-4 w-4" />
                            <span className="sr-only">Light Mode</span>
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0 bg-white text-black"
                            onClick={() => setTheme("dark")}
                          >
                            <Moon className="h-4 w-4" />
                            <span className="sr-only">Dark Mode</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-white text-black hover:bg-gray-200 dark:bg-white dark:text-black">
                    <Link href={"/plans"}>Upgrade Plan</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </aside>

      {/* Main content area */}
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
                  <p className="text-white whitespace-pre-wrap">{msg.text}</p>
                  {msg.vulnerabilities_found && (
                    <div className="mt-2 text-white">
                      <h3 className="font-semibold">Vulnerabilities:</h3>
                      <ul className="list-disc pl-4">
                        {msg.vulnerabilities_list.map((vul, i) => (
                          <li key={i}>{vul}</li>
                        ))}
                      </ul>
                      {msg.recommendations && (
                        <div className="mt-2">
                          <h3 className="font-semibold">Recommendations:</h3>
                          <p className="text-green-400">
                            {msg.recommendations}
                          </p>
                        </div>
                      )}
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

          {error && (
            <div className="text-red-500 mb-4 p-2 bg-red-100 dark:bg-red-900/50 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="text"
              placeholder="Describe what you want to build..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              className="flex-1 border-opacity-100"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-black "
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Right panel */}
        <div
          className={`${
            isRightPanelOpen ? "w-[50%]" : "w-0"
          } transition-all duration-300 overflow-hidden bg-[#1e1e1e] flex`}
        >
          {/* File tree section */}
          <div className="w-[200px] border-r border-[#323233] bg-[#252526]">
            <div className="p-2 text-sm text-gray-400 border-b border-[#323233]">
              EXPLORER
            </div>
            <ScrollArea className="h-[calc(100vh-40px)]">
              <div className="p-2">
                {activeArtifacts?.map((artifact, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedFile(index);
                    }}
                    className={`flex items-center gap-2 w-full px-2 py-1 text-sm rounded-sm hover:bg-[#2a2d2e] ${
                      selectedFile === index ? "bg-[#37373d]" : ""
                    }`}
                  >
                    <FileIcon className="h-4 w-4 text-[#7a7a7a]" />
                    <span className="text-[#cccccc] truncate text-left">
                      {artifact.filename}
                    </span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          <button
          onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
          className="absolute top-4 right-0 transform -translate-x-1/2 bg-gray-700/40 border border-gray-700/10 text-white p-2 rounded-md  transition-colors z-10"
          aria-label={isRightPanelOpen ? "Close code panel" : "Open code panel"}
        >
          {isRightPanelOpen ? <CodeXml size={20} /> : <CodeXml  size={20} />}
        </button>

          {/* Code section */}
          <div className="flex-1">
            {activeArtifacts && activeArtifacts[selectedFile] && (
              <div className="h-full flex flex-col">
                {/* File header */}
                <div className="flex items-center px-4 py-2 bg-[#252526] border-b border-[#323233]">
                  <span className="text-sm text-gray-300">
                    {activeArtifacts[selectedFile].filename}
                  </span>
                </div>

                {/* Code content */}
                  <div className="relative">
                    <pre
                      className="p-4 text-sm font-mono leading-[1.5] overflow-x-auto"
                      style={{
                        backgroundColor: "#1e1e1e",
                        tabSize: 2,
                      }}
                    >
                      <code>
                      <ScrollArea className="flex-1">
                        {activeArtifacts[selectedFile].content
                          .split("\n")
                          .map((line, i) => (
                            <div key={i} className="flex">
                              <span className="inline-block w-12 pr-4 text-right text-[#858585] select-none">
                                {i + 1}
                              </span>
                              <span
                                className="flex-1 pl-4"
                                style={{ color: "#d4d4d4" }}
                              >
                                {line || "\n"}
                              </span>
                            </div>
                          ))}
                    </ScrollArea>
                      </code>
                    </pre>
                    <Button
                      onClick={() =>
                        copyToClipboard(activeArtifacts[selectedFile].content)
                      }
                      className="absolute top-2 right-2 h-8 px-3 py-1 bg-[#2d2d2d] hover:bg-[#3e3e3e] text-xs text-gray-300 border-0"
                      variant="ghost"
                      size="sm"
                    >
                      Copy
                    </Button>
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
