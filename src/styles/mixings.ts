import { Style } from 'styles';

export const fullScreen: Style = {
  bottom: 0,
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
};

export const screenCenter: Style = {
  left: '50%',
  position: 'absolute',
  top: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
};

export const horizontalCenter: Style = {
  left: '50%',
  position: 'absolute',
  transform: 'translateX(-50%)',
};

export const threeDots: Style = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const fullFixedScreen: Style = {
  bottom: 0,
  left: 0,
  position: 'fixed',
  right: 0,
  top: 0,
};

export const formRowStyle: Style = {
  fontSize: '14px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: 4,
  paddingBottom: 4,
};
