import {faGift, faStar, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {IonCard, IonText} from '@ionic/react';
import React from 'react';
import RoundIcon from '../RoundIcon';
import styles from './styles.module.scss';

interface IHistoryPointCard {
  type?: string;
  expiration?: string;
  disable?: boolean;
  value?: number;
  icon?: IconDefinition;
  colorIcon?: string;
  used?: boolean;
}

const HistoryPointCard: React.FC<IHistoryPointCard & React.HTMLProps<HTMLDivElement>> = ({
  title,
  type,
  expiration,
  disable = false,
  value,
  icon = faStar,
  colorIcon = '#F5A202',
  used = false,
  ...others
}) => {
  return (
    <IonCard className={'ion-no-padding ui-w-100'} mode="ios">
      <div className={styles.card}>
        <RoundIcon
          icon={icon}
          color={disable ? '#A4A4A8' : colorIcon}
          backgroundColor={disable ? '#A4A4A8' + '15' : colorIcon + '15'}
          fontSize="20px"
          style={{width: '40px', height: '40px'}}
        ></RoundIcon>
        <div className={styles.content}>
          <IonText className="ui-fs-16 ui-font-regular" color="dark">
            {title}
          </IonText>
          {others?.children && <IonText>{others.children}</IonText>}
          {expiration && <IonText>{expiration}</IonText>}
        </div>
        <div>
          <IonText className="ui-fs-16 ui-font-medium" color={value && value < 0 ? 'danger' : 'dark'}>
            {used ? (value!! < 0 ? value : `+${value}`) : value}
          </IonText>
        </div>
      </div>
    </IonCard>
  );
};

export default HistoryPointCard;
