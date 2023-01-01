import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
  isPlatform,
  useIonActionSheet,
  useIonToast,
} from '@ionic/react';
import {t} from 'i18next';
import {chevronBack, lockClosedOutline, mailOutline, personAddOutline, personOutline} from 'ionicons/icons';
import moment from 'moment';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation} from 'react-router';
import authAPIs from '../../api/auth';
import {IRegisterUserRequest} from '../../api/auth/interface';
import CustomField from '../../components/CustomField';
import DatePicker from '../../components/DatePicker';
import GenderPicker from '../../components/GenderPicker';
import LoadingOverlay from '../../components/LoadingOverlay';
import { BUILD_VERSION } from '../../constants/version';
import {IError, IIdentityErrorResponse, OTPAction} from '../../types/interface';
import {validateConfirmPassword, validateEmail, validateFullName, validatePassword} from '../../utils/validate';

const FormRegister: React.FC = (props) => {
  const router = useHistory();
  const modal = React.useRef<HTMLIonModalElement>(null);
  const [present, dismiss] = useIonActionSheet();

  // Control:
  const [presentToast, dismissToast] = useIonToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {t} = useTranslation();

  // Params:
  const params = useLocation().state as {
    phoneNumber: string;
    countryCode: string;
    action: OTPAction;
  };

  //   FORM
  const [displayName, setDisplayName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [birthday, setBirthday] = useState<string>(moment().toISOString());
  const [gender, setGender] = useState<number>(0);

  const [isErrorDisplayName, setIsErrorDisplayName] = useState<IError>({});
  const [isErrorEmail, setIsErrorEmail] = useState<IError>({});
  const [isErrorPassword, setIsErrorPassword] = useState<IError>({});
  const [isErrorConfirmPassword, setIsErrorConfirmPassword] = useState<IError>({});
  const [isErrorBirthday, setIsErrorBirthday] = useState<boolean>(false);
  const [isErrorGender, setIsErrorGender] = useState<boolean>(false);

  const invalidate = (): boolean => {
    // let result = true;
    // if (!displayName || !validateDisplayName(displayName)) {
    //   setIsErrorDisplayName(true);
    //   result = false;
    // } else setIsErrorDisplayName(false);

    // if (!password || !validatePassword(password)) {
    //   setIsErrorPassword(true);
    //   result = false;
    // } else setIsErrorPassword(false);

    // if (!confirmPassword || confirmPassword !== password) {
    //   setIsErrorConfirmPassword(true);
    //   result = false;
    // } else setIsErrorConfirmPassword(false);

    // if (!email || !validateEmail(email)) {
    //   setIsErrorEmail(true);
    //   result = false;
    // } else setIsErrorEmail(false);

    // return result;
    const errorDisplayName = validateFullName(displayName);
    setIsErrorDisplayName(errorDisplayName);

    const errorPassword = validatePassword(password);
    setIsErrorPassword(errorPassword);

    const errorConfirmPassword = validateConfirmPassword(confirmPassword, password);
    setIsErrorConfirmPassword(errorConfirmPassword);

    const errorEmail = validateEmail(email);
    setIsErrorEmail(errorEmail);

    return (
      errorDisplayName.isError!! || errorPassword.isError!! || errorConfirmPassword.isError!! || errorEmail.isError!!
    );
  };

  const handleSubmit = async () => {
    if (invalidate()) return;
    try {
      setIsLoading(true);
      const body: IRegisterUserRequest = {
        confirmCode: '',
        birthday: birthday,
        email: email,
        displayName: displayName,
        password: password,
        confirmPassword: confirmPassword,
        phoneNumber: params.countryCode + params.phoneNumber,
        gender: gender,
        address: '',
        image: '',
        outletName: '',
        stateId: '',
        districtId: '',
        wardId: '',
        homeAddress: '',
      };
      const res = await authAPIs.registerUser(body);
      if (res) router.replace('./login');
      presentToast({
        message: t(`createAccountSuccess`),
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
                      mode="md"
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
                    <h6 className="ui-m-0 ui-text-seven ui-fs-24 ui-fw-800 ui-white-space-nowrap">
                      {t(`createAccount`)}
                    </h6>
                  </IonText>
                </div>
              </div>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <CustomField
                      className={isErrorDisplayName.isError ? '' : 'ui-mb-22'}
                      field={{
                        type: 'text',
                        isRequired: true,
                        value: displayName,
                        onChange: (value: any) => {
                          setDisplayName(value);
                        },
                        placeholder: t(`enterFullName`),
                        autocomplete: 'off',
                        icon: personOutline,
                        error: isErrorDisplayName.isError,
                        messageError: t(isErrorDisplayName.msgError!!),
                      }}
                    ></CustomField>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <CustomField
                      className={isErrorPassword.isError ? '' : 'ui-mb-22'}
                      field={{
                        isRequired: true,
                        isEye: true,
                        type: 'password',
                        value: password,
                        onChange: (value: any) => {
                          setPassword(value);
                        },
                        autocomplete: 'off',
                        placeholder: t(`password`),
                        icon: lockClosedOutline,
                        error: isErrorPassword.isError,
                        messageError: t(isErrorPassword.msgError!!),
                      }}
                    ></CustomField>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <CustomField
                      className={isErrorConfirmPassword.isError ? '' : 'ui-mb-22'}
                      field={{
                        isEye: true,
                        isRequired: true,
                        type: 'password',
                        value: confirmPassword,
                        onChange: (value: any) => {
                          setConfirmPassword(value);
                        },
                        placeholder: t(`confirmPassword`),
                        autocomplete: 'off',
                        icon: personAddOutline,
                        error: isErrorConfirmPassword.isError,
                        messageError: t(isErrorConfirmPassword.msgError!!),
                      }}
                    ></CustomField>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <CustomField
                      className={isErrorEmail.isError ? '' : 'ui-mb-22'}
                      field={{
                        type: 'email',
                        value: email,
                        onChange: (value: any) => {
                          setEmail(value);
                        },
                        placeholder: t('enterEmail'),
                        autocomplete: 'off',
                        icon: mailOutline,
                        error: isErrorEmail.isError,
                        messageError: t(isErrorEmail.msgError!!),
                        isRequired: true,
                      }}
                    ></CustomField>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol className="ui-mr-16">
                    <DatePicker
                      style={{height: '49px'}}
                      error={isErrorBirthday}
                      value={birthday || moment().format()}
                      maxDate={moment().local().format()}
                      onConfirm={(value) => {
                        setBirthday(value as string);
                      }}
                    ></DatePicker>
                  </IonCol>
                  <IonCol>
                    <GenderPicker
                      error={isErrorGender}
                      value={gender}
                      onValueChange={(v) => setGender(v)}
                    ></GenderPicker>
                  </IonCol>
                </IonRow>
              </IonGrid>
              <IonButton
                mode="ios"
                color={'primary'}
                className="ui-w-100 ui-pd-l-0 ui-pd-r-0 ui-fw-300 ui-mt-20"
                onClick={handleSubmit}
              >
                {t(`createAccount`)}
              </IonButton>
            </form>
          </div>
          <div className="ui-position-absolute ui-position-x-50 ui-position-bottom-0 ui-padding-12">
            <IonText className="ion-text-center" slot="end">
              <h2 className="ion-no-padding ui-fs-16 ui-lh-19 ui-white-space-nowrap ui-fw-300 ui-text-white">
                {t('version') + ' '}1CX 1.0 {BUILD_VERSION} {process.env.REACT_APP_ENV}
              </h2>
            </IonText>
          </div>
        </div>
        <LoadingOverlay isLoading={isLoading} />
      </IonContent>
    </IonPage>
  );
};
export default FormRegister;