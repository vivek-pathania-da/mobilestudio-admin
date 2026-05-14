import type { Metadata } from 'next';
import { ThemeEditorShell } from '@/components/theme-editor/ThemeEditorShell';

export const metadata: Metadata = {
  title: 'Theme Editor',
};

interface Props {
  params: Promise<{ customerId: string; themeId: string }>;
}

export default async function ThemeEditorPage({ params }: Props) {
  const { customerId, themeId } = await params;
  return (
    <ThemeEditorShell
      customerId={customerId}
      themeId={decodeURIComponent(themeId)}
      customerName={customerId}
    />
  );
}
