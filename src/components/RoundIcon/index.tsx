import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { IIcon } from "../CustomButton/interface";
import styles from "./styles.module.scss";

export interface IMenuButtonsGroupProps extends IIcon {
  backgroundColor?: string;
  fontSize?: string;
  linearGradient?: boolean;
}

const RoundIcon: React.FC<
  IMenuButtonsGroupProps & React.HTMLProps<HTMLDivElement>
> = ({
  className,
  linearGradient = false,
  fontSize,
  color,
  icon,
  backgroundColor,
  style,
  ...other
}) => {

  return (
    <div
      {...other}
      style={
        linearGradient
          ? { ...{ background: 'linear-gradient(to bottom,' + backgroundColor + ', #3A8AD300 )'  }, ...style }
          : { ...{ background: backgroundColor }, ...style }
      }
      className={styles.icon__container + " " + className}
    >
      <FontAwesomeIcon
        icon={icon}
        color={color}
        fontSize={fontSize || "24px"}
      ></FontAwesomeIcon>
    </div>
  );
};

export default RoundIcon;
