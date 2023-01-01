import {IonModal} from '@ionic/react';
import {t} from 'i18next';
import React, {HTMLProps} from 'react';
import GameRoundButton from '../../../../components/GameRoundButton';
import styles from './styles.module.scss';

type IGameRuleModalProps = {
  visible: boolean;
  onDissMissModal?: () => void;
};

const GameRuleModal: React.FC<IGameRuleModalProps & HTMLProps<HTMLDivElement>> = ({
  visible,
  onDissMissModal,
  children,
  ...other
}) => {
  return (
    <IonModal onDidDismiss={onDissMissModal} className={styles.modal} isOpen={visible}>
      <div className={styles.content}>
        <img className={styles.handle} src={require('../../../../asset/system/game_rule_handle.png')}></img>
        <img className={styles.logo} src={require('../../../../asset/system/game_rule_logo.png')}></img>
        <GameRoundButton
          onButtonClick={onDissMissModal}
          className={styles.closeButton}
          image={require('../../../../asset/icon/game_close_icon.png')}
        />
        <p className={styles.title}>{t('gameRule')}</p>
        <p className={styles.description}>{t('gameRuleDetail')}</p>
        <div className={styles.turnsBlock}>
          <img src={require('../../../../asset/system/game_gift_item.png')}></img>
          <p className={styles.title}>{t('turn')}</p>
        </div>
        <div className={styles.sorryBlock}>
          <p>{t('gameLosingRuleDetail')}</p>
          <img src={require('../../../../asset/system/game_sorry_item.png')}></img>
        </div>
      </div>
    </IonModal>
  );
};

export default GameRuleModal;
