import { IonBadge, IonButton, IonIcon, IonText } from "@ionic/react";
import React, { useRef, useState } from "react";
import styles from "./styles.module.scss";
import { notificationsOutline } from "ionicons/icons";

interface IBadgeButtonProps {
  icon?: string;
  text?: string;
  onClick?: () => void;
}

const BadgeButton: React.FC<
  IBadgeButtonProps & React.HTMLProps<HTMLDivElement>
> = ({ icon, text, onClick, className = {}, style = {}, ...others }) => {
  return (
    <React.Fragment>
      <div className="ui-position-relative">
        <IonButton
          onClick={onClick}
          className={styles.iconButton + " ion-no-padding"}
          fill="clear"
          color={"light"}
          mode="md"
        >
          <IonIcon
            className={styles.iconButton__icon}
            icon={icon || notificationsOutline}
          ></IonIcon>
        </IonButton>
        {text && (
          <IonBadge
            mode="ios"
            className={styles.iconButton__badge}
            color="danger"
          >
            {text}
          </IonBadge>
        )}
      </div>
    </React.Fragment>
  );
};
export default BadgeButton;
