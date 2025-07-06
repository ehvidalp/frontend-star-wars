export enum NavigationSection {
  START = 'start',
  PLANETS = 'planets'
}
export enum NavigationTarget {
  WELCOME = 'welcome-section',
  PLANETS_LIST = 'planets-list-section'
}
export interface NavigationItem {
  id: NavigationSection;
  label: string;
  ariaLabel: string;
  targetId: NavigationTarget;
  icon?: string;
  shortcut?: string;
}
export interface NavigationButtonConfig {
  id: string;
  label: string;
  ariaLabel: string;
  icon?: string;
  variant: 'primary' | 'back' | 'secondary';
  isActive?: boolean;
}
export interface ScrollTarget {
  elementId: string;
  behavior: ScrollBehavior;
  block: ScrollLogicalPosition;
}
export const SCROLL_OPTIONS = {
  behavior: 'smooth' as ScrollBehavior,
  block: 'start' as ScrollLogicalPosition,
  inline: 'nearest' as ScrollLogicalPosition
} as const;
export const INTERSECTION_OPTIONS = {
  root: null,
  rootMargin: '-50% 0px -50% 0px',
  threshold: 0
} as const;
export const ANIMATION_DELAYS = {
  NAVIGATION_DELAY: 100,
  SECTION_REVEAL_DELAY: 200,
  CLICK_ANIMATION_DURATION: 300
} as const;
