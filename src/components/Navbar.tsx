import React from "react";
import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  BookOpen, 
  Download, 
  Play, 
  Server, 
  FolderLock
} from "lucide-react";

interface NavbarProps {
  activeTab: "agents" | "sandbox" | "engines" | "mcp" | "guide" | "export";
  setActiveTab: (tab: "agents" | "sandbox" | "engines" | "mcp" | "guide" | "export") => void;
  onOpenExport: () => void;
  activeMemoryCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  activeMemoryCount
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand / Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-900 text-white shadow-sm">
            <Cpu className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-neutral-900 tracking-tight">Dayna Multi-Agent OS</span>
              <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                v4.0 Protocol
              </span>
            </div>
            <p className="text-xs text-neutral-500 hidden sm:block">
              Claude Desktop MCP • 21-Agent Roster • Two-Column Gateway
            </p>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center space-x-1 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab("agents")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "agents"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>21 Agents</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "sandbox"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <Play className="h-3.5 w-3.5 text-amber-400" />
            <span>Live Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab("engines")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "engines"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
            <span>Core Engines</span>
          </button>

          <button
            onClick={() => setActiveTab("mcp")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "mcp"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-purple-500" />
            <span>MCP & Config</span>
          </button>

          <button
            onClick={() => setActiveTab("guide")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === "guide"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
            <span>Guidekit</span>
          </button>
        </nav>

        {/* Right: Quick Status & Export Bundle */}
        <div className="flex items-center space-x-2.5">
          <div className="hidden lg:flex items-center space-x-2 border-r border-neutral-200 pr-3">
            <div className="flex items-center space-x-1.5 text-xs text-neutral-600">
              <Server className="h-3.5 w-3.5 text-emerald-600" />
              <span className="font-mono text-[11px] text-neutral-700">master-mcp</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-neutral-500">
              <FolderLock className="h-3 w-3 text-amber-600" />
              <span className="font-mono text-[11px]">5 Domains</span>
            </div>
            <div className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[10px] text-neutral-600">
              Memory: {activeMemoryCount}/5
            </div>
          </div>

          <button
            onClick={onOpenExport}
            className="flex items-center space-x-1.5 rounded-lg bg-neutral-900 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export Bundle</span>
          </button>
        </div>

      </div>
    </header>
  );
};
