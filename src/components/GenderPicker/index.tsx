import { faGenderless, faTransgender, faTransgenderAlt, faVenusMars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IonModal, IonText, IonIcon } from "@ionic/react";
import {
  checkmarkCircle,
  femaleOutline,
  maleFemaleOutline,
  maleOutline,
} from "ionicons/icons";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface IGenderPickerProps {
  onConfirm?(value: string | string[] | null | undefined): void;
  onValueChange?(value: number): void;
  error?: boolean;
}

const GenderPicker: React.FC<IGenderPickerProps & React.HTMLProps<HTMLDivElement>> = ({
  style,
  className,
  value,
  error,
  onConfirm,
  onValueChange,
  ...other
}) => {
  const modal = useRef<null | HTMLIonModalElement>(null);
  const {t} = useTranslation()

  const genders = [
    {
      value: 0,
      display: t(`female`),
    },
    {
      value: 1,
      display: t(`male`),
    },
  ];

  const renderValue = () => {
    const g = genders.find((item) => {
      return item?.value === value;
    });
    return g?.display;
  };

  return (
    <React.Fragment>
      <div
        onClick={() => {
          modal?.current?.present();
        }}
        {...other}
        className={styles.container + ' ' + className + ' ui-d-flex ui-w-100 ui-align-items-center ui-pd-l-15 '}
        style={style}
      >
        <FontAwesomeIcon icon={faVenusMars} className={styles.icon}/>
        <IonText class="ui-ml-15 ui-text-black ui-fs-16">{renderValue()}</IonText>
      </div>
      {error && (
        <IonText color={'danger'}>
          <p className="ui-font-regular ui-fs-12 ui-lh-14 ui-pd-l-16 ui-pd-t-4 ui-pd-b-4 ui-pd-r-12">
            {t(`genderIsNotChosen`)}
          </p>
        </IonText>
      )}
      <IonModal mode="md" ref={modal} keepContentsMounted={true} className={styles.modal}>
        <div className={styles.genders__container}>
          <div className={styles.genders__header}> {t(`chooseGender`)}</div>
          <div className={styles.genders__content}>
            {genders?.map((item, index) => {
              const isActive = value === item?.value;
              return (
                <React.Fragment key={index}>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onValueChange && onValueChange(item?.value);
                      modal?.current?.dismiss();
                    }}
                    key={index}
                    className={
                      styles.genders__item + ' ion-no-padding ' + (isActive ? styles['genders__item--active'] : '')
                    }
                  >
                    <div className="ui-d-flex ui-center ui-h-100">
                      <IonIcon
                        color={isActive ? 'danger' : ''}
                        icon={item?.value === 0 ? femaleOutline : maleOutline}
                      ></IonIcon>
                      <IonText class="ui-ml-12">{item?.display}</IonText>
                    </div>
                    {isActive && (
                      <div className="ui-d-flex ui-center ui-h-100">
                        <IonIcon icon={checkmarkCircle}></IonIcon>
                      </div>
                    )}
                  </div>
                  {index < genders?.length - 1 && <div className={styles.divider}></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </IonModal>
    </React.Fragment>
  );
};

export default GenderPicker;
