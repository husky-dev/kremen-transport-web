import { NavBar, PageTitle } from '@/components/Layout';
import { BusMarker, CurPositionMarker, RoutePath, StationMarker } from '@/components/Transport';
import { api } from '@/core/api';
import { Log } from '@/core/log';
import { defRoutePathColors, findRouteWithId, routeIdToColor, routesToStatiosn, routeToColor } from '@/core/transport';
import {
  isTransportBusArrOrUndef,
  isTransportRouteArrOrUndef,
  TransportBus,
  TransportBusesLocations,
  TransportRoute,
  TransportStation,
} from '@/types';
import {
  coordinates,
  errToStr,
  getStorage,
  isLatLngOrUndef,
  isNumArrOrUndef,
  isNumOrUndef,
  LatLng,
  mc,
  StyleProps,
  TestIdProps,
} from '@/utils';
import { Map, useMap } from '@vis.gl/react-google-maps';
import React, { FC, useEffect, useState } from 'react';

import { RoutesPanel } from './RoutesPanel';

const log = Log('MapPage');

type Props = StyleProps & TestIdProps;

const mapMarkerSize = 46;
const stationMarkerSize = Math.round(mapMarkerSize / 2.7);

const busesStorage = getStorage({ key: 'kremen:buses', guard: isTransportBusArrOrUndef });
const routesStorage = getStorage({ key: 'kremen:routes', guard: isTransportRouteArrOrUndef });
const selectedStorage = getStorage({ key: 'kremen:selected', guard: isNumArrOrUndef });
const zoomStorage = getStorage({ key: 'kremen:zoom', guard: isNumOrUndef });
const centerStorage = getStorage({ key: 'kremen:center', guard: isLatLngOrUndef });

const defRids = [16, 7, 2, 10];

const busesUpdateInterval = 1000 * 3; // 3 sec

const updateBusesWithLocations = (buses: TransportBus[], locations: TransportBusesLocations) => {
  return buses.map(itm => {
    const newLoc = locations[itm.tid];
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!newLoc) return itm;
    const [lat, lng, direction, speed] = newLoc;
    return { ...itm, lat, lng, direction, speed };
  });
};

