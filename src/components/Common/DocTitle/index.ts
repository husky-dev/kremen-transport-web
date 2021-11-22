import { FC, useEffect } from 'react';

interface Props {
  title?: string;
}

export const DocTitle: FC<Props> = ({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_COMPANY}` : `${APP_TITLE} | ${APP_COMPANY}`;
  });
  return null;
};

export default DocTitle;
