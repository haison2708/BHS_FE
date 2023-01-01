import {InputChangeEventDetail, IonInput, IonLabel, IonText} from '@ionic/react';
import React, {Fragment, RefObject, useEffect, useRef} from 'react';
import {arrayAmount} from '../../utils/array';
import styles from './styles.module.scss';
import {IOTPInput} from './interface';
import {useOTP} from '../../hooks/useOTP';

const OTPInput: React.FC<IOTPInput & React.HTMLProps<HTMLDivElement>> = ({
  arrayValue,
  currentIndex,
  changeCurrentIndex,
  changeValue,
  error,
  className = {},
  style = {},
  ...others
}) => {
  const handleFocus = () => {
    const nextSibling = document.querySelector(`input[name="input-focus"]`) as HTMLElement;
    nextSibling?.focus();
  };

  // Hook add event click outside element
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: Event) {
        if (ref.current && !ref.current.contains(event.target)) {
          // alert('You clicked outside of me!');
          changeCurrentIndex(-1);
        }
      }
      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef);

  useEffect(() => {
    handleFocus();
  });

  return (
    <>
      <div ref={wrapperRef} className={styles.container} onFocus={() => handleFocus()}>
        {arrayValue.map((num, index) => {
          return (
            <div
              key={index}
              className={index === currentIndex ? styles.wrapper_focused : styles.wrapper}
              onClick={() => {
                changeCurrentIndex(index);
              }}
            >
              <IonInput
                color={'primary'}
                inputmode="decimal"
                maxlength={1}
                readonly
                value={num}
                className={`${error.isError ? styles.input_error : ''} ${
                  arrayValue[index] !== '' ? styles.input_had_value : styles.input
                }`}
              />
            </div>
          );
        })}
      </div>
      <IonInput
        className="ion-no-padding"
        inputmode="decimal"
        name={`input-focus`}
        maxlength={1}
        clearOnEdit
        style={{opacity: '0', height: '0'}}
        onKeyDown={(e) => changeValue(e.key, currentIndex)}
      />
      {error.msgError !== '' && (
        <div>
          <IonText className="ion-text-center" color="danger">
            <p className="ui-mt-10">{error.msgError}</p>
          </IonText>
        </div>
      )}
    </>
  );
};
export default OTPInput;
