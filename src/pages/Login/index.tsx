import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonModal,
  IonPage,
  IonSpinner,
  IonText,
  IonToolbar,
  isPlatform,
  useIonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import {closeOutline, fingerPrintOutline, lockOpenOutline} from 'ionicons/icons';
import React, {useEffect, useRef, useState} from 'react';
import {Link, useHistory, useLocation} from 'react-router-dom';
import CustomButton from '../../components/CustomButton';
import CustomField from '../../components/CustomField';
import CustomFieldContent from '../../components/CustomFieldContent';
import styles from './styles.module.scss';

import * as _ from 'lodash';
import authAPIs from '../../api/auth';
import imgFingerprint from '../../asset/icon/icon_finger3x.png';
import {CountryCode} from '../../data/_mork/CountryCode';
import {formatTextNoSpacing} from '../../utils/format';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {getUserAppSetting, selectUser, setUser} from '../../features/user/userSlice';
import {Preferences} from '@capacitor/preferences';
import {getAllVendors} from '../../features/vendor/vendorSlice';
import {decodePassword, encodePassword, getFingerprintFlag, getInformationUserLogin} from '../../utils/utils';
import {FingerprintAIO} from '@awesome-cordova-plugins/fingerprint-aio';
import LoadingOverlay from '../../components/LoadingOverlay';
import {useTranslation} from 'react-i18next';
import {validatePassword, validatePhone} from '../../utils/validate';
import {IError} from '../../types/interface';
import {BUILD_VERSION} from '../../constants/version';

