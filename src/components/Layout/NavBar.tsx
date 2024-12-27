import { mc, StyleProps, TestIdProps } from '@/utils';
import React, { FC } from 'react';
import { ThemeSwitchBtn } from '../Buttons';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { routes } from '@/pages/routes';
import { Link } from 'react-router-dom';

type Props = StyleProps & TestIdProps;

export const NavBar: FC<Props> = ({ testId, className, style }) => {
  return (
    <div data-testid={testId} className={mc('navbar bg-base-100', className)} style={style}>
      <div className="flex-none">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <Bars3Icon className="w-6 h-6" />
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li>
              <Link to={routes.index}>{'Мапа'}</Link>
            </li>
            <li>
              <Link to={routes.about}>{'Про додаток'}</Link>
            </li>
            <li>
              <Link to={routes.privacy}>{'Політика конфіденційності'}</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex-1">
        <h1 className="text-xl font-medium px-2">{'#Кремінь.Транспорт'}</h1>
      </div>
      <div className="flex-none">
        <ThemeSwitchBtn className="btn btn-square btn-ghost" />
      </div>
    </div>
  );
};

export default NavBar;
