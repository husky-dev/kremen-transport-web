import { createMuiTheme, Theme } from '@material-ui/core/styles';
import { useTheme as useMuiTheme } from '@material-ui/styles';

import { colors } from './colors';

export const muiTheme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
  },
});

export const useTheme = () => useMuiTheme<Theme>();
