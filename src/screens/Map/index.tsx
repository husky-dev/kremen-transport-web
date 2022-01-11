import { ControlRoundBtn, DocTitle, View } from '@components/Common';
import Map from '@components/Geo/Map';
import { ServicesAppBar } from '@components/Services';
import { BusMarker, CurLocMarker, RoutePath, StationMarker } from '@components/Transport';
import {
  config,
  coordinates,
  defRoutePathColors,
  findRouteWithId,
  Log,
  routeIdToColor,
  routeToColor,
  track,
  useStorage,
} from '@core';
import { TransportBus, TransportRoute, TransportStation } from '@core/api';
import { getStorageParam } from '@core/storage';
import { fullScreen, m, Styles, ViewStyleProps } from '@styles';
import { isLatLngOrUndef, isNumArrOrUndef, isNumOrUndef, LatLng } from '@utils';
import { includes } from 'lodash';
import React, { FC, Suspense, useEffect, useRef, useState } from 'react';
import { GoogleMap } from 'react-google-maps';

import { SidePanel } from './scenes/SidePanel';
import { routesToStatiosn } from './utils';

const log = Log('screens.Map');

type Props = ViewStyleProps;

const mapMarkerSize = 46;
const stationMarkerSize = Math.round(mapMarkerSize / 2.7);

const selectedStorage = getStorageParam('selected', isNumArrOrUndef);
const zoomStorage = getStorageParam('mapZoom', isNumOrUndef);
const centerStorage = getStorageParam('mapCenter', isLatLngOrUndef);
const curPositionStorage = getStorageParam('mapCurPosition', isLatLngOrUndef);

export const MapScreen: FC<Props> = ({ style }) => {
  const mapRef = useRef<GoogleMap>(null);

  const { buses: allBuses, routes: allRoutes } = useStorage();

  const [center, setCenter] = useState<LatLng>(centerStorage.get() || coordinates.kremen);
  const [zoom, setZoom] = useState<number>(zoomStorage.get() || 14);
  const [selectedBus, setSelectedBus] = useState<TransportBus | undefined>(undefined);
  const [stationPopupId, setStationPopupId] = useState<number | undefined>(undefined);
  const [displayedRoutes, setDisplayedRoutes] = useState<number[]>(
    selectedStorage.get() || [189, 188, 192, 187, 190, 191],
  );
  const [mapMoved, setMapMoved] = useState<boolean>(false);

  const [curPosition, setCurPosition] = useState<LatLng | undefined>(curPositionStorage.get());

  useEffect(() => {
    track('MapScreenVisit');
  }, []);

  // Data

  const setAndSaveCurPosition = (val: LatLng | undefined) => {
    setCurPosition(val);
    if (val) {
      curPositionStorage.set(val);
    } else {
      curPositionStorage.remove();
    }
  };

  const setAndSaveCurCenter = (val: LatLng) => {
    setCenter(val);
    centerStorage.set(val);
  };

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
    zoomStorage.set(zoom);
  };

  const handleMapCenterChanged = () => {
    if (!mapRef.current) {
      return;
    }
    setMapMoved(true);
    log.debug('cener changed');
    const coord = mapRef.current.getCenter();
    const lat = coord.lat();
    const lng = coord.lng();
    setAndSaveCurCenter({ lat, lng });
  };

  const handleMapClick = () => {
    track('MapClick');
    log.debug('map click');
    setSelectedBus(undefined);
    setStationPopupId(undefined);
  };

  const handleZoomInPress = () => {
    if (mapRef.current) {
      setMapMoved(true);
      setZoomAndSave(mapRef.current.getZoom() + 1);
    }
  };

  const handleZoomOutPress = () => {
    if (mapRef.current) {
      setMapMoved(true);
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
    zoomStorage.set(newVal);
  };

  // Cur location

  useEffect(() => {
    if (navigator.geolocation) {
      log.info('geolocation allowed');
      navigator.geolocation.getCurrentPosition(handlePositionReceived, handlePositionErr);
    } else {
      log.info('geolocation not enabled on this device');
      setAndSaveCurPosition(undefined);
    }
  }, []);

  const handlePositionErr = (err: GeolocationPositionError) => {
    if (err.code === 1) {
      log.info('user denied geolocation prompt');
      setAndSaveCurPosition(undefined);
    } else {
      log.err(err.message);
    }
  };

  const handlePositionReceived = (rawVal: GeolocationPosition) => {
    log.debug('cur position firts received');
    const { latitude: lat, longitude: lng } = rawVal.coords;
    setAndSaveCurPosition({ lat, lng });
    if (!mapMoved) setAndSaveCurCenter({ lat, lng });
    navigator.geolocation.watchPosition(handlePositionUpdated);
  };

  const handlePositionUpdated = (rawVal: GeolocationPosition) => {
    log.debug('cur poisition changed');
    const val = { lat: rawVal.coords.latitude, lng: rawVal.coords.longitude };
    setAndSaveCurPosition(val);
  };

  const handleCurPositionClick = () => {
    log.debug('handle cur location press');
    if (curPosition) {
      setAndSaveCurCenter(curPosition);
    } else {
      alert('Геолокація не увумкнена або дана функція недоступна у вашому браузері');
    }
  };

  // Bus

  const handleBusMarkerClick = (bus: TransportBus) => {
    log.info('bus marker click', { bus });
    track('BusMarkerClick', { tid: bus.tid, rid: bus.rid, name: bus.name });
    setSelectedBus(bus);
    setStationPopupId(undefined);
  };

  const handleBusMarkerPopupClose = () => setSelectedBus(undefined);

  // Station

  const handleStationMarkerClick = (station: TransportStation) => {
    log.info('station marker click', { station });
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
    setDisplayedRoutes(val);
    selectedStorage.set(val);
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
      <DocTitle title={config.title} />
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
              routes={allRoutes}
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
      {/* <AlertDialog title="Нажаль сервіс недоступний.." visible>
        <p>
          <strong>{`Що сталось: `}</strong>
          додаток використовує дані з офіційного сервісу, який використовує Міська рада міста - Infobus.
        </p>
        <p>
          Це казахстанський сервіс (домен: infobus.kz). Нажаль, через події в країні, він наразі недоступний. Казахстан
          відключенний від Всесвітної мережі. Сервери з данними також знаходятся там.
        </p>
        <p>Нажаль, відновити роботу сервісу поки що неможливо.</p>
      </AlertDialog> */}
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
