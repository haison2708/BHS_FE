import {faStar} from '@fortawesome/free-solid-svg-icons';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar} from '@ionic/react';
import {t} from 'i18next';
import {chevronBack, optionsOutline} from 'ionicons/icons';
import React from 'react';
import {useHistory} from 'react-router';
import {useAppSelector} from '../../app/hook';
import ExchangeGiftItem from '../../components/ExchangeGiftItem';
import PointGiftCard from '../../components/PointGiftCard';
import {selectGiftsFromSelectedVendor, selectUserLoyalty} from '../../features/user/userSlice';
import styles from './styles.module.scss';

interface IExchangeGiftDetailProps {}

const ExchangeGiftDetail: React.FC<IExchangeGiftDetailProps & React.HTMLProps<HTMLDivElement>> = () => {
  const giftsFromSelectedVendor = useAppSelector(selectGiftsFromSelectedVendor);
  const userLoyalty = useAppSelector(selectUserLoyalty);

  const router = useHistory();

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent>
        <IonToolbar mode="md" className="medium-header-toolbar">
          <IonButtons slot="start">
            <IonButton
              fill="clear"
              color={'light'}
              onClick={() => {
                router.goBack();
              }}
            >
              <IonIcon icon={chevronBack} color={'white'} />
            </IonButton>
          </IonButtons>
          <IonTitle className={'ui-fs-16 ui-fw-400'} slot="">
            {t('accamulatePointToExchangeGift')}
          </IonTitle>
          <IonIcon className={styles.icon} icon={optionsOutline} color="light" slot="end"></IonIcon>
        </IonToolbar>
        <div className={styles.card + ' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}>
          <PointGiftCard
            point={{
              icon: faStar,
              colorIcon: '#F5A202',
              expiration: userLoyalty?.aboutToExpire,
              fontSize: 24,
              title: `${t('totalLoyaltyPoints')}`,
              value: userLoyalty?.totalPoint?.toString(),
            }}
            footer
            href="/earn-point-history"
          />
        </div>
        <div className={styles.exchanceGiftContainer}>
          {giftsFromSelectedVendor.map((item) => {
            const {giftOfLoyalty, ...program} = item;
            const gift = giftOfLoyalty?.[0];
            if (gift)
              return (
                <div key={gift.id} className={' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}>
                  <ExchangeGiftItem
                    processBar
                    gift={gift}
                    program={program}
                    disabled={gift.qtyAvailable === 0}
                    myPoint={userLoyalty?.totalPoint}
                  />
                </div>
              );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ExchangeGiftDetail;
