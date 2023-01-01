import {IonIcon, IonInput, IonItem, IonText} from '@ionic/react';
import {eyeOffOutline, eyeOutline} from 'ionicons/icons';
import React from 'react';
import styles from './styles.module.scss';
import {FieldType} from './interface';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
interface FieldProps {
  field: FieldType;
}
const CustomField: React.FC<FieldProps & React.HTMLProps<HTMLDivElement>> = ({
  field,
  className = {},
  style = {},
  ...others
}) => {
  let {value, placeholder} = field;
  const [isEye, setIsEye] = React.useState(false);
  const [typeInput, setTypeInput] = React.useState(field.type);

  const renderIcon = () => {
    if (field.FaIcon) return <FontAwesomeIcon icon={field.FaIcon} className={styles.faIcon}></FontAwesomeIcon>;
    if (field.icon) return <IonIcon className={styles.icon} icon={field.icon} slot="start" size="small"></IonIcon>;
    return <></>;
  };
  return (
    <div {...others} className={`${styles.container} ` + className} style={style}>
      <IonItem
        className={field.icon ? 'ion-no-padding' : 'ion-no-padding'}
        lines={'none'}
        id={field.error ? styles.IonItemErors : styles.IonItem}
        style={{display: 'flex', alignItems: 'center'}}
      >
        {renderIcon()}
        {field.isRequired && field.value?.toString().length === 0 ? (
          <IonInput
            className={styles.customInput + ` ${styles.required}`}
            placeholder={placeholder}
            type={typeInput}
            value={value}
            disabled={field?.disabled}
            autocomplete={field.autocomplete || 'on'}
            onIonChange={(e) => {
              if (field.onChange) field.onChange(e.target.value);
            }}
          />
        ) : (
          <IonInput
            className={styles.customInput}
            placeholder={placeholder}
            type={typeInput}
            value={value}
            disabled={field?.disabled}
            onIonChange={(e) => {
              if (field.onChange) field.onChange(e.target.value);
            }}
          />
        )}
        {field.isEye && (
          <IonIcon
            className={styles.icon}
            onClick={() => {
              setIsEye(!isEye);
              isEye ? setTypeInput('password') : setTypeInput('text');
            }}
            icon={isEye ? eyeOutline : eyeOffOutline}
            slot="end"
            size="small"
          ></IonIcon>
        )}
      </IonItem>
      {field.error && (
        <IonText color={'danger'}>
          <p className="ui-font-regular ui-fs-12 ui-lh-14 ui-pd-l-16 ui-pd-t-4 ui-pd-b-4 ui-pd-r-12">
            {field.messageError}
          </p>
        </IonText>
      )}
    </div>
  );
};
export default CustomField;
