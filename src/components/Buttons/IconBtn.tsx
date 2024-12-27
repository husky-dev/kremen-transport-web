/* eslint-disable react/button-has-type */
import { mc, StyleProps, TestIdProps } from '@/utils';
import { ChevronLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React, { FC, MouseEventHandler } from 'react';
import { Link } from 'react-router-dom';

interface Props extends StyleProps, TestIdProps {
  color?: FormControlColor;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon: IconBtnIcon;
  type?: 'submit' | 'reset' | 'button';
  active?: boolean;
  round?: boolean;
  square?: boolean;
  processing?: boolean;
  disabled?: boolean;
  tooltip?: string;
  to?: string;
  state?: unknown;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

type FormControlColor = 'primary' | 'secondary' | 'accent' | 'warning' | 'success' | 'error' | 'info' | 'neutral';

type IconBtnIcon =
  | 'x-mark'
  | 'check'
  | 'plus'
  | 'nova-poshta'
  | 'clipboard'
  | 'archive-box-arrow-down'
  | 'archive-box'
  | 'package'
  | 'cog-8-tooth'
  | 'arrow-path'
  | 'list-bullet'
  | 'user'
  | 'drone'
  | 'printer'
  | 'table-cells'
  | 'power'
  | 'pencil'
  | 'chevron-left'
  | 'bolt'
  | 'wrench-screwdriver'
  | 'truck';

export const IconBtn: FC<Props> = ({
  testId,
  className,
  style,
  size = 'sm',
  icon,
  tooltip,
  round,
  square,
  active = false,
  processing = false,
  disabled = false,
  color = 'neutral',
  to,
  state,
  type: btnType = 'button',
  onClick,
}) => {
  const containerClassName = mc(
    'btn',
    round && 'btn-circle',
    square && 'btn-square',
    !active && 'btn-outline',
    disabled && 'btn-disabled',
    size === 'xs' && 'btn-xs',
    size === 'sm' && 'btn-sm',
    size === 'md' && 'btn-md',
    size === 'lg' && 'btn-lg',
    color === 'primary' && 'btn-primary',
    color === 'secondary' && 'btn-secondary',
    color === 'accent' && 'btn-accent',
    color === 'warning' && 'btn-warning',
    color === 'success' && 'btn-success',
    color === 'error' && 'btn-error',
    color === 'info' && 'btn-info',
    color === 'neutral' && 'btn-neutral',
    className,
  );
  const iconClassName = mc(
    size === 'xs' && 'w-3 h-3',
    size === 'sm' && 'w-4 h-4',
    size === 'md' && 'w-5 h-5',
    size === 'lg' && 'w-6 h-6',
  );
  const tooltipClassName = mc(
    'tooltip tooltip-top',
    color === 'primary' && 'tooltip-primary',
    color === 'secondary' && 'tooltip-secondary',
    color === 'accent' && 'tooltip-accent',
    color === 'warning' && 'tooltip-warning',
    color === 'success' && 'tooltip-success',
    color === 'error' && 'tooltip-error',
    color === 'info' && 'tooltip-info',
    color === 'neutral' && 'tooltip-neutral',
    className,
  );

  const renderBtn = () => {
    if (!!to) {
      return (
        <Link to={to} state={state} data-testid={testId} style={style} className={containerClassName} onClick={onClick}>
          {renderContent()}
        </Link>
      );
    }
    return (
      <button
        data-testid={testId}
        style={style}
        disabled={disabled}
        className={containerClassName}
        type={btnType}
        onClick={onClick}
      >
        {renderContent()}
      </button>
    );
  };

  const renderContent = () => (processing ? renderSpinner() : renderIcon());

  const renderSpinner = () => <span className="loading loading-spinner loading-xs" />;

  const renderIcon = () => (
    <>
      {icon === 'x-mark' && <XMarkIcon className={iconClassName} />}
      {icon === 'plus' && <PlusIcon className={iconClassName} />}
      {icon === 'chevron-left' && <ChevronLeftIcon className={iconClassName} />}
    </>
  );

  return !tooltip ? (
    renderBtn()
  ) : (
    <div data-testid={testId} style={style} className={tooltipClassName} data-tip={tooltip}>
      {renderBtn()}
    </div>
  );
};

export default IconBtn;
