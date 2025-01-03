import { StyleProps, TestIdProps } from '@/utils';
import React, { FC } from 'react';

type Props = StyleProps & TestIdProps;
// interface Props extends StyleProps, TestIdProps {
//
// }

const propsToSvgProps = ({ testId, className, style }: Props) => ({
  'data-testid': testId,
  className,
  style,
  xmlns: 'http://www.w3.org/2000/svg',
});

export const ArrowDown: FC<Props> = props => (
  <svg {...propsToSvgProps(props)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
  </svg>
);

export const ArrowUp: FC<Props> = props => (
  <svg {...propsToSvgProps(props)} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
  </svg>
);
