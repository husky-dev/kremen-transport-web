// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC, useEffect } from 'react';

interface Props {
  readonly title?: string;
}

export const PageTitle: FC<Props> = ({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} | #Husky.Dev` : '#Husky.Dev';
  }, [title]);
  return null;
};

export default PageTitle;
