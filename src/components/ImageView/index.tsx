import {IonButton, IonFab, IonIcon, IonImg} from '@ionic/react';
import {close} from 'ionicons/icons';
import React from 'react';
import styles from './styles.module.scss';

type IImageViewProps = {
  imageSrc?: string;
  isShow?: boolean;
  onButtonClick?: () => void;
};

const ImageView: React.FC<IImageViewProps> = ({imageSrc, isShow, onButtonClick}) => {
  return (
    <div className={styles.container} style={{display: isShow ? 'flex' : 'none'}}>
      <IonFab horizontal="end" vertical="top">
        <IonButton
          fill="clear"
          onClick={() => {
            onButtonClick && onButtonClick();
          }}
        >
          <IonIcon mode="md" color="light" icon={close}></IonIcon>
        </IonButton>
      </IonFab>
      <img src={imageSrc}></img>
    </div>
  );
};

export default ImageView;
