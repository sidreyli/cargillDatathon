import { Anchor } from 'lucide-react';

export default function Header() {
  return (
    <header className="gradient-header text-white px-6 py-4 flex items-center">
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
    </header>
  );
}
