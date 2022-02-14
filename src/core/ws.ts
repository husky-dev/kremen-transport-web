import { errToStr, isUnknownDict, isStr } from '@utils';
import { useEffect, useState } from 'react';

import { TransportBus } from './api';
import { config } from './config';
import { Log } from './log';

const log = Log('ws');

interface WsOpt {
  onOpen?: () => void;
  onClose?: () => void;
  onMessage?: (data: WsMsg) => void;
  onError?: () => void;
}

type WsMsg = { type: 'buses'; data: Partial<TransportBus>[] };

const parseMsg = (data: unknown): WsMsg | undefined => {
  if (!isStr(data)) {
    log.err('incoming message is not a string', { data });
    return undefined;
  }
  try {
    const parsed = JSON.parse(data);
    if (!isUnknownDict(parsed)) {
      log.err('parsed message is not a directory, parsed=', parsed);
      return undefined;
    }
    if (!isStr(parsed.type)) {
      log.err('parsed message does not have type field');
      return undefined;
    }
    if (parsed.type === 'buses') {
      if (!parsed.data) {
        log.err('parsed message has type "buses" but "data" field is empty');
        return undefined;
      } else {
        return { type: 'buses', data: parsed.data as unknown as Partial<TransportBus>[] };
      }
    }
    log.warn('unknown message', { type: parsed.type });
    return undefined;
  } catch (err) {
    log.err('parsing income msg err', { data });
    return undefined;
  }
};

export const useWebScockets = ({ onOpen, onClose, onMessage, onError }: WsOpt = {}) => {
  const getConnection = () => {
    const url = `${config.api.ws}transport/realtime`;
    log.info('new connection', { url });
    const cn = new WebSocket(url);

    cn.onopen = () => {
      log.info('on open');
      if (onOpen) {
        onOpen();
      }
    };

    cn.onclose = e => {
      log.info('on close', { reason: e.reason });
      setTimeout(() => {
        log.info('reconnecting');
        setConnection(getConnection());
      }, 3000);
      if (onClose) {
        onClose();
      }
    };

    cn.onmessage = e => {
      // log.trace('on message, data=', e.data);
      if (onMessage) {
        const msg = parseMsg(e.data);
        if (msg) {
          onMessage(msg);
        }
      }
    };

    cn.onerror = (err: unknown) => {
      log.err('on err', { err: errToStr(err) });
      cn.close();
      if (onError) {
        onError();
      }
    };

    return cn;
  };

  const [connection, setConnection] = useState<WebSocket>();

  useEffect(() => {
    setConnection(getConnection());
  }, []);

  return connection;
};
