import {
  IonButton,
  IonButtons,
  IonCard,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonTitle,
} from "@ionic/react";
import * as React from "react";
import { IMenuButton } from "./interface";
import styles from "./styles.module.scss";

export interface IMenuButtonsGroupProps {
  buttons?: IMenuButton[];
}

const MenuButtonsGroup: React.FC<
  IMenuButtonsGroupProps & React.HTMLProps<HTMLDivElement>
> = ({ buttons, className, style, ...other }) => {
  return (
    <div {...other} className={className} style={style}>
      <IonCard mode="ios" class={styles.card}>
        <IonItemGroup>
          {buttons?.map((item, id) => {
            return (
              <React.Fragment key={id}>
                <IonItem button onClick={item?.onClick as unknown as React.MouseEventHandler<HTMLIonItemElement>} lines="none" detail={false} className={styles.button + " ion-no-padding ui-pd-t-8 ui-pd-b-8 ui-pd-l-16 ui-d-flex ui-center"}>
                    <IonIcon slot="start" color={item?.leftIcon?.color } className={styles.button__icon} size={item?.leftIcon?.size || 'small'} icon={item.leftIcon?.icon}></IonIcon>
                    <IonTitle color={item?.color} class={styles.button__title + ' ui-ml-10'}>{item.title}</IonTitle>
                    <div slot="end" className='ui-d-flex ui-center '>
                      {item?.rightItem ? item?.rightItem : <IonIcon color={item?.rightIcon?.color} className={styles.button__icon} size={item?.rightIcon?.size} icon={item?.rightIcon?.icon}></IonIcon>}
                    </div>
                </IonItem>
                { id < buttons?.length - 1 && <div className={styles.button__divider}></div>}
              </React.Fragment>
            );
          })}
        </IonItemGroup>
      </IonCard>
    </div>
  );
};

export default MenuButtonsGroup;
