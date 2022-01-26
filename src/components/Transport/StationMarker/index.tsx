/* eslint-disable max-len */
import { TransportRoute, TransportStation } from '@core/api';
import React, { FC, useMemo } from 'react';
import { Marker } from 'react-google-maps';

import StationPopup from './components/StationPopup';

interface Props {
  routes: TransportRoute[];
  station: TransportStation;
  popupOpen?: boolean;
  size?: number;
  route?: TransportRoute;
  selectedRoutes: number[];
  onClick?: (station: TransportStation) => void;
  onPopupClose: (station: TransportStation) => void;
}

const getIconCode = (size: number) => {
  const iconCode = btoa(`
  <svg width="${size}px" height="${size}px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <rect id="Rectangle" stroke="#2A569E" stroke-width="1" fill="#3E7FE8" x="0.5" y="0.5" width="19" height="19" rx="2"></rect>
    <path d="M9.17461763,15.9266167 C8.35007862,15.8608534 7.92229255,15.8029762 7.2806789,15.6687761 C6.4870421,15.5004914 5.77838637,15.2716562 5.26561922,15.0086026 C4.83272642,14.790327 4.61366119,14.6140223 4.52095457,14.4063063 C4.47460126,14.3063245 4.47198243,14.1274802 4.47198243,10.053091 C4.47198243,7.21229984 4.48232681,5.7471932 4.50039674,5.63411226 C4.55971327,5.2474182 4.83796409,4.86072415 5.17553143,4.68722644 L5.33528013,4.60569053 L5.34811241,4.01916668 C5.36094468,3.43518247 5.36094468,3.43264283 5.43309348,3.32477484 C5.47172124,3.2642244 5.55159559,3.18803512 5.61340001,3.15649008 C5.71396313,3.10128626 5.76031644,3.09593964 6.21376706,3.08805338 C6.80378974,3.07749382 6.88890175,3.09326633 7.03830607,3.2537985 C7.17998484,3.4037711 7.20316149,3.51952535 7.20316149,4.08239042 L7.20316149,4.52950125 L12.5628615,4.52950125 L12.5628615,4.01128042 C12.5628615,3.42475657 12.5860381,3.3326611 12.7457868,3.20634728 C12.8823589,3.10369224 13.0034798,3.08270677 13.4930703,3.08270677 C13.9723164,3.08270677 14.0625351,3.09847929 14.2068327,3.20634728 C14.3769258,3.33520074 14.3923769,3.40885039 14.3923769,4.0349392 L14.3923769,4.59526463 L14.5675767,4.6873601 C14.7840231,4.80044105 15.026265,5.04504876 15.1215905,5.24501223 C15.2787204,5.5763688 15.2685069,5.29500309 15.2632693,10.0427987 L15.2555437,14.3829148 L15.1833949,14.4933225 C15.0726183,14.6642805 14.8484464,14.8273523 14.4568002,15.0246425 C13.5471492,15.4796396 12.0990664,15.8190161 10.6431272,15.9189978 C10.2877518,15.9423893 9.42196624,15.9477359 9.17461763,15.9266167 Z M11.6579535,14.9057791 C11.810347,14.7742788 11.8129722,14.5691437 11.6605787,14.4324315 C11.6037428,14.3797779 11.5676462,14.3797779 9.91179356,14.3797779 L8.21984428,14.3797779 L8.14489447,14.4665093 C8.01310882,14.6164517 8.06220029,14.8741068 8.23533303,14.9452025 C8.26368532,14.958299 9.0309036,14.9688565 9.93502668,14.9688565 L11.5778845,14.9715292 L11.6579535,14.9057791 Z M9.62922844,13.4285703 C9.76803405,13.3495817 9.76803405,13.3600243 9.76032988,11.7608404 L9.75262571,10.2828171 L9.66787986,10.2063722 L9.58561501,10.1299273 L7.6222272,10.1299273 C5.68221305,10.1299273 5.65896997,10.1299273 5.59472504,10.1852193 C5.55620419,10.2142711 5.51507177,10.2826832 5.49966343,10.3354315 C5.4791625,10.4012999 5.47393934,10.8912968 5.4791625,11.8556267 C5.48686667,13.4390128 5.48177409,13.396841 5.66158155,13.4442341 C5.70532556,13.4573542 6.60462403,13.4652531 7.65813646,13.4652531 C9.14608565,13.4628433 9.58548443,13.4549444 9.62922844,13.4285703 Z M14.1794939,13.4306934 C14.3182986,13.351654 14.3182986,13.3621033 14.3105945,11.7618902 L14.3028903,10.2829155 L14.218145,10.2064214 L14.1358807,10.1299273 L10.2043002,10.1299273 L10.1220359,10.2064214 L10.0372906,10.2829155 L10.0295865,11.7170119 C10.0244939,12.5052625 10.0295865,13.1854033 10.0372906,13.232827 C10.0604029,13.3698733 10.12974,13.4331048 10.2711562,13.451592 C10.3404933,13.4594959 11.2346932,13.4673999 12.2599936,13.4647206 C13.6989659,13.4649885 14.1357502,13.4570845 14.1794939,13.4306934 Z M6.66822866,8.59219945 C6.83881236,8.50696478 6.97615876,8.35259533 7.06022199,8.15817912 C7.11622104,8.02775655 7.1238514,7.98513922 7.11363448,7.78017014 C7.10600413,7.58318336 7.09074342,7.52717201 7.02452745,7.40202587 C6.69111972,6.77900106 5.83341606,6.81634196 5.55096359,7.46588423 C5.34740123,7.93711016 5.58148501,8.48288261 6.05741225,8.64536964 C6.2254094,8.70395156 6.50023151,8.68000468 6.66822866,8.59219945 Z M13.8192556,8.61385134 C14.157251,8.45835606 14.3707422,8.0594139 14.2995785,7.70444754 C14.2436549,7.41689319 14.0708472,7.18621772 13.8192556,7.06969501 C13.6464478,6.98937992 13.3134893,6.98937992 13.1508847,7.07232829 C12.8535727,7.22005539 12.693422,7.45836738 12.6755988,7.77712611 C12.6629417,8.0103032 12.6958759,8.14499555 12.8052692,8.31089229 C12.9753647,8.56987554 13.2168823,8.69166481 13.5218144,8.67612845 C13.6286246,8.67086189 13.7480918,8.64505573 13.8192556,8.61385134 Z M3.93882591,13.4229938 C3.78812569,13.3647192 3.61994372,13.1952784 3.53700118,13.0204544 L3.46669142,12.8694516 L3.46669142,11.7439292 C3.46669142,10.6554173 3.4692435,10.6157151 3.51939184,10.4964741 C3.54950636,10.430259 3.60973541,10.3349738 3.65248272,10.2792562 C3.75035493,10.1627068 4.00900807,10.0223362 4.12461722,10.0223362 L4.20743216,10.0223362 L4.20743216,13.4652531 L4.12704169,13.4625614 C4.08186991,13.462696 3.99650289,13.4442581 3.93882591,13.4229938 Z M15.5830935,13.4652531 L15.5830935,10.0223362 L15.6534033,10.0223362 C15.8668846,10.0223362 16.1354909,10.2152878 16.2560766,10.455638 L16.3238343,10.590449 L16.3238343,12.8892181 L16.2560766,13.0240291 C16.138043,13.2591427 15.9296658,13.4204056 15.7061037,13.4494088 L15.5830935,13.4652531 Z" id="bus" fill="#FFFFFF" fill-rule="nonzero" transform="translate(9.895263, 9.511278) rotate(180.000000) translate(-9.895263, -9.511278) "></path>
  </svg>
  `);
  return `data:image/svg+xml;base64,${iconCode}`;
};

export const StationMarker: FC<Props> = ({
  station,
  onClick,
  popupOpen,
  route,
  size = 20,
  routes,
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
          <StationPopup
            station={station}
            route={route}
            routes={routes}
            selectedRoutes={selectedRoutes}
            onClose={handlePopupClose}
          />
        )}
      </Marker>
    ),
    [lat, lng, popupOpen, selectedRoutes, size],
  );
};

export default StationMarker;
