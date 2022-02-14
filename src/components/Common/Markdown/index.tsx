import { isStr } from '@utils';
import React, { FC } from 'react';

export const Markdown: FC = ({ children }) => {
  return <div dangerouslySetInnerHTML={isStr(children) ? { __html: children } : undefined} />;
};

export default Markdown;
