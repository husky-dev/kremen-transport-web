/* eslint-disable @typescript-eslint/no-explicit-any */
import { ControlRoundBtn, DocTitle, View } from 'components/Common';
import { ServicesAppBar } from 'components/Services';
import { BusMarker, CurLocMarker, RoutePath, StationMarker } from 'components/Transport';
import {
  coordinates,
  defRoutePathColors,
  findRouteWithId,
  getConf,
  removeConf,
  routeIdToColor,
  routeToColor,
  setConf,
  track,
} from 'core';
import { TransportBus, TransportRoute, TransportStation } from 'core/api';
import { useWebScockets } from 'core/ws';
import { includes, uniqBy } from 'lodash';
import React, { FC, useEffect, useRef, useState, lazy, Suspense } from 'react';
import { GoogleMap } from 'react-google-maps';
import { useSelector, useStoreManager } from 'store';
import { fullScreen, m, Styles, ViewStyleProps } from 'styles';
import { LatLng, Log } from 'utils';

import { SidePanel } from './scenes/SidePanel';
import { getMapZoomConf, getSelectedRoutesConf, setMapZoomConf, setSelectedRoutesConf } from './utils';

const Map = lazy(() => import('components/Geo/Map'));

const log = Log('screens.MapScreen');

const routesToStatiosn = (routes: TransportRoute[]): TransportStation[] => {
  const stations: TransportStation[] = [];
  routes.forEach(route => {
    stations.push(...route.stations);
  });
  return uniqBy(stations, station => station.sid);
};

type Props = ViewStyleProps;

const mapMarkerSize = 46;
const stationMarkerSize = Math.round(mapMarkerSize / 2.7);

