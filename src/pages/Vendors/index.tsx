import {
  IonBackButton,
  IonButton,
  IonCol,
  IonContent,
  IonFab,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonSearchbar,
  IonText,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import {chevronBack} from 'ionicons/icons';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import userAPIs from '../../api/user';
import vendorAPIs from '../../api/vendor';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import VendorCard from '../../components/VendorCard';
import {getAllCategories} from '../../features/category/categorySlice';
import { getNotifications } from '../../features/notification/notificationSlice';
import {
  getGiftsFromSelectedVendor,
  getUserAppSetting,
  selectUserAppSetting,
  getVendorOverview,
  getUserLoyalty,
} from '../../features/user/userSlice';
import {selectAllVendors, selectFollowingVendors} from '../../features/vendor/vendorSlice';
import {IVendor} from '../../types/interface';

import styles from './styles.module.scss';

const Vendors: React.FC = (props) => {
  // Redux:
  const appSetting = useAppSelector(selectUserAppSetting);
  const allVendors = useAppSelector(selectAllVendors);
  const followingVendors = useAppSelector(selectFollowingVendors);
  const dispatch = useAppDispatch();

  // Controls:
  const router = useHistory();
  const pageRef = useRef();
  const [disabledBackButton, setDisabledBackButton] = useState<boolean>(false);
  const [presentToast] = useIonToast();
  const {t} = useTranslation();

  // State:
  const [chosenVendor, setChosenVendor] = useState<IVendor>(
    allVendors.find((item) => {
      return item?.id == appSetting.vendorId;
    }) || {}
  );
  const [statusView, setStatusView] = useState<'all' | 'following'>('all');
  const [searchedAllVendors, setSearchedAllVendors] = useState<IVendor[]>([]);
  const [searchedFollowingVendors, setSearchedFollowingVendors] = useState<IVendor[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    setSearchText('');
  }, [statusView]);

  useEffect(() => {
    if (searchText) {
      statusView === 'all' ? searchVendor(searchText) : searchFollowingVendor(searchText);
    }
  }, [searchText, statusView]);

  useEffect(() => {
    const localChosenVendor = allVendors.find((item) => {
      return item?.id == appSetting.vendorId;
    });
    setDisabledBackButton(!localChosenVendor);
    setChosenVendor(localChosenVendor || {})
  }, [allVendors, appSetting]);

  const searchVendor = async (value: string) => {
    try {
      const res = await vendorAPIs.searchVendor(value, false);
      console.log(res);
      setSearchedAllVendors(res);
    } catch (e) {
      console.log('error search vendor: ', e);
    }
  };

  const searchFollowingVendor = async (value: string) => {
    try {
      const res = await vendorAPIs.searchVendor(value, true);
      setSearchedFollowingVendors(res);
    } catch (e) {
      console.log('error search following vendor: ', e);
    }
  };

  const handleSubmit = async () => {
    if (!!chosenVendor) {
      await userAPIs.updateUserAppSetting({
        vendorId: chosenVendor.id || '',
        langId: appSetting.langId || 'vi',
        isFingerprintLogin: appSetting.isFingerprintLogin || false,
        isGetNotifications: appSetting.isGetNotifications || false,
      });
      await dispatch(getUserAppSetting());
      dispatch(getNotifications())
      dispatch(getGiftsFromSelectedVendor());
      dispatch(getAllCategories());
      dispatch(getUserLoyalty());
      router.push('/tabs/home');
    } else {
      presentToast({
        message: t(`pleaseChooseVendor`),
        duration: 400,
        color: 'danger',
        mode: 'ios',
      });
    }
  };

  const renderVendors = () => {
    const displayData =
      statusView === 'all'
        ? searchText
          ? searchedAllVendors
          : allVendors
        : searchText
        ? searchedFollowingVendors
        : followingVendors;
    return displayData?.map((item, index) => {
      return (
        <IonCol style={{height: '100px'}} className="ui-pd-b-12" size="12" sizeLg="6" key={index}>
          <VendorCard
            isSelected={item?.id === chosenVendor?.id}
            vendor={item}
            onSelected={() => setChosenVendor(item)}
            onClickButton={() => {
              if (searchText) {
                statusView === 'all' ? searchVendor(searchText) : searchFollowingVendor(searchText);
              }
            }}
          />
        </IonCol>
      );
    });
  };

  return (
    <IonPage id="main-content" className="background-gray" ref={pageRef}>
      <IonHeader id="header-toolbar" className="ion-no-padding">
        <IonToolbar id="" className={`ion-no-padding ${styles.toolbar}`}>
          <div className="ui-mt-54 ui-d-flex ui-align-items-center ui-justify-content-space-between">
            <div className="ui-d-flex ui-align-items-center">
              <IonButton
                mode="md"
                fill='clear'
                color={'light'}
                className={`ion-no-padding ${styles.backIcon}`}
                disabled={disabledBackButton}
                onClick={() => router.goBack()}
              >
                <IonIcon icon={chevronBack}/>
              </IonButton>
              <IonText className="ui-align-self-center" color={'light'}>
                <h6 className="ui-m-0 ui-text-four ui-fs-16 ui-fw-400 ui-is-extra-small-font-size-5vw">
                  {t(`vendor`)}
                  {disabledBackButton}
                </h6>
              </IonText>
            </div>
            <div className="ui-d-flex ui-align-items-center"></div>
          </div>
          <div className="ui-d-flex ui-align-items-center ui-gap-2 ui-mt-15 ui-mb-10">
            <IonButton
              mode="md"
              className={
                statusView === 'all'
                  ? styles.buttonViewChoice + ` ion-padding-none ui-flex-grow-1 ui-w-50`
                  : styles.buttonView + ` ion-padding-none ui-flex-grow-1 ui-w-50`
              }
              onClick={() => {
                setStatusView('all');
              }}
            >
              <IonText className="ui-align-self-center" color={statusView === 'all' ? 'primary' : 'light'}>
                <h6 className=" ui-m-0 ui-text-four ui-fs-16 ui-fw-300 ui-is-extra-small-font-size-5vw  ui-text-initial">
                  {t(`allVendors`)}
                </h6>
              </IonText>
            </IonButton>
            <IonButton
              mode="md"
              className={
                statusView === 'following'
                  ? styles.buttonViewChoice + ` ion-padding-none ui-flex-grow-1 ui-w-50`
                  : styles.buttonView + ` ion-padding-none ui-flex-grow-1 ui-w-50`
              }
              onClick={() => {
                setStatusView('following');
              }}
            >
              <IonText className="ui-align-self-center" color={statusView === 'following' ? 'primary' : 'light'}>
                <h6 className="ui-m-0 ui-text-four ui-fs-16 ui-fw-300 ui-is-extra-small-font-size-5vw  ui-text-initial">
                  {t(`following`)}
                </h6>
              </IonText>
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <IonSearchbar
          className={styles.IonSearchbar + ' ion-no-padding'}
          value={searchText}
          mode="ios"
          placeholder={t(`searchVendor`)}
          onIonChange={(e) => {
            setSearchText(e.detail.value!);
          }}
        ></IonSearchbar>
        <IonGrid className="ui-mt-20">
          <IonRow>{renderVendors()}</IonRow>
        </IonGrid>

        {statusView === 'all' && (
          <IonFab className="ui-w-100vw ui-pd-r-32 ui-pd-l-16" vertical="bottom" horizontal="start" slot="fixed">
            <IonButton mode="ios" className={styles.confirmButton} color={'primary'} onClick={handleSubmit}>
              {t(`chooseVendor`)}
            </IonButton>
          </IonFab>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Vendors;
