import {faCalendarDays, faCheckDouble} from '@fortawesome/free-solid-svg-icons';
import styles from './styles.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/react';
import {chevronBack} from 'ionicons/icons';
import _ from 'lodash';
import React, {useState} from 'react';
import NotificationCard from './components/NotificationCard';
import {useHistory} from 'react-router';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {
  getNotifications,
  selectAllNotificationsData,
  selectOtherNotificationsData,
  selectPromotionNotificationsData,
  selectSystemNotificationsData,
} from '../../features/notification/notificationSlice';
import {INotificationMessage} from '../../types/interface';
import {useSignalR} from '../../hooks/useSignalR';
import { useTranslation } from 'react-i18next';

type ViewType = 'all' | 'promotion' | 'other' | 'system';
const Notification: React.FC = (props) => {
  // Redux:
  const dispatch = useAppDispatch();
  const allNotifications = useAppSelector(selectAllNotificationsData);
  const promotionNotifications = useAppSelector(selectPromotionNotificationsData);
  const systemNotifications = useAppSelector(selectSystemNotificationsData);
  const otherNotifications = useAppSelector(selectOtherNotificationsData);
  const {getInstance} = useSignalR();

  // Controls:
  const [viewStatus, setViewStatus] = useState<ViewType>('all');
  const router = useHistory();
  const {t} = useTranslation()

  const seenAllMessages = async () => {
    const signalrConnection = await getInstance();
    if (signalrConnection) {
      try {
        signalrConnection.invoke('seenNotify', null); // second param options: 1.null: seen all, 2.'id': seen specific notification by id
        // signalR listener will automaticly call api to get lastest noties
      } catch (e) {
        console.log('Fail to invoke method seenNotify: ', e);
      }
    } else {
      console.log('signalR server is not connected!');
    }
  };

  const renderViewButton = (viewType: ViewType, title?: string, count?: number) => {
    return (
      <div className={styles.buttonWrapper}>
        <IonButton
          className={styles.button}
          mode="ios"
          color={'light'}
          fill={viewStatus === viewType ? 'solid' : 'outline'}
          onClick={() => {
            setViewStatus(viewType);
          }}
        >
          <IonText className="ui-align-self-center ui-fs-16 ui-fw-300">
            <p>{title}</p>
          </IonText>
        </IonButton>
        {!!count && <div className={styles.badge}>{count}</div>}
      </div>
    );
  };

  const renderListNotifications = () => {
    let displayList: INotificationMessage[] = [];

    if (viewStatus === 'all') {
      displayList = allNotifications?.notifyMessages || [];
    }

    if (viewStatus === 'promotion') {
      displayList = promotionNotifications?.notifyMessages || [];
    }

    if (viewStatus === 'other') {
      displayList = otherNotifications?.notifyMessages || [];
    }

    if (viewStatus === 'system') {
      displayList = systemNotifications?.notifyMessages || [];
    }

    return (
      <IonGrid class={styles.listGrid}>
        {displayList.map((item, index) => {
          return (
            <IonRow key={index}>
              <NotificationCard notification={item}></NotificationCard>
            </IonRow>
          );
        })}
      </IonGrid>
    );
  };

  return (
    <IonPage id="main-content" className="background-gray">
      <IonHeader id="header-toolbar">
        <IonToolbar mode="ios" className={'medium-header-toolbar ' + styles.toolbar}>
          <IonButtons className={styles.toolbar__navigate}>
            <IonButton
              mode="md"
              onClick={() => {
                router.goBack();
              }}
            >
              <IonIcon color="light" icon={chevronBack}></IonIcon>
            </IonButton>
            <div style={{flex: 1}}>{t(`notification`)}</div>
            <IonButton
              mode="md"
              fill="clear"
              slot="end"
              onClick={() => {
                seenAllMessages();
              }}
            >
              <FontAwesomeIcon fontSize={'20px'} color="white" icon={faCheckDouble}></FontAwesomeIcon>
            </IonButton>
            <IonButton mode="md" fill="clear" slot="end" onClick={() => {}}>
              <FontAwesomeIcon fontSize={'20px'} color="white" icon={faCalendarDays}></FontAwesomeIcon>
            </IonButton>
          </IonButtons>
          <div className={styles.buttonsContainer}>
            {renderViewButton('all', t(`all`), allNotifications?.notSeen)}
            {renderViewButton('promotion', t(`endow`), promotionNotifications?.notSeen)}
            {renderViewButton('other', t(`otherActivities`), otherNotifications?.notSeen)}
            {renderViewButton('system', t(`system`), systemNotifications?.notSeen)}
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        {renderListNotifications()}
      </IonContent>
    </IonPage>
  );
};

export default Notification;
