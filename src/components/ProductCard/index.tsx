import {faAdd} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IonButton, IonCard, IonIcon, IonImg, IonLabel, IonRippleEffect, IonText} from '@ionic/react';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory} from 'react-router';
import {IProduct} from '../../types/interface';
import {formatMoney} from '../../utils/format';
import styles from './styles.module.scss';

interface IProductCard {
  readonly product?: IProduct;
}

const ProductCard: React.FC<IProductCard> = ({product}) => {
  const isSoldOut = false;
  const router = useHistory();
  const {t} = useTranslation();

  const handleClickAddToCart = async (e: any) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <div style={{position: 'relative', height: '100%'}}>
      <div
        className={styles.container + ' ion-activatable ripple-parent'}
        onClick={() => {
          product && router.push(`/product/${product.id}`);
        }}
      >
        <div className={styles.cardTop + (isSoldOut ? ' ui-bg-gray' : '')}>
          <IonImg src={product?.imgBannerUrl} className={styles.product__image}></IonImg>
          {/* {!product?.qty || product?.qty < 0 && (
              <div className={styles.cardTop__overlay}>
                <div className={styles.cardTop__overlay__soldOutTag}>
                  Hết Hàng
                </div>
              </div>
            )} */}
          {product?.isPromotion && <div className={styles.cardTop__saleTag}>{t('promotion')}</div>}
          {!!product?.qty && product?.qty > 0 && (
            <div className={styles.cardTop__leftAmount}>{t(`left`).toLowerCase() + product?.qty}</div>
          )}
          <div className={styles.cardTop__soldAmount}>{t(`sold`)} 9999+</div>
        </div>
        <div className={styles.cardBottom}>
          <IonText>
            <p className={styles.product__name}>{product?.name}</p>
          </IonText>
          <div className={styles.product__price}>
            <IonLabel>{formatMoney(product?.price || 0)}đ</IonLabel>
            <p>{product?.unit}</p>
          </div>
          {!!product?.pricePromotion && product?.pricePromotion > 0 && (
            <p className={styles.product__saleAmount}>
              {t(`saleAmount`) + ' '}
              {formatMoney(product?.price - product?.pricePromotion)}đ
            </p>
          )}
          {!!product?.pricePromotion && product?.pricePromotion > 0 && (
            <div className={styles.product__salePrice__container}>
              <p>{t(`salePrice`) + ' ' + formatMoney(product?.pricePromotion)}đ</p>
            </div>
          )}
        </div>
        <IonRippleEffect></IonRippleEffect>
      </div>
      <div className={styles.addToCartButton} onClick={handleClickAddToCart}>
        <FontAwesomeIcon icon={faAdd} />
      </div>
    </div>
  );
};
export default ProductCard;
