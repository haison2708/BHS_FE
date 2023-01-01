import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import {t} from 'i18next';
import {chevronBack, close} from 'ionicons/icons';
import {Fragment} from 'react';
import {useHistory} from 'react-router';
import {useAppSelector} from '../../app/hook';
import Category from '../../components/Category';
import Section from '../../components/Section';
import {selectCategories} from '../../features/category/categorySlice';
import styles from './styles.module.scss';

type Props = {};

const AllCategory = (props: Props) => {
  // Controls:
  const router = useHistory();

  // Redux:
  const categories = useAppSelector(selectCategories);
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
              <IonIcon color="light" icon={close}></IonIcon>
            </IonButton>
            <div style={{flex: 1}}>{t('productCategory')}</div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className={styles.content}>
        {categories?.map((item, index) => {
          return (
            <Fragment key={index}>
              <Section title={item.name} />
              <IonGrid className={styles.categoryGrid}>
                <IonRow>
                  {categories[index]?.category?.map((subItem, subIndex) => {
                    return (
                      <IonCol key={subIndex} sizeXs={'3'} sizeSm="2" sizeLg="1">
                        <Category key={subIndex} category={subItem}></Category>
                      </IonCol>
                    );
                  })}
                </IonRow>
              </IonGrid>
            </Fragment>
          );
        })}
      </IonContent>
    </IonPage>
  );
};

export default AllCategory;
