import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { FileIcon } from './FileIcon';

interface CodeContentProps {
  file: {
    filename: string;
    content: string;
    language?: string;
  };
}

export const CodeContent = ({ file }: CodeContentProps) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Code copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  const highlightSyntax = (code: string) => {
    return code.split('\n').map((line, i) => {
      let highlightedLine = line
        .replace(/(["'`])(.*?)\1/g, '<span class="text-yellow-300">$&</span>')
        .replace(/\b(const|let|var|function|return|import|export|from|default|class|extends|if|else|for|while)\b/g, 
          '<span class="text-pink-500">$&</span>')
        .replace(/(\w+)(?=\s*\()/g, '<span class="text-blue-400">$&</span>')
        .replace(/(\/\/.*$|\/\*[\s\S]*?\*\/)/gm, '<span class="text-green-600">$&</span>');
        
      return (
        <div key={i} className="flex">
          <span className="inline-block w-12 pr-4 text-right text-gray-600 select-none border-r border-gray-700 mr-4">
            {i + 1}
          </span>
          <span 
            className="flex-1"
            dangerouslySetInnerHTML={{ __html: highlightedLine || '&#8203;' }}
          />
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center px-4 py-2 bg-[#252526] border-b border-gray-800">
        <div className="flex items-center gap-2">
          <FileIcon filename={file.filename} />
          <span className="text-sm text-gray-300">{file.filename}</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="relative">
          <pre className="p-4 text-sm font-mono leading-[1.5] bg-[#1e1e1e]">
            <code>
              {highlightSyntax(file.content)}
            </code>
          </pre>
          
          <Button
            onClick={() => copyToClipboard(file.content)}
            className="absolute top-2 right-2 h-8 px-3 bg-[#2d2d2d] hover:bg-[#3e3e3e] text-gray-300"
            variant="ghost"
            size="sm"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};