import { IconBtn } from '@/components/Buttons';
import { Markdown, PageContainer, PageContent, PageTitle } from '@/components/Layout';
import { mc, StyleProps, TestIdProps } from '@/utils';
import React, { FC } from 'react';

interface Props extends StyleProps, TestIdProps {
  title: string;
  content: string;
}

export const ContentPage: FC<Props> = ({ testId, className, style, title, content }) => {
  return (
    <>
      <PageTitle title={title} />
      <PageContainer testId={testId} className={mc(className)} style={style}>
        <PageContent
          className="w-full max-w-3xl"
          title={
            <div className={mc('flex flex-row items-center', 'space-x-2')}>
              <IconBtn square icon="chevron-left" color="neutral" to="/" />
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

export default ContentPage;
