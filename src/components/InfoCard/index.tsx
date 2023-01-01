import {IonCard, IonIcon, IonImg, IonText} from '@ionic/react';
import {chevronForward} from 'ionicons/icons';
import React from 'react';
import {useHistory} from 'react-router';
import styles from './styles.module.scss';
import iconLuckWheel from '../../asset/icon/lucky_wheel.png';

interface IInfoCardProps {
  image?: string;
  rightIcon?: string;
  title?: string;
  leftItem?: any;
  button?: boolean;
  showRightIcon?: boolean;
  test?: boolean;
  expiration?: string;
  href?: string;
}

const InfoCard: React.FC<IInfoCardProps & React.HTMLProps<HTMLDivElement>> = ({
  leftItem,
  rightIcon,
  button,
  showRightIcon = true,
  image,
  title,
  style,
  href,
  expiration,
  className,
  type,
  ...other
}) => {
  const router = useHistory();

  const renderLeft = () => {
    if (leftItem) return leftItem;
    if (image) return <img src={iconLuckWheel} style={{width: '100%', height: '100%'}}></img>;
  };

  return (
    // <IonCard
    //     className={"ion-no-padding " + className}
    //     button={button}
    //     mode="ios"
    // >
    //     <div className={styles.cardContent + " "} {...other} style={style}>
    //         <div className="ui-d-flex" style={{ flex: 1 }}>
    //             <div className={styles.left}>{renderLeft()}</div>
    //             <div className={styles.center}>
    //                 <p className={styles.title}>{title}</p>
    //                 {other?.children}
    //             </div>
    //         </div>
    //         {showRightIcon && (
    //             <div className={styles.right}>
    //                 <IonIcon icon={rightIcon || chevronForward}></IonIcon>
    //             </div>
    //         )}
    //     </div>
    // </IonCard>

    <IonCard className={'ion-no-padding ' + className} button={button} mode="ios">
      <div
        className={styles.card}
        style={type === 'large' ? {height: '92px'} : {height: '80px'}}
        onClick={() => {
          href && router.push(href);
        }}
        {...other}
      >
        <div
          className={styles.img}
          style={type === 'large' ? {width: '44px', height: '44px'} : {width: '54px', height: '54px'}}
        >
          {renderLeft()}
          {/* <img src={image} alt="img" /> */}
        </div>
        <div className={styles.content}>
          <IonText className="ui-fs-16 ui-font-medium" color="dark">
            {title}
          </IonText>
          {other?.children}
          {expiration && <IonText>{expiration}</IonText>}
        </div>
        {showRightIcon && (
          <div style={{marginLeft: 'auto', marginRight: '16px'}}>
            <IonIcon icon={chevronForward}></IonIcon>
          </div>
        )}
      </div>
    </IonCard>
  );
};

export default InfoCard;
