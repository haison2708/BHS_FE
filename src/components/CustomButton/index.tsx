import { IonButton, IonIcon } from "@ionic/react";
import React from "react";
import styles from "./styles.module.scss";
import { IButton, IIcon } from "./interface";
interface IButtonProps {
  button?: IButton;
  icon?: IIcon;
}
const CustomButton: React.FC<
  IButtonProps & React.HTMLProps<HTMLDivElement>
> = ({ button, icon, className = {}, style = {}, ...others }) => {
  const containerStyles = styles[`container${button?.border}` || "container"];
  
  return (
    <React.Fragment>
      <div
        {...others}
        className={(containerStyles || styles.container) + ` ${className} `}
        style={style}
      >
        <IonButton className={`ion-padding-none `}   {...button}>
          {others.children}
          {icon && <IonIcon class={styles.red}   {...icon} />}
        </IonButton>
      </div>
    </React.Fragment>
  );
};
export default CustomButton;
