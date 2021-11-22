import { TransportPrediction } from 'core/api';

export const numToTimeStr = (val: number): { numStr: string; metric: string } => {
  if (val < 60) {
    return { numStr: `${val}`, metric: 'с' };
  }
  const mins = Math.ceil(val / 60);
  return { numStr: `${mins}`, metric: 'хв' };
};

export const getItemsSplitByRows = (items: TransportPrediction[]): TransportPrediction[][] => {
  const rows: TransportPrediction[][] = [[]];
  items.forEach((item, index) => {
    if (index % 2 === 0) {
      rows.push([]);
    }
    rows[rows.length - 1].push(item);
  });
  return rows;
};

export const getItemsSplitByColumns = (items: TransportPrediction[]): TransportPrediction[][] => {
  const rows: TransportPrediction[][] = [];
  const rowsCount: number = items.length % 2 === 0 ? Math.floor(items.length / 2) : Math.floor(items.length / 2) + 1;
  items.forEach((item, index) => {
    const rowIndex = index <= rowsCount - 1 ? index : index - rowsCount;
    if (!rows[rowIndex]) {
      rows.push([]);
    }
    rows[rowIndex].push(item);
  });
  return rows;
};
