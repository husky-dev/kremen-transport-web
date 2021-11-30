import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { withStyles } from '@material-ui/core/styles';
import React, { FC } from 'react';
import { ViewStyleProps } from '@styles';

import DialogTitle from './components/Title';

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

interface Props extends ViewStyleProps {
  title?: string;
  visible?: boolean;
  actions?: AlertDialogAction[];
  onClose?: () => void;
}

interface AlertDialogAction {
  title: string;
  autoFocus?: boolean;
  color?: 'inherit' | 'primary' | 'secondary' | 'default';
  onPress?: () => void;
}

export const AlertDialog: FC<Props> = ({ style, title, visible = false, actions, children, onClose }) => {
  return (
    <Dialog style={style} onClose={onClose} open={visible}>
      {!!title && <DialogTitle onClose={onClose}>{title}</DialogTitle>}
      <DialogContent dividers>{children}</DialogContent>
      {!!actions && actions.length && (
        <DialogActions>
          {actions.map((itm, key) => (
            <Button key={key} autoFocus={itm.autoFocus} onClick={itm.onPress} color={itm.color}>
              {itm.title}
            </Button>
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};
