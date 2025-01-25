import Image from "next/image";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen w-[90%] flex bg-maindark01" suppressHydrationWarning>
        <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-[80%] sm:w-[53%]">
                {children}
            </div>
        </div>
    </div>
  );
};

export default layout;
