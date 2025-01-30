export const organizeFiles = (files: any[]) => {
    const structure: { [key: string]: any } = {};
    
    files.forEach(file => {
      const parts = file.filename.split('/');
      let current = structure;
      
      parts.forEach((part: any, index: any) => {
        if (index === parts.length - 1) {
          current[part] = { ...file, type: 'file' };
        } else {
          current[part] = current[part] || { type: 'directory', children: {} };
          current = current[part].children;
        }
      });
    });
    
    return structure;
  };