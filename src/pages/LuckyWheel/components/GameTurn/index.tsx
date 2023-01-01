import React, { HTMLProps } from "react";
import styles from "./styles.module.scss";

type IGameTurn = {
  fromColor?: string;
  toColor?: string;
  image?: string,
  turns?: number
};

const imageAlternate = require('../../../../asset/icon/game_gamepad_icon.png')

const GameTurn: React.FC<IGameTurn & HTMLProps<HTMLDivElement>> = ({
  fromColor = "#fe914b",
  toColor = "#e26c20",
  image,
  turns,
  children,
  ...other
}) => {
  return (
    <div {...other} className={styles.container}>
      <div
        className={styles.background}
        style={{
          border: "4px solid " + fromColor,
          background: "linear-gradient(180deg, #FFFAEC, #FCF1D0)",
          color: toColor
        }}
      >
        <p>{turns}</p>
      </div>
      <div
        className={styles.buttonContainer}
        style={{
          background:
            "linear-gradient(180deg, " + fromColor + ", " + toColor + " 50%)",
        }}
      >
        <div
          className={styles.button}
          style={{
            background:
              "linear-gradient(0deg, " + fromColor + ", " + toColor + " 50%)",
          }}
        >
            <img src={image || imageAlternate}></img>
        </div>
      </div>
    </div>
  );
};

export default GameTurn;
