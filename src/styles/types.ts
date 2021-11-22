import { CSSProperties } from 'react';

export type Style = CSSProperties;

export interface Styles {
  [key: string]: Style;
}

export interface ViewStyleProps {
  style?: Style;
}

export type MergeStyleVal = Style | null | undefined | boolean;
export type MergeStyleVals = MergeStyleVal | MergeStyleVal[];
