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
  Hexagon,
  UserCircle,
  Users,
  Video,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { TOKEN_CATEGORIES } from '@/lib/theme-editor/token-categories';
import { getCategoryTokenCount } from '@/lib/theme-editor/theme-editor.utils';
import {
  DEFAULT_FONT_FAMILIES,
  DEFAULT_FONT_SIZES,
  DEFAULT_THEME,
  DEFAULT_RADIUS_TOKENS,
  COMPONENT_RADIUS_KEYS,
} from '@/lib/theme-editor/default-theme';

const ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Square,
  Type,
  Hexagon,
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
  const radiusOverrides = useThemeEditorStore((s) => s.radiusOverrides);

  const filtered = TOKEN_CATEGORIES.filter((c) => c.tab === selectedTab);
  const shapeModifiedCount = COMPONENT_RADIUS_KEYS.filter(
    (k) =>
      k in radiusOverrides &&
      radiusOverrides[k] !== DEFAULT_RADIUS_TOKENS[k]
  ).length;

  function renderCategoryButton(
    id: string,
    label: string,
    Icon: LucideIcon,
    count: number
  ) {
    const selected = selectedCategoryId === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => selectCategory(id)}
        className={cn(
          'flex w-full cursor-pointer items-center gap-2.5 rounded-none border-l-2 border-transparent px-3 py-2 text-left transition-colors',
          selected
            ? 'border-l-[var(--color-sidebar-accent)] bg-[var(--color-sidebar-hover)] pl-[10px] text-[var(--color-sidebar-foreground)]'
            : 'text-[var(--color-sidebar-muted)] hover:bg-[var(--color-sidebar-hover)] hover:text-[var(--color-sidebar-foreground)]'
        )}
      >
        <Icon
          className={cn(
            'size-4 shrink-0',
            selected
              ? 'text-[var(--color-sidebar-accent)]'
              : 'text-[var(--color-sidebar-muted)]'
          )}
          strokeWidth={1.75}
        />
        <span className="min-w-0 flex-1 truncate text-[13px]">{label}</span>
        <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 font-mono text-[10px] font-semibold text-[var(--color-primary-foreground)]">
          {count}
        </span>
      </button>
    );
  }

  return (
    <aside
      className="flex h-full w-[260px] shrink-0 flex-col border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar)] text-[var(--color-sidebar-foreground)]"
      aria-label="Token categories"
    >
      <div className="shrink-0 px-4 py-4">
        <p className="text-[10px] font-medium tracking-[0.2em] text-[var(--color-sidebar-muted)] uppercase">
          Token categories
        </p>
      </div>

      <div className="flex shrink-0 border-b border-[var(--color-sidebar-border)] px-2 pb-0">
        {(['core', 'extended'] as const).map((tab) => {
          const active = selectedTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => selectTab(tab)}
              className={cn(
                'flex-1 border-b-2 py-2.5 text-sm font-medium capitalize transition-colors',
                active
                  ? 'border-[var(--color-sidebar-accent)] text-[var(--color-sidebar-foreground)]'
                  : 'border-transparent text-[var(--color-sidebar-muted)] hover:text-[var(--color-sidebar-foreground)]'
              )}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <nav className="flex-1 overflow-y-auto py-1">
        {filtered.flatMap((cat) => {
          const Icon = ICON_MAP[cat.icon] ?? Circle;
          const count = getCategoryTokenCount(cat.id);
          const items = [renderCategoryButton(cat.id, cat.label, Icon, count)];
          if (selectedTab === 'core' && cat.id === 'typography') {
            items.push(
              renderCategoryButton(
                'shape',
                'Shape',
                Hexagon,
                shapeModifiedCount
              )
            );
          }
          return items;
        })}
      </nav>

      <div className="shrink-0 border-t border-[var(--color-sidebar-border)] px-3 py-3 text-center text-[11px] text-[var(--color-sidebar-muted)]">
        {COLOUR_TOKEN_COUNT} colour · {FONT_TOKEN_COUNT} font tokens
      </div>
    </aside>
  );
}
