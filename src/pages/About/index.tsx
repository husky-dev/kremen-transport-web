import { Markdown, PageContainer, PageContent, PageTitle } from '@/components/Layout';
import { mc, StyleProps, TestIdProps } from '@/utils';
import React, { FC } from 'react';

import content from './content.md';
import { IconBtn } from '@/components/Buttons';
import { routes } from '../routes';

type Props = StyleProps & TestIdProps;

export const AboutPage: FC<Props> = ({ testId, className, style }) => {
  const title = 'Про додаток';
  return (
    <>
      <PageTitle title={title} />
      <PageContainer testId={testId} className={mc(className)} style={style}>
        <PageContent
          className="w-full max-w-3xl"
          title={
            <div className={mc('flex flex-row items-center', 'space-x-2')}>
              <IconBtn square icon="chevron-left" color="neutral" to={routes.index} />
              <div>{title}</div>
            </div>
          }
        >
          <Markdown content={content} prose />
        </PageContent>
      </PageContainer>
    </>
  );
};

export default AboutPage;
