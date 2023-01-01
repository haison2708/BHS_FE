import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonRow,
  IonSpinner,
  IonToolbar,
} from '@ionic/react';
import {t} from 'i18next';
import {chevronBack} from 'ionicons/icons';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router';
import productAPIs from '../../api/product';
import ProductCard from '../../components/ProductCard';
import {IProduct} from '../../types/interface';
import styles from './styles.module.scss';

type Props = {};

const AllPromotionProducts: React.FC = (props: Props) => {
  const router = useHistory();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pages, setPages] = useState<number>(1);
  const [listProducts, setListProducts] = useState<IProduct[]>();
  const [disableScroll, setDisableScroll] = useState(false);

  useEffect(() => {
    const getPromotionProducts = async (pageIndex = 1) => {
      try {
        if (pageIndex <= 1) setIsLoading(true);
        const res = await productAPIs.getPromotionProducts(6, pageIndex);
        if (pageIndex <= 1) {
          setListProducts(res?.data || []);
        } else {
          setListProducts(listProducts?.concat(res?.data || []));
        }
        if (!res?.hasNextPage) setDisableScroll(true);
        else setDisableScroll(false);
      } catch (e) {
        console.log('Error get promotion products, page: ', pageIndex);
      } finally {
        setIsLoading(false);
      }
    };
    getPromotionProducts(pages);
  }, [pages]);

  const handleInfiniteScroll = (ev: any) => {
    setPages((padgeIndex) => (padgeIndex += 1));
    setTimeout(() => {
      ev.target.complete();
    }, 500);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="md" className={'small-header-toolbar ' + styles.toolbar}>
          <IonButtons className={styles.toolbar__navigate}>
            <IonButton
              mode="md"
              onClick={() => {
                router.goBack();
              }}
            >
              <IonIcon color="light" icon={chevronBack}></IonIcon>
            </IonButton>
            <div style={{flex: 1}}>{t('promotionProduct')}</div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>
            <IonSpinner color={'primary'} />
          </div>
        ) : (
          <>
            <IonGrid>
              <IonRow className="ui-w-flatform-mobile ui-mx-auto ui-mt-20">
                {listProducts?.length!! > 0 ? (
                  listProducts?.map((item, index) => {
                    return (
                      <IonCol className="ui-pd-b-12 ui-pd-r-5 ui-pd-l-5" size="6" key={index} sizeLg="3" sizeMd="4">
                        <ProductCard product={item} />
                      </IonCol>
                    );
                  })
                ) : (
                  <div className={styles.noItemBlock}>Không có sản phẩm</div>
                )}
              </IonRow>
            </IonGrid>
            <IonInfiniteScroll onIonInfinite={handleInfiniteScroll} threshold="100px" disabled={disableScroll}>
              <IonInfiniteScrollContent loadingSpinner="dots"></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AllPromotionProducts;
