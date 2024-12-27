// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { FC, useEffect } from 'react';

interface Props {
  title?: string;
}

export const PageTitle: FC<Props> = ({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} | #Kremen.Dev` : '#Kremen.Dev';
  }, [title]);
  return null;
};

export default PageTitle;
