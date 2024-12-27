/* eslint-disable max-len */
import React, { FC } from 'react';
import { LatLng, colorSetFromColor, colors } from '@/utils';
import { Marker } from '@vis.gl/react-google-maps';

interface Props {
  position: LatLng;
  title?: string;
  size?: number;
  opacity?: number;
  zIndex?: number;
  onClick?: () => void;
}

export const CurPositionMarker: FC<Props> = ({ position, opacity = 1.0, zIndex = 1, size = 38, title, onClick }) => {
  const getIconUri = () => {
    const curColors = colorSetFromColor(colors.primary);
    const iconCode = btoa(`<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${size}px" height="${size}px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <g stroke="none" stroke-width="1.3" fill="none" fill-rule="evenodd">
        <path d="M19,6.5 C22.4517797,6.5 25.5767797,7.89911016 27.8388348,10.1611652 C30.1008898,12.4232203 31.5,15.5482203 31.5,19 C31.5,21.4500858 30.7952391,23.7355981 29.5770839,25.6646471 C28.2975477,27.6908979 26.4519504,29.3240435 24.2623333,30.3417702 L24.2623333,30.3417702 L19.0000449,37.1800813 L13.7396607,30.3426968 C11.5494936,29.3251853 9.70338629,27.6919956 8.42348348,25.6655455 C7.2049798,23.7363077 6.5,21.4504662 6.5,19 C6.5,15.5482203 7.89911016,12.4232203 10.1611652,10.1611652 C12.4232203,7.89911016 15.5482203,6.5 19,6.5 Z" id="icon-pin" stroke="${curColors.dark}" fill="${curColors.light}"></path>
        <path d="M18.917653,9 C18.0124963,9 17.2797504,9.73328467 17.2797504,10.6382675 C17.2799242,11.5425552 18.0126701,12.2761701 18.917653,12.2761701 C19.8217669,12.2761701 20.555208,11.5425552 20.555208,10.6382675 C20.555208,9.73311087 19.8217669,9 18.917653,9 L18.917653,9 Z M17.1083824,12.6964041 C15.9487808,12.6964041 15,13.6361472 15,14.7941846 L15,19.8743939 C15,20.2697916 15.311278,20.5909762 15.7073709,20.5909762 C16.1036377,20.5909762 16.4246485,20.2701392 16.4246485,19.8743939 L16.4246485,15.2938631 L16.7899786,15.2938631 C16.7899786,15.2938631 16.7983211,27.2532979 16.7983211,28.0388793 C16.7983211,28.568973 17.2290005,29 17.7597894,29 C18.2902306,29 18.720041,28.568973 18.720041,28.0388793 L18.720041,20.6382502 L19.1145698,20.6382502 L19.1145698,28.0388793 C19.1145698,28.568973 19.5443801,29 20.0758642,29 C20.6066531,29 21.0402871,28.568973 21.0402871,28.0388793 L21.0402871,15.2938631 L21.4099623,15.2938631 L21.4099623,19.8743939 C21.4099623,20.2697916 21.7314945,20.5909762 22.1270661,20.5909762 C22.5233328,20.5909762 22.8349584,20.2701392 22.8349584,19.8743939 L22.8349584,14.7941846 C22.8349584,13.6361472 21.8854824,12.6964041 20.7269235,12.6964041 L17.1083824,12.6964041 L17.1083824,12.6964041 Z" id="Shape" fill="#FFFFFF" fill-rule="nonzero"></path>
      </g>
  </svg>
  `);
    return `data:image/svg+xml;base64,${iconCode}`;
  };

  return (
    <Marker
      position={position}
      zIndex={zIndex}
      opacity={opacity}
      title={title}
      icon={{
        url: getIconUri(),
        anchor: new google.maps.Point(Math.round(size / 2), Math.round(size / 2)),
      }}
      onClick={onClick}
    />
  );
};

export default CurPositionMarker;
