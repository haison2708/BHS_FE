import {
  faAnchorLock,
  faClock,
  faClockFour,
  faGift,
  faTimesCircle,
  faUserClock,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonToolbar,
} from '@ionic/react';
import {chevronBack, time, timeOutline} from 'ionicons/icons';
import { useEffect } from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation, useParams} from 'react-router';
import { useSignalR } from '../../hooks/useSignalR';
import { INotificationMessage } from '../../types/interface';
import styles from './styles.module.scss';

interface INotificationDetailProps {}

const NotificationDetail = (props: INotificationDetailProps) => {
  // Params:
  const {id} = useParams<{id: string}>();
  const routeState = useLocation().state as {notification: INotificationMessage}

  // Controls:
  const {t} = useTranslation();
  const router = useHistory();

  //Signalr;
  const {getInstance} = useSignalR();

  useEffect(() => {
    seenMessage()
  }, [id])

  const seenMessage = async () => {
    if (routeState.notification.seen) return;

    const signalrConnection = await getInstance();
    if (signalrConnection) {
      try {
        signalrConnection.invoke('seenNotify', Number(id)); // second param options: 1.null: seen all, 2.'id': seen specific notification by id
        // signalR listener will automatically call api to get latest noties
      } catch (e) {
        console.log(`Fail to invoke method seenNotify id: ${id} : `, e);
      }
    } else {
      console.log('signalR server is not connected!');
    }
  };

  return (
    <IonPage>
      <IonHeader className={styles.header}>
        <IonToolbar className={'medium-header-toolbar ' + styles.toolbar}>
          <IonButtons>
            <IonButton
              mode="ios"
              onClick={() => {
                router.goBack();
              }}
            >
              <IonIcon color="light" icon={chevronBack} />
            </IonButton>
            <div className={styles.titleWrapper}>{t(`detailInformation`)}</div>
          </IonButtons>
        </IonToolbar>
        <IonCard className={styles.card}>
          <div className={styles.card__line}>
            <FontAwesomeIcon fontSize={'14px'} color="#D92332" icon={faGift}></FontAwesomeIcon>
            <p className={styles.title}>{routeState?.notification?.notificationSetup?.title}</p>
          </div>
          <div className={styles.card__line + ' ' + styles.gray}>
            <IonIcon icon={timeOutline} />
            <p>{routeState?.notification?.notificationSetup?.subTitle}</p>
          </div>
          <div className={styles.card__content}>
            <p>{routeState?.notification?.notificationSetup?.content}</p>
            {/* <img
              src="https://www.upwork.com/catalog-images-resized/f7d56c964a9a9ebd8ce0ae3c67684085/large"
              alt="notification-image"
            /> */}
          </div>
        </IonCard>
      </IonHeader>
      <IonContent></IonContent>
    </IonPage>
  );
};

export default NotificationDetail;
