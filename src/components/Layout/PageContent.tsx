import { mc, StyleProps, TestIdProps } from '@/utils';
import React, { FC, PropsWithChildren, ReactElement, ReactNode } from 'react';

interface Props extends StyleProps, TestIdProps, PropsWithChildren {
  contentClassName?: string;
  title?: string | ReactNode | ReactElement | JSX.Element;
  backgroundColor?: 'bg-base-100' | 'bg-base-200' | 'bg-base-300';
  renderHeaderRight?: () => ReactNode;
  renderSubheader?: () => ReactNode;
}

export const PageContent: FC<Props> = ({
  testId,
  className,
  contentClassName,
  style,
  title,
  backgroundColor = 'bg-base-300',
  children,
  renderHeaderRight,
  renderSubheader,
}) => {
  return (
    <div data-testid={testId} style={style} className={mc('card', 'shadow-xl', backgroundColor, 'p-4 md:p-6 w-full', className)}>
      {(!!title || !!renderSubheader) && (
        <>
          <div className="space-y-4">
            {/** Title */}
            <div className={mc('flex', 'flex-col space-y-2 ', 'md:flex-row md:justify-between md:items-center md:space-y-0')}>
              {title ? <div className="flex-1 text-xl font-semibold">{title}</div> : null}
              {renderHeaderRight && renderHeaderRight()}
            </div>
            {/** Title */}
            {/** Subheader */}
            {renderSubheader && renderSubheader()}
            {/** Subheader */}
          </div>
          <div className="divider mt-2" />
        </>
      )}
      <div className={mc('w-full', contentClassName)}>{children}</div>
    </div>
  );
};

export default PageContent;
