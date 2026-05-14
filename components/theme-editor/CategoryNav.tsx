'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Accessibility,
  Activity,
  AlertTriangle,
  BarChart2,
  Bell,
  Bot,
  Calendar,
  CheckCircle,
  CheckSquare,
  Circle,
  Cloud,
  Crown,
  FlaskRound as Flask,
  Frame,
  Gauge,
  Globe,
  Hand,
  Layers,
  Loader,
  Lock,
  Map,
  MessageSquare,
  Minus,
  MoreHorizontal,
  MousePointer,
  Navigation,
  Palette,
  PlusCircle,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Square,
  Star,
  Sun,
  Table,
  Tag,
  TextCursorInput,
  Trophy,
  Type,
  UserCircle,
  Users,
  Video,
} from 'lucide-react';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { TOKEN_CATEGORIES } from '@/lib/theme-editor/token-categories';
import { getCategoryTokenCount } from '@/lib/theme-editor/theme-editor.utils';
import {
  DEFAULT_FONT_FAMILIES,
  DEFAULT_FONT_SIZES,
  DEFAULT_THEME,
} from '@/lib/theme-editor/default-theme';

const ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Square,
  Type,
  Star,
  Frame,
  CheckCircle,
  AlertTriangle,
  MousePointer,
  TextCursorInput,
  CheckSquare,
  Circle,
  Navigation,
  Layers,
  Loader,
  MessageSquare,
  Bell,
  Cloud,
  Sunset: Sun,
  BarChart2,
  Activity,
  Crown,
  Calendar,
  Search,
  Tag,
  UserCircle,
  PlusCircle,
  SlidersHorizontal,
  Gauge,
  Table,
  Globe,
  Video,
  Lock,
  ShoppingCart,
  Bot,
  Users,
  Trophy,
  Accessibility,
  Minus,
  Hand,
  Map,
  Flask,
  MoreHorizontal,
};

const COLOUR_TOKEN_COUNT = Object.keys(DEFAULT_THEME).length;
const FONT_TOKEN_COUNT =
  Object.keys(DEFAULT_FONT_FAMILIES).length + Object.keys(DEFAULT_FONT_SIZES).length;

export function CategoryNav() {
  const selectedTab = useThemeEditorStore((s) => s.selectedTab);
  const selectedCategoryId = useThemeEditorStore((s) => s.selectedCategoryId);
  const selectTab = useThemeEditorStore((s) => s.selectTab);
  const selectCategory = useThemeEditorStore((s) => s.selectCategory);

  const filtered = TOKEN_CATEGORIES.filter((c) => c.tab === selectedTab);

  return (
    <aside
      className="flex h-full w-[260px] shrink-0 flex-col bg-[#111827] text-white"
      aria-label="Token categories"
    >
      <div className="shrink-0 px-4 py-4">
        <p className="text-[10px] font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
          Token categories
        </p>
      </div>

      <div className="flex shrink-0 border-b border-[#1F2937] px-2 pb-0">
        {(['core', 'extended'] as const).map((tab) => {
          const active = selectedTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => selectTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium capitalize transition-colors ${
                active
                  ? 'border-b-2 border-white text-white'
                  : 'border-b-2 border-transparent text-[#6B7280] hover:text-[#D1D5DB]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <nav className="flex-1 overflow-y-auto py-1">
        {filtered.map((cat) => {
          const Icon = ICON_MAP[cat.icon] ?? Circle;
          const selected = selectedCategoryId === cat.id;
          const count = getCategoryTokenCount(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => selectCategory(cat.id)}
              className={`flex w-full cursor-pointer items-center gap-2.5 rounded px-3 py-2 text-left transition-colors ${
                selected
                  ? 'border-l-2 border-[#2563EB] bg-[#1F2937] pl-[10px] text-white'
                  : 'border-l-2 border-transparent text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#D1D5DB]'
              }`}
            >
              <Icon
                className="size-4 shrink-0"
                strokeWidth={1.75}
                style={{ color: selected ? '#2563EB' : '#4B5563' }}
              />
              <span className="min-w-0 flex-1 truncate text-[13px]">{cat.label}</span>
              <span className="shrink-0 rounded-full bg-[#374151] px-1.5 py-0.5 font-mono text-[11px] text-[#9CA3AF]">
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="shrink-0 border-t border-[#1F2937] px-3 py-3 text-center text-[11px] text-[#4B5563]">
        {COLOUR_TOKEN_COUNT} colour · {FONT_TOKEN_COUNT} font tokens
      </div>
    </aside>
  );
}
