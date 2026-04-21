import { api } from '@/core/api';
import { Log } from '@/core/log';
import { TransportPrediction, TransportRoute, TransportStation } from '@/types';
import { errToStr, StyleProps } from '@/utils';
import React, { FC, useEffect, useState } from 'react';

import StationPredictionsList from './StationPredictionsList';

const log = Log('StationPopup');

interface Props extends StyleProps {
  readonly routes: TransportRoute[];
  readonly station: TransportStation;
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

export const StationPopupContent: FC<Props> = ({ station, routes }) => {
  const { predictions, processing, err } = usePredictions(station.sid);
  return (
    <div className="w-40 text-gray-900">
      {processing && !predictions.length && (
        <div className="flex justify-center mt-1.5 h-5 overflow-hidden">
          <span className="loading loading-spinner loading-sm text-primary" />
        </div>
      )}
      {!!predictions.length && (
        <StationPredictionsList className="mt-1.5" routes={routes} predictions={predictions} station={station} />
      )}
      {!!err && <div className="mt-1 text-red-500 text-xs">{err}</div>}
    </div>
  );
};

export default StationPopupContent;
