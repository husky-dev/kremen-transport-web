import { createTheme, Theme } from '@material-ui/core/styles';
import { useTheme as useMuiTheme } from '@material-ui/styles';

import { colors } from './colors';

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
  },
});

export const useTheme = () => useMuiTheme<Theme>();
