import { getStorage } from '@/utils/storage';
import React, { createContext, FC, PropsWithChildren, useContext, useMemo, useState } from 'react';
import z from 'zod';

const ThemeSchema = z.enum(['light', 'dark']);

type Theme = z.infer<typeof ThemeSchema>;

const isTheme = (val: unknown): val is Theme => ThemeSchema.safeParse(val).success;

interface Context {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<Context>({
  theme: 'dark',
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const storage = getStorage<Theme>({
  key: 'kremen:theme',
  version: 1,
  guard: isTheme,
});

export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(storage.get() || 'dark');

  const handleSetTeme = (theme: Theme) => {
    setTheme(theme);
    storage.set(theme);
  };

  const value = useMemo(() => ({ theme, setTheme: handleSetTeme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
