'use client';

import { DEFAULT_THEME } from '@/lib/theme-editor/default-theme';
import { TOKEN_CATEGORIES } from '@/lib/theme-editor/token-categories';
import { getCategoryTokenCount } from '@/lib/theme-editor/theme-editor.utils';
import { useThemeEditorStore } from '@/stores/theme-editor.store';
import { FontEditor } from '@/components/theme-editor/FontEditor';
import { TokenRow } from '@/components/theme-editor/TokenRow';

export function TokenList() {
  const selectedCategoryId = useThemeEditorStore((s) => s.selectedCategoryId);
  const category = TOKEN_CATEGORIES.find((c) => c.id === selectedCategoryId);
  const resetCategory = useThemeEditorStore((s) => s.resetCategory);
  /** Subscribe to overrides map — not getTokenValue / isTokenModified (stable fn refs). */
  const colourOverrides = useThemeEditorStore((s) => s.colourOverrides);
  const selectedTokenKey = useThemeEditorStore((s) => s.selectedTokenKey);
  const selectToken = useThemeEditorStore((s) => s.selectToken);
  const resetToken = useThemeEditorStore((s) => s.resetToken);

  if (!category) return null;

  const count = getCategoryTokenCount(category.id);
  const isTypography = category.id === 'typography';

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 flex-row items-center justify-between border-b border-[#E2E8F0] bg-white px-4 py-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[#0F172A]">{category.label}</h2>
          <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 font-mono text-[11px] text-[#64748B]">
            {count} tokens
          </span>
        </div>
        <button
          type="button"
          onClick={() => resetCategory(selectedCategoryId)}
          className="text-[13px] font-medium text-[#DC2626] hover:underline"
        >
          Reset category
        </button>
      </header>

      {isTypography ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
          <FontEditor />
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto bg-[#F9FAFB]">
          {category.subcategories.map((sub) => (
            <section key={sub.label}>
              <h3 className="mb-2 px-4 pt-4 pb-2 text-[10px] font-medium tracking-[0.2em] text-[#9CA3AF] uppercase">
                {sub.label}
              </h3>
              <div className="bg-white">
                {sub.tokens.map((tokenKey) => (
                  <TokenRow
                    key={tokenKey}
                    tokenKey={tokenKey}
                    value={
                      colourOverrides[tokenKey] ??
                      DEFAULT_THEME[tokenKey] ??
                      '#000000'
                    }
                    isModified={
                      Object.prototype.hasOwnProperty.call(
                        colourOverrides,
                        tokenKey
                      )
                    }
                    isSelected={selectedTokenKey === tokenKey}
                    onSelect={() => selectToken(tokenKey)}
                    onReset={() => resetToken(tokenKey)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
