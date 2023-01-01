import {
  IonAvatar,
  IonChip,
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonToolbar,
  isPlatform,
  useIonAlert,
  useIonToast,
} from '@ionic/react';
import styles from './styles.module.scss';
import {
  bookOutline,
  chevronForward,
  headsetOutline,
  helpCircleOutline,
  informationCircleOutline,
  lockOpenOutline,
  logOutOutline,
  personOutline,
  settingsOutline,
  starOutline,
} from 'ionicons/icons';
import {useHistory} from 'react-router';
import gameLogo from '../../asset/icon/icon_finger.png';
import {IMenuButton} from '../../components/MenuButtonsGroup/interface';
import InfoCard from '../../components/InfoCard';
import MenuButtonsGroup from '../../components/MenuButtonsGroup';
import RoundIcon from '../../components/RoundIcon';
import {faChartSimple} from '@fortawesome/free-solid-svg-icons';
import {COLOR} from '../../constants/color';
import VendorInfoCard from '../../components/VendorInfoCard';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {selectUser, resetUserSlice, setFcmToken, selectUserLoyalty} from '../../features/user/userSlice';
import userAPIs from '../../api/user';
import {resetVendorSlice, selectSelectedVendor} from '../../features/vendor/vendorSlice';
import {listLoyaltyType} from '../../constants/constants';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {Preferences} from '@capacitor/preferences';
import {resetAppSlice} from '../../features/app/appSlice';
import {resetCategorySlice} from '../../features/category/categorySlice';
import {resetNotificationSlice} from '../../features/notification/notificationSlice';
import {resetProductSlice} from '../../features/product/productSlice';
import {PushNotifications} from '@capacitor/push-notifications';
import {t} from 'i18next';
import {BUILD_VERSION} from '../../constants/version';
import {useState} from 'react';
import LoadingOverlay from '../../components/LoadingOverlay';
import { resetProgramSlice } from '../../features/program/programSlice';

export interface IProfileProps {}

