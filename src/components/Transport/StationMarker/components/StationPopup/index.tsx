import { CircularProgress } from '@material-ui/core';
import IconArrowDownward from '@material-ui/icons/ArrowDownward';
import IconArrowUpward from '@material-ui/icons/ArrowUpward';
import { Text, View } from '@components/Common';
import { RouteCircle } from '@components/Transport';
import { api } from '@core';
import { TransportPrediction, TransportRoute, TransportStation } from '@core/api';
import React, { FC, useEffect, useState } from 'react';
import { InfoWindow } from 'react-google-maps';
import { colors, m, Styles, ViewStyleProps } from '@styles';
import { Log, Timer } from '@utils';

import StationPredictionsList from './components/StationPredictionsList';

const log = Log('@components.StationPopup');

interface Props extends ViewStyleProps {
  routes: TransportRoute[];
  station: TransportStation;
  route?: TransportRoute;
  selectedRoutes: number[];
  onClose: () => void;
}

const usePredictions = (sid: number) => {
  const [processing, setProcessing] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<TransportPrediction[]>([]);

  const updatePredictions = async () => {
    try {
      log.debug('getting station prediction');
      setProcessing(true);
      const items = await api.transport.stationPrediction(sid);
      setProcessing(false);
      setErr(null);
      log.debug('getting station prediction done, items=', items);
      setPredictions(items);
    } catch (catchErr) {
      setProcessing(false);
      log.err(catchErr);
      setErr('Помилка завантаження...');
    }
  };

  useEffect(() => {
    log.info('start update predictions');
    const timer = new Timer(updatePredictions, 3000, true);
    return () => {
      log.info('stop update predictions');
      timer.stop();
    };
  }, [sid]);

  return { predictions, processing, err };
};

const StationPopup: FC<Props> = ({ style, station, route, routes, onClose }) => {
  const { predictions, processing, err } = usePredictions(station.sid);
  const title = station.name;
  return (
    <InfoWindow onCloseClick={onClose}>
      <View style={m(styles.container, style)}>
        <View row={true} justifyContent="flex-start" alignItems="center">
          {route && <RouteCircle style={styles.circle} route={route} size={20} />}
          <View style={styles.direction}>
            {station.directionForward ? (
              <IconArrowDownward style={styles.iconDown} fontSize="inherit" />
            ) : (
              <IconArrowUpward style={styles.iconUp} fontSize="inherit" />
            )}
          </View>
          <View style={styles.title}>{title}</View>
        </View>
        {processing && !predictions.length && (
          <View style={styles.loading} row={true} justifyContent="center">
            <CircularProgress size={20} />
          </View>
        )}
        {!!predictions.length && (
          <StationPredictionsList
            style={styles.predictions}
            routes={routes}
            predictions={predictions}
            station={station}
          />
        )}
        {!!err && (
          <View style={styles.err}>
            <Text color={colors.red} size={12} bold={true}>
              {err}
            </Text>
          </View>
        )}
      </View>
    </InfoWindow>
  );
};

const styles: Styles = {
  container: {
    width: 160,
  },
  circle: {
    marginRight: 3,
  },
  direction: {
    fontSize: '20px',
    marginRight: 3,
    fontWeight: 'bold',
  },
  iconUp: {
    color: colors.green,
  },
  iconDown: {
    color: colors.blue,
  },
  loading: {
    marginTop: 6,
    height: 20,
    overflow: 'hidden',
  },
  predictions: {
    marginTop: 6,
  },
  err: {
    marginTop: 3,
  },
  title: {
    fontWeight: 'bold',
  },
};

export default StationPopup;
