import {
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonModal,
  IonPage,
  IonRow,
  useIonToast,
  useIonViewWillEnter,
} from '@ionic/react';
import {useEffect, useState} from 'react';
import styles from './styles.module.scss';
import GameButton from './components/GameButton';
import GameRoundButton from '../../components/GameRoundButton';
import GameTurn from './components/GameTurn';
import {IErrorResponse, IFortune, IReward} from '../../types/interface';
import {getRandomColor, getRandomNumber, trimURLId} from '../../utils/utils';
import GameComboBox from './components/GameComboBox';
import {checkmarkCircle} from 'ionicons/icons';
import GameRuleModal from './components/GameRuleModal';
import GameRewardResultModal from './components/GameRewardResultModal';
import {useHistory, useLocation} from 'react-router';
import fortuneAPIs from '../../api/fortune';
import userAPIs from '../../api/user';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {t} from 'i18next';
import {getUserLoyalty} from '../../features/user/userSlice';

type ILuckyWheelProps = {};

const LuckyWheel = (props: ILuckyWheelProps) => {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Params, path:
  const path = useLocation().pathname;
  const params = useLocation().state as {vendorId?: number};

  // Redux:
  const dispatch = useAppDispatch();

  // State:
  const [listFortune, setListFortune] = useState<IFortune[]>([]);
  const [selectedFortune, setSelectedFortune] = useState<IFortune>();
  const [resultReward, setResultReward] = useState<IReward>();
  const [isSpinningEnabled, setIsSpinningEnabled] = useState<boolean>(true);

  // Constants:
  const SPINNING_TIME = '3s';
  const PAUSE_TIME = 1000; //ms : the amount of time the wheel pause after spinning (without spinning backward)
  const resultIndex = selectedFortune?.fortuneDetails[0]
    ? selectedFortune?.fortuneDetails?.findIndex((item) => {
        return resultReward?.id == item.id;
      })
    : 0;
  const sizeOfEachGift = selectedFortune?.fortuneDetails ? 360 / selectedFortune?.fortuneDetails?.length : 0; // deg
  var spinningDegree =
    3600 -
    resultIndex * sizeOfEachGift -
    sizeOfEachGift / 5 -
    getRandomNumber(1, sizeOfEachGift - (2 * sizeOfEachGift) / 5); //deg: 360 = 1 circle

  // Styles:
  const pauseStyle = isSpinning // slow down when spinning AND reset wheel when not spinning
    ? {transition: 'transform ' + SPINNING_TIME + ' ease-out'}
    : {transition: 'none'};
  const spinStyle = isSpinning
    ? {
        transform: 'translate(-50%, -50%) rotate(' + spinningDegree + 'Deg)',
      }
    : {};

  // Controls:
  const router = useHistory();
  const [presentToast, dismissToast] = useIonToast();
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [showRule, setShowRule] = useState<boolean>(false);
  const [showResult, setShowResult] = useState<boolean>(false);

  useEffect(() => {
    if (params?.vendorId) {
      getListFortune(params?.vendorId);
    }
  }, []);

  // *This useEffect is to get list fortune when no vendorId is passed to the page (navigate back from history or navigate from my gift detail or on notifications clicked).
  useEffect(() => {
    if (selectedFortune?.vendor?.id && !params?.vendorId && listFortune?.length <= 0) {
      getListFortune(Number(selectedFortune?.vendor?.id));
    }
  }, [selectedFortune]);

  // * Get fortune detail whenever an id param appears in url
  useEffect(() => {
    const splitedPath = path.split('/');
    if (splitedPath[splitedPath.length - 2] == 'lucky-wheel') {
      getFortuneDetail();
    }
  }, [path]);

  const addColorForListReward = (list: IReward[]) => {
    if (list?.length <= 0 || !list[0]) return;
    if (list?.length > 3) {
      const middle = Math.floor(list.length / 2) + (list.length % 2);
      for (let i = 0; i < middle; i++) {
        {
          const randomColor = getRandomColor();
          list[i].color = randomColor;
          if (list[middle + i]) {
            list[middle + i].color = randomColor;
          }
        }
      }
    } else {
      list.forEach((item) => {
        item.color = getRandomColor();
      });
    }
  };

  const getListFortune = async (idOfVendor?: number) => {
    try {
      const res = await fortuneAPIs.getListFortune(idOfVendor);
      setListFortune(res?.data || []);
      if (trimURLId(path) === 'lucky-wheel' || !checkIfFortuneIdAvailable(trimURLId(path), res?.data)) {
        router.replace(`/lucky-wheel/${res?.data?.[0]?.id}`);
      }
    } catch (e) {
      console.log('Error get list fortune: ', e);
    }
  };

  const checkIfFortuneIdAvailable = (id: string | number, list?: IFortune[]) => {
    return list?.find((item) => {
      return item.id == id;
    });
  };

  const getFortuneDetail = async () => {
    try {
      const res = await fortuneAPIs.getFortuneDetail(trimURLId(path) || '');
      if (res?.fortuneDetails && res?.fortuneDetails?.[0]) {
        if (selectedFortune?.id !== res.id) {
          // first time :
          addColorForListReward(res?.fortuneDetails);
        } else {
          // after first time
          if (res.fortuneDetails.length != selectedFortune?.fortuneDetails.length) {
            // Reload if new data.length changes here:
            addColorForListReward(res.fortuneDetails);
          } else {
            // Reload if no data changed here:
            res.fortuneDetails.forEach((item, index) => {
              item.color = selectedFortune.fortuneDetails[index].color;
            });
          }
        }
      }
      setSelectedFortune(res);
    } catch (e) {
      console.log('Error get fortune detail: ', e);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFortune?.fortuneDetails[0]) {
      presentToast({
        message: t('luckyWheelOutOfGift'),
        duration: 400,
        color: 'danger',
        mode: 'ios',
      });
      return;
    }
    if (!selectedFortune?.turnsOfUser || selectedFortune?.turnsOfUser <= 0) {
      presentToast({
        message: t('outOfTurn'),
        duration: 400,
        color: 'danger',
        mode: 'ios',
      });
      return;
    }
    try {
      setIsSpinningEnabled(false);
      const res = await userAPIs.FortuneUserReward(selectedFortune.id || 0);
      setSelectedFortune({...selectedFortune, ...{turnsOfUser: selectedFortune.turnsOfUser - 1}});
      setResultReward(res);
      setIsSpinning(true);
    } catch (e) {
      console.log('Error fortuneUserReward: ', e);
      const error = e as IErrorResponse;
      getFortuneDetail();
      presentToast({
        message: error.data?.ErrorMessage,
        duration: 400,
        color: 'danger',
        mode: 'ios',
      });
    } finally {
      setIsSpinningEnabled(true);
    }
  };

  const renderWheelGifts = () => {
    if (!selectedFortune?.fortuneDetails[0]) return <></>;
    return selectedFortune?.fortuneDetails.map((item, index) => {
      return (
        <div
          key={index}
          className={styles.hold + ' ' + (selectedFortune?.fortuneDetails.length > 1 && styles['hold--clipped'])}
          style={{
            transform: 'rotate(' + sizeOfEachGift * index + 'deg)',
          }} // Start of each gift slice
        >
          <div
            className={styles.pie + ' ' + (selectedFortune?.fortuneDetails.length > 1 && styles['pie--clipped'])}
            style={{
              background: item.color || '#000000',
              transform: 'rotate(' + sizeOfEachGift + 'deg)', // End of each gift slice
            }}
          ></div>
          <div
            className={styles.halfPie}
            style={{
              transform: 'rotate(' + sizeOfEachGift / 2 + 'deg)',
            }}
          >
            <img
              src={item.image}
              style={{
                transform: 'translate(-50%, -50%)  rotate(' + (-sizeOfEachGift / 2 - index * sizeOfEachGift) + 'deg)',
              }}
            />
          </div>
        </div>
      );
    });
  };

  const renderActionSheet = () => {
    return (
      <IonModal
        className={styles.actionSheet}
        mode="ios"
        isOpen={showActionSheet}
        onDidDismiss={() => {
          setShowActionSheet(false);
        }}
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <div className={styles.actionSheet__content}>
          <div className={styles.actionSheet__content__header}>{t('chooseProgram')}</div>
          <div className={styles.actionSheet__content__list}>
            {listFortune?.map((item, index) => {
              const isSelected = selectedFortune?.id === item?.id;
              return (
                <div
                  key={index}
                  className={styles.actionSheet__content__list__item}
                  onClick={() => {
                    router.replace(`/lucky-wheel/${item.id}`);
                    setShowActionSheet(false);
                  }}
                >
                  <p>{item?.descr}</p>
                  {isSelected && <IonIcon icon={checkmarkCircle} />}
                </div>
              );
            })}
          </div>
        </div>
      </IonModal>
    );
  };

  return (
    <IonPage>
      <IonContent className={styles.content}>
        <div className={styles.wheelContainer}>
          <img className={styles.wheel} src={require('../../asset/system/wheel.png')} />
          <img className={styles.wheelShine} src={require('../../asset/system/wheel-shine.png')} />
          <img className={styles.wheelMarker} src={require('../../asset/system/wheel-marker.png')} />
          <div
            className={styles.wheelContent}
            style={{...pauseStyle, ...spinStyle}} // Reset to original state without spinning backward
            onTransitionEnd={() => {
              if (isSpinning) {
                // Fix bug when changing program cause animation transition
                setTimeout(() => {
                  setShowResult(true);
                }, PAUSE_TIME / 2);
                setTimeout(() => {
                  setIsSpinning(false);
                  getFortuneDetail();
                  dispatch(getUserLoyalty());
                }, PAUSE_TIME);
              }
            }}
          >
            {renderWheelGifts()}
          </div>
        </div>
        <IonGrid className={styles.topButtons}>
          <IonRow>
            <IonCol size="1">
              <GameRoundButton
                enabled={!isSpinning}
                image={require('../../asset/icon/game_back_icon.png')}
                fromColor="#e23743"
                toColor="#bc313f"
                onButtonClick={() => {
                  router.goBack();
                }}
              ></GameRoundButton>
            </IonCol>
            <IonCol size="1" offset="6">
              <GameRoundButton
                enabled={!isSpinning}
                image={require('../../asset/icon/game_rule_icon.png')}
                fromColor="#fe914b"
                toColor="#e26c20"
                onButtonClick={() => {
                  setShowRule(true);
                }}
              ></GameRoundButton>
            </IonCol>
            <IonCol size="1" offset="1">
              <GameTurn turns={selectedFortune?.turnsOfUser}></GameTurn>
            </IonCol>
          </IonRow>
        </IonGrid>
        <div className={styles.comboBoxHolder}>
          <GameComboBox
            title={selectedFortune?.descr || 'Vui lòng chọn chương trình'}
            currentVendor={selectedFortune?.vendor}
            onComboBoxClick={() => {
              if (!isSpinning) setShowActionSheet(true);
            }}
          />
        </div>
        <IonGrid className={styles.bottomButtons}>
          <IonRow>
            <IonCol size="5.75">
              <GameButton
                enabled={!isSpinning}
                onClickButton={() => {
                  router.push('/lucky-wheel-history/' + trimURLId(path));
                }}
                fromColor="#fe914b"
                toColor="#e26c20"
              >
                {t('history')}
              </GameButton>
            </IonCol>
            <IonCol size="5.75" offset="0.5">
              <GameButton
                enabled={!isSpinning && isSpinningEnabled}
                onClickButton={handleSubmit}
                fromColor="#04A489"
                toColor="#36B6A0"
              >
                {t('spin')}
              </GameButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        {renderActionSheet()}
        <GameRuleModal visible={showRule} onDissMissModal={() => setShowRule(false)} />
        <GameRewardResultModal
          visible={showResult}
          reward={resultReward}
          onDissMissModal={() => setShowResult(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default LuckyWheel;
