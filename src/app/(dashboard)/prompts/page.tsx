"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";

interface Prompt {
  id: string;
  title: string;
  categories: string[];
}

const categoryColors: { [key: string]: string } = {
  Writing: "bg-blue-100 text-black  dark:bg-blue-900 dark:text-black",
  Creative: "bg-purple-100 text-black  dark:bg-purple-900 dark:black",
  Story: "bg-pink-100 text-black  dark:bg-pink-900 dark:text-black",
  AI: "bg-green-100 text-black  dark:bg-green-900 dark:text-black",
  Productivity: "bg-yellow-100 text-black  dark:bg-yellow-900 dark:text-black",
  Business: "bg-orange-100 text-black dark:bg-orange-900 dark:text-black",
  Email: "bg-red-100 text-black dark:bg-red-900 dark:text-black",
  Technical: "bg-indigo-100 text-black dark:bg-indigo-900 dark:text-black",
  Code: "bg-cyan-100 text-black dark:bg-cyan-900 dark:text-black",
  Education: "bg-teal-100 text-black  dark:bg-teal-900 dark:text-black",
  Learning: "bg-emerald-100 text-black dark:bg-emerald-900 dark:text-black",
};

const samplePrompts: Prompt[] = [
  {
    id: "1",
    title: "Creative Writing",
    categories: ["Writing", "Creative"],
  },
  {
    id: "2",
    title: "Creative Writing",
    categories: ["Writing", "Story"],
  },
  {
    id: "3",
    title: "Creative Eeedr",
    categories: ["AI", "Productivity"],
  },
  {
    id: "4",
    title: "Creative Errtf",
    categories: ["Business", "Email"],
  },
  {
    id: "5",
    title: "Creative Errtf",
    categories: ["Technical", "Code"],
  },
  {
    id: "6",
    title: "Creative Errtf",
    categories: ["Education", "Learning"],
  },
];

export default function PromptHub() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const filteredPrompts = samplePrompts.filter((prompt) =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">PromptHub</h1>
      <div className="flex justify-center mb-8">
        <div className="flex items-center w-full max-w-md">
          <Input
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow mr-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {filteredPrompts.map((prompt) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            onSelect={() => setSelectedPrompt(prompt)}
          />
        ))}
      </div>
    </div>
  );
}

function PromptCard({
  prompt,
  onSelect,
}: {
  prompt: Prompt;
  onSelect: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative h-full">
      <Card className="relative z-10 border border-gray-700/20 h-full flex flex-col">
        <BorderBeam />
        <CardHeader className="flex-grow">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="line-clamp-2">{prompt.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="h-8 w-8 shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {prompt.categories.map((category) => (
              <Badge
                key={category}
                variant="outline"
                className={cn(
                  "text-xs font-medium rounded-md border border-transparent",
                  categoryColors[category] ||
                    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                )}
              >
                {category}
              </Badge>
            ))}
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}