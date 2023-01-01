import {faGift, faStar} from '@fortawesome/free-solid-svg-icons';
import {
  IonBackButton,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonToolbar,
} from '@ionic/react';
import {t} from 'i18next';
import {chevronBack, chevronForward} from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
import {FreeMode} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import PointGiftCard from '../../components/PointGiftCard';
import ProgramCard from '../../components/ProgramCard';
import {
  getVendorOverview,
  selectAllGiftCountOfUser,
  selectAllPointsOfUser,
  selectProgramsByVendor,
} from '../../features/user/userSlice';
import {ILoyaltyProgram} from '../../types/interface';
import {getLoyaltyType} from '../../utils/utils';
import styles from './styles.module.scss';

const VendorOverview: React.FC = () => {
  // Redux:
  const programsByVendor = useAppSelector(selectProgramsByVendor);
  const points = useAppSelector(selectAllPointsOfUser);
  const gifts = useAppSelector(selectAllGiftCountOfUser);

  const dispatch = useAppDispatch();

  const [state, setState] = useState<'earnPoint' | 'myGift' | 'memberRank' | 'program'>('earnPoint');

  useEffect(() => {
    dispatch(getVendorOverview());
  }, []);

  const renderAllProgram = (loyaltyPrograms: ILoyaltyProgram[]) => {
    return (
      <Swiper modules={[FreeMode]} freeMode spaceBetween={12} slidesPerView={'auto'} className={styles.horizontalList}>
        {loyaltyPrograms?.map((program, index) => (
          <SwiperSlide className={styles.item} key={index}>
            <ProgramCard program={program}></ProgramCard>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  const renderLoyaltyProgramsByVendor = () => {
    return programsByVendor.map((item) => (
      <div style={{marginTop: '-20px'}} className="ui-w-100 ui-w-flatform-mobile" key={item.id}>
        <div className={styles.vendorContainer}>
          <div className={styles.imgVendor} style={{backgroundImage: `url('${item?.logo}')`}} />
          <h6 className="nameVender ui-font-medium">{item.name}</h6>
          <div className={styles.iconContent}>
            <IonIcon icon={chevronForward}></IonIcon>
          </div>
        </div>
        {item.loyaltyProgram && renderAllProgram(item.loyaltyProgram)}
      </div>
    ));
  };

  const renderButtons = () => {
    return (
      <div className={styles.buttonsContainer}>
        <IonButton
          mode="ios"
          fill={state === 'earnPoint' ? 'solid' : 'outline'}
          color="light"
          onClick={() => {
            setState('earnPoint');
          }}
        >
          {t('loyaltyPoint')}
        </IonButton>
        <IonButton
          mode="ios"
          fill={state === 'myGift' ? 'solid' : 'outline'}
          color="light"
          onClick={() => {
            setState('myGift');
          }}
        >
          {t('myGift')}
        </IonButton>
        <IonButton
          mode="ios"
          fill={state === 'memberRank' ? 'solid' : 'outline'}
          color="light"
          onClick={() => {
            setState('memberRank');
          }}
        >
          {t('userRank')}
        </IonButton>
        <IonButton
          mode="ios"
          fill={state === 'program' ? 'solid' : 'outline'}
          color="light"
          onClick={() => {
            setState('program');
          }}
        >
          {t('program')}
        </IonButton>
      </div>
    );
  };

  return (
    <IonPage id="main-content" className="background-gray">
      <IonHeader id="header-toolbar">
        <IonToolbar id="" className={styles.toolbar}>
          <div className="ui-mt-50 ui-d-flex ui-align-items-center ui-w-100">
            <IonBackButton
              mode="md"
              color={'light'}
              className="ui-align-self-center"
              text={''}
              icon={chevronBack}
              defaultHref="/tabs/profile"
            />
            <IonText className="ui-align-self-center" color={'light'}>
              <h6 className="ui-m-0 ui-text-four ui-fs-16 ui-fw-400 ui-is-extra-small-font-size-5vw">
                {t('vendorOverview')}
              </h6>
            </IonText>
          </div>
          {renderButtons()}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ui-mt-16">
        <div className={styles.card + ' ui-pd-l-16 ui-pd-r-16 ui-d-flex ui-flex-direction-column ui-center'}>
          {state === 'earnPoint' &&
            points?.map((pointVendor, index) => (
              <PointGiftCard
                key={index}
                vendor={pointVendor?.vendor}
                point={{
                  icon: faStar,
                  colorIcon: '#F5A202',
                  expiration: pointVendor.aboutToExpire,
                  fontSize: 18,
                  value: pointVendor.totalPoint?.toString(),
                  title: `${t('totalLoyaltyPoints')}`,
                }}
              />
            ))}
          {state === 'myGift' &&
            gifts?.map((giftVendor, index) => (
              <PointGiftCard
                key={index}
                vendor={giftVendor.vendor}
                gift={{
                  title: `${t('myGift')}`,
                  icon: faGift,
                  colorIcon: '#D92332',
                  fontSize: 16,
                  value: `${giftVendor?.totalGift} ${t('unusedGift').toLocaleLowerCase()}`,
                }}
              />
            ))}
          {state === 'memberRank' &&
            programsByVendor?.map((vendor, index) => {
              return (
                <PointGiftCard
                  key={index}
                  vendor={vendor}
                  rank={getLoyaltyType(vendor?.configRankOfVendor?.rankOfUser?.rank || '')}
                />
              );
            })}
          {state === 'program' && renderLoyaltyProgramsByVendor()}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default VendorOverview;
