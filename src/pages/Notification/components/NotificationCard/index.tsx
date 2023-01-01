import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {faBell, faGift, faStar, IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IonCard, IonText} from '@ionic/react';
import React from 'react';
import {useHistory} from 'react-router';
import {typeOfNotificationSetup} from '../../../../constants/constants';
import {useSignalR} from '../../../../hooks/useSignalR';
import {INotificationMessage} from '../../../../types/interface';
import styles from './styles.module.scss';

type INotificationCardProps = {
  fromColor?: string;
  toColor?: string;
  icon?: any;
  button?: boolean;
  notification: INotificationMessage;
};

const redStyle = {background: `linear-gradient(137deg, #E41A23, #E9474F)`};
const blackStyle = {background: `linear-gradient(137deg, #0D0C22, #3D3C4E)`};
const yellowStyle = {background: `linear-gradient(137deg, #F5A202, #F6B434)`};

const NotificationCard: React.FC<INotificationCardProps> = ({icon, button = true, notification}) => {
  //Controls:
  const router = useHistory();

  //Signalr;
  const {getInstance} = useSignalR();

  const seenMessage = async () => {
    if (notification.seen) return;

    const signalrConnection = await getInstance();
    if (signalrConnection) {
      try {
        signalrConnection.invoke('seenNotify', notification?.id);
      } catch (e) {
        console.log(`Fail to invoke method seenNotify id: ${notification?.id} : `, e);
      }
    } else {
      console.log('signalR server is not connected!');
    }
  };

  const handleClick = async () => {
    if (notification?.notificationSetup?.type === typeOfNotificationSetup.promotionProgramPoint) {
      seenMessage()
      router.push(`/earn-point-history`);
    }

    if (notification.notificationSetup?.type === typeOfNotificationSetup.promotionProgram) {
      seenMessage()
      router.push(notification?.notificationSetup?.remark || '/');
    }

    if (
      notification?.notificationSetup?.type === typeOfNotificationSetup.system ||
      notification?.notificationSetup?.type === typeOfNotificationSetup.other
    ) {
      router.push({pathname: `/notification-detail/${notification?.id}`, state: {notification: notification}});
    }
  };

  return (
    <IonCard mode="ios" button={button} onClick={handleClick}>
      <div className={styles.content}>
        <div className={styles['content__left']}>
          <div
            className={styles.iconWrapper}
            style={
              (notification.notificationSetup?.type == typeOfNotificationSetup.promotionProgram && redStyle) ||
              (notification.notificationSetup?.type == typeOfNotificationSetup.promotionProgramPoint && yellowStyle) ||
              blackStyle
            }
          >
            <FontAwesomeIcon
              className={styles.icon}
              icon={
                icon ||
                (notification.notificationSetup?.type == typeOfNotificationSetup.promotionProgram && faGift) ||
                (notification.notificationSetup?.type == typeOfNotificationSetup.promotionProgramPoint && faStar) ||
                faBell
              }
            ></FontAwesomeIcon>
          </div>
        </div>
        <div className={styles['content__center']}>
          <IonText color={'dark'}>
            <p className={styles.title}>{notification?.notificationSetup?.title}</p>
          </IonText>
          <p className={styles.timeLine}>{notification?.notificationSetup?.subTitle}</p>
          <p className={styles.description}>{notification?.notificationSetup?.content}</p>
        </div>
        {!notification.seen && (
          <div className={styles['content__right']}>
            <div className={styles.dot}></div>
          </div>
        )}
      </div>
    </IonCard>
  );
};

export default NotificationCard;
