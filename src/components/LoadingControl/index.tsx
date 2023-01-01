import {IonModal, IonSpinner} from '@ionic/react';
import React from 'react';
import styles from './styles.module.scss';
type Props = {
  isLoading: boolean;
};

const LoadingControl: React.FC<Props> = ({isLoading = true}) => {
  return (
    <div className={styles.loading + ' ' + (isLoading && styles.active)}>
      <IonSpinner color={'primary'} name="circular" />
    </div>
  );
};

export default LoadingControl;
