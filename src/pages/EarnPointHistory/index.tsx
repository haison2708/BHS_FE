import {faGift, faStar} from '@fortawesome/free-solid-svg-icons';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import {t} from 'i18next';
import {chevronBack} from 'ionicons/icons';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import userAPIs from '../../api/user';
import {useAppSelector} from '../../app/hook';
import HistoryPointCard from '../../components/HistoryPointCard';
import PointGiftCard from '../../components/PointGiftCard';
import {selectUserLoyalty} from '../../features/user/userSlice';
import styles from './styles.module.scss';

interface IEarnPointHistoryCard {
  totalPoints?: number;
  expirationDate?: string;
  programName?: string;
  programId?: string;
}

interface IEarnPointHistoryUsedCard {
  id?: number;
  title?: string;
  programName?: string;
  point?: number;
  expirationDate?: string;
}

const EarnPointHistory: React.FC = () => {

  // Redux:
  const userLoyalty = useAppSelector(selectUserLoyalty);

  const [loading, setLoading] = useState<boolean>(true);
  const [state, setState] = useState<'active' | 'expiration'>('active');
  const [listEarnPointHistory, setListEarnPointHistory] = useState<IEarnPointHistoryCard[]>([]);
  const [listEarnPointHistoryUsed, setListEarnPointHistoryUsed] = useState<IEarnPointHistoryUsedCard[]>([]);

  useEffect(() => {
    getData();
  }, []);

  const getListEarnPointHistory = async () => {
    const res = await userAPIs.getEarnPointHistory();
    const listItems: IEarnPointHistoryCard[] = res?.data
      ? res?.data?.filter((item: IEarnPointHistoryCard) => item?.totalPoints!! > 0)
      : [];
    setListEarnPointHistory(listItems);
  };

  const getListEarnPointHistoryUsed = async () => {
    const res = await userAPIs.getEarnPointHistoryUsed();
    setListEarnPointHistoryUsed(res.data);
  };

  const getData = async () => {
    try {
      setLoading(true);
      await getListEarnPointHistory();
      await getListEarnPointHistoryUsed();
    } catch (e) {
      console.log('Error get points: ', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent>
        <IonToolbar mode="md" className="large-header-toolbar">
          <div className="ui-d-flex">
            <IonButtons slot="start">
              <IonBackButton mode="md" icon={chevronBack} defaultHref="/exchange-gift-detail"></IonBackButton>
            </IonButtons>
            <IonTitle className={'ui-fs-16 ui-fw-400'} slot="">
              {t('accamulatePointHistory')}
            </IonTitle>
          </div>
          <div className={styles.tags}>
            <IonButton
              mode="ios"
              fill={state === 'active' ? 'solid' : 'outline'}
              color="light"
              className={styles.button}
              onClick={() => {
                setState('active');
              }}
            >
              <IonText className="ui-align-self-center" color={state === 'active' ? 'primary' : 'light'}>
                <h6 className=" ui-m-0 ui-text-four ui-fs-16 ui-font-regular ui-is-extra-small-font-size-5vw  ui-text-initial">
                  {t('notExpired')}
                </h6>
              </IonText>
            </IonButton>
            <IonButton
              mode="ios"
              fill={state === 'expiration' ? 'solid' : 'outline'}
              color="light"
              className={styles.button}
              onClick={() => {
                setState('expiration');
              }}
            >
              <IonText className="ui-align-self-center" color={state === 'expiration' ? 'primary' : 'light'}>
                <h6 className="ui-m-0 ui-text-four ui-fs-16 ui-font-regular ui-is-extra-small-font-size-5vw  ui-text-initial">
                  {t('used')}
                </h6>
              </IonText>
            </IonButton>
          </div>
        </IonToolbar>
        <div className={styles.card + ' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}>
          <PointGiftCard
            point={{
              icon: faStar,
              colorIcon: '#F5A202',
              fontSize: 24,
              title: `${t('totalLoyaltyPoints')}`,
              value: userLoyalty?.totalPoint?.toString(),
            }}
          />
        </div>
        <div className={styles.cardPointContainer}>
          {loading ? (
            <div className={styles.loading}>
              <IonSpinner color={'primary'} />
            </div>
          ) : state === 'active' ? (
            listEarnPointHistory.map((item, index) => (
              <div
                key={index}
                className={styles.card + ' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}
              >
                <HistoryPointCard
                  title={item.programName}
                  expiration={`${t('expireDate')} ${moment.utc(item.expirationDate).local().format('DD/MM/YYYY')}`}
                  value={item.totalPoints}
                />
              </div>
            ))
          ) : (
            listEarnPointHistoryUsed.map((item, index) => (
              <div
                key={index}
                className={styles.card + ' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}
              >
                <HistoryPointCard
                  value={item.point}
                  title={item.title}
                  expiration={`Hạn sử dụng: ${moment.utc(item.expirationDate).local().format('DD/MM/YYYY')}`}
                  icon={faStar}
                  colorIcon="#F5A202"
                  used
                >
                  {item.programName}
                </HistoryPointCard>
              </div>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EarnPointHistory;
