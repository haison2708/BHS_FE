import {notificationsOutline} from 'ionicons/icons';
import {useHistory} from 'react-router';
import {useAppSelector} from '../../app/hook';
import {selectAllNotificationsData} from '../../features/notification/notificationSlice';
import BadgeButton from '../BadgeButton';

type Props = {};

const NotificationButton = (props: Props) => {
  // Controls:
  const router = useHistory();

  // Redux:
  const allNotifications = useAppSelector(selectAllNotificationsData);

  const handleRenderCountNumber = (number: number = 0) => {
    if (number <= 0) return ''
    if (number > 99) return '99+'
    return number.toString()
  }
  
  return (
    <BadgeButton
      icon={notificationsOutline}
      text={handleRenderCountNumber(allNotifications?.notSeen)}
      onClick={() => {
        router.push('/notification');
      }}
    />
  );
};

export default NotificationButton;
