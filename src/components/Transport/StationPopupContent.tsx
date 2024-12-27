import { api } from '@/core/api';
import { Log } from '@/core/log';
import { TransportPrediction, TransportRoute, TransportStation } from '@/types';
import { colors, errToStr, ms, StyleProps, Styles } from '@/utils';
import React, { FC, useEffect, useState } from 'react';

import StationPredictionsList from './StationPredictionsList';

const log = Log('StationPopup');

interface Props extends StyleProps {
  routes: TransportRoute[];
  station: TransportStation;
}

const usePredictions = (sid: number) => {
  const [processing, setProcessing] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<TransportPrediction[]>([]);

  const updatePredictions = async () => {
    try {
      log.debug('getting station prediction', { sid });
      setProcessing(true);
      const items = await api.transport.stationPrediction(sid);
      setProcessing(false);
      setErr(null);
      log.debug('getting station prediction done', { sid, items });
      setPredictions(items);
    } catch (err: unknown) {
      setProcessing(false);
      log.err('getting station prediction', { err: errToStr(err) });
      setErr('Помилка завантаження...');
    }
  };

  useEffect(() => {
    log.info('start update predictions');
    // Update predictions every 3 seconds
    const interval = setInterval(() => updatePredictions(), 1000 * 5);
    return () => clearInterval(interval);
  }, [sid]);

  return { predictions, processing, err };
};

export const StationPopupContent: FC<Props> = ({ style, className, station, routes }) => {
  const { predictions, processing, err } = usePredictions(station.sid);
  return (
    <div style={ms(styles.container, style)} className={className}>
      {processing && !predictions.length && (
        <div style={styles.loading} className="flex flex-row justify-center">
          <span className="loading loading-spinner loading-xs" />
        </div>
      )}
      {!!predictions.length && (
        <StationPredictionsList style={styles.predictions} routes={routes} predictions={predictions} station={station} />
      )}
      {!!err && <div style={styles.err}>{err}</div>}
    </div>
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
  title: {
    fontWeight: 'bold',
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
};

export default StationPopupContent;
