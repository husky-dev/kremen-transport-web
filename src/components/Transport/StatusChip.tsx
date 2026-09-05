import { mc, ms, StyleProps, TestIdProps } from '@/utils';
import React, { FC } from 'react';

export type ConnectionStatus = 'ok' | 'error' | 'offline';

interface Props extends StyleProps, TestIdProps {
  readonly status: ConnectionStatus;
  /** Header variant used on mobile: sits on an existing surface and hides the label while all is well */
  readonly compact?: boolean;
}

const statusToLabel = (status: ConnectionStatus): string => {
  if (status === 'ok') return 'Онлайн';
  if (status === 'error') return 'Сервіс Infobus недоступний';
  return 'Немає з\'єднання';
};

export const StatusChip: FC<Props> = ({ testId, className, style, status, compact }) => {
  const label = statusToLabel(status);
  return (
    <div
      data-testid={testId}
      style={ms(style)}
      className={mc(
        'flex flex-row items-center gap-1.5 min-w-0',
        'text-xs text-base-content/70',
        !compact && 'rounded-full px-3 py-1.5 bg-base-100 shadow',
        className,
      )}
      title={label}
      aria-label={label}
    >
      <span className={mc('shrink-0 w-2 h-2 rounded-full', status === 'ok' ? 'bg-success' : 'bg-error')} />
      {(!compact || status !== 'ok') && <span className={mc(compact ? 'truncate' : 'whitespace-nowrap')}>{label}</span>}
    </div>
  );
};

export default StatusChip;
