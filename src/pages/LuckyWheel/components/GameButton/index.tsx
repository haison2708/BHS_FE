import React, { HTMLProps } from "react";
import styles from "./styles.module.scss";

type IGameButtonProps = {
  fromColor?: string;
  toColor?: string;
  enabled?: boolean;
  onClickButton?: () => void
};

const GameButton: React.FC<IGameButtonProps & HTMLProps<HTMLDivElement>> = ({
  fromColor = '#e23743',
  toColor = '#bc313f',
  enabled = true,
  onClickButton,
  children,
  ...other
}) => {
  return (
    <div {...other} onClick={()=>{enabled && onClickButton && onClickButton()}}
      className={styles.buttonContainer}
      style={{
        background:
          "linear-gradient(225deg, " + fromColor + ", " + toColor + ")",
      }}
    >
      <div
        className={styles.button}
        style={{
          background:
            "linear-gradient(120deg, " + fromColor + ", " + toColor + ")",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GameButton;
