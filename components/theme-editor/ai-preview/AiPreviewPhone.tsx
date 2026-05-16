'use client';

import { PhoneFrame } from './PhoneFrame';
import { HomeSlide } from './slides/HomeSlide';
import { TypographySlide } from './slides/TypographySlide';
import { ButtonsSlide } from './slides/ButtonsSlide';
import { StatusSlide } from './slides/StatusSlide';
import { NavigationSlide } from './slides/NavigationSlide';

type Slide = 'home' | 'typography' | 'buttons' | 'status' | 'navigation';

type Props = {
  tokens: Record<string, string>;
  slide: Slide;
};

const SLIDE_MAP = {
  home: HomeSlide,
  typography: TypographySlide,
  buttons: ButtonsSlide,
  status: StatusSlide,
  navigation: NavigationSlide,
};

export function AiPreviewPhone({ tokens, slide }: Props) {
  const SlideComponent = SLIDE_MAP[slide];
  return (
    <PhoneFrame>
      <SlideComponent tokens={tokens} />
    </PhoneFrame>
  );
}