export const MapPage: FC<Props> = () => {
  const map = useMap('routes-map');

  const [routes, setRoutes] = useState<TransportRoute[]>(routesStorage.get() || []);
  const [buses, setBuses] = useState<TransportBus[]>(busesStorage.get() || []);

  const [selectedBus, setSelectedBus] = useState<TransportBus | undefined>(undefined);
  const [stationPopupId, setStationPopupId] = useState<number | undefined>(undefined);
  const [selectedRoutes, setSelectedRoutes] = useState<number[]>(selectedStorage.get() || defRids);

  const [curPosition, setCurPosition] = useState<LatLng | undefined>(undefined);

  useEffect(() => {
    fullUpdate();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => locationsUpdate(), busesUpdateInterval);
    return () => clearInterval(interval);
  }, []);

  const fullUpdate = async () => {
    try {
      log.debug('full update');
      const [newRoutes, newBusses] = await Promise.all([api.transport.routes(), api.transport.buses()]);
      log.debug('full update done');
      setRoutes(newRoutes);
      routesStorage.set(newRoutes);
      setBuses(newBusses);
      busesStorage.set(newBusses);
    } catch (err: unknown) {
      log.err(errToStr(err));
    }
  };

  const locationsUpdate = async () => {
    try {
      log.debug('locations update');
      const locations = await api.transport.busesLocations();
      log.debug('locations update done');
      setBuses(b => {
        const newBusses = updateBusesWithLocations(b, locations);
        busesStorage.set(newBusses);
        return newBusses;
      });
    } catch (err: unknown) {
      log.err(errToStr(err));
    }
  };

  // Map

  const handleMapClick = () => {
    log.debug('map click');
    setSelectedBus(undefined);
    setStationPopupId(undefined);
  };

  // Bus

  const handleBusMarkerClick = (bus: TransportBus) => {
    log.info('bus marker click', { bus });
    setSelectedBus(bus);
    setStationPopupId(undefined);
  };

  const handleBusMarkerPopupClose = () => setSelectedBus(undefined);

  // Station

  const handleStationMarkerClick = (station: TransportStation) => {
    log.info('station marker click', { station });
    setStationPopupId(station.sid);
    setSelectedBus(undefined);
  };

  const handleStationMarkerPopupClose = () => {
    setStationPopupId(undefined);
  };

  // Routes

  const handleDisplayedRoutesChange = (val: number[]) => {
    setSelectedRoutes(val);
    selectedStorage.set(val);
  };

  // Cur position

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (navigator.geolocation) {
      log.info('geolocation allowed');
      navigator.geolocation.getCurrentPosition(handlePositionReceived, handlePositionErr);
    } else {
      log.info('geolocation not enabled on this device');
      setCurPosition(undefined);
    }
  }, []);

  const handlePositionErr = (err: GeolocationPositionError) => {
    if (err.code === 1) {
      log.info('user denied geolocation prompt');
      setCurPosition(undefined);
    } else {
      log.err(err.message);
    }
  };

  const handlePositionReceived = (rawVal: GeolocationPosition) => {
    log.debug('cur position firts received');
    const { latitude: lat, longitude: lng } = rawVal.coords;
    setCurPosition({ lat, lng });
    navigator.geolocation.watchPosition(handlePositionUpdated);
  };

  const handlePositionUpdated = (rawVal: GeolocationPosition) => {
    log.debug('cur poisition changed');
    const val = { lat: rawVal.coords.latitude, lng: rawVal.coords.longitude };
    setCurPosition(val);
  };

  const hanldePositionMarkerClick = () => {
    log.info('cur position marker click');
    if (!map || !curPosition) return;
    map.setCenter(curPosition);
  };

  // Render

  const curRoutes = routes.filter(({ rid }) => selectedRoutes.includes(rid));
  const curBuses = buses.filter(({ rid }) => selectedRoutes.includes(rid));
  const curStations = routesToStatiosn(curRoutes);

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

  const renderStationMarker = (station: TransportStation) => (
    <StationMarker
      key={`station-${station.rid}-${station.sid}`}
      station={station}
      routes={routes}
      selectedRoutes={selectedRoutes}
      size={stationMarkerSize}
      route={findRouteWithId(routes, station.rid)}
      popupOpen={station.sid === stationPopupId}
      onClick={handleStationMarkerClick}
      onPopupClose={handleStationMarkerPopupClose}
    />
  );

  const renderBusMarker = (bus: TransportBus) => {
    const colors = routeIdToColor(bus.rid, routes);
    const route = findRouteWithId(routes, bus.rid);
    let opacity = 1.0;
    let zIndex = 20;
    if (selectedBus) {
      if (selectedBus.rid !== bus.rid) {
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
        // size={mapMarkerSize}
        zIndex={zIndex}
        opacity={opacity}
        popupOpen={bus.tid === selectedBus?.tid}
        onClick={handleBusMarkerClick}
        onPopupClose={handleBusMarkerPopupClose}
      />
    );
  };

  return (
    <>
      <PageTitle title="Громадський транспорт Кременчука" />
      <NavBar className="absolute left-0 top-0 right-0 z-10" />
      <Map
        className="absolute left-0 top-0 right-0 bottom-0 overflow-hidden z-0"
        id="routes-map"
        styles={[
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }],
          },
          {
            featureType: 'transit',
            stylers: [{ visibility: 'off' }],
          },
        ]}
        reuseMaps
        defaultCenter={centerStorage.get() || coordinates.kremen}
        defaultZoom={zoomStorage.get() || 14}
        fullscreenControl={false}
        mapTypeControl={false}
        streetViewControl={false}
        gestureHandling="greedy"
        onCenterChanged={e => centerStorage.set(e.detail.center)}
        onZoomChanged={e => zoomStorage.set(e.detail.zoom)}
        onClick={handleMapClick}
      >
        {curRoutes.map(renderRoutePath)}
        {curBuses.map(renderBusMarker)}
        {curStations.map(renderStationMarker)}
        {!!curPosition && <CurPositionMarker size={mapMarkerSize} position={curPosition} onClick={hanldePositionMarkerClick} />}
      </Map>
      <div className={mc('absolute top-[72px] left-0 w-full sm:w-auto', 'px-2')}>
        <RoutesPanel
          className={mc('w-full sm:w-72')}
          routes={routes}
          selected={selectedRoutes}
          onSelectedChange={handleDisplayedRoutesChange}
        />
      </div>
    </>
  );
};

export default MapPage;
