import { isString } from 'lodash';
import React, { FC } from 'react';

export const Markdown: FC = ({ children }) => {
  return <div dangerouslySetInnerHTML={isString(children) ? { __html: children } : undefined} />;
};

export default Markdown;
