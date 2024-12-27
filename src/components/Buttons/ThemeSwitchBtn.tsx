import { mc, StyleProps, TestIdProps } from '@/utils';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import React, { FC } from 'react';

import { useTheme } from '../Layout';

type Props = StyleProps & TestIdProps;

export const ThemeSwitchBtn: FC<Props> = ({ testId, className, style }) => {
  const { theme, setTheme } = useTheme();
  return (
    <label data-testid={testId} className={mc('swap swap-rotate', className)} style={style}>
      <input
        type="checkbox"
        className="theme-controller"
        value="light"
        checked={theme === 'light'}
        onChange={e => setTheme(e.target.checked ? 'light' : 'dark')}
      />
      <SunIcon className="swap-on fill-current w-5 h-5" />
      <MoonIcon className="swap-off fill-current w-5 h-5" />
    </label>
  );
};

export default ThemeSwitchBtn;
