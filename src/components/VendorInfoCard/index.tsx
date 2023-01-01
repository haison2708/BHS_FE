import {faGift, faStar} from '@fortawesome/free-solid-svg-icons';
import {IonCard, IonIcon, IonLabel, IonRippleEffect} from '@ionic/react';
import {t} from 'i18next';
import {chevronDownCircleOutline} from 'ionicons/icons';
import * as React from 'react';
import {useHistory} from 'react-router';
import {useAppSelector} from '../../app/hook';
import {selectUserLoyalty} from '../../features/user/userSlice';
import {IVendor} from '../../types/interface';
import RoundIcon from '../RoundIcon';
import styles from './styles.module.scss';

export interface IVendorInfoCardProps {
  rightIcon?: string;
  hasButtons?: boolean;
  onLeftButtonClick?: Function;
  onRighttButtonClick?: Function;
  vendor?: IVendor;
}

const VendorInfoCard: React.FC<IVendorInfoCardProps & React.HTMLProps<HTMLDivElement>> = ({
  hasButtons = false,
  vendor,
  rightIcon,
  className,
  style,
  ...other
}) => {
  // Redux:
  const userLoyalty = useAppSelector(selectUserLoyalty);

  // Controls:
  const router = useHistory();

  return (
    <div {...other} style={style} className={styles.container + ' ' + className}>
      <IonCard mode="ios" className={hasButtons ? '' : styles.shrink}>
        <div className={styles.card__top}>
          <div className={styles.card__topLeft} style={{backgroundImage: `url('${vendor?.logo}')`}} />
          <div className={styles.card__topCenter}>
            <IonLabel>{vendor?.name}</IonLabel>
            <IonLabel className={hasButtons ? styles.point__hidden : styles.point__show}>
              {userLoyalty?.totalPoint?.toString()} {t('point').toLocaleLowerCase()}
            </IonLabel>
          </div>
          <div
            className={styles.card__topRight}
            onClick={() => {
              router.push('/vendors');
            }}
          >
            <IonIcon icon={rightIcon || chevronDownCircleOutline}></IonIcon>
          </div>
        </div>
        {hasButtons && (
          <div className={styles.card__bottom}>
            <div
              className={styles.card__bottomButton + ' ion-activatable ripple-parent'}
              onClick={() => {
                router.push('/exchange-gift-detail');
              }}
            >
              <div className={styles.card__bottomButtonLeft}>
                <RoundIcon
                  icon={faStar}
                  color={'#F5A202'}
                  backgroundColor={'#F5A202' + '15'}
                  fontSize="16px"
                  className={styles.card__bottomButtonLeftIcon}
                />
              </div>
              <div className={styles.card__bottomButtonRight}>
                <IonLabel>
                  {userLoyalty?.totalPoint?.toString()} {t('point').toLocaleLowerCase()}
                </IonLabel>
                <p>{t('loyaltyPoint')}</p>
              </div>
              <IonRippleEffect></IonRippleEffect>
            </div>
            <div className={styles.divider}></div>
            <div
              className={styles.card__bottomButton + ' ion-activatable ripple-parent'}
              onClick={() => {
                router.push('/my-gift');
              }}
            >
              <div className={styles.card__bottomButtonLeft}>
                <RoundIcon
                  icon={faGift}
                  color={'#D92332'}
                  backgroundColor={'#D92332' + '15'}
                  fontSize="16px"
                  className={styles.card__bottomButtonLeftIcon}
                />
              </div>
              <div className={styles.card__bottomButtonRight}>
                <IonLabel>{t('myGift')}</IonLabel>
                <p>
                  {userLoyalty?.totalGift || '0'} {t('unusedGift').toLocaleLowerCase()}
                </p>
              </div>
              <IonRippleEffect></IonRippleEffect>
            </div>
          </div>
        )}
        {other.children && other.children}
      </IonCard>
    </div>
  );
};

export default VendorInfoCard;
