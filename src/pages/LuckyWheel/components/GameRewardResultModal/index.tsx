import {IonModal} from '@ionic/react';
import {t} from 'i18next';
import React, {HTMLProps} from 'react';
import GameRoundButton from '../../../../components/GameRoundButton';
import {IReward} from '../../../../types/interface';
import styles from './styles.module.scss';

type IGameRewardResultModalProps = {
  visible: boolean;
  onDissMissModal?: () => void;
  reward?: IReward;
};

const SORRY_TYPE = 89454;

const GameRewardResultModal: React.FC<IGameRewardResultModalProps & HTMLProps<HTMLDivElement>> = ({
  visible,
  onDissMissModal,
  reward,
  children,
  ...other
}) => {
  return (
    <IonModal onDidDismiss={onDissMissModal} className={styles.modal} isOpen={visible}>
      <img className={styles.sparklingLight} src={require('../../../../asset/system/game_light.png')}></img>
      <div className={styles.content}>
        <GameRoundButton
          onButtonClick={onDissMissModal}
          className={styles.closeButton}
          image={require('../../../../asset/icon/game_close_icon.png')}
        />
        <div className={styles.mainLogo}>
          <img src={reward?.image}></img>
        </div>
        {reward?.fortuneType != SORRY_TYPE && <p>{t('congratulationsYourGiftRecived')}</p>}
        <p className={styles.giftName}>{(reward?.quantity ? reward.quantity + ' ' : '') + (reward?.descr || '')}</p>
      </div>
    </IonModal>
  );
};

export default GameRewardResultModal;
