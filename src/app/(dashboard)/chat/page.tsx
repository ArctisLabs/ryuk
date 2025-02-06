"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Brain,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CodeXml,
  FileIcon,
  LogOut,
  Moon,
  Send,
  Sun,
  X,
  Sparkles,
  Settings,
  CreditCard,
  FileJson,
  FileText,
  FileCode,
  File,
  FolderIcon,
} from "lucide-react";
import { SpaceBetweenHorizontallyIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import Link from "next/link";
import { anta } from "@/components/ui/fonts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodePanel } from "@/components/code-panel/Codepanel";

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

const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
    case "jsx":
    case "ts":
    case "tsx":
      return <FileCode className="h-4 w-4 text-yellow-500" />;
    case "json":
      return <FileJson className="h-4 w-4 text-yellow-300" />;
    case "md":
      return <FileText className="h-4 w-4 text-blue-400" />;
    case "html":
      return <FileCode className="h-4 w-4 text-orange-500" />;
    case "css":
      return <FileCode className="h-4 w-4 text-blue-500" />;
    case "py":
      return <FileCode className="h-4 w-4 text-green-500" />;
    default:
      return <File className="h-4 w-4 text-gray-400" />;
  }
};

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
          isOpen ? "w-60" : "w-16"
        } flex flex-col relative transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-white/5 dark:bg-black/20 backdrop-blur-lg rounded-r-2xl" />
        <div className="absolute inset-0 rounded-r-2xl border border-white/10 shadow-[0_0_90px_rgba(255,255,255,0.07)]" />

        <nav className="flex-1 relative z-10">
          <div className="flex items-center justify-between p-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={toggleSidebar}
                    variant="ghost"
                    className="rounded-lg p-2 hover:bg-white/10"
                    aria-label="Toggle Sidebar"
                  >
                    <SpaceBetweenHorizontallyIcon className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isOpen ? "Collapse" : "Expand"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isOpen && (
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className={`font-semibold ${anta.className}`}>
                  KINETIC AI
                </span>
              </div>
            )}
          </div>

          {isOpen ? (
            <ScrollArea className="h-[calc(100vh-8rem)] px-4">
              <div className="space-y-4">
                {technologyGroups.map((group) => (
                  <Card key={group.title} className="p-3 bg-white/5 border-0">
                    <button
                      onClick={() => toggleGroup(group.title)}
                      className="flex items-center justify-between w-full text-left py-2 px-1 rounded-md transition-colors"
                    >
                      <span className="font-medium flex items-center gap-2">
                        {group.title}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          openGroups.includes(group.title) ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openGroups.includes(group.title) && (
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        {group.options.map((row) =>
                          row.map(
                            (option) =>
                              option && (
                                <TooltipProvider key={option.name}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() =>
                                          handleTechSelect(
                                            group.title,
                                            option.name
                                          )
                                        }
                                        className={`p-2 rounded-lg flex gap-2 items-center transition-all ${
                                          selectedTech[
                                            group.title.toLowerCase() as keyof typeof selectedTech
                                          ] === option.name
                                            ? "bg-blue-500/20 text-blue-500"
                                            : "hover:bg-white/5"
                                        }`}
                                      >
                                        <Image
                                          src={option.iconPath}
                                          alt={option.name}
                                          width={20}
                                          height={20}
                                          className="h-5 w-5"
                                        />
                                        <span className="text-sm">
                                          {option.name}
                                        </span>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Select {option.name}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )
                          )
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center gap-3 mt-4">
              {["K", "I", "N", "E", "T","I","C"].map((letter, index) => (
                <span
                  key={index}
                  className={`text-2xl font-bold bg-gray-100 bg-clip-text text-transparent ${anta.className}`}
                >
                  {letter}
                </span>
              ))}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Button
              variant="ghost"
              className="w-full flex items-center gap-3 hover:bg-white/10"
              onClick={() => setIsLogoutPopupOpen(!isLogoutPopupOpen)}
            >
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full ring-2 ring-white/20"
                />
              )}
              {isOpen && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium truncate">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {session?.user?.email}
                  </p>
                </div>
              )}
            </Button>

            {isLogoutPopupOpen && (
              <Card className="absolute bottom-full mb-2 left-0 right-0 mx-4 bg-white/10 backdrop-blur-lg border-white/10">
                <div className="p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    {session?.user?.image && (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-12 h-12 rounded-lg ring-2 ring-white/20"
                      />
                    )}
                    <div>
                      <p className="font-medium">{session?.user?.name}</p>
                      <Badge variant="secondary" className="mt-1">
                        Free Plan
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-sm hover:bg-white/10"
                    >
                      <CreditCard className="h-4 w-4" />
                      Billing
                    </Button>
                    <Link href="/settings">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-sm hover:bg-white/10"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-2 text-sm text-red-400 hover:bg-red-500/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Theme</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4" />
                        Light
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4" />
                        Dark
                      </Button>
                    </div>
                  </div>

                  <Link href="/plans">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </nav>
      </aside>

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
            <div className="flex flex-col gap-1">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-white text-black "
              >
                <Send className="h-4 w-4" />
              </Button>
              <Button className="bg-white text-black ">
                <Link href={"/prompts"}>
                  <Brain className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </form>
        </div>

        <div
          className={`${
            isRightPanelOpen ? "w-[50%]" : "w-0"
          } transition-all duration-300 overflow-hidden bg-[#1e1e1e] flex`}
        >
          {!isRightPanelOpen && (
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className="absolute top-4 right-0 transform -translate-x-1/2 bg-gray-700/40 border border-gray-700/10 text-white p-2 rounded-md  transition-colors z-10"
              aria-label={
                isRightPanelOpen ? "Close code panel" : "Open code panel"
              }
            >
              <CodeXml size={20} />
            </button>
          )}

          {/* Code section */}
          <div className="flex-1">
            {activeArtifacts && activeArtifacts[selectedFile] && (
              <div className="h-full flex flex-col">
                <CodePanel
                  isOpen={isRightPanelOpen}
                  onClose={() => setIsRightPanelOpen(false)}
                  artifacts={activeArtifacts}
                  selectedFile={activeArtifacts?.[selectedFile]?.filename}
                  onFileSelect={(filename, content) => {
                    const index =
                      activeArtifacts?.findIndex(
                        (a) => a.filename === filename
                      ) ?? -1;
                    if (index !== -1) {
                      setSelectedFile(index);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
