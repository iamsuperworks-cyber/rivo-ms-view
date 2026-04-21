import { useState, createContext, useContext } from "react";
import { RivoSidebar } from "./RivoSidebar";
import { RivoTopBar } from "./RivoTopBar";
import { cn } from "@/lib/utils";

interface SidebarCtx {
  collapsed: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarCtx>({ collapsed: false, toggle: () => {} });

export const useSidebarState = () => useContext(SidebarContext);

export function RivoLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggle = () => setCollapsed((c) => !c);

  return (
    <SidebarContext.Provider value={{ collapsed, toggle }}>
      <div className="min-h-screen flex">
        <RivoSidebar />
        <div
          className={cn(
            "flex-1 flex flex-col transition-[margin] duration-200",
            collapsed ? "ml-[64px]" : "ml-[220px]"
          )}
        >
          <RivoTopBar />
          <main className="flex-1 bg-background p-6">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
