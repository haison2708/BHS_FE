import {IonButton, IonButtons, IonContent, IonIcon, IonPage, IonText, isPlatform, useIonToast} from '@ionic/react';
import {chevronBack, lockOpenOutline, personOutline} from 'ionicons/icons';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation} from 'react-router';
import authAPIs from '../../api/auth';
import {IConfirmPasswordFromAppRequest} from '../../api/auth/interface';
import CustomField from '../../components/CustomField';
import LoadingOverlay from '../../components/LoadingOverlay';
import { BUILD_VERSION } from '../../constants/version';
import {IError, IIdentityErrorResponse, OTPAction} from '../../types/interface';
import {validateConfirmPassword, validatePassword} from '../../utils/validate';

const FormForgotPassword: React.FC = (props) => {
  // Control:
  const router = useHistory();
  const [presentToast, dismissToast] = useIonToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {t} = useTranslation();

  // Params:
  const params = useLocation().state as {
    phoneNumber: string;
    countryCode: string;
    action: OTPAction;
  };

  // State:
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isErrorPassword, setIsErrorPassword] = useState<IError>({});
  const [isErrorConfirmPassword, setIsErrorConfirmPassword] = useState<IError>({});

  const invalidate = (): boolean => {
    // let result = false;

    const errorPassword = validatePassword(password, 'new');
    setIsErrorPassword(errorPassword);

    const errorConfirmPassowrd = validateConfirmPassword(confirmPassword, password, 'new');
    setIsErrorConfirmPassword(errorConfirmPassowrd);

    // if (!password || !validatePassword(password)) {
    //   setIsErrorPassword(true);
    //   result = false;
    // } else setIsErrorPassword(false);

    // if (!confirmPassword || confirmPassword !== password) {
    //   setIsErrorConfirmPassword(true);
    //   result = false;
    // } else setIsErrorConfirmPassword(false);

    return errorPassword.isError!! || errorConfirmPassowrd.isError!!;
  };

  const handleSubmit = async () => {
    if (invalidate()) return;
    try {
      setIsLoading(true);
      const body: IConfirmPasswordFromAppRequest = {
        confirmCode: '',
        password: password,
        identity: params.countryCode + params.phoneNumber,
        confirmPassword: confirmPassword,
      };
      const res = await authAPIs.confirmPasswordFromApp(body);
      if (res) router.push('./login');
      presentToast({
        message: t(`createNewAccountSuccess`),
        duration: 600,
        color: 'success',
        mode: 'ios',
      });
    } catch (e) {
      console.log('Error register User: ', e);
      const error = e as IIdentityErrorResponse;
      presentToast({
        message: error?.data,
        duration: 600,
        color: 'danger',
        mode: 'ios',
      });
    } finally {
      setIsLoading(false);
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
                      mode="ios"
                      onClick={() => {
                        router.goBack();
                      }}
                    >
                      <IonIcon icon={chevronBack} />
                    </IonButton>
                  </IonButtons>
                </div>
                <div style={{width: 'max-content'}} className="ui-position-absolute ui-position-xy-center">
                  <IonText className="ui-m-0 ui-mt-32 ui-m-spacing-3">
                    <h6 className="ui-m-0 ui-text-seven ui-fs-24 ui-fw-800 ui-is-extra-small-font-size-5vw">
                      {t(`newPassword`)}
                    </h6>
                  </IonText>
                </div>
              </div>
              <CustomField
                className="ui-mb-22"
                field={{
                  isEye: true,
                  isRequired: true,
                  type: 'password',
                  value: password,
                  onChange: (value: any) => {
                    setPassword(value);
                  },
                  autocomplete: 'off',
                  placeholder: t(`password`),
                  icon: personOutline,
                  error: isErrorPassword.isError,
                  // messageError: t(`oldPasswordVerificationRule`),
                  messageError: t(isErrorPassword.msgError!!),
                }}
              ></CustomField>
              <CustomField
                className="ui-w-100  ui-pd-l-0 ui-pd-r-0"
                field={{
                  isEye: true,
                  isRequired: true,
                  type: 'password',
                  value: confirmPassword,
                  autocomplete: 'off',
                  onChange: (value: any) => {
                    setConfirmPassword(value);
                  },
                  placeholder: t(`confirmPassword`),
                  icon: lockOpenOutline,
                  error: isErrorConfirmPassword.isError,
                  // messageError: t(`invalidConfirmOldPassword`),
                  messageError: t(isErrorConfirmPassword.msgError!!),
                }}
              ></CustomField>
              <IonButton mode="ios" className="ui-w-100 ui-pd-l-0 ui-pd-r-0 ui-mt-40" onClick={handleSubmit}>
                {t(`confirm`)}
              </IonButton>
            </form>
          </div>
          <div className="ui-position-absolute ui-position-x-50 ui-position-bottom-0 ui-padding-12">
            <IonText className="ion-text-center" slot="end" style={{color: 'white'}}>
              <h2 className="ion-no-padding ui-fs-16 ui-lh-19 ui-fw-300">{t(`version`) + ' '}1CX 1.0 {BUILD_VERSION} {process.env.REACT_APP_ENV}</h2>
            </IonText>
          </div>
        </div>
        <LoadingOverlay isLoading={isLoading} />
      </IonContent>
    </IonPage>
  );
};
export default FormForgotPassword;
