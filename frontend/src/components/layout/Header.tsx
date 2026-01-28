import { Anchor, BarChart3 } from 'lucide-react';

export default function Header() {
  return (
    <header className="gradient-header text-white px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center">
          <Anchor className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight leading-tight">
            Cargill Ocean Transportation
          </h1>
          <p className="text-sky-200 text-xs font-medium">
            Voyage Optimization Platform
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 text-xs">
          <BarChart3 className="w-3.5 h-3.5" />
          <span className="font-medium">SMU Datathon 2026</span>
        </div>
      </div>
    </header>
  );
}