export const MapScreen: FC<Props> = ({ style }) => {
  const mapRef = useRef<GoogleMap>(null);

  const manager = useStoreManager();
  const allRoutes = useSelector(s => s.transport.routes);
  const allBuses = useSelector(s => s.transport.buses);

  const [center, setCenter] = useState<LatLng>(coordinates.kremen);
  const [zoom, setZoom] = useState<number>(getMapZoomConf(14));
  const [selectedBus, setSelectedBus] = useState<TransportBus | undefined>(undefined);
  const [stationPopupId, setStationPopupId] = useState<number | undefined>(undefined);
  const [displayedRoutes, setDisplayedRoutes] = useState<number[]>(
    getSelectedRoutesConf([189, 188, 192, 187, 190, 191]),
  );

  useEffect(() => {
    track('MapScreenVisit');
    manager.updateCommonData();
  }, []);

  useWebScockets({
    onMessage: msg => {
      if (msg.type === 'buses') {
        log.debug('ws buses update');
        manager.modBuses(msg.data);
      }
    },
  });

  // Map

  const handleMapZoomChanged = () => {
    if (!mapRef.current) {
      return;
    }
    const zoom = mapRef.current.getZoom();
    if (isNaN(zoom)) {
      return;
    }
    log.debug(`zoom changed: ${zoom}`);
    setMapZoomConf(zoom);
  };

  const handleMapCenterChanged = () => {
    if (!mapRef.current) {
      return;
    }
    log.debug('cener changed');
    const coord = mapRef.current.getCenter();
    const lat = coord.lat();
    const lng = coord.lng();
    setCenter({ lat, lng });
  };

  const handleMapClick = () => {
    track('MapClick');
    log.debug('map click');
    setSelectedBus(undefined);
    setStationPopupId(undefined);
  };

  const handleZoomInPress = () => {
    if (mapRef.current) {
      setZoomAndSave(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOutPress = () => {
    if (mapRef.current) {
      setZoomAndSave(mapRef.current.getZoom() - 1);
    }
  };

  const setZoomAndSave = (val: number) => {
    let newVal = val;
    if (newVal < 0) {
      newVal = 0;
    }
    if (newVal > 22) {
      newVal = 22;
    }
    setZoom(newVal);
    setMapZoomConf(newVal);
  };

  // Cur location

  const [curPosition, setCurPosition] = useState<LatLng | undefined>(getConf('curPosition'));

  useEffect(() => {
    if (navigator.geolocation) {
      log.info('geolocation allowed');
      navigator.geolocation.getCurrentPosition(handlePositionReceived, handlePositionErr);
    } else {
      log.info('geolocation not enabled on this device');
      removeConf('curPosition');
      setCurPosition(undefined);
    }
  }, []);

  const handlePositionErr = (err: PositionError) => {
    if (err.code === 1) {
      log.info('user denied geolocation prompt');
      removeConf('curPosition');
      setCurPosition(undefined);
    } else {
      log.err(err.message);
    }
  };

  const handlePositionReceived = (rawVal: Position) => {
    log.debug('cur position firts received');
    const { latitude: lat, longitude: lng } = rawVal.coords;
    setCenter({ lat, lng });
    setCurPosition({ lat, lng });
    navigator.geolocation.watchPosition(handlePositionUpdated);
  };

  const handlePositionUpdated = (rawVal: Position) => {
    log.debug('cur poisition changed');
    const val = { lat: rawVal.coords.latitude, lng: rawVal.coords.longitude };
    setConf('curPosition', val);
    setCurPosition(val);
  };

  const handleCurPositionClick = () => {
    log.debug('handle cur location press');
    if (curPosition) {
      setCenter(curPosition);
    } else {
      alert('Геолокація не увімкнена або дана функція не доступна в вашому браузері');
    }
  };

  // Bus

  const handleBusMarkerClick = (bus: TransportBus) => {
    log.info('bus marker click, bus=', bus);
    track('BusMarkerClick', { tid: bus.tid, rid: bus.rid, name: bus.name });
    setSelectedBus(bus);
    setStationPopupId(undefined);
  };

  const handleBusMarkerPopupClose = () => setSelectedBus(undefined);

  // Station

  const handleStationMarkerClick = (station: TransportStation) => {
    log.info('station marker click, station=', station);
    track('StationMarkerClick', { sid: station.sid, name: station.name });
    setStationPopupId(station.sid);
    setSelectedBus(undefined);
  };

  const handleStationMarkerPopupClose = () => {
    setStationPopupId(undefined);
  };

  // Routes

  const handleDisplayedRoutesChange = (val: number[]) => {
    track('DisplayedRoutesChange', { routes: val });
    setSelectedRoutesConf(val);
    setDisplayedRoutes(val);
  };

  // Render

  const routes = allRoutes.filter(({ rid }) => includes(displayedRoutes, rid));
  const buses = allBuses.filter(({ rid }) => includes(displayedRoutes, rid));
  const stations = routesToStatiosn(routes);

  const renderRoutePath = (route: TransportRoute) => {
    let colors = defRoutePathColors;
    let opacity = 0.5;
    let zIndex = 1;
    if (selectedBus) {
      if (selectedBus.rid === route.rid) {
        opacity = 1.0;
        zIndex = 2;
        colors = routeToColor(route);
      } else {
        opacity = 0.3;
        colors = defRoutePathColors;
      }
    }
    return <RoutePath key={`path-${route.rid}`} route={route} colors={colors} opacity={opacity} zIndex={zIndex} />;
  };

  const renderBusMarker = (bus: TransportBus) => {
    const colors = routeIdToColor(bus.rid, allRoutes);
    const route = findRouteWithId(allRoutes, bus.rid);
    let opacity = 1.0;
    let zIndex = 20;
    if (selectedBus) {
      if (selectedBus?.rid !== bus.rid) {
        opacity = 0.5;
      } else {
        zIndex = 21;
      }
    }
    return (
      <BusMarker
        key={`bus-${bus.tid}`}
        bus={bus}
        route={route}
        colors={colors}
        size={mapMarkerSize}
        zIndex={zIndex}
        opacity={opacity}
        popupOpen={bus.tid === selectedBus?.tid}
        onClick={handleBusMarkerClick}
        onPopupClose={handleBusMarkerPopupClose}
      />
    );
  };

  const mapOpt: google.maps.MapOptions = {
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false,
    zoomControl: false,
    styles: [
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }],
      },
    ],
  };

  return (
    <View style={m(styles.container, style)}>
      <DocTitle title={APP_TITLE} />
      <ServicesAppBar />
      <Suspense fallback={() => null}>
        <Map
          mapRef={mapRef}
          style={styles.map}
          defaultOptions={mapOpt}
          defaultZoom={zoom}
          defaultCenter={center}
          center={center}
          zoom={zoom}
          onZoomChanged={handleMapZoomChanged}
          onCenterChanged={handleMapCenterChanged}
          onClick={handleMapClick}
        >
          {buses.map(renderBusMarker)}
          {routes.map(renderRoutePath)}
          {stations.map(station => (
            <StationMarker
              key={`station-${station.rid}-${station.sid}`}
              station={station}
              selectedRoutes={displayedRoutes}
              size={stationMarkerSize}
              route={findRouteWithId(allRoutes, station.rid)}
              popupOpen={station.sid === stationPopupId}
              onClick={handleStationMarkerClick}
              onPopupClose={handleStationMarkerPopupClose}
            />
          ))}
          {!!curPosition && <CurLocMarker size={mapMarkerSize} position={curPosition} />}
        </Map>
      </Suspense>
      <SidePanel
        style={styles.routesPanel}
        buses={allBuses}
        routes={allRoutes}
        selected={displayedRoutes}
        onSelectedChange={handleDisplayedRoutesChange}
      />
      <View style={styles.controlsPanel}>
        <ControlRoundBtn style={styles.controlsPanelBtn} icon="plus" onClick={handleZoomInPress} />
        <ControlRoundBtn style={styles.controlsPanelBtn} icon="minus" onClick={handleZoomOutPress} />
        <ControlRoundBtn style={styles.controlsPanelBtn} icon="target" onClick={handleCurPositionClick} />
      </View>
    </View>
  );
};

const styles: Styles = {
  container: {
    ...fullScreen,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  map: {
    ...fullScreen,
  },
  routesPanel: {
    position: 'absolute',
    top: 14 + 60,
    left: 14,
    width: 260,
    zIndex: 2,
    overflowY: 'scroll',
  },
  controlsPanel: {
    position: 'absolute',
    right: 14,
    bottom: 24,
    zIndex: 2,
  },
  controlsPanelBtn: {
    marginTop: 4,
    marginBottom: 4,
  },
};

export default MapScreen;
