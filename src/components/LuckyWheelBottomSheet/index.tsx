import {IonIcon, IonModal} from '@ionic/react';
import {t} from 'i18next';
import {chevronForward} from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import {useHistory} from 'react-router';
import vendorAPIs from '../../api/vendor';
import { useAppSelector } from '../../app/hook';
import { selectUserLoyalty } from '../../features/user/userSlice';
import { IVendorWithLuckyWheelTurn } from '../../types/interface';
import styles from './styles.module.scss';

type ILuckyWheelBottomSheetProps = {
  visible: boolean;
  onModalDidDismiss?: () => void;
};

const LuckyWheelBottomSheet: React.FC<ILuckyWheelBottomSheetProps> = ({visible, onModalDidDismiss}) => {
  // Controls:
  const router = useHistory();

  // Redux:
  const userLoyalty = useAppSelector(selectUserLoyalty);

  // State:
  const [listTurnCount, setListTurnCount] = useState<IVendorWithLuckyWheelTurn[]>([])

  useEffect(() => {
    if (visible) getListTurnCount()
  }, [visible])

  const getListTurnCount = async () => {
    try {
      const res = await vendorAPIs.getLuckyWheelTurns()
      setListTurnCount(res)
    } catch (e) {
      console.log('Error get list turn count: ' + e)
    }
  }

  return (
    <IonModal
      className={styles.actionSheet}
      mode="ios"
      isOpen={visible}
      onDidDismiss={() => {
        onModalDidDismiss && onModalDidDismiss();
      }}
      initialBreakpoint={1}
      breakpoints={[0, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
    >
      <div className={styles.actionSheet__content}>
        <div className={styles.actionSheet__content__header}>
          <img className={styles.logo} src={require('../../asset/system/game_rule_logo.png')}></img>
          <div className={styles.textBlock}>{t('luckyWheel')}</div>
          <div className={styles.chip}>{`${userLoyalty?.luckyWheelTurns} ${t('turn').toLowerCase()}`}</div>
        </div>
        <div className={styles.actionSheet__content__list}>
          {listTurnCount?.map((item, index) => {
            return (
              <div
                className={styles.actionSheet__content__list__item}
                key={index}
                onClick={() => {
                  onModalDidDismiss && onModalDidDismiss();
                  router.push({pathname: `/lucky-wheel`, state: {vendorId: item?.id}});
                }}
              >
                <div className={styles.left}>
                  <div
                    className={styles.image}
                    style={{
                      background: `url('${item?.logo}') no-repeat 100% center/cover`,
                    }}
                  ></div>
                  <p>{item?.name}</p>
                </div>
                <div className={styles.right}>
                  {item?.luckyWheelTurns} <IonIcon icon={chevronForward} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </IonModal>
  );
};

export default LuckyWheelBottomSheet;
