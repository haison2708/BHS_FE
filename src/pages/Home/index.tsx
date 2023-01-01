import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonSearchbar,
  IonToolbar,
  IonicSlides,
  IonImg,
  IonGrid,
  IonRow,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import React, {Fragment, useEffect, useState} from 'react';
import styles from './styles.module.scss';
import {Autoplay, FreeMode, Pagination} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import PairButton from '../../components/PairButton';
import VendorInfoCard from '../../components/VendorInfoCard';
import InfoCard from '../../components/InfoCard';
import ProductCard from '../../components/ProductCard';
import {useAppDispatch, useAppSelector} from '../../app/hook';
import {
  getGiftsFromSelectedVendor,
  selectUser,
  getVendorOverview,
  selectCurrentVendor,
  getUserLoyalty,
  selectUserLoyalty,
} from '../../features/user/userSlice';
import productAPIs from '../../api/product';
import Category from '../../components/Category';
import {getAllCategories, selectCategories} from '../../features/category/categorySlice';
import {flattenSubCategories} from '../../utils/array';
import ProgramCard from '../../components/ProgramCard';
import {IProduct} from '../../types/interface';
import Section from '../../components/Section';
import {shuffle} from 'lodash';
import {selectSelectedVendor} from '../../features/vendor/vendorSlice';
import {useHistory} from 'react-router';
import {Trans, useTranslation} from 'react-i18next';
import {RefresherEventDetail} from '@ionic/core';
import {IonRefresherCustomEvent} from '@ionic/core/dist/types/components';
import NotificationButton from '../../components/NotificationButton';
import CartButton from '../../components/CartButton';
import banner from '../../asset/icon/banner.png';
import LuckyWheelBottomSheet from '../../components/LuckyWheelBottomSheet';
import { selectFlatListAllPrograms } from '../../features/program/programSlice';

interface IHomeProps {}

