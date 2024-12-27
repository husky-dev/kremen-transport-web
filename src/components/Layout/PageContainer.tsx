import { mc, StyleProps, TestIdProps } from '@/utils';
import React, { FC, PropsWithChildren } from 'react';

interface Props extends StyleProps, TestIdProps, PropsWithChildren {
  //
}

export const PageContainer: FC<Props> = ({ testId, className, style, children }) => {
  return (
    <main
      className={mc('flex-1', 'flex flex-col items-center', 'py-2 md:py-4 px-3 md:px-6', className)}
      data-testid={testId}
      style={style}
    >
      {children}
    </main>
  );
};

export default PageContainer;
