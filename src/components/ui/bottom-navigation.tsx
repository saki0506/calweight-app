import { ChartLine, PenSquare, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'graph' | 'edit' | 'calendar' | 'settings';

type BottomNavigationProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

const tabs: { id: TabId; icon: typeof ChartLine }[] = [
  { id: 'graph', icon: ChartLine },
  { id: 'edit', icon: PenSquare },
  { id: 'calendar', icon: Calendar },
  { id: 'settings', icon: Settings },
];

export function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 md:py-4 bg-[#D9D9D9]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'p-2 md:p-3 rounded-lg transition-colors',
              activeTab === tab.id
                ? 'text-pink-500'
                : 'text-gray-600 hover:text-gray-800'
            )}
          >
            <Icon className="h-8 w-8 md:h-10 md:w-10" strokeWidth={1.5} />
          </button>
        );
      })}
    </nav>
  );
}

export type { TabId };