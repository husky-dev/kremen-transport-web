import { clearRouteNumber, offlineColors } from '@core';
import { TransportBus, TransportRoute, TransportType } from '@core/api';
import { ColorsSet } from '@styles';
import React, { FC, useMemo } from 'react';
import { Marker } from 'react-google-maps';

import iconPinLeft1 from './assets/pinLeft1.svg.txt';
import iconPinLeft2 from './assets/pinLeft2.svg.txt';
import iconPinLeft3 from './assets/pinLeft3.svg.txt';
import iconPinLeft4 from './assets/pinLeft4.svg.txt';
import iconPinRight1 from './assets/pinRight1.svg.txt';
import iconPinRight2 from './assets/pinRight2.svg.txt';
import iconPinRight3 from './assets/pinRight3.svg.txt';
import iconPinRight4 from './assets/pinRight4.svg.txt';
import iconTrolleybusLeft from './assets/trolleybusLeft.svg.txt';
import iconTrolleybusRight from './assets/trolleybusRight.svg.txt';
import BusPopup from './components/BusPopup';

interface Props {
  bus: TransportBus;
  route?: TransportRoute;
  width?: number;
  height?: number;
  colors: ColorsSet;
  opacity?: number;
  zIndex?: number;
  popupOpen?: boolean;
  onClick?: (bus: TransportBus) => void;
  onPopupClose: (bus: TransportBus) => void;
}

const getIconCode = (bus: TransportBus, route: TransportRoute | undefined, colors: ColorsSet) => {
  const { light, dark } = colors;
  const { direction } = bus;
  const rotate = direction + 180;
  const type = direction <= 180 ? 'left' : 'right';
  const rotateStr = `rotate(${rotate} ${type === 'right' ? 23 : 23 + 12} 23)`;
  const label = clearRouteNumber(route?.number || '');
  let code = '';
  if (label.length === 1) code = type === 'left' ? iconPinLeft1 : iconPinRight1;
  if (label.length === 2) code = type === 'left' ? iconPinLeft2 : iconPinRight2;
  if (label.length === 3) code = type === 'left' ? iconPinLeft3 : iconPinRight3;
  if (label.length === 4) code = type === 'left' ? iconPinLeft4 : iconPinRight4;
  if (bus.type === TransportType.Trolleybus) {
    const icon = type === 'left' ? iconTrolleybusLeft : iconTrolleybusRight;
    code = code.replace(/<path id="transport"[\s\S]+?\/>/g, icon);
  }
  code = code
    .replace(/#8E3339/g, dark)
    .replace(/#E0535D/g, light)
    .replace(/<tspan([\s\S]+?)>([\s\S]+?)<\/tspan>/g, `<tspan$1>${encodeLabelText(label)}</tspan>`)
    .replace(/<g id="pin">/g, `<g id="pin" transform="${rotateStr}">`);
  return code;
};

const encodeLabelText = (label: string) => unescape(encodeURIComponent(label));

export const BusMarker: FC<Props> = ({
  onClick,
  bus,
  route,
  popupOpen,
  colors,
  opacity = 1.0,
  zIndex = 20,
  onPopupClose,
}) => {
  const handleClick = () => {
    if (onClick) onClick(bus);
  };

  const handlePopupClose = () => {
    onPopupClose(bus);
  };

  const { lat, lng } = bus;
  const iconCode = `data:image/svg+xml;base64,${btoa(getIconCode(bus, route, bus.offline ? offlineColors : colors))}`;
  return useMemo(
    () => (
      <Marker
        position={{ lat, lng }}
        title={bus.name}
        icon={{
          url: iconCode,
          anchor: new google.maps.Point(23, Math.round(46 / 2)),
        }}
        zIndex={zIndex}
        opacity={opacity}
        onClick={handleClick}
      >
        {popupOpen && <BusPopup bus={bus} route={route} onClose={handlePopupClose} />}
      </Marker>
    ),
    [lat, lng, opacity, zIndex, popupOpen, bus.offline, bus.direction],
  );
};

export default BusMarker;
