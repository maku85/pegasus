// The Navigation API, missing from TypeScript's types and from older browsers
interface NavigationApi {
  canGoBack: boolean;
  currentEntry: { key: string } | null;
}

export const getNavigation = () =>
  (window as Window & { navigation?: NavigationApi }).navigation;
