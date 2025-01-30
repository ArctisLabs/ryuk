import { 
    FileJson, 
    FileText, 
    FileCode, 
    File
  } from "lucide-react";
  
  interface FileIconProps {
    filename: string;
    className?: string;
  }
  
  export const FileIcon = ({ filename, className = "h-4 w-4" }: FileIconProps) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    
    switch(ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <FileCode className={`${className} text-yellow-500`} />;
      case 'json':
        return <FileJson className={`${className} text-yellow-300`} />;
      case 'md':
        return <FileText className={`${className} text-blue-400`} />;
      case 'html':
        return <FileCode className={`${className} text-orange-500`} />;
      case 'css':
        return <FileCode className={`${className} text-blue-500`} />;
      case 'py':
        return <FileCode className={`${className} text-green-500`} />;
      default:
        return <File className={`${className} text-gray-400`} />;
    }
  };
  