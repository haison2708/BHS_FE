import { faBirthdayCake, faCakeCandles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IonModal,
  IonText,
  IonIcon,
  IonDatetime,
  IonButton,
} from "@ionic/react";
import { giftOutline } from "ionicons/icons";
import moment from "moment";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import styles from "./styles.module.scss";

interface IDatePickerProps {
  onConfirm?(value: string | string[] | null | undefined): void;
  onValueChange?(value: string | string[] | null | undefined): void;
  maxDate?: string;
  error?: ConstrainBoolean;
}

const DatePicker: React.FC<IDatePickerProps & React.HTMLProps<HTMLDivElement>> = ({
  style,
  className,
  value,
  error,
  defaultValue,
  onConfirm,
  onValueChange,
  maxDate,
  ...other
}) => {
  const datetime = useRef<null | HTMLIonDatetimeElement>(null);
  const modal = useRef<null | HTMLIonModalElement>(null);
  const {t, i18n} = useTranslation()

  const reset = () => {
    datetime.current?.reset();
  };

  const handleCancel = () => {
    modal.current?.dismiss();
  };

  const handleConfirm = async () => { //Identity Server save birthday as UTC (time zone 0)
    onConfirm && onConfirm(datetime.current?.value);
    await modal.current?.dismiss();
    await datetime?.current?.confirm();
  };

  return (
    <React.Fragment>
      <div
        {...other}
        className={styles.container + ' ' + className + ' ui-d-flex ui-w-100 ui-align-items-center ui-pd-l-15 '}
        style={style}
        // id="open-modal-birthday"
        onClick={() => modal.current?.present()}
      >
        {/* <IonIcon slot="start" icon={giftOutline} className={styles.icon}></IonIcon> */}
        <FontAwesomeIcon icon={faCakeCandles} className={styles.icon}/>
        <IonText class="ui-ml-15 ui-text-black ui-fs-16">
          {moment(datetime?.current?.value).format('DD/MM/YYYY')}
        </IonText>
      </div>
      {error && (
        <IonText color={'danger'}>
          <p className="ui-font-regular ui-fs-12 ui-lh-14 ui-pd-l-16 ui-pd-t-4 ui-pd-b-4 ui-pd-r-12">
            {t(`dateIsNotChosen`)}
          </p>
        </IonText>
      )}
      <IonModal ref={modal} keepContentsMounted={true} className={styles.modalBirthday} trigger="open-modal-birthday">
        <div>
          <div className={styles.datetime__header}>
            <h6 className="ui-fs-16 ui-fw-300 ui-text-white">{t(`chooseDate`)}</h6>
            <IonButton
              mode="ios"
              fill="outline"
              color={"light"}
              class={styles.datetime__refreshButton}
              onClick={reset}
            >
              {t(`refresh`)}
            </IonButton>
          </div>
          <div className={styles.marginBlock} />
          <IonDatetime
            color={'primary'}
            className={styles.datetime}
            showDefaultTitle={false}
            multiple={false}
            mode="md"
            value={value as string}
            max={maxDate}
            presentation="date"
            locale={i18n.language == 'vi' ? "vi-VN" : "en-US"}
            id="datetime"
            ref={datetime}
            onIonChange={(e) => {
              if (maxDate && moment(e.detail.value).isAfter(moment(maxDate))) {
                if (datetime.current) datetime.current.value = maxDate
              } else {
                onValueChange && onValueChange(e?.detail?.value);
              }
            }}
          ></IonDatetime>
          <div className={styles.datetime__footer}>
            <IonButton
              mode="ios"
              className={styles.datetime__footerButtons}
              fill="outline"
              color={'primary'}
              onClick={handleCancel}
            >
              {t(`cancel`)}
            </IonButton>
            <IonButton
              mode="ios"
              className={styles.datetime__footerButtons}
              fill="solid"
              color={'primary'}
              onClick={handleConfirm}
            >
              {t(`apply`)}
            </IonButton>
          </div>
        </div>
      </IonModal>
    </React.Fragment>
  );
};

export default DatePicker;
