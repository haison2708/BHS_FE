import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import {chevronBack, closeOutline} from 'ionicons/icons';
import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.scss';
import {QrReader} from 'react-qr-reader';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBoltLightning, faImage, faQrcode} from '@fortawesome/free-solid-svg-icons';
import {usePhotoGallery} from '../../hooks/usePhotoGallery';
import {Decoder} from '@nuintun/qrcode';
import RoundIcon from '../../components/RoundIcon';
import {useHistory} from 'react-router-dom';
import {useAppDispatch} from '../../app/hook';
import {getUserLoyalty} from '../../features/user/userSlice';
import {IUseQRRespone} from '../../api/user/interface';
import userAPIs from '../../api/user';
import {AndroidPermissions} from '@awesome-cordova-plugins/android-permissions';
import {useTranslation} from 'react-i18next';
import {formatMoney} from '../../utils/format';
import { getAllProgram } from '../../features/program/programSlice';

interface IQRScannerProps {}

const QRScanner: React.FC<IQRScannerProps> = ({}) => {
  // Redux:
  const dispatch = useAppDispatch();

  // Controls:
  const {photo, chooseFromGallery} = usePhotoGallery();
  const modal = useRef<HTMLIonModalElement>(null);
  const [present, dismiss] = useIonToast();
  var isUsingFrontCam = !isPlatform('capacitor') && !isPlatform('android') && !isPlatform('ios');
  const [hasFolderPermission, setHasFolderPermission] = useState<boolean>(false);
  const [showQR, setShowQR] = useState<boolean>(!isPlatform('capacitor'));
  const router = useHistory();
  const {t} = useTranslation();

  // State:
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const [data, setData] = useState<string>();
  const [qrData, setQrData] = useState<IUseQRRespone>();

  useEffect(() => {
    checkPermission();
  }, []);

  useEffect(() => {
    const checkQrData = async () => {
      try {
        console.log('callAPI');
        const res = await userAPIs.useQR({
          qrCode: data,
        });
        if (res) {
          console.log('qr content res: ', res);
          setQrData(res);

          // Reload Data:
          await dispatch(getUserLoyalty());
          await dispatch(getAllProgram());

          modal.current?.present();
        }
      } catch (e) {
        setQrData(undefined);
        console.log('Error use QR: ', e);
        modal.current?.present();
      }
    };

    if (isScanning && data) {
      if (!modal.current?.isOpen) {
        checkQrData();
      }
      setIsScanning(false);
    }
  }, [isScanning, data]);

  // Avoid camera still scanning after navigated to product detail:
  useIonViewWillEnter(() => {
    setIsScanning(true);
  });

  const checkPermission = async () => {
    if (isPlatform('capacitor')) {
      AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.CAMERA)
        .then(async (res) => {
          if (!res.hasPermission) {
            await AndroidPermissions.requestPermissions([AndroidPermissions.PERMISSION.CAMERA]).then((value) => {
              console.log('CAMERA PERMISSION', value);
              if (value?.hasPermission) setShowQR(true);
              else {
                present({
                  message: t(`allowPerrmissionToUseCamera`),
                  duration: 4000,
                  color: 'danger',
                  mode: 'ios',
                  position: 'top',
                });
              }
            });
          } else {
            setShowQR(true);
          }
        })
        .catch((e) => {
          console.log('Error ask camera permission: ', e);
        });

      AndroidPermissions.checkPermission(AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
        .then(async (res) => {
          if (res.hasPermission) {
            setHasFolderPermission(true);
          }
        })
        .catch((e) => {
          console.log('Error ask folder permission: ', e);
        });
    }
  };

  const handleScan = async (data: any) => {
    if (data && !modal.current?.isOpen) {
      setData(data?.text);
    }
  };

  const handleDismissModal = () => {
    setData('');
    setIsScanning(true);
  };

  const handleClickChooseImage = async () => {
    if (!hasFolderPermission && isPlatform('capacitor') && (isPlatform('android') || isPlatform('ios'))) {
      const hasFolderPermission = await AndroidPermissions.checkPermission(
        AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE
      );
      if (!hasFolderPermission.hasPermission) {
        AndroidPermissions.requestPermissions([AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE])
          .then((res) => {
            if (res.hasPermission) setHasFolderPermission(true);
          })
          .catch((e) => {
            console.log('Error ask folder permission: ', e);
          });
      }
    }

    await chooseFromGallery();
    const qrcode = new Decoder();

    try {
      const result = await qrcode.scan(photo?.webPath || '');
      if (result) {
        setData(result.data);
      }
    } catch (e) {
      present({
        message: t(`cannotReadImage`),
        duration: 300,
        color: 'danger',
        mode: 'ios',
      });
    }
  };

  const renderModal = () => {
    return (
      <IonModal ref={modal} isOpen={false} mode="ios" className={styles.modal} onDidDismiss={handleDismissModal}>
        <div className={styles.modal__content}>
          <IonFab vertical="top" horizontal="end">
            <IonButton
              fill="clear"
              onClick={() => {
                modal.current?.dismiss();
              }}
            >
              <IonIcon color="danger" icon={closeOutline}></IonIcon>
            </IonButton>
          </IonFab>
          <div className={styles.modal__iconWrapper}>
            <RoundIcon
              style={{width: '60px', height: '60px'}}
              icon={faQrcode}
              color="#21367B"
              backgroundColor="#21367B15"
              fontSize="36px"
              linearGradient
            ></RoundIcon>
          </div>
          <div className="ui-text-center ui-w-100">
            <IonLabel className="ui-text-black ui-fw-700 ui-text-center">{data}</IonLabel>
          </div>
          {qrData ? (
            <>
              <div className={styles.modal__chip}>
                <IonLabel className="ion-no-padding ui-fw-500">
                  + {qrData?.points} {t(`point`)}
                </IonLabel>
              </div>
              <div className={styles.modal__product}>
                <img
                  className={styles.modal__productImage}
                  src={qrData?.image || 'https://minhcaumart.vn/media/com_eshop/products/8934822101336.jpg'}
                  alt="product_image"
                />
                <div className="ui-pd-l-12 ui-w-100 ui-h-100 ui-d-flex ui-flex-direction-column ui-justify-content-space-around">
                  <p className="ui-fs-16 ui-fw-500">{qrData?.name}</p>
                  <p className="ui-fs-14 ui-fw-500">{formatMoney(qrData?.price || 0)}đ</p>
                  <IonText
                    color={'primary'}
                    onClick={async () => {
                      await modal?.current?.dismiss();
                      setIsScanning(false);
                      router.push(`/product/${qrData.productId}`);
                    }}
                  >
                    <p className="ui-fs-14 ui-fw-400">{t(`seeDetail`) + ' >'} </p>
                  </IonText>
                </div>
              </div>
            </>
          ) : (
            <div className="ui-text-center ui-mt-20">
              <IonLabel className="ui-fw-500 ui-text-danger">{t(`invalidBarcode`)}</IonLabel>
            </div>
          )}
        </div>
      </IonModal>
    );
  };

  const renderScanMask = () => {
    return (
      <div className={styles.scanArea}>
        <div className={styles.scanArea__corner + ' ' + styles['scanArea__corner--topLeft']}></div>
        <div className={styles.scanArea__corner + ' ' + styles['scanArea__corner--topRight']}></div>
        <div className={styles.scanArea__corner + ' ' + styles['scanArea__corner--bottomLeft']}></div>
        <div className={styles.scanArea__corner + ' ' + styles['scanArea__corner--bottomRight']}></div>
        <div className={styles.scanArea__line}></div>
      </div>
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="md" className="small-header-toolbar">
          <IonButtons slot="start">
            <IonBackButton mode="md" icon={chevronBack} defaultHref="/"></IonBackButton>
          </IonButtons>
          <IonTitle className="ui-fs-16 ui-fw-400">{t(`scanBarcode`)}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className={styles.container}>
          {showQR && (
            <QrReader
              className={isUsingFrontCam ? styles['qrReader--reverseVertical'] : ''}
              videoId="qrScanner__video"
              constraints={{facingMode: 'environment'}}
              onResult={(data) => {
                handleScan(data);
              }}
              videoContainerStyle={{
                height: 'fit-content',
                overflow: 'visible',
              }}
              videoStyle={{
                transform: 'scaleX(-1) !important',
              }}
            ></QrReader>
          )}
          {renderModal()}
          <div className={styles.overlay}>
            <div className={styles.instruction}>
              <h6>{t(`scanInstruction`)}</h6>
            </div>
            <div className={styles.scanArea__invisibleBlock}></div>
            <div className={styles.scanArea__footer}>
              <div className={styles.lightingAlert}>{t('lackOfLight')}</div>
              <div className={'ui-mt-24 ui-d-flex ui-center'}>
                <div className={styles.button} onClick={() => {}}>
                  <div className={styles.button__iconWrapper}>
                    <FontAwesomeIcon icon={faBoltLightning}></FontAwesomeIcon>
                  </div>
                  <IonLabel>{t('turnOnLight')}</IonLabel>
                </div>

                <div className={styles.button + ' ui-ml-20'} onClick={handleClickChooseImage}>
                  <div className={styles.button__iconWrapper}>
                    <FontAwesomeIcon icon={faImage}></FontAwesomeIcon>
                  </div>
                  <IonLabel>{t(`chooseImage`)}</IonLabel>
                </div>
              </div>
            </div>
            {renderScanMask()}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default QRScanner;
