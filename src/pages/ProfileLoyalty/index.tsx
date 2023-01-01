import React, {Fragment, useEffect, useState} from 'react';
import {IonPage, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonCard} from '@ionic/react';
import {chevronBack} from 'ionicons/icons';
import styles from './styles.module.scss';
import {useAppSelector} from '../../app/hook';
import {selectUserLoyalty} from '../../features/user/userSlice';
import RoundIcon from '../../components/RoundIcon';
import {IConfigRankOfVendor, ILoyaltyType} from '../../types/interface';
import {getLoyaltyType} from '../../utils/utils';
import {t} from 'i18next';
import {Trans} from 'react-i18next';
import { listLoyaltyType } from '../../constants/constants';
import vendorAPIs from '../../api/vendor';

interface IProfileLoyaltyProps {}

const ProfileLoyalty: React.FC = (props: IProfileLoyaltyProps) => {
  // Redux:
  const [configRankOfVendor, setConfigRankOfVendor] = useState<IConfigRankOfVendor>()
  const userLoyalty = useAppSelector(selectUserLoyalty);

  // State:
  const [nextLoyaltyType, setNextLoyaltyType] = useState<ILoyaltyType>();
  const [currentLoyaltyType, setCurrentLoyaltyType] = useState<ILoyaltyType>();

  useEffect(() => {
    getConfigRankOfVendor()
  }, [])

  useEffect(() => {
    const current = getLoyaltyType(userLoyalty?.rankOfUser?.rank || '');
    setCurrentLoyaltyType(current);
    const next = getLoyaltyType(current?.nextRank || '');
    const nextPoint = configRankOfVendor?.[current?.typeNextRank as keyof typeof configRankOfVendor]
    setNextLoyaltyType({...next, ...{point: nextPoint as number}});
  }, [configRankOfVendor, userLoyalty?.rankOfUser?.rank]);

  const getConfigRankOfVendor = async () => {
    try {
      const res = await vendorAPIs.getConfigRank()
      setConfigRankOfVendor(res)
    } catch (e) {
      console.log('Error get config rank of vendor: ', e)
    }
  }

  const renderRankItem = (rank: string, point?: number) => {
    const loyaltyType = getLoyaltyType(rank || '');

    const isActive = (configRankOfVendor?.rankOfUser?.point || 0) < (point || 0);
    return (
      <IonCard mode="ios" button onClick={() => {}} className={'ui-w-flatform-mobile ui-w-100 ui-mt-16'}>
        <div className={styles.subCard + ' ' + (isActive ? styles['subCard--active'] : '')}>
          <div className={'ui-h-100 ui-d-flex ' + styles.icon__Wrapper}>
            <RoundIcon
              linearGradient={true}
              icon={loyaltyType?.icon}
              color={loyaltyType?.color}
              backgroundColor={loyaltyType?.color + '15'}
              fontSize="24px"
              className={styles['icon--large']}
            />
          </div>
          <div className={styles.subCard__content}>
            <h6 className="ui-fs-20 ui-font-bold ui-text-black">{t(loyaltyType?.title!!)}</h6>
            {point ? (
              <p className="ui-fs-16 ui-text-gray ui-fw-300">
                {t('needAccamulateSomePoints')}{' '}
                <span className="ui-fw-500">
                  {point} {t('point').toLocaleLowerCase()}
                </span>
              </p>
            ) : (
              <p className="ui-fs-16 ui-text-gray ui-fw-300">{t(loyaltyType?.description!!)}</p>
            )}
          </div>
        </div>
      </IonCard>
    );
  };

  return (
    <IonPage>
      <IonHeader id="header-toolbar"></IonHeader>
      <IonContent>
        <IonToolbar mode="md" className="medium-header-toolbar">
          <IonButtons slot="start">
            <IonBackButton mode="md" icon={chevronBack} defaultHref="/tabs/profile"></IonBackButton>
          </IonButtons>
          <IonTitle className={'ui-fs-14 ui-fw-400'} slot="">
            {t('userRank')}
          </IonTitle>
        </IonToolbar>
        <div className={styles.content + ' ui-pd-l-16 ui-pd-r-16 ui-d-flex ui-flex-direction-column ui-center'}>
          <IonCard
            mode="ios"
            style={{overflow: 'visible'}}
            className={'ui-w-flatform-mobile ui-w-100 ' + styles.mainCard}
          >
            <div className="ui-w-100 ui-d-flex ui-align-items-center ui-flex-direction-column">
              <RoundIcon
                icon={currentLoyaltyType?.icon}
                color={currentLoyaltyType?.color}
                backgroundColor={currentLoyaltyType?.color + '15'}
                fontSize="24px"
                className={styles['icon--large']}
              />
              <p className="ui-text-gray ui-fs-14" style={{margin: '16px 16px 8px'}}>
                {t('totalLoyaltyPoints')}
              </p>
              <h6 className="ui-fs-24 ui-font-bold ui-text-black" style={{margin: '0 0 24px'}}>
                {userLoyalty?.rankOfUser?.point}
              </h6>
              <div className={styles.mainCard__progressBar}>
                <div className={styles.mainCard__progressBarLeft}>
                  <div
                    className={styles.progress}
                    style={{
                      background: currentLoyaltyType?.color + '15',
                      width: ((userLoyalty?.rankOfUser?.point || 0) / (nextLoyaltyType?.point || 0)) * 100 + '%',
                    }}
                  ></div>
                  <RoundIcon
                    icon={currentLoyaltyType?.icon}
                    color={currentLoyaltyType?.color}
                    backgroundColor={currentLoyaltyType?.color + '15'}
                    fontSize="16px"
                    className={styles['icon--medium']}
                  />
                  <div className={styles.mainCard__progressBarLeftContent}>
                    {currentLoyaltyType?.nextRank ? (
                      <p className="ui-ml-3">
                        <Trans
                          i18nKey={'youNeedSomePointsToUpRank'}
                          values={{point: (nextLoyaltyType?.point || 0) - (userLoyalty?.rankOfUser?.point || 0)}}
                          components={{b: <span className="ui-fw-700 ui-text-black" />}}
                        ></Trans>
                      </p>
                    ) : (
                      <p className="ui-ml-10">{t('youHaveReachedMaxRank')}</p>
                    )}
                  </div>
                </div>
                {nextLoyaltyType?.icon && (
                  <RoundIcon
                    icon={nextLoyaltyType?.icon}
                    color={nextLoyaltyType?.color}
                    backgroundColor={nextLoyaltyType?.color + '15'}
                    fontSize="16px"
                    className={styles['icon--medium']}
                  />
                )}
              </div>
            </div>
          </IonCard>
          {renderRankItem('New', 0)}
          {listLoyaltyType?.map((item, index) => {
            if (item?.typeRank) return(
              <Fragment key={index}>{renderRankItem(item?.rank || '', configRankOfVendor?.[item?.typeRank])}</Fragment>)
            })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfileLoyalty;
