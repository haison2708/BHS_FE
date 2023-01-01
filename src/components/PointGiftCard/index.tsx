import {IconDefinition} from '@fortawesome/free-solid-svg-icons';
import {IonCard, IonCardContent, IonIcon, IonText} from '@ionic/react';
import {t} from 'i18next';
import {chevronForward, giftOutline} from 'ionicons/icons';
import moment from 'moment';
import React from 'react';
import {useHistory} from 'react-router';
import {useAppSelector} from '../../app/hook';
import {selectUserLoyalty} from '../../features/user/userSlice';
import {IAboutToExpire, IConfigRankOfVendor, ILoyaltyType, IVendorOfUser} from '../../types/interface';
import {getLoyaltyType} from '../../utils/utils';
import RoundIcon from '../RoundIcon';
import styles from './styles.module.scss';

interface IPointCardProps {
  icon?: IconDefinition;
  colorIcon?: string;
  title?: string;
  value?: string;
  fontSize?: number;
  expiration?: IAboutToExpire;
}

interface IGiftCardProps {
  icon?: IconDefinition;
  colorIcon?: string;
  title?: string;
  value?: string;
  fontSize?: number;
}

interface IPointGiftCardProps {
  vendor?: IVendorOfUser;
  href?: string;
  point?: IPointCardProps;
  gift?: IGiftCardProps;
  rank?: ILoyaltyType;
  footer?: boolean;
}

const PointGiftCard: React.FC<IPointGiftCardProps & React.HTMLProps<HTMLDivElement>> = ({
  vendor,
  footer,
  href,
  point,
  gift,
  rank,
}) => {

  // Controls:
  const router = useHistory();

  // Redux:
  const userLoyalty = useAppSelector(selectUserLoyalty);

  const handleRenderNextAchievement = () => {
    const nextRankPoint = vendor?.configRankOfVendor?.[rank?.typeNextRank as keyof IConfigRankOfVendor];
    const nextRankType = getLoyaltyType(rank?.nextRank || '');
    const remainingPointTillNextRank = (nextRankPoint as number) - (vendor?.configRankOfVendor?.rankOfUser?.point || 0);
    return rank?.nextRank
      ? `${t('add')} ${remainingPointTillNextRank} ${t('point').toLowerCase()} ${t('upRank').toLowerCase()} ${t(nextRankType?.rank?.toLowerCase() || '')}`
      : `${t('youHaveReachedMaxRank')}`;
  };

  return (
    <IonCard mode="ios" style={{overflow: 'visible'}} className={styles.card + ' ui-w-flatform-mobile ui-w-100'}>
      <div className={styles.wrapper}>
        {vendor && (
          <div className={styles.vendorContainer}>
            <div className={styles.imgVendor} style={{backgroundImage: `url('${vendor?.logo}')`}} />
            <h6 className="nameVender ui-font-medium">{vendor?.name}</h6>
            <div className={styles.iconContent}>
              <IonIcon icon={chevronForward}></IonIcon>
            </div>
          </div>
        )}
        {rank ? (
          <IonCardContent className={styles.rankContainer}>
            <div className={styles.imgRank}>
              <RoundIcon
                icon={rank?.icon}
                color={rank?.color}
                backgroundColor={rank?.color + '15'}
                fontSize="16px"
                style={{width: '40px', height: '40px'}}
                linearGradient
              />
            </div>
            <div className={styles.contentRank}>
              <IonText color={'dark'} className="ui-fs-18 ui-font-medium">
                {t(rank?.title || '')}
              </IonText>
              <span className={styles.rankValue}>
                {vendor?.configRankOfVendor?.rankOfUser?.point}
                {` ${t('loyaltyPoint').toLocaleLowerCase()}`}
              </span>
              <span>{handleRenderNextAchievement()}</span>
            </div>
          </IonCardContent>
        ) : (
          <IonCardContent className={styles.pointContainer}>
            <span style={{fontSize: '14px'}}>{point?.title || gift?.title}</span>
            <div
              className={styles.pointWrapper}
              onClick={() => {
                if (href) router.push(`${href}`);
              }}
            >
              <RoundIcon
                icon={point?.icon || gift?.icon}
                color={point?.colorIcon || gift?.colorIcon}
                backgroundColor={point?.colorIcon + '15' || gift?.colorIcon + '15'}
                fontSize="14px"
                style={{width: '26px', height: '26px'}}
              />
              <IonText
                color={'dark'}
                className={`ui-fs-${point?.fontSize || gift?.fontSize} ui-font-bold ui-mt-1 ${!href && 'ui-mr-22'}`}
              >
                {point?.value || gift?.value}
              </IonText>
              {href && (
                <div className={styles.iconContent}>
                  <IonIcon color={'dark'} icon={chevronForward}></IonIcon>
                </div>
              )}
            </div>
            {point?.expiration && point?.expiration?.point !== 0 && (
              <div style={{fontSize: '14px', fontWeight: '400'}}>
                <IonText color={'dark'} style={{fontSize: '14px', fontWeight: '500'}}>
                  {point?.expiration?.point}
                  {' ' + t('point').toLowerCase() + ' '}
                </IonText>
                {t('expireAt').toLocaleLowerCase()}{' '}
                {moment.utc(point?.expiration.expirationDate).local().format('DD/MM/YYYY')}
              </div>
            )}
          </IonCardContent>
        )}
        {footer && (
          <div className={styles.giftContainer} onClick={() => router.push('/my-gift')}>
            <IonIcon
              icon={giftOutline}
              color={'danger'}
              style={{
                marginRight: '12px',
                fontSize: '18px',
                marginBottom: '1px',
              }}
            />
            <span>{t('myGift')}</span>
            <div className={styles.giftActive}>
              <span>
                {userLoyalty?.totalGift || '0'} {t('unusedGift').toLocaleLowerCase()}
              </span>
              <div className={styles.iconContent}>
                <IonIcon icon={chevronForward}></IonIcon>
              </div>
            </div>
          </div>
        )}
      </div>
    </IonCard>
  );
};

export default PointGiftCard;
