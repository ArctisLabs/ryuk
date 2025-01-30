import React from 'react';
import { ChevronDown, ChevronRight, FolderOpen, FolderClosed } from "lucide-react";
import { FileIcon } from './FileIcon';

interface FileTreeItemProps {
  name: string;
  item: any;
  depth?: number;
  onSelect: (filename: string, content: string) => void;
  selectedFile: string;
}

export const FileTreeItem = ({ 
  name, 
  item, 
  depth = 0, 
  onSelect, 
  selectedFile 
}: FileTreeItemProps) => {
  const [isOpen, setIsOpen] = React.useState(true);
  const isDirectory = item.type === 'directory';
  const isSelected = item.filename === selectedFile;
  
  const toggleDirectory = () => setIsOpen(!isOpen);
  
  return (
    <div>
      <div
        className={`flex items-center px-2 py-1 cursor-pointer text-sm 
          ${isSelected ? 'bg-blue-500/20' : 'hover:bg-white/5'}
          ${isDirectory ? 'text-gray-300' : 'text-gray-400'}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => {
          if (isDirectory) {
            toggleDirectory();
          } else {
            onSelect(item.filename, item.content);
          }
        }}
      >
        {isDirectory ? (
          <div className="flex items-center gap-1">
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-500" />
            )}
            {isOpen ? (
              <FolderOpen className="h-4 w-4 text-yellow-400" />
            ) : (
              <FolderClosed className="h-4 w-4 text-yellow-400" />
            )}
          </div>
        ) : (
          <span className="ml-4">
            <FileIcon filename={name} />
          </span>
        )}
        <span className="ml-2">{name}</span>
      </div>
      
      {isDirectory && isOpen && (
        <div>
          {Object.entries(item.children).map(([childName, childItem]: [string, any]) => (
            <FileTreeItem
              key={childName}
              name={childName}
              item={childItem}
              depth={depth + 1}
              onSelect={onSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};