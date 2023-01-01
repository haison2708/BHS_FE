import {IonIcon} from '@ionic/react';
import {caretDown} from 'ionicons/icons';
import React, {HTMLProps} from 'react';
import { IVendor } from '../../../../types/interface';
import styles from './styles.module.scss';

type IGameComboBoxProps = {
  fromColor?: string;
  toColor?: string;
  onComboBoxClick?: () => void;
  title?: string;
  currentVendor?: IVendor
};

const GameComboBox: React.FC<IGameComboBoxProps & HTMLProps<HTMLDivElement>> = ({
  fromColor = '#e23743',
  toColor = '#bc313f',
  onComboBoxClick,
  title,
  children,
  currentVendor,
  ...other
}) => {
  return (
    <div
      {...other}
      className={styles.container}
      style={{
        background: 'linear-gradient(180deg, #FFFAEC, #FCF1D0)',
      }}
    >
      <div className={styles.vendorBlock}>
        <div
          className={styles.image}
          style={{background: `url('${currentVendor?.logo}') no-repeat 100% center/cover`}}
        />
        <p>{currentVendor?.name}</p>
      </div>
      <div
        onClick={() => {
          onComboBoxClick && onComboBoxClick();
        }}
        className={styles.comboBox}
      >
        <p>{title}</p>
        <IonIcon icon={caretDown}></IonIcon>
      </div>
    </div>
  );
};

export default GameComboBox;
