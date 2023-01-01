import {
  IonCol,
  IonContent,
  IonFab,
  IonGrid,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
  IonPage,
  IonRow,
  IonSpinner,
  useIonToast,
} from "@ionic/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import userAPIs from "../../api/user";
import GameRoundButton from "../../components/GameRoundButton";
import InfoCard from "../../components/InfoCard";
import { IFortuneRewardHistoryItem } from "../../types/interface";
import styles from "./styles.module.scss";

type ILuckyWheelHistoryProps = {};

const LuckyWheelHistory = (props: ILuckyWheelHistoryProps) => {
  // Params:
  const { id } = useParams<{ id: string }>();

  // State:
  const [history, setHistory] = useState<IFortuneRewardHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInfiniteDisabled, setIsInfiniteDisabled] = useState<boolean>(false);

  // Controls:
  const router = useHistory();

  useEffect(() => {
    getHistory();
  }, [id, currentPage]);

  const getHistory = async () => {
    try {
      if (currentPage === 1) setIsLoading(true);
      const res = await userAPIs.getFortuneRewardHistory(id, 10, currentPage);
      setHistory(history?.concat(res.data || []));
      if (!res.hasNextPage) setIsInfiniteDisabled(true)
    } catch (e) {
      console.log("Error get lucky wheel history: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfiniteScroll = (ev: any) => {
    setCurrentPage((currentPage) => (currentPage += 1));
    setTimeout(() => {
      ev.target.complete();
    }, 500);
  };

  const renderListHistory = () => {
    return (
      <div className={styles.list}>
        {history?.map((item, index) => {
          const qty = item?.fortune?.fortuneDetails?.[0]?.quantity || 0 > 0 ? item?.fortune?.fortuneDetails?.[0]?.quantity :' '
          return (
            <InfoCard 
              button
              key={index}
              className={styles.historyCard}
              title={qty + ' ' + item.fortune?.fortuneDetails[0].descr}
              leftItem={
                <img
                  className={styles.historyCard__image}
                  src={item.fortune?.fortuneDetails[0].image}
                ></img>
              }
            >
              {moment.utc(item.createdAt).local().format("DD/MM/YYYY hh:mm")}
            </InfoCard>
          );
        })}
      </div>
    );
  };

  return (
    <IonPage>
      <IonContent className={styles.container}>
          <IonGrid className={styles.topButtons}>
            <IonRow>
              <IonCol size="1">
                <GameRoundButton
                  image={require("../../asset/icon/game_close_icon.png")}
                  fromColor="#e23743"
                  toColor="#bc313f"
                  onButtonClick={() => {
                    router.goBack();
                  }}
                ></GameRoundButton>
              </IonCol>
            </IonRow>
          </IonGrid>
          {isLoading ? (
            <div className={styles.loadingBlock}>
              <IonSpinner name="circular" color={"light"} />
            </div>
          ) : (
            renderListHistory()
          )}
          <IonInfiniteScroll
            onIonInfinite={handleInfiniteScroll}
            threshold=" 100px"
            disabled={isInfiniteDisabled}
          >
            <IonInfiniteScrollContent color="light" loadingSpinner="dots"></IonInfiniteScrollContent>
          </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default LuckyWheelHistory;