const Login: React.FC = (props) => {
  // Controls:
  const router = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {t} = useTranslation();
  const modal = useRef<HTMLIonModalElement>(null);
  const modalFinger = useRef<HTMLIonModalElement>(null);
  const pageRef = useRef();
  const [presentToast] = useIonToast();

  // Redux:
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // State:
  const [countryCode] = useState<choiceLocation[]>(CountryCode);
  const [choiceLocation, setChoiceLocation] = useState<choiceLocation>(countryCode[0]);

  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [isErrorPhone, setIsErrorPhone] = useState<IError>({});
  const [isErrorPassword, setIsErrorPassword] = useState<IError>({});
  const [loginError, setLoginError] = useState({
    status: false,
    message: t(`loginFailSomethingWrong`),
  });
  const [messageFingerprint, setMessageFingerprint] = useState<string>(t('fingerprintLogin'));

  useIonViewWillEnter(() => {
    const checkIsAuthenticated = async () => {
      if (user.identity) {
        return router.push('/tabs/home', {from: '/login'});
      }
    };
    checkIsAuthenticated();
  });

  useEffect(() => {
    const getData = async () => {
      const data = await getInformationUserLogin();
      data.username && setPhone(data.username.slice(3));
      setPassword(data.password);
    };
    getData();
  }, []);

  const invalid = () => {
    const errorPhone = validatePhone(phone);
    setIsErrorPhone(errorPhone);

    const errorPassword = validatePassword(password);
    setIsErrorPassword(errorPassword);

    return errorPhone.isError!! || errorPassword.isError!!;
  };

  function dismissModalFinger() {
    modalFinger.current?.dismiss();
  }

  const onSubmit = (username: string, password: string) => {
    if (invalid()) return;
    setIsLoading(true);
    authAPIs
      .login({
        grant_type: 'password',
        client_id: 'ro.client',
        client_secret: 'secret',
        username: username,
        password: password,
      })
      .then(async (res) => {
        await Preferences.set({
          key: '_accessToken',
          value: res.access_token || '',
        });
        await Preferences.set({
          key: '_refreshToken',
          value: res.refresh_token || '',
        });
        await Preferences.set({
          key: '_username',
          value: username,
        });
        await Preferences.set({
          key: '_password',
          value: encodePassword(password),
        });
        try {
          const user = await authAPIs.getUserInfo();
          dispatch(setUser(user));
          const r = await authAPIs.createUser(user);
        } catch (e) {
          console.log('Error getUser or createUser: ', e);
        } finally {
          await dispatch(getUserAppSetting());
          await dispatch(getAllVendors());
          router.replace('/tabs/home');
        }
      })
      .catch((err) => {
        if (!err?.status && !err?.data) {
          presentToast({
            message: t('networkError'),
            duration: 2000,
            color: 'danger',
            mode: 'ios',
          });
        } else {
          setLoginError({
            status: true,
            message: t(`loginFailSomethingWrong`),
          });
        }
        throw err;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFormatPhone = (phone: string) => {
    return phone.startsWith('0') ? phone.slice(1) : phone;
  };

  const handleFingerprint = async () => {
    const fingerprintFlag = await getFingerprintFlag();
    setMessageFingerprint(t('fingerprintLogin'));
    if (fingerprintFlag === '1') {
      const data = await getInformationUserLogin();
      FingerprintAIO.isAvailable().then(
        () => {
          FingerprintAIO.show({
            title: '1CX App Biometric Sign On',
            subtitle: 'HQ SOFT',
            fallbackButtonTitle: 'Use another way',
            disableBackup: false,
            cancelButtonTitle: 'Cancel',
          }).then(
            () => {
              dismissModalFinger();
              setIsLoading(true);
              authAPIs
                .login({
                  grant_type: 'password',
                  client_id: 'ro.client',
                  client_secret: 'secret',
                  username: data.username!!,
                  password: data.password!!,
                })
                .then(async (res) => {
                  await Preferences.set({
                    key: '_accessToken',
                    value: res.access_token || '',
                  });
                  await Preferences.set({
                    key: '_refreshToken',
                    value: res.refresh_token || '',
                  });
                  try {
                    const user = await authAPIs.getUserInfo();
                    dispatch(setUser(user));
                    const r = await authAPIs.createUser(user);
                  } catch (e) {
                    console.log('Error getUser or createUser: ', e);
                  } finally {
                    await dispatch(getUserAppSetting());
                    await dispatch(getAllVendors());
                    router.replace('/tabs/home');
                  }
                })
                .catch((loginError) => {
                  if (!loginError?.status && !loginError?.data) {
                    presentToast({
                      message: t('networkError'),
                      duration: 2000,
                      color: 'danger',
                      mode: 'ios',
                    });
                  }
                })
                .finally(() => {
                  setIsLoading(false);
                });
            },
            (err) => {
              setMessageFingerprint(t(`verifyFailTryOtherWay`));
            }
          );
        },
        (err) => {
          setMessageFingerprint(t(`settingBiometricInDevice`));
        }
      );
    } else {
      setMessageFingerprint(t(`notActiveBiometricFeature`));
    }
  };

  const renderCountryCode = (_mork: choiceLocation[]) => {
    return (
      <React.Fragment>
        {_mork.map((country, index) => {
          return (
            <div
              key={country.id}
              onClick={() => {
                setChoiceLocation({
                  ...choiceLocation,
                  ...country,
                });
                modal.current?.dismiss();
              }}
              className="ui-cursor-pointer ui-d-flex  ui-align-items-center  ui-justify-content-space-between"
            >
              <div className="ui-d-flex ui-align-items-center">
                <img className={styles.inputImage} src={country.srcImageTitle} alt="choice_image" />
                <h3
                  className={
                    country.id === choiceLocation.id
                      ? 'ui-ml-12 ui-text-danger ui-font-regular ui-fs-16 ui-lh-19'
                      : 'ui-ml-12 ui-font-regular ui-fs-16 ui-lh-19'
                  }
                >
                  {country.title}
                </h3>
              </div>
              <div className="ui-d-flex ui-align-items-center">
                <h3
                  className={
                    country.id === choiceLocation.id
                      ? 'ui-text-danger ui-font-regular ui-fs-16 ui-lh-19'
                      : 'ui-font-regular ui-fs-16 ui-lh-19'
                  }
                >
                  {country.value}
                </h3>
              </div>
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <React.Fragment>
      <IonPage id="main-content" ref={pageRef}>
        <IonContent
          scrollY={!isPlatform('desktop')}
          slot="fixed"
          fullscreen
          className="ion-padding ui-overflow-y-hidden"
          id="content-introduction"
        >
          <div id="content-introduction__overylay"></div>
          <div className="ui-position-relative ui-w-100 ui-h-100">
            <div className="ui-position-absolute ui-position-top ui-d-flex ui-justify-content-center ui-w-100 ">
              <div className="ui-position-relative ui-w-100 ui-w-flatform-extra-small">
                <div className="logo-system"></div>
              </div>
            </div>
            <div className="ui-w-100 ui-w-flatform-extra-small  ui-position-absolute ui-bg-white ui-position-xy-center ui-position-top-60 ui-spacing-2 ui-border-radius-16 ui-zindex-mobile-stepper">
              <form
                className="ui-padding-24 ui-border-radius-16"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <div className="ui-position-relative">
                  <div className="ui-w-100 ui-d-flex ui-align-items-center ui-justify-content-center">
                    <IonText className="ui-m-0 ui-mt-32 ui-mb-32">
                      <h6 className="ui-m-0 ui-text-seven ui-fs-24 ui-fw-800">{t(`login`)}</h6>
                    </IonText>
                    <div className="ui-position-absolute ui-position-right-0">
                      <IonButtons>
                        <CustomButton
                          icon={{
                            className: '',
                            icon: fingerPrintOutline,
                            color: 'light',
                          }}
                          button={{
                            shape: 'round',
                            isBackgroundTransparent: true,
                            id: 'open-fingerPrint',
                            style: {
                              width: '32px',
                              height: '32px',
                              borderRadius: '50px',
                            },
                            className: 'ui-bg-primary',
                          }}
                          onClick={handleFingerprint}
                        ></CustomButton>
                      </IonButtons>
                      <IonModal
                        mode="md"
                        ref={modalFinger}
                        trigger="open-fingerPrint"
                        className={styles.modalFinger + ` ion-no-padding`}
                      >
                        <div>
                          <IonHeader collapse="fade">
                            <IonToolbar>
                              <IonButtons slot="end">
                                <CustomButton
                                  icon={{
                                    className: '',
                                    icon: closeOutline,
                                    color: 'danger',
                                    size: 'large',
                                  }}
                                  button={{
                                    border: 'Circle',
                                    isBackgroundTransparent: true,
                                    fill: 'clear',
                                  }}
                                  onClick={() => dismissModalFinger()}
                                ></CustomButton>
                              </IonButtons>
                            </IonToolbar>
                          </IonHeader>
                          <IonContent fullscreen scrollY={false}>
                            <img
                              alt="fingerPrint_icon"
                              style={{
                                width: '128px',
                                height: '128px',
                                padding: '20px',
                                position: 'absolute',
                                top: '0%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: '1050',
                              }}
                              src={imgFingerprint}
                            />
                            <IonText className="ion-text-center" color="dark">
                              <p className="ui-font-regular ui-lh-24 ui-mt-60 ui-pd-l-51 ui-pd-r-51">
                                {messageFingerprint}
                              </p>
                            </IonText>
                          </IonContent>
                        </div>
                      </IonModal>
                    </div>
                  </div>
                </div>
                <CustomFieldContent
                  className={isErrorPhone.isError ? '' : 'ui-mb-22'}
                  field={{
                    type: 'tel',
                    value: phone,
                    onChange: (value: any) => {
                      setPhone(value.toString());
                    },
                    placeholder: t(`phoneNumber`),
                    error: isErrorPhone.isError,
                    messageError: t(isErrorPhone.msgError!!),
                    content: (
                      <React.Fragment>
                        <IonButton
                          fill="clear"
                          id="open-modal-phone-login"
                          className={styles.buttonClearPhone + ' ion-no-padding'}
                        >
                          <div className={styles.containerInput + ` ui-d-flex ui-align-items-center`}>
                            <div className={styles.inputLogin + ` ui-d-flex ui-align-items-center`}>
                              <img
                                className={styles.inputImage}
                                src={choiceLocation.srcImageTitle}
                                alt="choice_image"
                              />
                            </div>
                            <IonText className={'ion-text-center ui-pd-l-4'}>
                              <div
                                className={
                                  'ui-fs-16 ui-lh-19 ui-pd-t-12 ui-pd-b-12 ui-pd-r-14 ui-text-secondary ui-font-medium'
                                }
                              >
                                {choiceLocation.value}
                              </div>
                            </IonText>
                          </div>
                        </IonButton>
                        <IonModal
                          mode="md"
                          className={styles.customModal}
                          id="example-modal"
                          ref={modal}
                          trigger="open-modal-phone-login"
                        >
                          <div className="ui-w-100 ui-h-100 ui-overflow-hidden">
                            <div className="ui-spacing-3 ui-pd-t-16 ui-pd-b-16">
                              <IonText color={'light'}>
                                <div>{t(`chooseCountryCode`)}</div>
                              </IonText>
                            </div>
                            <div className="ui-bg-white ui-spacing-2 ui-pd-t-10 ui-pd-l-10 ui-pd-r-24">
                              {renderCountryCode(countryCode)}
                            </div>
                          </div>
                        </IonModal>
                      </React.Fragment>
                    ),
                  }}
                ></CustomFieldContent>
                <CustomField
                  className={isErrorPassword.isError ? '' : 'ui-mb-22'}
                  field={{
                    isEye: true,
                    type: 'password',
                    value: password,
                    label: 'Email',
                    onChange: (value: any) => {
                      setPassword(value);
                    },
                    placeholder: t(`password`),
                    icon: lockOpenOutline,
                    error: isErrorPassword.isError,
                    messageError: t(isErrorPassword.msgError!!),
                  }}
                ></CustomField>
                <IonText className="ion-text-right ion-no-padding ui-d-flex ui-justify-content-flex-end">
                  <Link style={{color: '#21367B'}} className="ion-no-padding ui-d-inline-block" to="/forgot-password">
                    <h6 className="ui-m-0 ui-fs-16 ui-lh-19">{t(`didYouForgetYourPassword`)}</h6>
                  </Link>
                </IonText>
                <IonButton
                  mode="ios"
                  color={'primary'}
                  className="ui-w-100 ui-mt-20 ui-mb-20"
                  onClick={() => {
                    onSubmit(`${choiceLocation.value}${formatTextNoSpacing(handleFormatPhone(phone))}`, password);
                  }}
                >
                  {t(`login`)}
                </IonButton>
                {loginError.status && (
                  <IonText color={'danger'}>
                    <p className="ui-mb-8">{loginError.message}</p>
                  </IonText>
                )}
                <div className="ui-w-100 ui-d-flex ui-justify-content-center">
                  <IonText className="ion-text-right">
                    <div className="ui-fs-16 ui-lh-19 ui-text-gray ui-pd-r-10">{t(`youDidNotHaveAccountYet`)}</div>
                  </IonText>
                  <Link to="/register">
                    <IonText className="ion-text-right">
                      <div
                        className="ui-fs-16 ui-lh-19 ui-text-primary ui-font-medium"
                        style={{
                          textDecoration: 'underline',
                        }}
                      >
                        {t(`register`)}
                      </div>
                    </IonText>
                  </Link>
                </div>
              </form>
            </div>
            <div className="ui-position-absolute ui-position-x-50 ui-position-bottom-0 ui-padding-12">
              <IonText className="ion-text-center" slot="end">
                <h2 className="ion-no-padding ui-fs-16 ui-lh-19 ui-white-space-nowrap ui-text-white ui-fw-300">
                  {t(`version`) + ' '}1CX 1.0 {BUILD_VERSION} {process.env.REACT_APP_ENV}
                </h2>
              </IonText>
            </div>
          </div>
          <LoadingOverlay isLoading={isLoading} />
        </IonContent>
      </IonPage>
    </React.Fragment>
  );
};

interface choiceLocation {
  id: any;
  title: string;
  code: string;
  value: string;
  srcImageTitle: string;
}

export default Login;