const Home: React.FC<IHomeProps> = (props) => {
  // Redux:
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const categories = useAppSelector(selectCategories);
  const selectedVendor = useAppSelector(selectSelectedVendor);
  const allPrograms = useAppSelector(selectFlatListAllPrograms);
  const userLoyalty = useAppSelector(selectUserLoyalty);

  // State:
  const [searchText, setSearchText] = useState<string>('');
  const [suggestPromotionProducts, setSuggestPromotionProducts] = useState<IProduct[]>([]);
  const [listPromotionProducts, setListPromotionProducts] = useState<IProduct[]>([]);
  const [listSuggestProducts, setListSuggestProducts] = useState<IProduct[]>([]);
  const [listViewedProducts, setListViewedProducts] = useState<IProduct[]>([]);
  const [slides, setSlides] = useState([
    'https://www.upwork.com/catalog-images-resized/f7d56c964a9a9ebd8ce0ae3c67684085/large',
    'https://i0.wp.com/ytimg.googleusercontent.com/vi/avAHFGqVqsQ/maxresdefault.jpg?resize=160,120',
    'https://acloserlisten.files.wordpress.com/2020/01/games-banner-1140x400-1.png',
    'https://static-cse.canva.com/blob/649196/createbanners.jpg',
    'https://intphcm.com/data/upload/mau-sac-banner-quang-cao.jpg',
    'https://d3jmn01ri1fzgl.cloudfront.net/photoadking/webp_thumbnail/6006c4ca15504_json_image_1611056330.webp',
    'https://d9n64ieh9hz8y.cloudfront.net/wp-content/uploads/20180802153839/banner-saga-3-ra-mat-danh-dau-su-ket-thuc-cho-dong-game.jpg',
  ]);
  const [loadings, setLoadings] = useState<{
    promotionProducts: boolean;
    suggestProducts: boolean;
    viewedProducts: boolean;
    suggestPromotionProducts: boolean;
  }>({
    promotionProducts: false,
    suggestProducts: false,
    viewedProducts: false,
    suggestPromotionProducts: false,
  });
  const [showSwiper, setShowSwiper] = useState<boolean>(false);

  // Controls:
  const router = useHistory();
  const [productsView, setProductsView] = useState<'promotion' | 'suggest' | 'viewed'>('promotion');
  const [promotionCurrentPage, setPromotionCurrentPage] = useState<number>(1);
  const [suggestCurrentPage, setSuggestCurrentPage] = useState<number>(1);
  const [viewedCurrentPage, setViewedCurrentPage] = useState<number>(1);
  const [isDisabledPromotionInfiniteScroll, setIsDisabledPromotionInfiniteScroll] = useState<boolean>(false);
  const [isDisabledSuggestInfiniteScroll, setIsDisabledSuggestInfiniteScroll] = useState<boolean>(false);
  const [isDisabledViewedInfiniteScroll, setIsDisabledViewedInfiniteScroll] = useState<boolean>(false);
  const [showMainVendorButtons, setShowMainVendorButtons] = useState<boolean>(true);
  const [showLuckyWheelActionSheet, setShowLuckyWheelActionSheet] = useState<boolean>(false);
  const {t} = useTranslation();

  const vendorFollowing = useAppSelector(selectCurrentVendor);

  // Get random suggest promotion products first time:
  useEffect(() => {
    if (user?.identity) {
      getSuggestPromotionProducts();
    }
  }, [user, dispatch]);

  // Paginating Products:

  useEffect(() => {
    if (user?.identity) {
      getPromotionProducts(promotionCurrentPage);
    }
  }, [user, promotionCurrentPage, selectedVendor]);

  useEffect(() => {
    if (user?.identity) {
      getSuggestProducts(suggestCurrentPage);
    }
  }, [user, suggestCurrentPage, selectedVendor]);

  useEffect(() => {
    if (user?.identity) {
      getViewedProducts(viewedCurrentPage);
    }
  }, [user, viewedCurrentPage, selectedVendor]);

  // First time change tabs
  useEffect(() => {
    if (user?.identity) {
      if (productsView === 'promotion' && listPromotionProducts.length <= 0) {
        getPromotionProducts(promotionCurrentPage);
      }
      if (productsView === 'suggest' && listSuggestProducts.length <= 0) {
        getSuggestProducts(suggestCurrentPage);
      }
      if (productsView === 'viewed' && listViewedProducts.length <= 0) {
        getViewedProducts(viewedCurrentPage);
      }
    }
  }, [user, productsView]);

  // Select another vendor:
  useEffect(() => {
    resetData();
  }, [selectedVendor]);

  const getSuggestPromotionProducts = async (size = 10) => {
    try {
      setLoadings({...loadings, ...{suggestPromotionProducts: true}});
      const res = await productAPIs.getAllPromotionProducts();
      const randomizedProducts = shuffle(res?.data);
      setSuggestPromotionProducts(randomizedProducts?.slice(0, size));
    } catch (e) {
      console.log('Error get suggest promotion products');
    } finally {
      setLoadings({
        ...loadings,
        ...{suggestPromotionProducts: false},
      });
    }
  };

  const getPromotionProducts = async (pageIndex = 1) => {
    try {
      if (pageIndex <= 1) setLoadings({...loadings, ...{promotionProducts: true}});
      const res = await productAPIs.getPromotionProducts(6, pageIndex);
      if (pageIndex <= 1) {
        setListPromotionProducts(res?.data || []);
      } else {
        setListPromotionProducts(listPromotionProducts?.concat(res?.data || []));
      }
      if (!res?.hasNextPage) setIsDisabledPromotionInfiniteScroll(true);
      else setIsDisabledPromotionInfiniteScroll(false);
    } catch (e) {
      console.log('Error get promotion products, page: ', pageIndex);
    } finally {
      setLoadings({...loadings, ...{promotionProducts: false}});
    }
  };

  const getSuggestProducts = async (pageIndex = 1) => {
    try {
      if (pageIndex <= 1) setLoadings({...loadings, ...{suggestProducts: true}});
      const res = await productAPIs.getSuggestProducts(6, pageIndex);
      if (pageIndex <= 1) {
        setListSuggestProducts(res?.data || []);
      } else {
        setListSuggestProducts(listSuggestProducts?.concat(res?.data || []));
      }
      if (!res?.hasNextPage) setIsDisabledSuggestInfiniteScroll(true);
      else setIsDisabledSuggestInfiniteScroll(false);
    } catch (e) {
      console.log('Error get suggest products, page: ', pageIndex);
    } finally {
      setLoadings({...loadings, ...{suggestProducts: false}});
    }
  };

  const getViewedProducts = async (pageIndex = 1) => {
    try {
      if (pageIndex <= 1) setLoadings({...loadings, ...{viewedProducts: true}});
      const res = await productAPIs.getViewedProducts(6, pageIndex);
      if (pageIndex <= 1) {
        setListViewedProducts(res?.data || []);
      } else {
        setListViewedProducts(listViewedProducts?.concat(res?.data || []));
      }
      if (!res?.hasNextPage) setIsDisabledViewedInfiniteScroll(true);
      else setIsDisabledViewedInfiniteScroll(false);
    } catch (e) {
      console.log('Error get viewed products, page: ', pageIndex);
    } finally {
      setLoadings({...loadings, ...{viewedProducts: false}});
    }
  };

  const handleInfiniteScroll = (ev: any) => {
    if (productsView === 'promotion' && listPromotionProducts?.length > 0) {
      setPromotionCurrentPage((promotionCurrentPage) => (promotionCurrentPage += 1));
    }

    if (productsView === 'suggest' && listSuggestProducts?.length > 0) {
      setSuggestCurrentPage((suggestCurrentPage) => (suggestCurrentPage += 1));
    }

    if (productsView === 'viewed' && listViewedProducts?.length > 0) {
      setViewedCurrentPage((viewedCurrentPage) => (viewedCurrentPage += 1));
    }

    setTimeout(() => {
      ev.target.complete();
    }, 500);
  };

  const handlePullingReset = async (e: IonRefresherCustomEvent<RefresherEventDetail>) => {
    await resetData();
    e.detail.complete();
  };

  const resetData = async () => {
    // Control:
    setPromotionCurrentPage(1);
    setSuggestCurrentPage(1);
    setViewedCurrentPage(1);
    setIsDisabledPromotionInfiniteScroll(false);
    setIsDisabledSuggestInfiniteScroll(false);
    setIsDisabledViewedInfiniteScroll(false);

    // Random Data:
    await getSuggestPromotionProducts();

    // Reload Data:
    await dispatch(getAllCategories());
    await dispatch(getUserLoyalty());
    await dispatch(getGiftsFromSelectedVendor());
  };

  const renderHeader = () => {
    return (
      <IonHeader style={{background: '#F7F7F8'}}>
        <IonToolbar mode="ios" className={'medium-header-toolbar ' + styles.toolbar}>
          <div className="ui-d-flex ui-flex-direction-column ui-align-items-center ui-w-100 ui-overflow-visible ">
            <div className={'ui-w-100 ui-d-flex ui-w-flatform-mobile ' + styles.toolbar__content}>
              <IonSearchbar
                className={styles.searchBar + ' ion-no-padding'}
                value={searchText}
                mode="ios"
                placeholder={t(`search`)}
                showClearButton="always"
                onIonChange={(e) => {
                  setSearchText(e.detail.value!);
                }}
              ></IonSearchbar>
              <CartButton />
              <NotificationButton />
            </div>
          </div>
        </IonToolbar>
        <VendorInfoCard
          hasButtons={showMainVendorButtons}
          className={
            styles.mainVendor +
            ' ui-w-flatform-mobile ' +
            (showMainVendorButtons ? styles['mainVendor--expand'] : styles['mainVendor--shrink'])
          }
          vendor={vendorFollowing}
        ></VendorInfoCard>
      </IonHeader>
    );
  };

  const renderCategory = () => {
    return (
      <IonGrid className={styles.categoryGrid}>
        <IonRow>
          {flattenSubCategories(categories || [], 7).map((item, index) => {
            return (
              <IonCol key={index} sizeXs={'3'} sizeSm="2">
                <Category key={index} category={item}></Category>
              </IonCol>
            );
          })}
          <IonCol sizeXs={'3'} sizeSm="2">
            <Category seeMore></Category>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const renderAllProgram = () => {
    if (allPrograms?.length > 0)
      return (
        <Fragment>
          <Section title={t(`program`)} linkText={t(`viewAll`)} href="/tabs/good-will" />
          <Swiper
            modules={[FreeMode]}
            spaceBetween={12}
            freeMode={true}
            slidesPerView={'auto'}
            className={styles.horizontalList}
          >
            {allPrograms?.slice(0, 10)?.map((program, index) => (
              <SwiperSlide key={index} className={styles.item}>
                <ProgramCard program={program}></ProgramCard>
              </SwiperSlide>
            ))}
          </Swiper>
        </Fragment>
      );
  };

  const renderListProducts = () => {
    const displayProducts =
      productsView === 'promotion'
        ? listPromotionProducts
        : productsView === 'suggest'
        ? listSuggestProducts
        : listViewedProducts;

    const isLoading =
      (loadings.promotionProducts && productsView === 'promotion') ||
      (loadings.suggestProducts && productsView === 'suggest') ||
      (loadings.viewedProducts && productsView === 'viewed');
    return (
      <Fragment>
        {isLoading ? (
          <div className={styles.loading}>
            <IonSpinner color={'primary'} />
          </div>
        ) : (
          <IonGrid>
            <IonRow className="ui-w-flatform-mobile ui-mx-auto ui-mt-20">
              {displayProducts?.length > 0 ? (
                displayProducts?.map((item, index) => {
                  return (
                    <IonCol className="ui-pd-b-12 ui-pd-r-5 ui-pd-l-5" size="6" key={index} sizeLg="3" sizeMd="4">
                      <ProductCard product={item} />
                    </IonCol>
                  );
                })
              ) : (
                <div className={styles.noItemBlock}>{t(`thereIsNoProduct`)}</div>
              )}
            </IonRow>
          </IonGrid>
        )}
      </Fragment>
    );
  };

  const renderSuggestPromotionProductsBlock = () => {
    if (!loadings.suggestPromotionProducts && suggestPromotionProducts?.length > 0)
      return (
        <Fragment>
          <Section title={t(`promotion`)} linkText={t(`viewAll`)} href="/all-promotion-products" />
          {loadings.suggestPromotionProducts && (
            <div className={styles.loading}>
              <IonSpinner color={'primary'} />
            </div>
          )}
          <Swiper
            modules={[FreeMode]}
            freeMode
            spaceBetween={12}
            slidesPerView={'auto'}
            className={styles.horizontalList}
          >
            {suggestPromotionProducts?.map((item, index) => {
              return (
                <SwiperSlide key={index} className={styles.item}>
                  <ProductCard product={item} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </Fragment>
      );
  };

  const renderSwiper = () => {
    setTimeout(() => {
      setShowSwiper(true);
    }, 50); // Fix swiper doesn't autoplay bug
    return (
      showSwiper && (
        <Swiper
          loop
          modules={[Pagination, Autoplay, IonicSlides]}
          pagination={{
            clickable: true,
            bulletActiveClass: styles['swiper__pagination--active'],
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          className={styles.swiper}
        >
          {slides?.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <IonImg
                  onClick={() => {
                    alert(index);
                  }}
                  // src={item}
                  src={banner}
                ></IonImg>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )
    );
  };

  return (
    <IonPage className={styles.page}>
      {renderHeader()}
      <IonContent
        scrollEvents={true}
        onIonScroll={(e) => {
          if (e.detail.scrollTop > 50) {
            setShowMainVendorButtons(false);
          } else {
            setShowMainVendorButtons(true);
          }
        }}
      >
        <IonRefresher
          className={styles.refresher}
          slot="fixed"
          onIonRefresh={(e) => handlePullingReset(e)}
          pullFactor={0.5}
          pullMin={70}
        >
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <div className={styles.pageContent}>
          <PairButton className="ui-w-100 ui-w-flatform-mobile ui-w-100 ui-pd-l-16 ui-pd-r-16"></PairButton>
          <div className="ui-w-100 ui-w-flatform-mobile ui-pd-l-16 ui-pd-r-16">
            {renderSwiper()}
            <InfoCard
              className={styles.gameCard}
              button
              title={t(`luckyWheel`)}
              image="https://play-lh.googleusercontent.com/z-9awB6PeArGyWNSCKDP62PLI_jnXfgEmEMJdzwYPlRnTQIFcHp2OXFIWhfFRNMcyeZ1=w280-h280"
              onClick={() => {
                setShowLuckyWheelActionSheet(true)
              }}
            >
              <p className="ui-text-gray ui-fs-14 ui-fw-300">
                <Trans
                  i18nKey={'youHaveNTurns'}
                  values={{turn: userLoyalty?.luckyWheelTurns}}
                  components={{red: <span className="ui-text-danger ui-fw-500" />}}
                ></Trans>
              </p>
            </InfoCard>
            {renderSuggestPromotionProductsBlock()}
            <Section title={t(`category`)} linkText={t(`viewAll`)} href="/all-category" />
            {!categories?.length && (
              <div className={styles.loading}>
                <IonSpinner color={'primary'} />
              </div>
            )}
            {renderCategory()}
            {renderAllProgram()}
            <Section title={t(`product`)} />
            <IonGrid className={styles.productsGrid}>
              <IonRow>
                <IonCol size="4" className={styles.start}>
                  <IonButton
                    mode="ios"
                    fill={productsView === 'promotion' ? 'solid' : 'outline'}
                    color={productsView === 'promotion' ? 'primary' : 'medium'}
                    onClick={() => {
                      setProductsView('promotion');
                    }}
                  >
                    {t(`promotion`)}
                  </IonButton>
                </IonCol>
                <IonCol size="4">
                  <IonButton
                    mode="ios"
                    fill={productsView === 'suggest' ? 'solid' : 'outline'}
                    color={productsView === 'suggest' ? 'primary' : 'medium'}
                    onClick={() => {
                      setProductsView('suggest');
                    }}
                  >
                    {t(`suggest`)}
                  </IonButton>
                </IonCol>
                <IonCol size="4" className={styles.end}>
                  <IonButton
                    mode="ios"
                    fill={productsView === 'viewed' ? 'solid' : 'outline'}
                    color={productsView === 'viewed' ? 'primary' : 'medium'}
                    onClick={() => {
                      setProductsView('viewed');
                    }}
                  >
                    {t(`viewed`)}
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
            {renderListProducts()}
            <IonInfiniteScroll
              onIonInfinite={handleInfiniteScroll}
              threshold="100px"
              disabled={
                productsView === 'promotion'
                  ? isDisabledPromotionInfiniteScroll
                  : productsView === 'suggest'
                  ? isDisabledSuggestInfiniteScroll
                  : isDisabledViewedInfiniteScroll
              }
            >
              <IonInfiniteScrollContent loadingSpinner="dots"></IonInfiniteScrollContent>
            </IonInfiniteScroll>
          </div>
        </div>
        <LuckyWheelBottomSheet visible={showLuckyWheelActionSheet} onModalDidDismiss={() => setShowLuckyWheelActionSheet(false)}/>
      </IonContent>
    </IonPage>
  );
};

export default Home;
