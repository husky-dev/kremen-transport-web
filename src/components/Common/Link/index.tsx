import React, { FC, SyntheticEvent } from 'react';
import { colors, m, Styles, ViewStyleProps } from '@styles';

interface Props extends ViewStyleProps {
  href?: string;
  target?: string;
  onClick?: () => void;
}

export const Link: FC<Props> = ({ style, href, children, target = '__blank', onClick }) => {
  const handleClick = (e: SyntheticEvent) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };

  return (
    <a style={m(styles.link, style)} href={href} target={target} onClick={handleClick}>
      {children}
    </a>
  );
};

const styles: Styles = {
  link: {
    fontWeight: 'bold',
    color: colors.red,
    borderBottom: `1px dashed ${colors.red}`,
    cursor: 'pointer',
  },
};

export default Link;
