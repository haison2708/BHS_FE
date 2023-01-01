import {faGift, faStar} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonText,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import {t} from 'i18next';
import {checkmarkSharp, closeOutline} from 'ionicons/icons';
import moment from 'moment';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import userAPIs from '../../api/user';
import {useAppDispatch} from '../../app/hook';
import {ApiErrorResponseStatusCode} from '../../constants/constants';
import {getGiftsFromSelectedVendor, getUserLoyalty} from '../../features/user/userSlice';
import {IErrorResponse, IGiftOfLoyalty, ILoyaltyProgram} from '../../types/interface';
import CustomButton from '../CustomButton';
import CustomFieldContent from '../CustomFieldContent';
import RoundIcon from '../RoundIcon';
import styles from './styles.module.scss';
import iconLuckyWheel from '../../asset/icon/lucky_wheel.png';
import {useHistory, useLocation} from 'react-router';

interface IExchangeGiftItemProps {
  gift: IGiftOfLoyalty;
  program?: ILoyaltyProgram;
  myPoint?: number;
  onDoneRedeemPoints?: () => void;
  disabled?: boolean;
  processBar?: boolean;
  href?: string;
}

const ExchangeGiftItem: React.FC<IExchangeGiftItemProps & React.HTMLProps<HTMLDivElement>> = ({
  gift,
  program,
  myPoint,
  onDoneRedeemPoints,
  style,
  disabled = false,
  processBar = false,
  href,
  className,
  ...other
}) => {
  // Control:
  const [presentToast, dismissToast] = useIonToast();
  const [numberGift, setNumberGift] = useState<number>(1);
  const [isSelected, setIsSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useHistory();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const maxCountGifts = useMemo<number | undefined>(
    () => myPoint && gift.point && Math.floor(Number(myPoint / gift.point)),
    [myPoint, gift]
  );

  useEffect(() => {
    isSelected && gift.qtyAvailable && setNumberGift(maxCountGifts!!);
  }, [isSelected, gift]);

  const handleRedeemPoint = async (id: number, count: number = 0) => {
    if (count <= 0) {
      presentToast({
        message: t('chooseAppropriateGiftAmount'),
        duration: 400,
        color: 'danger',
        mode: 'ios',
      });
      return;
    }

    try {
      setIsLoading(true);
      const res = await userAPIs
        .exchangeGift({
          giftOfLoyaltyId: id,
          quantity: count,
        })
        .then(() => {
          presentToast({
            message: `${t('exchangeGiftSuccess')}`,
            duration: 300,
            color: 'success',
            mode: 'ios',
          });
        })
        .catch((err) => {
          throw err;
        });
    } catch (e) {
      console.log('Error exchangeGift: ', e);
      const error = e as IErrorResponse;

      // Handle message error
      let errorMessage = t('exchangeGiftFail');
      if (
        error.data?.ErrorCode === ApiErrorResponseStatusCode.Ended ||
        error.data?.ErrorCode === ApiErrorResponseStatusCode.LessThanValue ||
        error.data?.ErrorCode === ApiErrorResponseStatusCode.OutOfGifts ||
        error.data?.ErrorCode === ApiErrorResponseStatusCode.NotEnoughPoint
      ) {
        errorMessage = error.data.ErrorMessage || '';
      }

      presentToast({
        message: errorMessage,
        duration: 400,
        color: 'danger',
        mode: 'ios',
      });
    } finally {
      dispatch(getGiftsFromSelectedVendor());
      dispatch(getUserLoyalty());

      onDoneRedeemPoints && onDoneRedeemPoints();

      setNumberGift(1);
      setIsSelected(false);
      setIsOpened(false);
      setIsLoading(false);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLIonCardElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.pathname?.split('/')?.[1]?.toString() !== 'gift-exchange-program-detail') {
      router.push(`/gift-exchange-program-detail/${program?.id}/${program?.type}`);
    }
  };

  const [isOpened, setIsOpened] = useState(false);

  const handleOpenModal = () => {
    setIsOpened((prev) => !prev);
  };

  return (
    <IonCard
      // button={!href}
      href={`/gift-exchange-program-detail/${program?.id}/${program?.type}`}
      mode="ios"
      style={{overflow: 'hidden'}}
      className={'ui-w-flatform-mobile ui-w-100'}
      onClick={(e) => handleClick(e)}
    >
      <div className={styles.content}>
        <div className={styles.imgContainer}>
          <img src={iconLuckyWheel}></img>
        </div>
        <div className={styles.infomationContainer}>
          <IonText color={'dark'} className="ui-fs-16 ui-font-medium ui-mb-22">
            {gift?.quantity + ' ' + gift?.name}
          </IonText>
          <div className={styles.description}>
            <p>{program?.name}</p>
            <p>
              {t('from')} {moment.utc(program?.startDate).local().format('DD/MM/YYYY')} -{' '}
              {moment.utc(program?.endDate).local().format('DD/MM/YYYY')}
            </p>
          </div>
          <div className={styles.changeContainer}>
            <div className={styles.pointAndQuantity}>
              <div className={styles.pointContainer}>
                <FontAwesomeIcon color={'#F5A202'} icon={faStar}></FontAwesomeIcon>
                <p>
                  {gift?.point} {t('point')}
                </p>
              </div>
              {!disabled && processBar && (
                <div className={styles.progressBar}>
                  <div
                    className={styles.progress}
                    style={{
                      width: gift?.qtyAvailable && gift?.limit && 100 * (gift?.qtyAvailable / gift?.limit) + '%',
                    }}
                  ></div>
                  <p>
                    {t('leftFull')} {gift?.qtyAvailable}/{gift?.limit}
                  </p>
                </div>
              )}
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <IonButton fill="solid" mode="ios" disabled={disabled || !processBar} onClick={handleOpenModal}>
                {t('exchange')}
              </IonButton>
              <IonModal
                mode="md"
                isOpen={isOpened}
                onDidDismiss={() => setIsOpened(false)}
                className={styles.modelChangeGift + ` ion-no-padding`}
                onWillPresent={() => {
                  setIsSelected(false);
                  setNumberGift(1);
                }}
              >
                <IonHeader collapse="fade">
                  <IonToolbar className={styles.toolbarModal + ` ion-no-padding`}>
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
                          className: styles.iconClose,
                        }}
                        onClick={() => setIsOpened(false)}
                      ></CustomButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent>
                  <RoundIcon
                    icon={faGift}
                    color={'#D92332'}
                    backgroundColor={'#D92332' + '15'}
                    fontSize="36px"
                    className={styles.iconModel}
                    linearGradient
                  />
                  <div className={styles.modelContent}>
                    <IonText className=" ion-text-center" color="dark">
                      <p className="ui-font-regular ui-fs-16 ui-lh-24 ui-mt-60 ui-mb-16 ui-pd-l-51 ui-pd-r-51">
                        {t('exchangeGiftAmount')}
                      </p>
                    </IonText>
                    <CustomFieldContent
                      className="ui-ml-24 ui-mr-24"
                      field={{
                        type: 'number',
                        value: numberGift,
                        // value: phone,
                        onChange: (value: number) => setNumberGift(value),
                        placeholder: `${t('enterExchangeGift')}`,
                        // error: isErrorPhone,
                        messageError: `${t('invalidPhone')}`,
                      }}
                    ></CustomFieldContent>
                    <div className="ui-w-100 ui-d-flex ui-flex-direction-row ui-justify-content-flex-start ui-mt-24 ui-mb-24 ui-ml-24 ui-mr-24">
                      <div className="ui-align-self-flex-end ui-ml-12 ui-mr-12">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsSelected(!isSelected);
                          }}
                          className={styles.checkbox + ' ' + (isSelected && styles['checkbox--active'])}
                        >
                          {isSelected && <IonIcon icon={checkmarkSharp} />}
                        </div>
                      </div>
                      <p>{t('maxExchangeGiftAmount')}</p>
                    </div>
                  </div>
                  <div className="ui-ml-24 ui-mr-24">
                    <IonButton
                      type="button"
                      mode="ios"
                      className={styles.submitButton}
                      color={'primary'}
                      onClick={() => gift.id && handleRedeemPoint(gift.id, Number(numberGift))}
                      disabled={isLoading}
                    >
                      {t('exchangeGift')}
                    </IonButton>
                  </div>
                </IonContent>
              </IonModal>
            </div>
          </div>
        </div>
      </div>
    </IonCard>
  );
};

export default ExchangeGiftItem;
