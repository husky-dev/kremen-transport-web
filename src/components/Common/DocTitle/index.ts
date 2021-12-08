import { config } from '@core/config';
import { FC, useEffect } from 'react';

interface Props {
  title?: string;
}

export const DocTitle: FC<Props> = ({ title }) => {
  useEffect(() => {
    document.title = title ? `${title} | ${config.title}` : `${config.title} | ${config.company}`;
  });
  return null;
};

export default DocTitle;
