import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import styles from './styles.module.scss';
import {chevronBack, lockOpenOutline} from 'ionicons/icons';
import React, {useState} from 'react';
import {useHistory} from 'react-router';
import authAPIs from '../../api/auth';
import {IChangePasswordFromAppRequest} from '../../api/auth/interface';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import CustomField from '../../components/CustomField';
import {getUser, selectUser} from '../../features/user/userSlice';
import {IError, IIdentityErrorResponse} from '../../types/interface';
import {Preferences} from '@capacitor/preferences';
import LoadingOverlay from '../../components/LoadingOverlay';
import {t} from 'i18next';
import {validateConfirmPassword, validatePassword} from '../../utils/validate';
interface IChangePasswordProps {}

function ChangePassword({}: IChangePasswordProps) {
  // Redux:
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  // State:
  const [oldPassword, setOldPassword] = useState<string>('');
  const [isErrorOldPassword, setIsErrorOldPassword] = useState<IError>({});
  const [newPassword, setNewPassword] = useState<string>('');
  const [isErrorNewPassword, setIsErrorNewPassword] = useState<IError>({});
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [isErrorConfirmNewPassword, setIsErrorConfirmNewPassword] = useState<IError>({});

  // Control:
  const [presentToast, dismissToast] = useIonToast();
  const router = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const invalidate = (): boolean => {
    const errorOldPassword = validatePassword(oldPassword);
    setIsErrorOldPassword(errorOldPassword);

    const errorNewPassword = validatePassword(newPassword, 'new');
    setIsErrorNewPassword(errorNewPassword);

    const errorNewConfirmPassword = validateConfirmPassword(confirmNewPassword, newPassword, 'new');
    setIsErrorConfirmNewPassword(errorNewConfirmPassword);

    return errorOldPassword.isError!! || errorNewPassword.isError!! || errorNewConfirmPassword.isError!!;
  };

  const handleSubmit = async () => {
    if (invalidate()) return;
    try {
      setIsLoading(true);
      const body: IChangePasswordFromAppRequest = {
        identity: user?.phoneNumber || '',
        oldPassword: oldPassword,
        password: newPassword,
        confirmPassword: confirmNewPassword,
      };
      const res = await authAPIs.changePasswordFromApp(body);
      presentToast({
        message: `${t('changePasswordSuccess')}`,
        duration: 600,
        color: 'success',
        mode: 'ios',
      });
      // Relogin because access token has died
      const loginRes = await authAPIs.login({
        grant_type: 'password',
        client_id: 'ro.client',
        client_secret: 'secret',
        username: user?.phoneNumber || '',
        password: newPassword,
      });
      await Preferences.set({
        key: '_accessToken',
        value: loginRes.access_token || '',
      });
      await Preferences.set({
        key: '_refreshToken',
        value: loginRes.refresh_token || '',
      });
      dispatch(getUser());
      router.replace('/tabs/profile');
    } catch (e) {
      console.log('Error change password from app : ', e);
      const error = e as IIdentityErrorResponse;
      presentToast({
        message: error?.data || `${t('changePasswordFail')}`,
        duration: 600,
        color: 'danger',
        mode: 'ios',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader></IonHeader>
      <IonContent>
        <IonToolbar mode="md" className="medium-header-toolbar">
          <IonButtons slot="start">
            <IonBackButton mode="md" icon={chevronBack} defaultHref="/profile-info"></IonBackButton>
          </IonButtons>
          <IonTitle className={'ui-fs-16 ui-fw-400'} slot="">
            {t('changePassword')}
          </IonTitle>
        </IonToolbar>
        <div className={styles.card + ' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}>
          <IonCard mode="ios" style={{overflow: 'visible'}} className={styles.card + ' ui-w-flatform-mobile ui-w-100'}>
            <img src={require('../../asset/system/change_password_logo.png')}></img>
            <form
              className="ui-spacing-2"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <CustomField
                className={isErrorOldPassword.isError ? '' : 'ui-mb-22'}
                field={{
                  isEye: true,
                  type: 'password',
                  value: oldPassword,
                  onChange: (value: any) => {
                    setOldPassword(value);
                  },
                  placeholder: `${t('confirmOldPassword')}`,
                  autocomplete: 'off',
                  icon: lockOpenOutline,
                  error: isErrorOldPassword.isError,

                  messageError: `${t(isErrorOldPassword.msgError!!)}`,
                }}
              ></CustomField>
              <CustomField
                className={isErrorNewPassword.isError ? '' : 'ui-mb-22'}
                field={{
                  isEye: true,
                  type: 'password',
                  value: newPassword,
                  onChange: (value: any) => {
                    setNewPassword(value);
                  },
                  placeholder: `${t('enterNewPassword')}`,
                  autocomplete: 'off',
                  icon: lockOpenOutline,
                  error: isErrorNewPassword.isError,

                  messageError: `${t(isErrorNewPassword.msgError!!)}`,
                }}
              ></CustomField>
              <CustomField
                className={isErrorConfirmNewPassword.isError ? '' : 'ui-mb-22'}
                field={{
                  isEye: true,
                  type: 'password',
                  value: confirmNewPassword,
                  onChange: (value: any) => {
                    setConfirmNewPassword(value);
                  },
                  placeholder: `${t('confirmNewPassword')}`,
                  autocomplete: 'off',
                  icon: lockOpenOutline,
                  error: isErrorConfirmNewPassword.isError,

                  messageError: `${t(isErrorConfirmNewPassword.msgError!!)}`,
                }}
              ></CustomField>
              <div className={styles.submitButton__container}>
                <IonButton mode="ios" className={styles.submitButton} color={'primary'} onClick={handleSubmit}>
                  {t('changePassword')}
                </IonButton>
              </div>
            </form>
          </IonCard>
        </div>
        <LoadingOverlay isLoading={isLoading} />
      </IonContent>
    </IonPage>
  );
}

export default ChangePassword;
