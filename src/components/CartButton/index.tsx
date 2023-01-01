import {cartOutline} from 'ionicons/icons';
import {useHistory} from 'react-router';
import BadgeButton from '../BadgeButton';

type Props = {};

const CartButton = (props: Props) => {
  // Controls:
  const router = useHistory();
  
  const handleRenderCountNumber = (number: number = 0) => {
    if (number <= 0) return ''
    if (number > 99) return '99+'
    return number.toString()
  }
  return (
    <BadgeButton
      icon={cartOutline}
      text={''}
      onClick={() => {
        router.push('/notification');
      }}
    />
  );
};

export default CartButton;
