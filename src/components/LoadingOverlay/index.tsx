import { IonSpinner } from "@ionic/react";
import React from "react";
import styles from "./styles.module.scss";

type LoadingOverlayProps = {
  isLoading: boolean;
  backgroundColor?: string;
  spinnerColor?: string
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  backgroundColor = "#00000050",
  spinnerColor = 'light'
}) => {
  return (
    <div
      className={styles.loadingOverlay}
      style={{ display: isLoading ? "flex" : "none" , background: backgroundColor}}
    >
      <IonSpinner color={spinnerColor} name="circular" />
    </div>
  );
};

export default LoadingOverlay;
