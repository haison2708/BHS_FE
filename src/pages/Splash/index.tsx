import { IonContent, IonImg, IonLabel, IonPage } from '@ionic/react'
import React from 'react'
import Logo from "../../asset/system/logoX3.png";
import styles from './styles.module.scss'

type ISplashProps = {}

const Splash = (props: ISplashProps) => {
  return (
    <IonPage>
        <IonContent>
            <div className={styles.content}>
                <IonImg src={Logo}/>
                <div><IonLabel position='fixed'>haison</IonLabel></div>
            </div>
        </IonContent>
    </IonPage>
  )
}

export default Splash