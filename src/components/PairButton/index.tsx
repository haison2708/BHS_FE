import { faQrcode, faTrain } from "@fortawesome/free-solid-svg-icons";
import { IonCard, IonLabel, IonRippleEffect, IonRow } from "@ionic/react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import RoundIcon from "../RoundIcon";
import styles from './styles.module.scss'

export interface IPairButtonProps {
  onLeftButtonClick?: () => void,
  onRighttButtonClick?: () => void,
  leftIcon?: string,
  rightIcon?: string,
}

const PairButton: React.FC<
IPairButtonProps & React.HTMLProps<HTMLDivElement>
> = ({
  leftIcon,
  rightIcon,
  onLeftButtonClick,
  onRighttButtonClick,
  className,
  style,
  ...other
}) => {

  const router = useHistory()
  const {t} = useTranslation()

  const goToScanner = () => {
    router.push('/qr-scanner')
  }

  const goToVendors = () => {
    router.push('/vendors')
  }
  return (
    <div
      {...other}
      style={style}
      className={styles.container + " " + className}
    >
        <IonCard mode="ios" className="ion-no-padding">
          <div className={styles.content}>
          <div className={styles.content__button + ' ion-activatable ripple-parent'} onClick={onLeftButtonClick ? onLeftButtonClick : goToScanner}>
              <div className={styles.content__buttonLeft}>
              <RoundIcon
                    icon={leftIcon ? leftIcon :faQrcode}
                    linearGradient
                    color={'#21367B'}
                    backgroundColor={'#21367B' + "15"}
                    fontSize="18px"
                    className={styles.content__buttonLeftIcon}
                  />
              </div>
              <div className={styles.content__buttonRight}>
                <IonLabel>{t(`scanBarcode`)}</IonLabel>
              </div>
              <IonRippleEffect></IonRippleEffect>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.content__button + ' ion-activatable ripple-parent'} onClick={onRighttButtonClick ? onRighttButtonClick : goToVendors}>
              <div className={styles.content__buttonLeft}>
              <RoundIcon
                    icon={rightIcon? rightIcon : faTrain}
                    linearGradient
                    color={'#21367B'}
                    backgroundColor={'#21367B' + "15"}
                    fontSize="18px"
                    className={styles.content__buttonLeftIcon}
                  />
              </div>
              <div className={styles.content__buttonRight}>
                <IonLabel>{t(`vendor`)}</IonLabel>
              </div>
              <IonRippleEffect></IonRippleEffect>
            </div>
          </div>
        </IonCard>
    </div>
  );
};

export default PairButton;
