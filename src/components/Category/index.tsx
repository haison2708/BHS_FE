import { IonCard, IonIcon, IonImg } from "@ionic/react";
import { ellipsisHorizontal } from "ionicons/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { ICategory } from "../../types/interface";
import styles from "./styles.module.scss";

type ICategoryProps = {
  className?: string;
  category?: ICategory;
  seeMore?: boolean;
};

const Category: React.FC<ICategoryProps> = ({
  className,
  category,
  seeMore,
}) => {
  const router = useHistory()
  const {t} = useTranslation()

  const handleClick = () => {
    if (seeMore) {
      router.push('/all-category')
    } else {
      router.push({pathname: `/category/${category?.id}`, state: {title: category?.name}})
    }
  }
  return (
    <div className={styles.container}>
      <IonCard button mode="ios" className={styles.topCard} onClick={handleClick}>
        {seeMore ? (
          <div className={styles.iconWrapper}><IonIcon icon={ellipsisHorizontal}></IonIcon></div>
        ) : (
          <img src={category?.imageUrl} />
        )}
      </IonCard>
      <p>{seeMore ? t(`seeMore`) : category?.name}</p>
    </div>
  );
};

export default Category;
