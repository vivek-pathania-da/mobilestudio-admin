'use client';

import { PhoneFrame } from './PhoneFrame';
import { DashboardSlide } from './slides/DashboardSlide';
import { FormSlide } from './slides/FormSlide';
import { AlertsSlide } from './slides/AlertsSlide';
import { TypographySlide } from './slides/TypographySlide';
import type { AiPreviewSlide } from './types';

type Props = {
  tokens: Record<string, string>;
  radiusTokens?: Record<string, number>;
  slide: AiPreviewSlide;
};

const SLIDE_MAP = {
  dashboard: DashboardSlide,
  form: FormSlide,
  alerts: AlertsSlide,
  typography: TypographySlide,
};

export function AiPreviewPhone({ tokens, radiusTokens, slide }: Props) {
  const SlideComponent = SLIDE_MAP[slide];
  return (
    <PhoneFrame>
      <SlideComponent tokens={tokens} radiusTokens={radiusTokens} />
    </PhoneFrame>
  );
}
