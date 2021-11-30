import { View } from '@components/Common';
import { RouteCircle } from '@components/Transport';
import { TransportBus, TransportRoute } from '@core/api';
import React, { FC } from 'react';
import { InfoWindow } from 'react-google-maps';
import { m, Styles, ViewStyleProps } from '@styles';

interface Props extends ViewStyleProps {
  bus: TransportBus;
  route?: TransportRoute;
  onClose: () => void;
}

export const BusPopup: FC<Props> = ({ style, bus, onClose, route }) => {
  const title = `${bus.name}`;
  return (
    <InfoWindow onCloseClick={onClose}>
      <View style={m(styles.container, style)}>
        <View row={true} justifyContent="flex-start" alignItems="center">
          {route && <RouteCircle style={styles.circle} route={route} size={20} />}
          <View style={styles.title}>{title}</View>
        </View>
      </View>
    </InfoWindow>
  );
};

const styles: Styles = {
  container: {
    width: 140,
  },
  circle: {
    marginRight: 5,
  },
  title: {
    fontWeight: 'bold',
  },
};

export default BusPopup;
