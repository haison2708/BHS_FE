import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import {chatboxEllipses, chevronBack, timeOutline} from 'ionicons/icons';
import moment from 'moment';
import styles from './styles.module.scss';
import React, {Fragment, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router';
import ProductCard from '../../components/ProductCard';
import {ILoyaltyProgram} from '../../types/interface';
import loyaltyProgramAPIs from '../../api/loyaltyProgram';
import {ProgramTypes} from '../../constants/constants';
import {Trans, useTranslation} from 'react-i18next';

type IAccumulatePointsProgramDetailProps = {};

const AccumulatePointsProgramDetail = (props: IAccumulatePointsProgramDetailProps) => {
  // Controls:
  const router = useHistory();
  const {t} = useTranslation();

  // Params:
  const {id, type} = useParams<{id: string; type: string}>();

  // State:
  const [accumulatePointsProgram, setAccumulatePointsProgram] = useState<ILoyaltyProgram>();

  useEffect(() => {
    getProgramDetail();
  }, [id]);

  const getProgramDetail = async () => {
    try {
      const res = await loyaltyProgramAPIs.getLoyaltyProgramDetail(id);
      setAccumulatePointsProgram(res);
    } catch (e) {
      console.log('Error get accumulate program detail: ', e);
    }
  };

  const renderListProduct = () => {
    return (
      <div className={styles.productsBlock}>
        <h2 className={styles.title}>{t(`participateProducts`)}</h2>
        <IonGrid style={{marginTop: '16px'}}>
          <IonRow>
            {accumulatePointsProgram?.productParticipatingLoyalties?.map((item, index) => {
              return (
                <IonCol className="ui-pd-b-12 ui-pd-r-5 ui-pd-l-5" size="6" key={index} sizeLg="3" sizeMd="4">
                  <ProductCard product={item?.product} />
                </IonCol>
              );
            })}
          </IonRow>
        </IonGrid>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar
          style={{
            background: `url('${accumulatePointsProgram?.imgBannerUrl}') no-repeat 100% center/cover`,
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
          <div className={styles.infoBlock__tag}>{t(`accamulatePoint`)}</div>
          <h1 className={styles.title}>{accumulatePointsProgram?.name}</h1>
          <div className={styles.infoBlock__timeLine}>
            <IonIcon icon={timeOutline}></IonIcon>
            <p>
              <span>{t(`activeTime`)}: </span>
              {moment.utc(accumulatePointsProgram?.startDate).local().format('DD/MM/YYYY')} -{' '}
              {moment.utc(accumulatePointsProgram?.endDate).local().format('DD/MM/YYYY')}
            </p>
          </div>
          <div className={styles.infoBlock__timeLine}>
            <IonIcon icon={timeOutline}></IonIcon>
            <p>
              <span>{t(`pointExpireTime`)}: </span>
              {moment.utc(accumulatePointsProgram?.expirationDate).local().format('DD/MM/YYYY')}
            </p>
          </div>
          <div className={styles.infoBlock__divider} />
          <div className={styles.infoBlock__vendor}>
            <div className={styles.infoBlock__vendor__left}>
              <div
                className={styles.infoBlock__vendor__left__initial}
                style={{backgroundImage: `url('${accumulatePointsProgram?.vendor?.logo}')`}}
              />
              <p>{accumulatePointsProgram?.vendor?.name}</p>
            </div>
            <IonIcon icon={chatboxEllipses} color="secondary"></IonIcon>
          </div>
        </div>
        <div className={styles.constructionBlock}>
          <h2 className={styles.title}>{t(`participateInstruction`)}</h2>

          {type === ProgramTypes.LoyaltyPurchaseProgram.type.toString() &&
            accumulatePointsProgram?.productParticipatingLoyalties?.map((item, index) => {
              return (
                <Fragment>
                  <p className={styles.constructionBlock__subTitle}>{t(`accamulateWhenBuyGoods`)}</p>
                  <p key={index} className={styles.constructionBlock__line}>
                    <Trans
                      i18nKey={'12345_1'}
                      values={{productA: item?.product?.name, money: item?.amountOfMoney + 'đ', point: item?.points}}
                      components={{red: <span className={styles.textRed} />}}
                    ></Trans>
                  </p>
                </Fragment>
              );
            })}

          {type === ProgramTypes.LoyaltyQrCodeProgram.type.toString() &&
            accumulatePointsProgram?.productParticipatingLoyalties?.map((item, index) => {
              return (
                <Fragment key={index}>
                  <p className={styles.constructionBlock__subTitle}>{t(`12345_3`)}</p>
                  <p key={index} className={styles.constructionBlock__line}>
                    <Trans
                      i18nKey={'12345_4'}
                      values={{product: item?.product?.name, point: item?.points}}
                      components={{red: <span className={styles.textRed} />}}
                    ></Trans>
                  </p>
                </Fragment>
              );
            })}
        </div>
        {renderListProduct()}
      </IonContent>
    </IonPage>
  );
};

export default AccumulatePointsProgramDetail;
