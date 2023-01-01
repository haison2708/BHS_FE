import {IonCard, IonIcon, IonImg} from '@ionic/react';
import {star, timeOutline} from 'ionicons/icons';
import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {ProgramTypes} from '../../constants/constants';
import {ILoyaltyProgram} from '../../types/interface';
// import { isLoyaltyGiftExchangeProgram } from "../../utils/utils";
import styles from './styles.module.scss';
import imgProgram from '../../asset/icon/program.png';

interface IProgramCardProps {
  program?: ILoyaltyProgram;
}

const imageHolder = imgProgram;
const ProgramCard: React.FC<IProgramCardProps> = ({program}) => {
  // Controls:
  const router = useHistory();
  const {t} = useTranslation();

  const isGiftExchangeProgram = program?.type == ProgramTypes.LoyaltyGiftExchangeProgram.type;
  const handleClick = () => {
    if (isGiftExchangeProgram) {
      router.push('/gift-exchange-program-detail/' + program?.id + '/' + program?.type);
    } else {
      router.push('/accumulate-points-program-detail/' + program?.id + '/' + program?.type);
    }
  };

  return (
    <IonCard mode="ios" button className={styles.container} onClick={handleClick}>
      <div className={styles.cardTop}>
        <IonImg src={program?.imgBannerUrl || imageHolder}></IonImg>
        {isGiftExchangeProgram ? (
          <div className={styles.tradeGiftTag}>{t(`exchangeGift`)}</div>
        ) : (
          <div className={styles.accumulatePointsTag}>{t(`accamulatePoint`)}</div>
        )}
        {!isGiftExchangeProgram && (
          <div className={styles.pointsTag}>
            <IonIcon icon={star}></IonIcon>
            <p>
              {!isGiftExchangeProgram && (program?.pointOfUser || 0)} {t(`point`)}
            </p>
          </div>
        )}
      </div>
      <div className={styles.cardBottom}>
        <p slot="start" className='text-2lines'>{program?.name}</p>
        <div className={styles.timeBlock}>
          <IonIcon icon={timeOutline}></IonIcon>
          <p>
            {moment.utc(program?.startDate).local().format('DD/MM/YYYY')} -{' '}
            {moment.utc(program?.endDate).local().format('DD/MM/YYYY')}
          </p>
        </div>
      </div>
    </IonCard>
  );
};

export default ProgramCard;
