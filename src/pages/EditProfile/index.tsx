import React, {useEffect, useState} from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonTitle,
  IonCard,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  useIonToast,
  useIonAlert,
} from '@ionic/react';
import {callOutline, chevronBack, person, personOutline} from 'ionicons/icons';
import styles from './styles.module.scss';
import CustomField from '../../components/CustomField';
import {normalizeInput} from '../../utils/format';
import moment from 'moment';
import DatePicker from '../../components/DatePicker';
import GenderPicker from '../../components/GenderPicker';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {getUser, selectUser} from '../../features/user/userSlice';
import authAPIs from '../../api/auth';
import _ from 'lodash';
import {useHistory} from 'react-router';
import LoadingOverlay from '../../components/LoadingOverlay';
import {t} from 'i18next';
import {validateEmail, validateFullName} from '../../utils/validate';
import {IError} from '../../types/interface';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface IEditProfileProps {}

const EditProfile: React.FC = (props: IEditProfileProps) => {
  // Controls:
  const [present, dismiss] = useIonToast();
  const [presentAlert] = useIonAlert();
  const router = useHistory();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Redux:
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  // State:
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber);
  const [email, setEmail] = useState(user?.email);
  const [birthDay, setBirthDay] = useState(user?.birthday);
  const [gender, setGender] = useState(user?.gender);

  const [isErrorDisplayName, setIsErrorDisplayName] = useState<IError>({});
  const [isErrorPhoneNumber, setIsErrorPhoneNumber] = useState(false);
  const [isErrorEmail, setIsErrorEmail] = useState<IError>({});
  const [isErrorBirthDay, setIsErrorBirthDay] = useState(false);
  const [isErrorGender, setIsErrorGender] = useState(false);

  const invalid = () => {
    const errorDisplayName = validateFullName(displayName);
    setIsErrorDisplayName(errorDisplayName);

    const errorEmail = validateEmail(email!!);
    setIsErrorEmail(errorEmail);

    return errorDisplayName.isError!! || errorEmail.isError!!;
  };

  const onClickSubmit = () => {
    presentAlert({
      mode: 'md',
      header: `${t('updateInformationConfirmMessage')}`,
      buttons: [
        {
          text: `${t('cancel')}`,
          role: 'cancel',
          handler: () => {},
        },
        {
          text: `${t('agree')}`,
          role: 'confirm',
          handler: handleSubmit,
        },
      ],
    });
  };

  const handleSubmit = async () => {
    if (_.isEmpty(phoneNumber)) {
      return setIsErrorPhoneNumber(true);
    } else {
      setIsErrorPhoneNumber(false);
    }
    if (_.isEmpty(birthDay)) {
      return setIsErrorBirthDay(true);
    } else {
      setIsErrorBirthDay(false);
    }
    if (invalid()) return;

    try {
      setIsLoading(true);
      const data = {
        displayName: displayName,
        email: email,
        gender: gender,
        address: user?.address,
        birthday: birthDay,
      };
      const res = await authAPIs.updateUserInfo(data);
      present({
        message: `${t('updateInformationSuccess')}`,
        duration: 300,
        color: 'success',
        mode: 'ios',
      });
      dispatch(getUser());
      router.goBack();
    } catch (e) {
      console.log('Error update user info: ', e);
      present({
        message: `${t('updateInformationFail')}`,
        duration: 300,
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
          <IonTitle className={'ui-fs-14 ui-fw-400'} slot="">
            {t('editAccountInformation')}
          </IonTitle>
        </IonToolbar>
        <div className={styles.card + ' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}>
          <IonCard mode="ios" style={{overflow: 'visible'}} className={'ui-w-flatform-mobile ui-w-100'}>
            <div className="ui-w-100 ui-w-flatform-mobile">
              <form
                className="ui-spacing-2"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <CustomField
                  className={isErrorDisplayName.isError ? '' : 'ui-mb-22'}
                  field={{
                    isRequired: true,
                    type: 'text',
                    value: displayName,
                    label: `${t('fullName')}`,
                    onChange: (value: any) => {
                      setDisplayName(value);
                    },
                    placeholder: `${t('enterFullName')}`,
                    icon: person,
                    error: isErrorDisplayName.isError,

                    messageError: `${t(isErrorDisplayName.msgError!!)}`,
                  }}
                ></CustomField>
                <CustomField
                  className={isErrorPhoneNumber ? '' : 'ui-mb-22 '}
                  field={{
                    disabled: true,
                    isRequired: true,
                    type: 'text',
                    value: phoneNumber,
                    label: `${t('phoneNumber')}`,
                    onChange: (value: any) => {
                      setPhoneNumber(normalizeInput(value).toString());
                    },
                    placeholder: `${t('enterPhoneNumber')}`,
                    FaIcon: faPhone,
                    error: isErrorPhoneNumber,

                    messageError: `${t('emptyPhoneNumber')}`,
                  }}
                ></CustomField>
                <CustomField
                  className={isErrorEmail.isError ? '' : 'ui-mb-22 '}
                  field={{
                    isRequired: true,
                    type: 'email',
                    value: email,
                    label: `${t('email')}`,
                    onChange: (value: any) => {
                      setEmail(value);
                    },
                    placeholder: `${t('enterEmail')}`,
                    error: isErrorEmail.isError,
                    FaIcon: faEnvelope,

                    messageError: `${t(isErrorEmail.msgError!!)}`,
                  }}
                ></CustomField>
                <IonGrid>
                  <IonRow>
                    <IonCol size="6">
                      <DatePicker 
                        className={styles.inputFiled}
                        error={isErrorBirthDay}
                        value={moment.utc(user?.birthday).local().format()}
                        maxDate={moment().local().format()}
                        onConfirm={(value) => setBirthDay(value as string)}
                      ></DatePicker>
                    </IonCol>
                    <IonCol size="5.5" push="0.5">
                      <GenderPicker
                        error={isErrorGender}
                        value={gender}
                        onValueChange={(v) => setGender(v)}
                      ></GenderPicker>
                    </IonCol>
                  </IonRow>
                </IonGrid>
                <div className={styles.submitButton__container}>
                  <IonButton mode="ios" className={styles.submitButton} color={'primary'} onClick={onClickSubmit}>
                    {t('update')}
                  </IonButton>
                </div>
              </form>
            </div>
          </IonCard>
        </div>
        <LoadingOverlay isLoading={isLoading} />
      </IonContent>
    </IonPage>
  );
};

export default EditProfile;
