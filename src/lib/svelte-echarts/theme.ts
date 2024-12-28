import type { EChartsOption } from 'echarts';

// These need to be synced with css color vars from app.css
export interface ThemeData {
  background: string
  foreground: string
  muted: string
  mutedForeground: string
  popover: string
  popoverForeground: string
  card: string
  cardForeground: string
  border: string
  input: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  ring: string
}

export const lightTheme: ThemeData = {
  background: "hsl(0 0% 100%)",
  foreground: "hsl(222.2 84% 4.9%)",
  muted: "hsl(210 40% 96.1%)",
  mutedForeground: "hsl(215.4 16.3% 46.9%)",
  popover: "hsl(0 0% 100%)",
  popoverForeground: "hsl(222.2 84% 4.9%)",
  card: "hsl(0 0% 100%)",
  cardForeground: "hsl(222.2 84% 4.9%)",
  border: "hsl(214.3 31.8% 91.4%)",
  input: "hsl(214.3 31.8% 91.4%)",
  primary: "hsl(222.2 47.4% 11.2%)",
  primaryForeground: "hsl(210 40% 98%)",
  secondary: "hsl(210 40% 96.1%)",
  secondaryForeground: "hsl(222.2 47.4% 11.2%)",
  accent: "hsl(210 40% 96.1%)",
  accentForeground: "hsl(222.2 47.4% 11.2%)",
  destructive: "hsl(0 72.2% 50.6%)",
  destructiveForeground: "hsl(210 40% 98%)",
  ring: "hsl(222.2 84% 4.9%)",
}

export const darkTheme: ThemeData = {
  background: "hsl(222.2, 84%, 4.9%)",
  foreground: "hsl(210, 40%, 98%)",
  muted: "hsl(217.2, 32.6%, 17.5%)",
  mutedForeground: "hsl(215, 20.2%, 65.1%)",
  popover: "hsl(222.2, 84%, 4.9%)",
  popoverForeground: "hsl(210, 40%, 98%)",
  card: "hsl(222.2, 84%, 4.9%)",
  cardForeground: "hsl(210, 40%, 98%)",
  border: "hsl(217.2, 32.6%, 17.5%)",
  input: "hsl(217.2, 32.6%, 17.5%)",
  primary: "hsl(210, 40%, 98%)",
  primaryForeground: "hsl(222.2, 47.4%, 11.2%)",
  secondary: "hsl(217.2, 32.6%, 17.5%)",
  secondaryForeground: "hsl(210, 40%, 98%)",
  accent: "hsl(217.2, 32.6%, 17.5%)",
  accentForeground: "hsl(210, 40%, 98%)",
  destructive: "hsl(0, 62.8%, 30.6%)",
  destructiveForeground: "hsl(210, 40%, 98%)",
  ring: "hsl(212.7, 26.8%, 83.9%)",
}

export function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export function deepMerge<T extends Object>(target: T, ...sources: T[]): T {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key] as any, source[key] as any);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return deepMerge(target, ...sources);
}

function mergeObject<T>(themeObj: any, configObj?: T): T | undefined {
  if (!configObj) return themeObj;

  return deepMerge(themeObj, configObj);
}

function mergeArray<T>(themeObj: any, configObjs?: T[]): T[] | undefined {
  if (!configObjs) return configObjs;

  return configObjs.map(o => mergeObject(themeObj, o)!);
}

function mergeArrayOrObj<T>(themeObj: Partial<T>, configObjs?: T | T[]): T | T[] | undefined {
  if (!configObjs) return configObjs;

  if (configObjs instanceof Array) {
    return mergeArray(themeObj, configObjs);
  }

  return mergeObject(themeObj, configObjs);
}

export function applyTheme(options: EChartsOption, theme: ThemeData): EChartsOption {
  return {
    ...options,
    backgroundColor: theme.background,
    color: theme.foreground,
    textStyle: mergeObject({ color: theme.foreground }, options.textStyle),
    grid: mergeArrayOrObj({ backgroundColor: theme.background }, options.grid),
    title: mergeArrayOrObj({ textStyle: { color: theme.foreground } }, options.title),
    tooltip: mergeArrayOrObj({
      backgroundColor: theme.card,
      borderColor: theme.border,
      textStyle: {
        color: theme.cardForeground,
      },
    }, options.tooltip),
  }
}
