import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";

interface ISwitchProps {
    active?: boolean;
    onValueChange?: Function;
    onClickSwitch?: Function;
    enabled?: boolean;
}

const Switch: React.FC<ISwitchProps & React.HTMLProps<HTMLDivElement>> = ({
    enabled = true,
    active,
    onValueChange,
    onClickSwitch,
    className,
    style,
    children,
    ...other
}) => {
    return (
        <div
            {...other}
            onClick={(event) => {
                if (!enabled) return
                try {
                    event.stopPropagation();
                    onClickSwitch && onClickSwitch(!active);
                    onValueChange && onValueChange(!active);
                } catch (e) {}
            }}
            className={
                styles.switch + " " + (active ? styles["switch--active"] : " ")
            }
        >
            <div
                className={
                    styles.switch__handle +
                    " " +
                    (active ? styles["switch__handle--active"] : " ")
                }
            ></div>
        </div>
    );
};
export default Switch;
