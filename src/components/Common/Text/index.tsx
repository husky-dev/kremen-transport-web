import { m, MergeStyleVal, px, Style } from '@styles';
import { isArr, isNum } from '@utils';
import React, { FC } from 'react';

interface Props {
  className?: string;
  style?: Style | MergeStyleVal[];
  block?: boolean;
  size?: number | string;
  bold?: boolean;
  color?: string;
  content?: string;
}

export const Text: FC<Props> = ({ className, style, size, block, children, color, bold, content }) => {
  const getSizeStyle = (): Style | undefined => {
    if (!size) {
      return undefined;
    }
    if (isNum(size)) {
      return { fontSize: px(size) };
    }
    return { fontSize: size };
  };

  const finalStyle = m(
    block && { display: 'block ' },
    getSizeStyle(),
    color ? { color } : undefined,
    bold ? { fontWeight: 'bold' } : undefined,
    isArr(style) ? m(...style) : style,
  );
  return (
    <span className={className} style={finalStyle}>
      {content || children}
    </span>
  );
};

export default Text;
