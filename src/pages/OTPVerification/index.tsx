import {IonButton, IonButtons, IonContent, IonIcon, IonPage, IonText, isPlatform, useIonToast} from '@ionic/react';
import {chevronBack} from 'ionicons/icons';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation} from 'react-router';
import authAPIs from '../../api/auth';
import OTPInput from '../../components/OTPInput';
import {BUILD_VERSION} from '../../constants/version';
import {useOTP} from '../../hooks/useOTP';
import {IIdentityErrorResponse, OTPAction} from '../../types/interface';

const OTPVerification: React.FC = (props) => {
  // Controls:
  const params = useLocation().state as {phoneNumber: string; countryCode: string; action: OTPAction};
  const router = useHistory();
  const {t} = useTranslation();
  const {arrayValue, currentIndex, changeCurrentIndex, changeValue, getOTPstring} = useOTP(5);

  // State:
  const [errorCode, setErrorCode] = useState({
    isError: false,
    msgError: '',
  });

  // Control:
  const [present, dismiss] = useIonToast();

  const COUNT_TIME = 300;
  const [countTime, setCountTime] = useState<number>(COUNT_TIME);
  const [startTime, setStartTime] = useState<moment.Moment>();

  // const {counter} = useCounter(COUNT_TIME);

  useEffect(() => {
    startCountingTime();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (countTime === 0 || countTime < 0) {
        // Stop Counting:
        clearInterval(interval);
      } else {
        setCountTime(COUNT_TIME - moment().diff(startTime, 'seconds'));
      }
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, countTime]);

  const startCountingTime = () => {
    setCountTime(COUNT_TIME);
    setStartTime(moment());
  };

  const invalidate = (): boolean => {
    let result = false;
    const otp = getOTPstring();
    if (otp?.length < 5) {
      setErrorCode({
        isError: true,
        msgError: t(`pleaseFillCode`),
      });
      result = true;
    } else {
      setErrorCode({
        isError: false,
        msgError: '',
      });
    }
    return result;
  };

  const handleSubmit = async () => {
    if (invalidate()) return;
    try {
      const otp = getOTPstring();
      const res = await authAPIs.validateOTP({
        confirmCode: otp,
        phoneNumber: params?.countryCode + params.phoneNumber,
      });
      if (params?.action === 'register') {
        router.replace({
          pathname: '/form-register',
          state: {phoneNumber: params?.phoneNumber, countryCode: params.countryCode},
        });
      } else if (params?.action === 'forgotPassword') {
        router.replace({
          pathname: '/form-forgot-password',
          state: {phoneNumber: params?.phoneNumber, countryCode: params.countryCode},
        });
      }
    } catch (e) {
      console.log('Error validateOTP: ', e);
      const error = e as IIdentityErrorResponse;
      present({
        message: error?.data,
        duration: 300,
        color: 'danger',
        mode: 'ios',
      });
    }
  };

  const handleClickResendOTP = async () => {
    if (params?.action === 'register') {
      try {
        const res = await authAPIs.registerUserActiveCode({
          country: params?.countryCode,
          phoneNumber: params?.phoneNumber,
        });
        // startCountingTime();
      } catch (e) {
        console.log('Error registerUserActiveCode: ', e);
        const error = e as IIdentityErrorResponse;
        present({
          message: error?.data,
          duration: 300,
          color: 'danger',
          mode: 'ios',
        });
      }
    } else if (params?.action === 'forgotPassword') {
      try {
        const res = await authAPIs.forgotPasswordActiveCode({
          country: params?.countryCode,
          phoneNumber: params?.phoneNumber,
        });
        // startCountingTime();
      } catch (e) {
        console.log('Error forgotPasswordActiveCode: ', e);
        const error = e as IIdentityErrorResponse;
        present({
          message: error?.data,
          duration: 300,
          color: 'danger',
          mode: 'ios',
        });
      }
    }
  };

  return (
    <IonPage id="main-content">
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
              <div className="ui-w-100 ui-h-auto ui-position-relative" style={{height: '77px'}}>
                <div className="ui-position-absolute ui-position-y-center">
                  <IonButtons class="" slot="start">
                    <IonButton
                      onClick={() => {
                        params?.action === 'forgotPassword'
                          ? router.replace('/forgot-password')
                          : router.replace('/register');
                      }}
                    >
                      <IonIcon icon={chevronBack} />
                    </IonButton>
                  </IonButtons>
                </div>
                <div className="ui-position-absolute ui-position-xy-center">
                  <IonText className="ui-m-0 ui-mt-32 ui-m-spacing-3">
                    <h6 className="ui-m-0 ui-text-seven ui-fs-24 ui-fw-800 ui-is-extra-small-font-size-5vw">
                      {t(`verifyOTP`)}
                    </h6>
                  </IonText>
                </div>
              </div>
              <p className="ion-text-center ui-ml-48 ui-mr-48  ui-fs-16 ui-is-extra-small-no-margin ui-is-extra-small-font-size-4vw">
                {t(`enterOTPSentToPhoneNumber`)}
                <span className="ui-font-medium ui-text-primary ui-lh-25 ui-fs-16 ui-is-extra-small-font-size-4vw ">
                  {' '}
                  {params?.countryCode + params?.phoneNumber}
                </span>
              </p>
              <OTPInput
                arrayValue={arrayValue}
                currentIndex={currentIndex}
                changeCurrentIndex={changeCurrentIndex}
                changeValue={changeValue}
                error={errorCode}
              ></OTPInput>
              <IonButton
                mode="ios"
                color={'primary'}
                style={{height: '43px'}}
                className="ui-w-100 ui-mt-30 ui-mb-20"
                onClick={handleSubmit}
              >
                {t(`verify`)}
              </IonButton>
              <IonText className="ion-text-center" color="primary">
                <div className="ui-font-medium ui-lh-25 ui-fs-16 ui-text-underline">
                  {countTime <= 0 ? (
                    <IonButton fill="clear" className="ui-text-underline" onClick={handleClickResendOTP}>
                      {t(`resendOTP`)}
                    </IonButton>
                  ) : (
                    countTime
                  )}
                </div>
              </IonText>
            </form>
          </div>
          <div className="ui-position-absolute ui-position-x-50 ui-position-bottom-0 ui-padding-12">
            <IonText className="ion-text-center" slot="end" style={{color: 'white'}}>
              <h2 className="ion-no-padding ui-fs-16 ui-lh-19 ui-fw-300">
                {t(`version`) + ' '}1CX 1.0 {BUILD_VERSION} {process.env.REACT_APP_ENV}
              </h2>
            </IonText>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};
export default OTPVerification;
