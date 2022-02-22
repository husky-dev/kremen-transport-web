import { Paper } from '@material-ui/core';
import { DocTitle, Markdown } from '@components/Common';
import React, { FC } from 'react';
import { Styles } from '@styles';

import content from './assets/about.md';

export const SupportScreen: FC = () => (
  <Paper style={styles.content}>
    <DocTitle title="Про додаток" />
    <Markdown>{content.html}</Markdown>
  </Paper>
);

const styles: Styles = {
  container: {},
  content: {
    maxWidth: 992,
    margin: '40px auto',
    padding: '20px',
  },
};

export default SupportScreen;
