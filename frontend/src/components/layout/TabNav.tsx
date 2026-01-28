import { LayoutDashboard, Ship, SlidersHorizontal, Brain } from 'lucide-react';
import type { TabId } from '../../types';

interface TabNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'voyages', label: 'Voyages', icon: <Ship className="w-4 h-4" /> },
  { id: 'scenarios', label: 'Scenarios', icon: <SlidersHorizontal className="w-4 h-4" /> },
  { id: 'ml', label: 'ML Insights', icon: <Brain className="w-4 h-4" /> },
];

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="border-b border-border bg-white px-6">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'text-ocean-600 border-ocean-500'
                : 'text-text-secondary border-transparent hover:text-navy-700 hover:border-border'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
