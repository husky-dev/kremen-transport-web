import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import ServicesIcon from '@components/Services/Icon';
import { View } from '@components/Common';
import { Service } from '@core/services';
import React, { FC } from 'react';
import { m, Styles, ViewStyleProps } from '@styles';

interface Props extends ViewStyleProps {
  item: Service;
}

export const ServiceListItem: FC<Props> = ({ style, item }) => (
  <ListItem style={m(styles.container, style)} button component="a" href={item.url}>
    <ListItemIcon>
      <View style={m(styles.iconWrap, { backgroundColor: item.color })}>
        <ServicesIcon name={item.id} size={20} />
      </View>
    </ListItemIcon>
    <ListItemText primary={item.title} secondary={item.descr} />
  </ListItem>
);

const styles: Styles = {
  container: {
    maxWidth: 400,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export type ServiceListItemProps = Props;
export default ServiceListItem;
