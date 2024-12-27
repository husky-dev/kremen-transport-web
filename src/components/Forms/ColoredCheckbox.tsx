import React, { FC, SyntheticEvent } from 'react';
import { colors, ms, Styles, StyleProps, mc } from '@/utils';

interface Props extends StyleProps {
  size?: number;
  color?: string;
  checked?: boolean;
  onChange: (val: boolean) => void;
}

export const FormColoredCheckbox: FC<Props> = ({ className, style, checked, color, size = 20, onChange }) => {
  const onClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    onChange(checked ? false : true);
  };
  const styles = getStyles(color);
  const cstyle = ms({ width: size, height: size }, styles.container, style);
  return (
    <div className={mc('flex flex-row justify-center items-center', 'rounded-md', className)} style={cstyle} onClick={onClick}>
      {checked && <span className="rounded-sm" style={styles.sqr} />}
    </div>
  );
};

const getStyles = (color: string = colors.red): Styles => ({
  container: {
    cursor: 'pointer',
    boxSizing: 'border-box',
    border: `3px solid ${color}`,
    userSelect: 'none',
  },
  sqr: {
    display: 'block',
    width: 10,
    height: 10,
    backgroundColor: color,
    cursor: 'pointer',
    userSelect: 'none',
  },
});

export default FormColoredCheckbox;
