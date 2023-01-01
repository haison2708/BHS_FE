import {
  IonBackButton,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/react';
import {t} from 'i18next';
import {chevronBack, optionsOutline} from 'ionicons/icons';
import moment from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import userAPIs from '../../api/user';
import {useAppSelector} from '../../app/hook';
import InfoCard from '../../components/InfoCard';
import {IUserGiftOfLoyalty} from '../../types/interface';
import styles from './styles.module.scss';

const contain = {
  active: 1,
  used: 2,
  expiration: 3,
};

const MyGift: React.FC = (props) => {
  const pageRef = useRef();
  const [listMyGifts, setListMyGifts] = useState<IUserGiftOfLoyalty[]>([]);

  const [statusView, setStatusView] = useState<'active' | 'used' | 'expiration'>('active');

  useEffect(() => {
    const type = contain[statusView];
    const pageSize = 10;
    const pageIndex = 1;
    const fetchListMyGifts = async () => {
      const res = await userAPIs.getGiftsOfUser(type, pageSize, pageIndex);
      // console.log(res.data);
      setListMyGifts(res.data);
    };
    fetchListMyGifts();
  }, [statusView]);

  const renderMyGifts = (type: 'active' | 'used' | 'expiration') => {
    const isActive = type !== 'expiration';
    return (
      <>
        {listMyGifts &&
          listMyGifts?.map((gift) => (
            <IonCol className="ui-mb-16" size="12" sizeLg="6" key={gift?.id}>
              <InfoCard
                type="large"
                expiration={`${t('expireDate')} ${moment
                  .utc(gift?.expirationDate)
                  .local()
                  .format('DD/MM/YYYY')}`}
                button
                title={gift?.giftOfLoyalty?.quantity + ' ' + gift?.giftOfLoyalty?.name}
                image="https://play-lh.googleusercontent.com/z-9awB6PeArGyWNSCKDP62PLI_jnXfgEmEMJdzwYPlRnTQIFcHp2OXFIWhfFRNMcyeZ1=w280-h280"
                href={isActive ? `/my-gift/${gift?.id}` : undefined}
              ></InfoCard>
            </IonCol>
          ))}
      </>
    );
  };

  return (
    <IonPage id="main-content" className="background-gray" ref={pageRef}>
      <IonHeader id="header-toolbar">
        <IonToolbar id="" className={`ui-pd-b-10 ${styles.toolbar}`}>
          <div className="ui-mt-50 ui-d-flex ui-align-items-center ui-justify-content-space-between">
            <div className="ui-d-flex ui-align-items-center ui-w-100">
              <IonBackButton
                mode="md"
                color={'light'}
                className="ui-align-self-center"
                text={''}
                icon={chevronBack}
                defaultHref="/tabs/profile"
              />
              <IonText className="ui-align-self-center" color={'light'}>
                <h6 className="ui-m-0 ui-text-four ui-fs-16 ui-fw-400 ui-is-extra-small-font-size-5vw">
                  {t('myGift')}
                </h6>
              </IonText>
              <IonIcon className={styles.icon} icon={optionsOutline} color="light"></IonIcon>
            </div>
            <div className="ui-d-flex ui-align-items-center"></div>
          </div>
          <div className="ui-d-flex ui-align-items-center ui-gap-2 ui-mt-15">
            <IonButton
              mode="md"
              className={
                statusView === 'active'
                  ? styles.buttonViewChoice + ` ion-padding-none ui-flex-grow-1 ui-w-32`
                  : styles.buttonView + ` ion-padding-none ui-flex-grow-1 ui-w-32`
              }
              onClick={() => {
                setStatusView('active');
              }}
            >
              <IonText className="ui-align-self-center" color={statusView === 'active' ? 'primary' : 'light'}>
                <h6 className=" ui-m-0 ui-font-regular ui-fs-15 ui-is-extra-small-font-size-5vw  ui-text-initial">
                  {t('notExpired')}
                </h6>
              </IonText>
            </IonButton>
            <IonButton
              mode="md"
              className={
                statusView === 'used'
                  ? styles.buttonViewChoice + ` ion-padding-none ui-flex-grow-1 ui-w-32`
                  : styles.buttonView + ` ion-padding-none ui-flex-grow-1 ui-w-32`
              }
              onClick={() => {
                setStatusView('used');
              }}
            >
              <IonText className="ui-align-self-center" color={statusView === 'used' ? 'primary' : 'light'}>
                <h6 className="ui-m-0 ui-font-regular ui-fs-15 ui-is-extra-small-font-size-5vw  ui-text-initial">
                  {t('used')}
                </h6>
              </IonText>
            </IonButton>
            <IonButton
              mode="md"
              className={
                statusView === 'expiration'
                  ? styles.buttonViewChoice + ` ion-padding-none ui-flex-grow-1 ui-w-32`
                  : styles.buttonView + ` ion-padding-none ui-flex-grow-1 ui-w-32`
              }
              onClick={() => {
                setStatusView('expiration');
              }}
            >
              <IonText className="ui-align-self-center " color={statusView === 'expiration' ? 'primary' : 'light'}>
                <h6 className="ui-m-0 ui-font-regular ui-fs-15 ui-is-extra-small-font-size-5vw  ui-text-initial">
                  {t('expired')}
                </h6>
              </IonText>
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonGrid style={{display: 'grid', gap: '16px'}}>
          <IonRow>{renderMyGifts(statusView)}</IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default MyGift;
