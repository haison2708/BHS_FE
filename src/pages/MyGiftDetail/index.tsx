import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {t} from 'i18next';
import {chevronBack} from 'ionicons/icons';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router';
import userAPIs from '../../api/user';
import {IUserGiftOfLoyalty} from '../../types/interface';
import styles from './styles.module.scss';

interface IParamsProps {
  id: string;
}

const MyGiftDetail: React.FC = () => {
  const router = useHistory();
  const {id} = useParams<IParamsProps>();
  const [exchangeGiftDetail, setExchangeGiftDetail] = useState<IUserGiftOfLoyalty>();

  useEffect(() => {
    getGiftDetail()
  }, []);

  const getGiftDetail = async () => {
    try {
      const res = await userAPIs.getGiftOfUserDetail(id)
      setExchangeGiftDetail(res)
    } catch (e) {
      console.log("Error get ExchangeGiftDetail: ", e)
    }
  }

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent>
        <IonToolbar mode="md" className="medium-header-toolbar">
          <IonButtons slot="start">
            <IonButton
              onClick={() => {
                router.goBack();
              }}
            >
              <IonIcon icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle className={'ui-fs-16 ui-fw-400'} slot="">
            {t('detailInformation')}
          </IonTitle>
        </IonToolbar>
        <div className={styles.card + ' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}>
          <IonCard mode="ios" style={{overflow: 'visible'}} className={styles.card + ' ui-w-flatform-mobile ui-w-100'}>
            <div className={styles.headerCard}>
              <div className={styles.img}>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-39Kr20WkAWlxwkERcC87WvhXcVm8QTjeaA&usqp=CAU"
                  alt=""
                />
              </div>
              <div className={styles.headerContent}>
                <IonTitle className="ui-position-relative ui-fs-18 ui-font-bold" color={'dark'}>
                  {exchangeGiftDetail?.giftOfLoyalty?.name}
                </IonTitle>
                <IonText>{`${t('expireDate')} ${moment
                  .utc(exchangeGiftDetail?.expirationDate)
                  .local()
                  .format('DD/MM/YYYY')}`}</IonText>
              </div>
            </div>
            <div className={styles.contentCard}>
              <div className={styles.content}>
                <h6>{t('useCondition')}</h6>
                <ul>
                  <li>
                    {t('applyWhenAttendLuckyWheel')}
                    <span> {exchangeGiftDetail?.giftOfLoyalty?.fortune?.descr}</span>
                  </li>
                  <li>
                    {t('expireDate')}
                    <span> {moment.utc(exchangeGiftDetail?.expirationDate).local().format('DD/MM/YYYY')}</span>
                  </li>
                </ul>
              </div>
              <div className={styles.content}>
                <h6>{t('useInstruction')}</h6>
                <ul>
                  <li>
                    {t('accessTo')}
                    <span> {t('luckyWheel')}</span>
                  </li>
                  <li>
                    {t('chooseProgram')}
                    <span> {exchangeGiftDetail?.giftOfLoyalty?.fortune?.descr}</span>
                  </li>
                  <li>{t('spinToReceiveGift')}</li>
                </ul>
              </div>
            </div>
          </IonCard>
        </div>
        <IonFab className="ui-w-100vw  ui-pd-r-32 ui-pd-l-16" vertical="bottom" horizontal="start" slot="fixed">
          <IonButton
            mode="ios"
            color={'primary'}
            className="ui-w-100 ui-fw-300"
            // onClick={handleSubmit}
            onClick={() => {
              router.push(`/lucky-wheel/${exchangeGiftDetail?.giftOfLoyalty?.fortune?.id}`);
            }}
          >
            {t('use')}
          </IonButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default MyGiftDetail;
