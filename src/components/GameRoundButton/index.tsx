import React, { HTMLProps } from "react";
import styles from "./styles.module.scss";

type IGameRoundButtonProps = {
  fromColor?: string;
  toColor?: string;
  image?: string,
  enabled?: boolean,
  onButtonClick?: () => void
};

const imageAlternate = require('../../asset/icon/game_back_icon.png')

const GameRoundButton: React.FC<IGameRoundButtonProps & HTMLProps<HTMLDivElement>> = ({
  fromColor = '#e23743',
  toColor = '#bc313f',
  image,
  enabled = true,
  onButtonClick,
  className,
  children,
  ...other
}) => {
  return (
    <div {...other} onClick={()=>{enabled && onButtonClick && onButtonClick()}}
      className={styles.buttonContainer + ' ' + className}
      style={{
        background: toColor
      }}
    >
      <div
        className={styles.button}
        style={{
          background: fromColor,
          borderTop: '3px solid ' + '#ffffff' + '50',
          borderBottom: '3px solid ' + '#000000' + '30'
        }}
      >
        <img src={image || imageAlternate}></img>
      </div>
    </div>
  );
};

export default GameRoundButton;