const Profile = (props: IProfileProps) => {
  const avatarPlaceHolder = require('../../asset/icon/avatar_holder.jpg');
  //State
  const [showMainVendorButtons, setShowMainVendorButtons] = useState<boolean>(true);

  // Control:
  const router = useHistory();
  const [presentAlert] = useIonAlert();
  const [present] = useIonToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Reudx:
  const user = useAppSelector(selectUser);
  const selectedVendor = useAppSelector(selectSelectedVendor);
  const userLoyalty = useAppSelector(selectUserLoyalty);

  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await userAPIs.logout();

      if (isPlatform('capacitor')) {
        await PushNotifications.removeAllListeners();
      }

      await Preferences.remove({key: '_accessToken'});
      await Preferences.remove({key: '_refreshToken'});

      dispatch(setFcmToken(''));
      dispatch(resetUserSlice());
      dispatch(resetAppSlice());
      dispatch(resetCategorySlice());
      dispatch(resetNotificationSlice());
      dispatch(resetProductSlice());
      dispatch(resetVendorSlice());
      dispatch(resetProgramSlice());

      router.push('/login');
    } catch (e) {
      console.log('Error logout: ', e);
    }
    finally {
      setIsLoading(false);
    }
  };

  const userInfo: IMenuButton = {
    title: `${t('accountInformation')}`,
    leftIcon: {
      icon: personOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightIcon: {
      icon: chevronForward,
    },
    onClick: () => {
      router.push('/profile-info');
    },
  };

  const changePassword: IMenuButton = {
    title: `${t('changePassword')}`,
    leftIcon: {
      icon: lockOpenOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightIcon: {
      icon: chevronForward,
    },
    onClick: () => {
      router.push('/change-password');
    },
  };

  const setting: IMenuButton = {
    title: `${t('setting')}`,
    leftIcon: {
      icon: settingsOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightIcon: {
      icon: chevronForward,
    },
    onClick: () => {
      router.push('/setting');
    },
  };

  const guideline: IMenuButton = {
    title: `${t('useInstruction')}`,
    leftIcon: {
      icon: bookOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightIcon: {
      icon: chevronForward,
    },
  };

  const supportCenter: IMenuButton = {
    title: `${t('contactSupport')}`,
    leftIcon: {
      icon: headsetOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightIcon: {
      icon: chevronForward,
    },
  };

  const askQuestion: IMenuButton = {
    title: `${t('frequentlyAskedQuestions')}`,
    leftIcon: {
      icon: helpCircleOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightIcon: {
      icon: chevronForward,
    },
  };

  const feedback: IMenuButton = {
    title: `${t('feedbackToApp')}`,
    leftIcon: {
      icon: starOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightIcon: {
      icon: chevronForward,
    },
  };

  const appInfo: IMenuButton = {
    title: `${t('appInformation')}`,
    leftIcon: {
      icon: informationCircleOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightIcon: {
      icon: chevronForward,
    },
    onClick: () => {
      present({
        message: BUILD_VERSION + " " + process.env.REACT_APP_ENV,
        duration: 3000,
        color: 'primary',
        mode: 'ios',
      });
    },
  };

  const logOut: IMenuButton = {
    title: `${t('logout')}`,
    color: 'danger',
    leftIcon: {
      icon: logOutOutline,
      size: 'small',
      color: 'danger',
    },
    rightIcon: {
      icon: chevronForward,
      color: 'danger',
    },
    onClick: () => {
      presentAlert({
        mode: 'md',
        header: `${t('areYouSureWantToLogout')}`,
        buttons: [
          {
            text: `${t('cancel')}`,
            role: 'cancel',
          },
          {
            text: `${t('agree')}`,
            role: 'confirm',
            handler: () => {
              handleLogout();
            },
          },
        ],
      });
    },
  };
  const accountMenu: IMenuButton[] = [userInfo, changePassword];

  const helpMenu: IMenuButton[] = [setting, guideline, supportCenter, askQuestion];

  const aboutAppMenu: IMenuButton[] = [feedback, appInfo, logOut];

  const loyaltyType = listLoyaltyType.find((item) => {
    return item.rank == userLoyalty?.rankOfUser?.rank;
  });

  const renderHeader = () => {
    return (
      <IonHeader>
        <IonToolbar className={'medium-header-toolbar '}>
          <div>
            <div
              className="ui-d-flex ui-w-100 ui-h-100 ui-align-items-flex-start ui-justify-content-space-between ui-w-flatform-mobile"
              style={{margin: '0 auto'}}
            >
              <div className="ui-d-flex ui-align-items-center ui-text-one-line">
                <div>
                  <IonAvatar class={styles.avatar}>
                    <img src={user?.image || avatarPlaceHolder} />
                  </IonAvatar>
                </div>
                <div className={styles.contentContainer}>
                  <h6 className="ui-fs-16 ui-font-bold ui-text-white ui-text-one-line">{user?.displayName}</h6>
                  <h6 className="ui-fs-14 ui-font-regular ui-sub-text ui-text-one-line">{user?.phoneNumber}</h6>
                </div>
              </div>
              <IonChip
                class="ui-pd-l-10 ui-pd-r-10 ui-bg-transparent"
                style={{border: '1px solid #fff', background: '#fff', minWidth: 'fit-content'}}
                onClick={() => {
                  router.push('/profile-loyalty');
                }}
              >
                <FontAwesomeIcon
                  className="ui-text-white ui-fs-14"
                  style={{color: loyaltyType?.color}}
                  icon={loyaltyType?.icon}
                ></FontAwesomeIcon>
                <IonLabel class="ui-text-black ui-fs-14 ui-fw-600 ui-ml-8">{t(loyaltyType?.shortTitle!!)}</IonLabel>
              </IonChip>
            </div>
          </div>
        </IonToolbar>
        <VendorInfoCard
          hasButtons={showMainVendorButtons}
          className={
            styles.mainVendor +
            ' ui-w-flatform-mobile ' +
            (showMainVendorButtons ? styles['mainVendor--expand'] : styles['mainVendor--shrink'])
          }
          vendor={selectedVendor}
        ></VendorInfoCard>
      </IonHeader>
    );
  };

  return (
    <IonPage className="background-gray" id="main-cotent">
      {renderHeader()}
      <IonContent
        fullscreen
        className={styles.content}
        scrollEvents={true}
        onIonScroll={(e) => {
          if (e.detail.scrollTop > 50) {
            setShowMainVendorButtons(false);
          } else {
            setShowMainVendorButtons(true);
          }
        }}
      >
        <InfoCard
          className={styles.vendorButton}
          button
          title={`${t('vendorOverview')}`}
          image={gameLogo}
          showRightIcon={false}
          leftItem={
            <RoundIcon
              style={{width: '48px', height: '48px'}}
              color={COLOR.primary}
              backgroundColor={COLOR.primary + '15'}
              linearGradient
              fontSize="19px"
              icon={faChartSimple}
            />
          }
          onClick={() => router.push('/overview-provider')}
        >
          <p className={styles.vendorButton__subTitle}>{t('reportStatisticsActivitiesFromAllVendor')}</p>
        </InfoCard>
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <MenuButtonsGroup buttons={accountMenu}></MenuButtonsGroup>
          <MenuButtonsGroup buttons={helpMenu}></MenuButtonsGroup>
          <MenuButtonsGroup buttons={aboutAppMenu}></MenuButtonsGroup>
        </div>
      </IonContent>
        <LoadingOverlay isLoading={isLoading}/>
    </IonPage>
  );
};

export default Profile;
