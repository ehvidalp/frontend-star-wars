export type LoadingSize = 'small' | 'medium' | 'large';
export type LoadingVariant = 'primary' | 'secondary';
export interface LoadingStateConfig {
  size: LoadingSize;
  variant: LoadingVariant;
  ariaLabel: string;
}
export interface ErrorStateConfig {
  title: string;
  message: string;
  showRetryButton: boolean;
  retryText: string;
  retryLabel: string;
}
export interface EndStateConfig {
  message: string;
  ariaLabel: string;
}
