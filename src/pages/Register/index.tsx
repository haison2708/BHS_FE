import {
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonModal,
  IonPage,
  IonText,
  isPlatform,
  useIonToast,
} from '@ionic/react';
import {chevronBack} from 'ionicons/icons';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {Link} from 'react-router-dom';
import authAPIs from '../../api/auth';
import CustomFieldContent from '../../components/CustomFieldContent';
import { BUILD_VERSION } from '../../constants/version';
import {IError, IIdentityErrorResponse, OTPAction} from '../../types/interface';
import {validatePhone} from '../../utils/validate';
import styles from './styles.module.scss';
const Register: React.FC = (props) => {
  const router = useHistory();

  const [phone, setPhone] = useState<string>();
  const [isErrorPhone, setIsErrorPhone] = useState<IError>({});

  // Control:
  const [present, dismiss] = useIonToast();
  const modal = useRef<HTMLIonModalElement>(null);
  const {t} = useTranslation();

  const [choiceLocation] = useState<choiceLocation>({
    title: 'vietnam',
    code: 'mk',
    value: '+84',
    srcImageTitle: 'https://cdn-icons-png.flaticon.com/512/206/206632.png',
  });

  const invalidate = (): boolean => {
    // let result = true
    // if (!phone || isNaN(phone)) {
    //   setIsErrorPhone(true);
    //   result = false
    // } else setIsErrorPhone(false)
    // return result;

    const errorPhone = validatePhone(phone);
    setIsErrorPhone(errorPhone);

    return errorPhone.isError!!;
  };

  const handleFormatPhone = (phone: string) => {
    return phone.startsWith('0') ? phone.slice(1) : phone;
  };

  const handleSubmit = async () => {
    if (invalidate()) return;
    try {
      const formatPhone = handleFormatPhone(phone!!);
      const res = await authAPIs.registerUserActiveCode({country: choiceLocation.value, phoneNumber: formatPhone});
      router.push({
        pathname: '/otp-verification',
        state: {phoneNumber: formatPhone, countryCode: choiceLocation.value, action: 'register' as OTPAction},
      });
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
                        router.goBack();
                      }}
                    >
                      <IonIcon icon={chevronBack} />
                    </IonButton>
                  </IonButtons>
                </div>
                <div className="ui-position-absolute ui-position-xy-center">
                  <IonText className="ui-m-0 ui-mt-32 ui-m-spacing-3">
                    <h6 className="ui-m-0 ui-text-seven ui-fs-24 ui-fw-800 ui-white-space-nowrap">{t(`register`)}</h6>
                  </IonText>
                </div>
              </div>
              <CustomFieldContent
                className={isErrorPhone.isError ? '' : 'ui-mb-22'}
                field={{
                  type: 'tel',
                  value: phone,
                  onChange: (value: any) => {
                    setPhone(value);
                  },
                  placeholder: t('enterPhoneNumber'),
                  error: isErrorPhone.isError,
                  messageError: t(isErrorPhone.msgError!!),
                  content: (
                    <React.Fragment>
                      <IonButton
                        fill="clear"
                        id="open-modal-phone"
                        className={styles.buttonClearPhone + ' ion-no-padding'}
                      >
                        <div className={styles.containerInput + ` ui-d-flex ui-align-items-center`}>
                          <div className={styles.inputLogin + ` ui-d-flex ui-align-items-center`}>
                            <img className={styles.inputImage} src={choiceLocation.srcImageTitle} alt="choice_image" />
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
                        trigger="open-modal-phone"
                      >
                        <div className="ui-w-100 ui-h-100 ui-overflow-hidden">
                          <div className="ui-spacing-3 ui-pd-t-16 ui-pd-b-16">
                            <IonText color={'light'}>
                              <div>{t(`chooseCountryCode`)}</div>
                            </IonText>
                          </div>
                          <div className="ui-bg-white ui-spacing-2 ui-pd-t-10 ui-pd-l-10 ui-pd-r-24">
                            <div className="ui-cursor-pointer ui-d-flex  ui-align-items-center  ui-justify-content-space-between">
                              <div className="ui-d-flex  ui-align-items-center">
                                <img
                                  className={styles.inputImage}
                                  src={choiceLocation.srcImageTitle}
                                  alt="choice_image"
                                />
                                <h3 className="ui-ml-12 ui-text-danger ui-font-regular ui-fs-16 ui-lh-19">Việt Nam</h3>
                              </div>
                              <div className="ui-d-flex  ui-align-items-center">
                                <h3 className="ui-text-danger ui-font-regular ui-fs-16 ui-lh-19">+84</h3>
                              </div>
                            </div>
                            <div className="ui-cursor-pointer ui-d-flex  ui-align-items-center ui-justify-content-space-between">
                              <div className="ui-d-flex  ui-align-items-center">
                                <img
                                  className={styles.inputImage}
                                  src={`https://cdn-icons-png.flaticon.com/512/206/206626.png`}
                                  alt="choice_image"
                                />
                                <h3 className="ui-ml-12 ui-font-regular ui-fs-16 ui-lh-19">United States</h3>
                              </div>
                              <div className="ui-d-flex  ui-align-items-center">
                                <h3 className=" ui-font-regular ui-fs-16 ui-lh-19">+1</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </IonModal>
                    </React.Fragment>
                  ),
                }}
              ></CustomFieldContent>
              <IonButton
                mode="ios"
                color={'primary'}
                className="ui-w-100 ui-mt-12 ui-mb-24"
                style={{height: '43px'}}
                onClick={handleSubmit}
              >
                {t(`recieveOTP`)}
              </IonButton>
              <div className="ui-w-100 ui-d-flex ui-justify-content-center">
                <IonText className="ion-text-right">
                  <div className="ui-fs-16 ui-lh-19 ui-text-gray ui-pd-r-10">{t(`alreadyHaveAccount?`)}</div>
                </IonText>
                <Link to="/login">
                  <IonText className="ion-text-right">
                    <div
                      className="ui-fs-16 ui-lh-19 ui-text-primary ui-font-medium"
                      style={{textDecoration: 'underline'}}
                    >
                      {t(`login`)}
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
      </IonContent>
    </IonPage>
  );
};

interface choiceLocation {
  title: string;
  code: string;
  value: string;
  srcImageTitle: string;
}

export default Register;
