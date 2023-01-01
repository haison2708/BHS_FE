import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import {chevronForward} from 'ionicons/icons';
import React, {useState} from 'react';
import styles from './styles.module.scss';
import ProgramCard from '../../components/ProgramCard';
import {useAppSelector} from '../../app/hook';
import {ILoyaltyProgram, IVendorOfUser} from '../../types/interface';
import {useHistory} from 'react-router';
import { useTranslation } from 'react-i18next';
import NotificationButton from '../../components/NotificationButton';
import CartButton from '../../components/CartButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
import { selectListAccumulatePointProgramsPerVendor, selectListGiftExchangeProgramsPerVendor, selectListProgramsPerVendor } from '../../features/program/programSlice';

const GoodWill: React.FC = (props) => {
  // Redux:
  const programsByVendor= useAppSelector(selectListProgramsPerVendor);
  const giftExchangeProgramsByVendor = useAppSelector(selectListGiftExchangeProgramsPerVendor);
  const accumulatePointProgramsByVendor = useAppSelector(selectListAccumulatePointProgramsPerVendor);

  // State:
  const [searchText, setSearchText] = useState<string>();

  // Controls:
  const [programsView, setProgramsView] = useState<'all' | 'accumulatePoints' | 'giftExchange'>('all');
  const router = useHistory();
  const {t} = useTranslation()

  const renderHeader = () => {
    return (
      <IonHeader style={{background: '#F7F7F8'}}>
        <IonToolbar mode="ios" className={'medium-header-toolbar ' + styles.toolbar}>
          <div className="ui-d-flex ui-flex-direction-column ui-align-items-center ui-w-100 ui-overflow-visible ">
            <div className={'ui-w-100 ui-d-flex ui-w-flatform-mobile ' + styles.toolbar__content}>
              <IonSearchbar
                className={styles.searchBar + ' ion-no-padding'}
                value={searchText}
                mode="ios"
                placeholder={t(`search`)}
                showClearButton="always"
                onIonChange={(e) => {
                  setSearchText(e.detail.value!);
                }}
              ></IonSearchbar>
              <CartButton/>
              <NotificationButton/>
            </div>
          </div>
          {renderButtons()}
        </IonToolbar>
        {/* <VendorInfoCard
                    className={
                        styles.mainFloatingCard + " ui-w-flatform-mobile"
                    }
                    vendor={getChosenVendor()}
                    hasButtons
                ></VendorInfoCard> */}
      </IonHeader>
    );
  };

  const renderButtons = () => {
    return (
      <IonGrid className={styles.buttonsGrid}>
        <IonRow>
          <IonCol size="4" className={styles.start}>
            <IonButton
              mode="ios"
              fill={programsView === 'all' ? 'solid' : 'outline'}
              color="light"
              onClick={() => {
                setProgramsView('all');
              }}
            >
              {t(`all`)}
            </IonButton>
          </IonCol>
          <IonCol size="4">
            <IonButton
              mode="ios"
              fill={programsView === 'accumulatePoints' ? 'solid' : 'outline'}
              color="light"
              onClick={() => {
                setProgramsView('accumulatePoints');
              }}
            >
              {t(`accamulatePoint`)}
            </IonButton>
          </IonCol>
          <IonCol size="4" className={styles.end}>
            <IonButton
              mode="ios"
              fill={programsView === 'giftExchange' ? 'solid' : 'outline'}
              color="light"
              onClick={() => {
                setProgramsView('giftExchange');
              }}
            >
              {t(`exchangeGift`)}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const renderAllProgram = (loyaltyPrograms: ILoyaltyProgram[]) => {
    return (
      <Swiper modules={[FreeMode]} spaceBetween={12} freeMode={true} slidesPerView={'auto'} className={styles.horizontalList}>
        {loyaltyPrograms?.map((program, index) => (
          <SwiperSlide key={index} className={styles.item}>
            <ProgramCard program={program}></ProgramCard>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  const renderLoyaltyProgramsByVendor = () => {
    var programsByVendorFiltered: IVendorOfUser[] = [];

    if (programsView === 'all') {
      programsByVendorFiltered = programsByVendor;
    } else if (programsView === 'giftExchange') {
      programsByVendorFiltered = giftExchangeProgramsByVendor;
    }
    else if (programsView === 'accumulatePoints') {
      programsByVendorFiltered = accumulatePointProgramsByVendor;
    }

    return programsByVendorFiltered?.map((item) => {
      if (item?.loyaltyProgram && item?.loyaltyProgram?.length > 0)
        return (
          <div style={{marginTop: '0px'}} className="ui-w-100 ui-w-flatform-mobile" key={item.id}>
            <div className={styles.vendorContainer}>
              <div className={styles.imgVendor} style={{backgroundImage: `url('${item?.logo}')`}}/>
              <h6 className="nameVender ui-font-medium">{item.name}</h6>
              <div className={styles.iconContent}>
                <IonIcon icon={chevronForward}></IonIcon>
              </div>
            </div>
            {renderAllProgram(item.loyaltyProgram)}
          </div>
        );
    });
  };

  return (
    <IonPage id="main-content" className="background-gray">
      {renderHeader()}
      <IonContent fullscreen className="ion-padding">
        <div className={styles.pageContent}>{renderLoyaltyProgramsByVendor()}</div>
      </IonContent>
    </IonPage>
  );
};

export default GoodWill;
