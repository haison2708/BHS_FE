import {useState} from 'react';

export function useOTP(amountNumber: number) {
  const [arrayValue, setArrayValue] = useState(() => {
    return new Array(amountNumber).fill('');
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const regex = /^[0-9]$/;

  function checkRegex(value: string) {
    return regex.test(value);
  }

  function changeCurrentIndex(index: number) {
    setCurrentIndex(index);
  }

  function changeNextIndex(index: number) {
    if (index === arrayValue.length - 1) return;
    setCurrentIndex(index + 1);
  }

  function changePrevIndex(index: number) {
    if (index === 0) return;
    setCurrentIndex(index - 1);
  }

  function changeValue(value: string, index: number) {
    if (currentIndex < 0 || currentIndex > arrayValue.length) return;
    console.log('change');

    if (value === 'Backspace') {
      setArrayValue((array) => {
        const newArray = [...array];
        newArray.splice(index, 1, '');
        return newArray;
      });
      changePrevIndex(index);
    }

    if (value === 'Tab') {
      changeCurrentIndex(-1);
    }

    if (checkRegex(value)) {
      setArrayValue((array) => {
        const newArray = [...array];
        newArray.splice(index, 1, value);
        return newArray;
      });
      changeNextIndex(index);
    }
  }

  function getOTPstring() {
    return arrayValue.join('');
  }

  return {
    arrayValue,
    currentIndex,
    changeCurrentIndex,
    changeValue,
    getOTPstring,
  };
}
