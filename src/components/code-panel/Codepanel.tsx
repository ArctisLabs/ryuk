import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, X } from "lucide-react";
import { FileTreeItem } from './FileTreeItem';
import { CodeContent } from './CodeContent';
import { organizeFiles } from './utils';

interface Artifact {
  filename: string;
  content: string;
  language?: string;
}

interface CodePanelProps {
  isOpen: boolean;
  onClose: () => void;
  artifacts: Artifact[];
  selectedFile: string;
  onFileSelect: (filename: string, content: string) => void;
}

export const CodePanel = ({ 
  isOpen, 
  onClose, 
  artifacts, 
  selectedFile, 
  onFileSelect 
}: CodePanelProps) => {
  const fileStructure = React.useMemo(() => organizeFiles(artifacts || []), [artifacts]);
  const currentFile = artifacts?.find(a => a.filename === selectedFile);

  return (
    <div className={`${
      isOpen ? 'w-[100%]' : 'w-0'
    } transition-all duration-300 overflow-hidden bg-[#1e1e1e] flex`}>
      <div className="w-[250px] border-r border-gray-800 bg-[#252526]">
        <div className="p-3 text-sm text-gray-400 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isOpen ? (
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-white/5"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => onClose()}
                className="p-1 rounded hover:bg-white/5"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
            <span className="uppercase text-xs font-medium">Explorer</span>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-40px)]">
          <div className="p-2">
            {Object.entries(fileStructure).map(([name, item]) => (
              <FileTreeItem
                key={name}
                name={name}
                item={item}
                onSelect={onFileSelect}
                selectedFile={selectedFile}
              />
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Code Content */}
      {currentFile && (
        <CodeContent file={currentFile} />
      )}
    </div>
  );
};