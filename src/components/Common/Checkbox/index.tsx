import React, { FC, SyntheticEvent } from 'react';
import { colors, m, Styles, ViewStyleProps } from '@styles';

import View from '../View';

interface Props extends ViewStyleProps {
  size?: number;
  color?: string;
  checked?: boolean;
  onChange: (val: boolean) => void;
}

export const Checkbox: FC<Props> = ({ style, checked, color, size = 20, onChange }) => {
  const onClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    onChange(checked ? false : true);
  };
  const styles = getStyles(color);
  const cstyle = m({ width: size, height: size }, styles.container, style);
  return (
    <View style={cstyle} row={true} justifyContent="center" alignItems="center" onClick={onClick}>
      {checked && <span style={styles.sqr} />}
    </View>
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

export default Checkbox;
