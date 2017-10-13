import React from 'react';
import styles from './Spinner.scss';
import src from './spinner.png';

const Spinner = ({ children }) => (
  <span className={styles.spinner}><img src={src} alt="" /><span>{children}</span></span>
);

export const CenteredSpinner = ({ children }) => (<div style={{ textAlign: 'center' }}><Spinner {...children} /></div>);

export default Spinner;

