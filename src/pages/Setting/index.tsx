import {Preferences} from '@capacitor/preferences';
import {IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonCard} from '@ionic/react';
import {t} from 'i18next';
import {
  chevronBack,
  chevronForwardOutline,
  fingerPrintOutline,
  globeOutline,
  notificationsOutline,
} from 'ionicons/icons';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import userAPIs from '../../api/user';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import LoadingControl from '../../components/LoadingControl';
import MenuButtonsGroup from '../../components/MenuButtonsGroup';
import {IMenuButton} from '../../components/MenuButtonsGroup/interface';
import ModalLanguage from '../../components/ModalLanguage';
import Switch from '../../components/Switch';
import {getUserAppSetting, selectUser, selectUserAppSetting} from '../../features/user/userSlice';
import {getFingerprintFlag, updateAppSetting} from '../../utils/utils';
import styles from './styles.module.scss';

interface ISettingProps {}

const Setting: React.FC<ISettingProps> = ({}) => {
  // Redux:
  const appSetting = useAppSelector(selectUserAppSetting);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [fingerprintFlag, setFingerprintFlag] = useState<boolean>(false);

  // Controls:
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkFingerprintFlag = async () => {
      const data = await getFingerprintFlag();
      if (data === '1') {
        return setFingerprintFlag(true);
      }
    };
    checkFingerprintFlag();
  }, []);

  // Controls:
  const modal = useRef<HTMLIonModalElement>(null);

  const handleUpdateFingerPrintOption = async (v: boolean) => {
    try {
      if (v) {
        await Preferences.set({
          key: '_fingerprintFlag',
          value: '1',
        });
        setFingerprintFlag(true);
      } else {
        await Preferences.set({
          key: '_fingerprintFlag',
          value: '0',
        });
        setFingerprintFlag(false);
      }
    } catch (e) {
      console.log('Error update finger print option: ', e);
    }
  };

  const handleUpdateGetNotificationOption = async (v: boolean) => {
    try {
      setIsLoading(true);
      await userAPIs.updateUserAppSetting({
        vendorId: appSetting.vendorId || '',
        langId: appSetting.langId || 'vi',
        isFingerprintLogin: appSetting.isFingerprintLogin || false,
        isGetNotifications: v,
      });
      dispatch(getUserAppSetting());
    } catch (e) {
      console.log('Error update get notifications option: ', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeLanguage = async (value: string) => {
    try {
      setIsLoading(true);
      await userAPIs.updateUserAppSetting({
        vendorId: appSetting.vendorId || '',
        langId: value || appSetting.langId || 'vi',
        isFingerprintLogin: appSetting.isFingerprintLogin || false,
        isGetNotifications: appSetting.isGetNotifications || false,
      });
      dispatch(getUserAppSetting());
    } catch (e) {
      console.log('Error update language: ', e);
    } finally {
      setIsLoading(false);
    }
    modal.current?.dismiss();
  };

  const fingerprintLogin: IMenuButton = {
    title: `${t('fingerprintLogin')}`,
    leftIcon: {
      icon: fingerPrintOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightItem: <Switch className="" active={fingerprintFlag} onClickSwitch={handleUpdateFingerPrintOption}></Switch>,
  };

  const notification: IMenuButton = {
    title: `${t('recieveNotification')}`,
    leftIcon: {
      icon: notificationsOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightItem: (
      <Switch
        enabled={!isLoading}
        className=""
        active={appSetting.isGetNotifications}
        onClickSwitch={handleUpdateGetNotificationOption}
      ></Switch>
    ),
  };

  const language: IMenuButton = {
    title: `${t('language')}`,
    leftIcon: {
      icon: globeOutline,
      size: 'small',
      color: 'tertiary',
    },
    rightIcon: {
      icon: chevronForwardOutline,
    },
    onClick: () => {
      modal.current?.present();
    },
  };

  const Menu: IMenuButton[] = useMemo<IMenuButton[]>(
    () => [fingerprintLogin, notification, language],
    [fingerprintLogin, notification, language]
  );

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent>
        <IonToolbar mode="md" className={'medium-header-toolbar '}>
          <IonButtons slot="start">
            <IonBackButton mode="md" icon={chevronBack} defaultHref="/tabs/profile"></IonBackButton>
          </IonButtons>
          <IonTitle className={'ui-fs-14 ui-fw-400'} slot="">
            {t('setting')}
          </IonTitle>
        </IonToolbar>
        <div className={styles.card + ' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}>
          <IonCard style={{overflow: 'visible'}} className={'ui-w-flatform-mobile ui-w-100'}>
            <div className="ui-w-100 ui-w-flatform-mobile">
              <MenuButtonsGroup buttons={Menu}></MenuButtonsGroup>
            </div>
          </IonCard>
        </div>
        <LoadingControl isLoading={isLoading} />
        <ModalLanguage
          enabled={!isLoading}
          onValueChange={handleChangeLanguage}
          langId={appSetting.langId}
          ref={modal}
        />
      </IonContent>
    </IonPage>
  );
};

export default Setting;
