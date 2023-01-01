import {IonIcon, IonModal, IonText} from '@ionic/react';
import {t} from 'i18next';
import {checkmarkCircle} from 'ionicons/icons';
import React, {forwardRef} from 'react';
import {Languages} from '../../constants/constants';
import styles from './styles.module.scss';

type IModalLanguageProps = {
  langId?: string;
  onValueChange: (value: string) => void;
  enabled?: boolean;
};

const ModalLanguage = forwardRef<HTMLIonModalElement, IModalLanguageProps>(
  ({langId, onValueChange, enabled = true}, ref) => {
    return (
      <IonModal mode="md" ref={ref} keepContentsMounted={true} className={styles.modal}>
        <div className={styles.container}>
          <div className={styles.header}> {t('chooseLanguage')}</div>
          <div className={styles.content}>
            {Languages?.map((item, index) => {
              const isActive = langId == item.langId;
              return (
                <React.Fragment key={index}>
                  <div
                    onClick={(e) => {
                      if (!enabled) return;
                      e.stopPropagation();
                      onValueChange && onValueChange(item.langId);
                    }}
                    key={index}
                    className={styles.item + ' ion-no-padding ' + (isActive ? styles['item--active'] : '')}
                  >
                    <div className="ui-d-flex ui-center ui-h-100">
                      <img src={item.image} />
                      <IonText class="ui-ml-12">{item.displayName}</IonText>
                    </div>
                    {isActive && (
                      <div className="ui-d-flex ui-center ui-h-100">
                        <IonIcon icon={checkmarkCircle}></IonIcon>
                      </div>
                    )}
                  </div>
                  {index < Languages?.length - 1 && <div className={styles.divider}></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </IonModal>
    );
  }
);

export default ModalLanguage;
