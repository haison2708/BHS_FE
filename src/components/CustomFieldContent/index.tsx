import { IonInput, IonItem, IonText } from "@ionic/react";
import React from "react";
import styles from "./styles.module.scss";
import { FieldType } from "./interface";

interface FieldProps {
  field: FieldType;
}
const CustomFieldContent: React.FC<
  FieldProps & React.HTMLProps<HTMLDivElement>
> = ({ field, className = {}, style = {}, ...others }) => {
  let { value, placeholder } = field;
  return (
    <React.Fragment>
      <div
        {...others}
        className={`${styles.container} ` + className}
        style={style}
      >
        {field.label}
        <IonItem
          className={field.content ? "ion-no-padding" : ""}
          lines={"none"}
          id={field.error ? styles.IonItemErors : styles.IonItem}
        >
          {field.content}
          <IonInput
            disabled={field.disabled}
            className={`ion-no-padding `+styles.customInput}
            placeholder={placeholder}
            type={field.type}
            value={value}
            onIonChange={(e) => {
              if (field.onChange) field.onChange(e.target.value);
            }}
          />
        </IonItem>
        {field.error && (
          <IonText className="ion-no-padding" color={"danger"}   >
            <p className="ui-font-regular ui-fs-12 ui-lh-14 ui-pd-l-16 ui-pd-t-4 ui-pd-b-4 ui-pd-r-12">
              {field.messageError}
            </p>
          </IonText>
        )}
      </div>
    </React.Fragment>
  );
};
export default CustomFieldContent;
