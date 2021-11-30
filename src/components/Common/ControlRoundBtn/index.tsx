import { Fab } from '@material-ui/core';
import React, { FC } from 'react';
import { ViewStyleProps } from '@styles';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import PlusIcon from '@material-ui/icons/Add';
import MinusIcon from '@material-ui/icons/Remove';

interface Props extends ViewStyleProps {
  icon: ControlRoundBtnIcon;
  onClick?: () => void;
}

type ControlRoundBtnIcon = 'target' | 'plus' | 'minus';

export const ControlRoundBtn: FC<Props> = ({ style, icon, onClick }) => {
  return (
    <Fab style={style} size="small" color="primary" onClick={onClick}>
      {icon === 'target' && <MyLocationIcon />}
      {icon === 'plus' && <PlusIcon />}
      {icon === 'minus' && <MinusIcon />}
    </Fab>
  );
};

export default ControlRoundBtn;
