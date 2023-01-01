import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonIcon,
  IonicSlides,
  IonImg,
  IonPage,
  IonRow,
  IonSpinner,
} from '@ionic/react';
import {chatboxEllipses, chevronBack} from 'ionicons/icons';
import React, {useEffect, useRef, useState} from 'react';
import {useHistory, useParams} from 'react-router';
import styles from './styles.module.scss';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import {Swiper, SwiperSlide} from 'swiper/react';
import productAPIs from '../../api/product';
import {IProduct, IVendor} from '../../types/interface';
import {shuffle} from 'lodash';
import ProductCard from '../../components/ProductCard';
import {formatMoney} from '../../utils/format';
import LoadingOverlay from '../../components/LoadingOverlay';
import {t} from 'i18next';

interface IParamsProps {
  id: string;
}

interface IUnit {
  id?: number;
  unit?: string;
}

const ProductDetail: React.FC = () => {
  const {id} = useParams<IParamsProps>();
  const router = useHistory();
  const contentRef = useRef<HTMLIonContentElement>(null);

  const [loading, setLoading] = useState<boolean[]>([true, true]);
  const [product, setProduct] = useState<IProduct | undefined>(undefined);
  const [vendor, setVendor] = useState<IVendor | undefined>(undefined);
  const [suggestPromotionProducts, setSuggestPromotionProducts] = useState<IProduct[]>([]);
  const [slides, setSlides] = useState<(string | undefined)[]>([]);
  const [indexSlide, setIndexSlide] = useState<number>(0);
  const [units, setUnits] = useState<IUnit[]>([]);

  const getSuggestPromotionProducts = async (size = 10) => {
    try {
      const res = await productAPIs.getSuggestProducts();
      const randomizedProducts = shuffle(res?.data);
      setSuggestPromotionProducts(randomizedProducts?.slice(0, size));
    } catch (e) {
      console.log('Error get suggest promotion products');
    } finally {
      setLoading((prev) => [prev[0], false]);
    }
  };

  const fetchGetProductDetail = async () => {
    try {
      const data = await productAPIs.getProductDetail(id);
      const vendor = data.product?.vendor;
      setVendor(vendor);
      const product = data.product?.products?.filter((product) => product?.id?.toString() === id);

      product && setProduct(product[0]);
      const images = data.product?.products && data.product?.products.map((product) => product.imgBannerUrl);
      images && setSlides([...images]);

      const units: IUnit[] = [];
      data.product?.products!!.map((product) => units.push({id: Number(product.id), unit: product.unit}));
      units && setUnits(units);
    } catch (e) {
      console.log('Error get product detail');
    } finally {
      setLoading((prev) => [false, prev[1]]);
    }
  };

  useEffect(() => {
    contentRef?.current?.scrollToTop();
    fetchGetProductDetail();
    getSuggestPromotionProducts();
  }, [id]);

  return (
    <IonPage>
      {loading[0] ? (
        <LoadingOverlay backgroundColor="transparent" spinnerColor="primary" isLoading />
      ) : (
        <IonContent ref={contentRef} id="content-scroll" className={styles.content}>
          <IonFab className="ui-pd-t-40 ui-pd-l-16" vertical="top" horizontal="start" slot="fixed">
            <IonFabButton
              color={'light'}
              size="small"
              onClick={() => {
                router.goBack();
              }}
            >
              <IonIcon icon={chevronBack} color={'primary'} />
            </IonFabButton>
          </IonFab>
          <IonGrid className={styles.gird}>
            <IonRow className={styles.row}>
              <IonCol className={styles.col}>
                <IonCard className={styles.card}>
                  <IonCardContent className={styles.cardCotent + ' ion-no-padding'}>
                    {/* <IonButtons className={styles.iconBack}>
                      <IonButton
                        fill="solid"
                        color={'light'}
                        onClick={() => {
                          router.goBack();
                        }}
                      >
                        <IonIcon icon={chevronBack} color={'primary'} />
                      </IonButton>
                    </IonButtons> */}
                    {slides.length === 0 ? (
                      <div className={styles.loading}>
                        <IonSpinner color={'primary'} />
                      </div>
                    ) : (
                      <>
                        <Swiper
                          modules={[IonicSlides]}
                          className={styles.swiper}
                          onSlideChange={(swiper) => setIndexSlide(swiper.activeIndex)}
                        >
                          {slides?.map((item, index) => {
                            return (
                              <SwiperSlide key={index}>
                                <IonImg className={styles.img} src={item}></IonImg>
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                        <span>
                          {indexSlide + 1} / {slides.length}
                        </span>
                      </>
                    )}
                  </IonCardContent>
                </IonCard>
                <div className={styles.informationContainer} style={{background: 'white'}}>
                  <div className={styles.contentContainer}>
                    <div className={styles.tagsContainer}>
                      <div className={styles.quantityAvailid}>{`${t('left')} 200 thùng`}</div>
                      <div className={styles.quantitySaled}>{`${t('sold')} 9999+`}</div>
                    </div>
                    <h1 className={styles.title}>{product?.name}</h1>
                    <div className={styles.priceContainer}>
                      <span className={styles.priceOld}>{`${formatMoney(product?.price!!)}đ`}</span>
                      {product?.pricePromotion != 0 && (
                        <div className={styles.priceNewContainer}>
                          <span className={styles.priceNew}>
                            {`${t('salePrice')} ${formatMoney(product?.pricePromotion!!)}đ`}
                          </span>
                          <span className={styles.priceSale}>
                            {`${t('saleAmount')} ${formatMoney(product?.price!! - product?.pricePromotion!!)}đ`}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={styles.unitContainer}>
                      {units.map((unit, index) => (
                        <div
                          key={index}
                          className={id === unit?.id?.toString() ? styles.unitChoosed : styles.unit}
                          onClick={() => {
                            router.replace(`/product/${unit.id}`);
                          }}
                        >
                          {unit.unit}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={styles.vernderContainer}>
                    <div className={styles.vendorWrapper}>
                      <div className={styles.vendorLogo} style={{backgroundImage: `url('${vendor?.logo}')`}}/>
                      <span className={styles.vendorName}>{vendor?.name}</span>
                    </div>
                    <div className={styles.iconComment}>
                      <IonIcon icon={chatboxEllipses} color="secondary"></IonIcon>
                    </div>
                  </div>
                </div>
              </IonCol>
            </IonRow>
            <IonRow className={styles.row}>
              <IonCol className={styles.col}>
                <div className={styles.descriptionContainer}>
                  <h1 className={styles.descriptionHeader}>{t('productDetail')}</h1>
                  <span className={styles.descriptionContent}>{product?.descr}</span>
                </div>
              </IonCol>
            </IonRow>
            {!loading[1] && (
              <IonRow className={styles.row}>
                <IonCol className={styles.col}>
                  <div className={styles.descriptionContainer}>
                    <h1 className={styles.descriptionHeader}>{t('suggestedProduct')}</h1>
                    <IonGrid>
                      <IonRow className="ui-w-flatform-mobile ui-mx-auto ui-mt-20">
                        {suggestPromotionProducts?.length > 0 ? (
                          suggestPromotionProducts?.map((item, index) => {
                            return (
                              <IonCol
                                className="ui-pd-b-12 ui-pd-r-5 ui-pd-l-5"
                                size="6"
                                key={index}
                                sizeLg="3"
                                sizeMd="4"
                              >
                                <ProductCard product={item} />
                              </IonCol>
                            );
                          })
                        ) : (
                          <div className={styles.noItemBlock}>{t('thereIsNoProduct')}</div>
                        )}
                      </IonRow>
                    </IonGrid>
                  </div>
                </IonCol>
              </IonRow>
            )}
          </IonGrid>
          <IonFab className="ui-w-100vw ui-pd-r-32 ui-pd-l-16" vertical="bottom" horizontal="start" slot="fixed">
            <IonButton mode="ios" className={styles.confirmButton} color={'primary'}>
              {t('addToCart')}
            </IonButton>
          </IonFab>
        </IonContent>
      )}
    </IonPage>
  );
};

export default ProductDetail;
