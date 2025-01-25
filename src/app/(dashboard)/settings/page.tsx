"use client"
import React, { useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessagesSquareIcon,
  GithubIcon,
  LoaderIcon
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from 'next/link';
import { anta } from '@/components/ui/fonts';

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  readme?: string;
  owner: string;
  default_branch: string;
  files: Array<{
    name: string;
    path: string;
    size: number;
    type: string;
    sha: string;
  }>;
}

const history = [
  { his: "abfsdvsdvdssds" },
  { his: "saf" },
  { his: "aasffe" },
  { his: "asesfc" },
  { his: "abfsdvssdvdssds" },
  { his: " dsfdsrr" },
  { his: "abfsdvsadvdssds" },
  { his: "abfsdvsdfvdssds" },
  { his: "abfsdvsvdvdssds" },
  { his: "abfsdavsdvdssds" },
  { his: "f" },
  { his: "g" },
  { his: "h" },
];


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoData, setRepoData] = useState<Repository | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [isLogoutPopupOpen, setIsLogoutPopupOpen] = useState(false);
  const [ repositories, setRepositories ] = useState<any[]>([]);

  const handleFetchRepo = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const url = new URL(repoUrl);
      const pathParts = url.pathname.split("/").filter(Boolean);
      
      if (pathParts.length < 2) {
        throw new Error("Invalid GitHub URL. Please provide a valid repository URL.");
      }
      
      const [username, repoName] = pathParts;
      const res = await fetch(`/api/github/${repoName}?username=${username}`, { 
        cache: "no-store" 
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch repository data");
      }
      
      const data = await res.json();
      setRepoData(data);
    } catch (err: any) {
      setError(err.message);
      setRepoData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/sign-in" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex h-screen">
    <aside
      className={`${
        isOpen ? "w-64" : "w-16"
      } flex flex-col relative transition-all duration-300`}
    >
      <div className="absolute inset-0 bg-gradient-to-b bg-gray-700/10 rounded-r-2xl" />
      <div className="absolute inset-0 rounded-r-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.07)] backdrop-blur-sm" />

      <nav className="flex-1 relative z-10">
        <div className="pl-2 h-full">
          <div className="p-4 flex items-center gap-2">
            {isOpen ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-white hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex flex-col items-center w-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-white hover:bg-white/10 mb-4"
                  onClick={() => setIsOpen(true)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="flex flex-col space-y-2 text-center">
                  {["K", "U", "I", "P", "E", "R"].map((letter, index) => (
                    <span
                      key={index}
                      className={`text-2xl font-semibold tracking-tighter bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent ${anta.className}`}
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <LogOut className="mt-[22rem] w-5 h-5" />
              </div>
            )}
            {isOpen && (
              <h2
                className={`text-white font-semibold text-xl bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent ${anta.className} flex`}
              >
                {["K", "U", "I", "P", "E", "R"].map((letter, index) => (
                  <span
                    key={index}
                    className="text-3xl font-semibold tracking-tighter bg-white text-transparent bg-clip-text text-center px-1"
                  >
                    {letter}
                  </span>
                ))}
              </h2>
            )}
          </div>

          {isOpen && (
            <>
              <div className="h-[calc(40vh-6rem)] w-full flex flex-col relative">
                <div className="flex-1 relative overflow-hidden">
                  <ScrollArea className="h-full absolute inset-x-0">
                    <div className="p-4 space-y-2">
                      <Link href="/chat" className="block">
                        <button className="w-full text-left text-white bg-gray-800/80 rounded-lg py-2.5 px-3 cursor-pointer group transition-all duration-200 backdrop-blur-sm">
                          <span className="truncate text-md font-medium">
                            Chat
                          </span>
                        </button>
                      </Link>

                      <Link href="/output" className="block">
                        <button className="w-full text-left text-white hover:bg-gray-800/80 rounded-lg py-2.5 px-3 cursor-pointer group transition-all duration-200 backdrop-blur-sm">
                          <span className="truncate text-md font-medium">
                            Generate Output
                          </span>
                        </button>
                      </Link>

                      <Link href="/settings" className="block">
                        <button className="w-full text-left text-white hover:bg-gray-800/80 rounded-lg py-2.5 px-3 cursor-pointer group transition-all duration-200 backdrop-blur-sm">
                          <span className="truncate text-md font-medium">
                            Settings
                          </span>
                        </button>
                      </Link>

                      {/* <Link href="/settings" className="block">
                        <button className="w-full text-left text-white hover:bg-gray-800/80 rounded-lg py-2.5 px-3 cursor-pointer group transition-all duration-200 backdrop-blur-sm">
                          <span className="truncate text-md font-medium">
                            Settings
                          </span>
                        </button>
                      </Link> */}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="h-[calc(67vh-6rem)] w-full flex flex-col relative">
                <div className="flex-1 relative overflow-hidden">
                  <span className={`p-2 mt-10 text-xl ${anta.className}`}>
                    Recents
                  </span>
                  <ScrollArea className="h-full absolute inset-x-0">
                    <div className="p-2 space-y-2">
                      {history.map((item) => (
                        <div
                          key={item.his}
                          className="flex items-center text-white hover:bg-white/5 rounded-lg py-1 px-3 cursor-pointer group transition-all duration-200 backdrop-blur-sm"
                        >
                          <div className="flex justify-center items-center gap-2 truncate text-sm font-medium">
                            <MessagesSquareIcon className="w-4" />
                            {item.his}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              <div className="relative flex items-center space-x-2 mt-5">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-gray-600 w-[90%] h-[50px] ml-3 hover:bg-gray-500 text-white"
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
                        <p className="text-xs font-semibold">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-gray-300">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>
                </Button>

                {isLogoutPopupOpen && (
                  <div
                    className="absolute left-full ml-2 bg-gray-700 text-white rounded-lg shadow-lg p-4 w-64 z-50 transform transition-transform origin-top-left animate-slide-in-top -mt-16"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      {session?.user?.image && (
                        <img
                          src={session.user.image}
                          alt="Profile"
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-sm font-semibold">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-gray-300">
                          {session?.user?.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging out..." : "Confirm Logout"}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </aside>

    <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Paste GitHub repository URL"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="flex-1 bg-gray-800 text-white border-gray-700"
              />
              <Button 
                onClick={handleFetchRepo}
                disabled={isLoading}
                className="min-w-[100px] bg-gray-800 hover:bg-gray-700"
              >
                {isLoading ? (
                  <LoaderIcon className="w-4 h-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    <GithubIcon className="w-4 h-4" />
                    Fetch
                  </span>
                )}
              </Button>
            </div>

            {error && (
              <div className="bg-red-900/20 text-red-400 p-4 rounded-lg">
                {error}
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}