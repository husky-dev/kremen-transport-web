import { List, Popover, Typography } from '@material-ui/core';
import IconDown from '@material-ui/icons/KeyboardArrowDown';
import IconUp from '@material-ui/icons/KeyboardArrowUp';
import { View } from 'components/Common';
import { defServices, serviceIdToTitle } from 'core/services';
import React, { FC, MouseEvent, useState } from 'react';
import { Styles, ViewStyleProps } from 'styles';

import ServiceListItem from './components/ListItem';

interface Props extends ViewStyleProps {
  current: string;
}

export const ServicesDropdown: FC<Props> = ({ style, current }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | undefined>(undefined);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <>
      <View style={[styles.container, style]} row={true} alignItems="center" onClick={handleClick}>
        <Typography variant="h6">{serviceIdToTitle(current)}</Typography>
        {!!anchorEl ? <IconUp style={styles.icon} /> : <IconDown style={styles.icon} />}
      </View>
      <Popover
        anchorEl={anchorEl}
        keepMounted
        open={!!anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => setAnchorEl(undefined)}
      >
        <List component="nav">
          {defServices.map(itm => (
            <ServiceListItem key={itm.id} item={itm} />
          ))}
        </List>
      </Popover>
    </>
  );
};

const styles: Styles = {
  container: {},
  icon: {
    position: 'relative',
    marginLeft: 4,
    top: 1,
    fontSize: '30px',
  },
};

export default ServicesDropdown;
