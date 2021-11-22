/* eslint-disable max-len */
import { TransportRoute, TransportStation } from 'core/api';
import React, { FC, useMemo } from 'react';
import { Marker } from 'react-google-maps';

import StationPopup from './components/StationPopup';

interface Props {
  station: TransportStation;
  popupOpen?: boolean;
  size?: number;
  route?: TransportRoute;
  selectedRoutes: number[];
  onClick?: (station: TransportStation) => void;
  onPopupClose: (station: TransportStation) => void;
}

const getIconCode = (size: number) => {
  const fill = '#5097D5';
  const stroke = '#FFFFFF';
  const strokeWidth = 1.5;
  const iconCode = btoa(`<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${size}px" height="${size}px" viewBox="0 0 10 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="Transport" stroke="none" stroke-width="${strokeWidth}" fill="none" fill-rule="evenodd">
      <g id="Icons" fill="${fill}" stroke="${stroke}">
        <circle id="icon-station" cx="5" cy="5" r="${5 - strokeWidth / 2}"></circle>
      </g>
  </g>
</svg>
  `);
  return `data:image/svg+xml;base64,${iconCode}`;
};

export const StationMarker: FC<Props> = ({
  station,
  onClick,
  popupOpen,
  route,
  size = 12,
  selectedRoutes,
  onPopupClose,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(station);
    }
  };

  const handlePopupClose = () => {
    onPopupClose(station);
  };

  const { lat, lng } = station;
  return useMemo(
    () => (
      <Marker
        position={{ lat, lng }}
        title={station.name}
        icon={{
          url: getIconCode(size),
          anchor: new google.maps.Point(Math.round(size / 2), Math.round(size / 2)),
        }}
        zIndex={10}
        onClick={handleClick}
      >
        {popupOpen && (
          <StationPopup station={station} route={route} selectedRoutes={selectedRoutes} onClose={handlePopupClose} />
        )}
      </Marker>
    ),
    [lat, lng, popupOpen, selectedRoutes, size],
  );
};

export default StationMarker;
