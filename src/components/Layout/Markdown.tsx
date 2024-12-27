/* eslint-disable react/no-danger */
import { isStr, mc, StyleProps, TestIdProps } from '@/utils';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import React, { FC, useEffect, useState } from 'react';

interface Props extends StyleProps, TestIdProps {
  content?: string;
  prose?: boolean;
}

export const Markdown: FC<Props> = ({ testId, className, style, content, prose = false }) => {
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    if (!content) return setHtml('');
    const parsed = marked.parse(content);
    if (isStr(parsed)) {
      setHtml(
        DOMPurify.sanitize(parsed, {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: ['target', 'allow', 'allowfullscreen', 'frameborder', 'scrolling'],
        }),
      );
    }
  }, [content]);

  return (
    <div
      data-testid={testId}
      className={mc(className, prose && 'prose')}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Markdown;
