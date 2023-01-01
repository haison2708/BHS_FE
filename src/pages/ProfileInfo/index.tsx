import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonActionSheet,
  useIonToast,
} from '@ionic/react';
import {camera, chevronBackOutline, chevronForward, personRemoveOutline} from 'ionicons/icons';
import React, {useState} from 'react';
import moment from 'moment';
import {IMenuButton} from '../../components/MenuButtonsGroup/interface';
import MenuButtonsGroup from '../../components/MenuButtonsGroup';
import styles from './styles.module.scss';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {getUser, selectUser} from '../../features/user/userSlice';
import {usePhotoGallery} from '../../hooks/usePhotoGallery';
import authAPIs from '../../api/auth';
import {useHistory} from 'react-router';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserEdit} from '@fortawesome/free-solid-svg-icons';
import LoadingOverlay from '../../components/LoadingOverlay';
import {t} from 'i18next';
import ImageView from '../../components/ImageView';

type IProfileInfoProps = {};

const ProfileInfo: React.FC = (props: IProfileInfoProps) => {
  // Controls:
  const router = useHistory();
  const [present] = useIonToast();
  const {photo, takePhoto} = usePhotoGallery();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [presentActionSheet] = useIonActionSheet();
  const [showFullAvatar, setShowFullAvatar] = useState<boolean>(false);

  // Redux:
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();

  const deleteProfile: IMenuButton = {
    title: `${t('requestDeleteAccount')}`,
    color: 'dark',
    leftIcon: {
      icon: personRemoveOutline,
      size: 'small',
      color: 'danger',
    },
    rightIcon: {
      icon: chevronForward,
    },
  };
  const accountMenu: IMenuButton[] = [deleteProfile];

  const handleClickAvatar = async () => {
    presentActionSheet({
      header: `${t('action')}`,
      cssClass: 'my-custom-class',
      mode: 'md',
      onWillDismiss(event) {
        if (event.detail.data.action === 'viewImage') {
          setShowFullAvatar(true);
        }
        if (event.detail.data.action === 'updateImage') {
          handleChangeAvatar();
        }
      },
      buttons: user?.image
        ? [
            {
              text: t('viewImage'),
              data: {
                action: 'viewImage',
              },
            },
            {
              text: t('updateImage'),
              data: {
                action: 'updateImage',
              },
            },
          ]
        : [
            {
              text: t('updateImage'),
              data: {
                action: 'updateImage',
              },
            },
          ],
    });
  };

  const handleChangeAvatar = async () => {
    await takePhoto();
    try {
      setIsLoading(true);
      const res = await authAPIs.updateUserAvatar(photo?.base64 || '');
      present({
        message: `${t('updateImageSuccess')}`,
        duration: 600,
        color: 'success',
        mode: 'ios',
      });
    } catch (e) {
      console.log('Error update user avatar: ', e);
      present({
        message: `${t('updateImageFail')}`,
        duration: 600,
        color: 'danger',
        mode: 'ios',
      });
    } finally {
      await dispatch(getUser());
      setIsLoading(false);
    }
  };

  const handleClickEditProfile = () => {
    router.push('/edit-profile');
  };

  return (
    <IonPage>
      <IonHeader id="header-toolbar"></IonHeader>
      <IonContent>
        <IonToolbar mode="md" className={styles.header}>
          <IonButtons slot="start">
            <IonBackButton mode="md" icon={chevronBackOutline} defaultHref="/tabs/profile"></IonBackButton>
          </IonButtons>
          <IonTitle className={'ui-fs-16 ui-fw-400'} slot="">
            {t('accountInformation')}
          </IonTitle>
          <IonButton fill="clear" slot="end" onClick={handleClickEditProfile}>
            <FontAwesomeIcon fontSize={'20px'} color="white" icon={faUserEdit}></FontAwesomeIcon>
          </IonButton>
        </IonToolbar>
        <div className={styles.card + ' ui-pd-l-20 ui-pd-r-20 ui-d-flex ui-flex-direction-column ui-center'}>
          <IonCard mode="ios" style={{overflow: 'visible'}} className={'ui-w-flatform-mobile ui-w-100'}>
            <div className={styles.card__content + ' ui-align-items-center ui-pd-l-10 ui-pd-r-10 ui-pd-t-50'}>
              <div
                className={styles.avatarContainer + ' ' + styles['avatarContainer--full']}
                onClick={handleClickAvatar}
              >
                <IonAvatar>
                  <img src={user?.image ? user?.image : require('../../asset/icon/avatar_holder.jpg')} />
                </IonAvatar>
                <div className={styles.cameraIconContainer}>
                  <IonIcon icon={camera}></IonIcon>
                </div>
              </div>
              <p className="ui-text-center ui-text-black ui-fs-16 ui-font-bold ui-mb-14">{user?.displayName}</p>
              <div className={styles.divider}></div>
              <IonList>
                <IonItem lines="none">
                  <IonLabel mode="ios" className={styles.label}>
                    <p>{t('phoneNumber')}</p>
                  </IonLabel>
                  <IonText mode="md" className={styles.text}>
                    {user?.phoneNumber}
                  </IonText>
                </IonItem>
                <div className={styles.divider}></div>
                <IonItem lines="none">
                  <IonLabel mode="ios" className={styles.label}>
                    <p>{t('birthday')}</p>
                  </IonLabel>
                  <IonText mode="md" className={styles.text}>
                    {moment.utc(user?.birthday).local().format('DD/MM/YYYY')}
                  </IonText>
                </IonItem>
                <div className={styles.divider}></div>
                <IonItem lines="none">
                  <IonLabel mode="ios" className={styles.label}>
                    <p>{t('gender')}</p>
                  </IonLabel>
                  <IonText mode="md" className={styles.text}>
                    {user?.gender === 0 ? 'Nữ' : 'Nam'}
                  </IonText>
                </IonItem>
                <div className={styles.divider}></div>
                <IonItem lines="none" className={styles.item}>
                  <IonLabel mode="ios" className={styles.label}>
                    <p>{t('email')}</p>
                  </IonLabel>
                  <IonText mode="md" className={styles.text}>
                    {user?.email}
                  </IonText>
                </IonItem>
              </IonList>
            </div>
          </IonCard>
          <div className="ui-w-100 ui-w-flatform-mobile">
            <MenuButtonsGroup className="ui-mt-16" buttons={accountMenu}></MenuButtonsGroup>
          </div>
        </div>
        <ImageView imageSrc={user?.image} isShow={showFullAvatar} onButtonClick={() => setShowFullAvatar(false)} />
        <LoadingOverlay isLoading={isLoading} />
      </IonContent>
    </IonPage>
  );
};

export default ProfileInfo;
