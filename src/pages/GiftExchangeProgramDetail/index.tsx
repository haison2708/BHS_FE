import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonToolbar} from '@ionic/react';
import {chatboxEllipses, chevronBack, timeOutline} from 'ionicons/icons';
import moment from 'moment';
import styles from './styles.module.scss';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router';
import {ILoyaltyProgram} from '../../types/interface';
import loyaltyProgramAPIs from '../../api/loyaltyProgram';
import ExchangeGiftItem from '../../components/ExchangeGiftItem';
import {Trans, useTranslation} from 'react-i18next';
import imgProgram from '../../asset/icon/program.png';

type IGiftExchangeProgramDetailProps = {};

const GiftExchangeProgramDetail = (props: IGiftExchangeProgramDetailProps) => {
  // Control:
  const router = useHistory();
  const {t} = useTranslation();

  // Params:
  const {id, type} = useParams<{id: string; type: string}>();

  // State:
  const [program, setProgram] = useState<ILoyaltyProgram>();

  const getProgramDetail = async () => {
    try {
      const res = await loyaltyProgramAPIs.getLoyaltyProgramDetail(id);
      setProgram(res);
    } catch (e) {
      console.log('Error get gift exchange program detail: ', e);
    }
  };

  useEffect(() => {
    getProgramDetail();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{
            background: `url('${program?.imgBannerUrl || imgProgram}') no-repeat 100% center/cover`,
          }}
          className={styles.toolbar}
        >
          <IonButtons slot="start">
            <IonButton
              fill="solid"
              color={'light'}
              onClick={() => {
                router.goBack();
              }}
            >
              <IonIcon icon={chevronBack} color={'primary'} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className={styles.content}>
        <div className={styles.infoBlock}>
          <div className={styles.infoBlock__tag}>{t(`exchangeGift`)}</div>
          <h1 className={styles.title}>{program?.name}</h1>
          <div className={styles.infoBlock__timeLine}>
            <IonIcon icon={timeOutline}></IonIcon>
            <p>
              <span>{t(`activeTime`)}: </span>
              {moment.utc(program?.startDate).local().format('DD/MM/YYYY')} -{' '}
              {moment(program?.endDate).local().format('DD/MM/YYYY')}
            </p>
          </div>
          <div className={styles.infoBlock__divider} />
          <div className={styles.infoBlock__vendor}>
            <div className={styles.infoBlock__vendor__left}>
              <div
                className={styles.infoBlock__vendor__left__initial}
                style={{backgroundImage: `url('${program?.vendor?.logo}')`}}
              />
              <p>{program?.vendor?.name}</p>
            </div>
            <IonIcon icon={chatboxEllipses} color="secondary"></IonIcon>
          </div>
        </div>
        <div className={styles.constructionBlock}>
          <h2 className={styles.title}>{t(`participateInstruction`)}</h2>
          <p className={styles.constructionBlock__subTitle}>
            <Trans
              i18nKey={'12345_2'}
              values={{
                timeLine: `${moment.utc(program?.startDate).local().format('DD/MM/YYYY')} - ${moment(program?.endDate)
                  .local()
                  .format('DD/MM/YYYY')}`,
              }}
              components={{red: <span className={styles.textRed} />}}
            ></Trans>
          </p>
        </div>
        <div className={styles.horizontalList}>
          <h2 className={styles.title}>{t(`exchangeGiftList`)}</h2>
          {program?.giftOfLoyalty?.map((gift, index) => {
            return (
              <div style={{marginTop: '24px'}} key={index}>
                <ExchangeGiftItem
                  gift={gift}
                  program={program}
                  processBar
                  disabled={gift?.qtyAvailable === 0}
                  myPoint={program?.vendor?.totalPoint}
                  onDoneRedeemPoints={getProgramDetail}
                />
              </div>
            );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GiftExchangeProgramDetail;
