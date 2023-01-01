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
  IonSearchbar,
  IonToolbar,
} from '@ionic/react';
import {t} from 'i18next';
import {chevronBack, homeOutline} from 'ionicons/icons';
import {useEffect, useState} from 'react';
import {useHistory, useLocation, useParams} from 'react-router';
import productAPIs from '../../api/product';
import LoadingOverlay from '../../components/LoadingOverlay';
import ProductCard from '../../components/ProductCard';
import {IProduct} from '../../types/interface';
import styles from './styles.module.scss';

type Props = {};

const ProductsByCategory = (props: Props) => {
  // Controls:
  const router = useHistory();
  const [currentPage, setCurretPage] = useState<number>(1);
  const [isDisableInfiniteScroll, setIsDisableInfiniteScroll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Redux:

  // Params:
  const {id} = useParams<{id: string}>();
  const params = useLocation().state as {title: string};

  // State:
  const [searchText, setSearchText] = useState<string>('');
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    getListProducts(1);
  }, [id]);

  useEffect(() => {
    getListProducts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (!!searchText) {
    } else {
    }
  }, [searchText]);

  const handleInfiniteScroll = (ev: any) => {
    setCurretPage((currentPage) => (currentPage += 1));

    setTimeout(() => {
      ev.target.complete();
    }, 500);
  };

  const getListProducts = async (pageIndex = 1) => {
    try {
      if (currentPage == 1) setIsLoading(true);
      const res = await productAPIs?.getProductsByCategory(id, 6, pageIndex);
      if (pageIndex <= 1) {
        setProducts(res?.data || []);
      } else {
        setProducts(products?.concat(res?.data || []));
      }
      if (!res?.hasNextPage) setIsDisableInfiniteScroll(true);
      else setIsDisableInfiniteScroll(false);
    } catch (e) {
      console.log('Error get products by category id: ', id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar mode="md" className={'medium-header-toolbar ' + styles.toolbar}>
          <IonButtons className={styles.toolbar__navigate}>
            <IonButton
              mode="md"
              onClick={() => {
                router.goBack();
              }}
            >
              <IonIcon color="light" icon={chevronBack}></IonIcon>
            </IonButton>
            <div style={{flex: 1}}>{params?.title}</div>
            <IonButton
              mode="md"
              onClick={() => {
                router.replace('/tabs/home');
              }}
            >
              <IonIcon color="light" icon={homeOutline}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonSearchbar
            className={styles.searchBar + ' ion-no-padding'}
            value={searchText}
            mode="ios"
            placeholder={`${t('searchProduct')}`}
            showClearButton="always"
            onIonChange={(e) => {
              setSearchText(e.detail.value!);
            }}
            debounce={1000}
          ></IonSearchbar>
        </IonToolbar>
      </IonHeader>
      <IonContent className={styles.content}>
        <IonGrid className={styles.grid}>
          {isLoading ? (
            <LoadingOverlay backgroundColor="transparent" spinnerColor="primary" isLoading />
          ) : (
            <IonRow className="ui-w-flatform-mobile ui-mx-auto ui-mt-20">
              {products?.length > 0 ? (
                products?.map((item, index) => {
                  return (
                    <IonCol className="ui-pd-b-12 ui-pd-r-5 ui-pd-l-5" size="6" key={index} sizeLg="3" sizeMd="4">
                      <ProductCard product={item} />
                    </IonCol>
                  );
                })
              ) : (
                <div className={styles.noItemBlock}>{t('thereIsNoProduct')}</div>
              )}
            </IonRow>
          )}
        </IonGrid>
        <IonInfiniteScroll onIonInfinite={handleInfiniteScroll} threshold="100px" disabled={isDisableInfiniteScroll}>
          <IonInfiniteScrollContent loadingSpinner="dots"></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default ProductsByCategory;
