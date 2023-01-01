interface changeCurrentIndexFunc {
  (index: number): void;
}

interface changeValueFunc {
  (value: string, index: number): void;
}

interface arrayValue {
  id: number;
  value: string;
}

interface errorOTP {
  isError: boolean;
  msgError: string;
}
export interface IOTPInput {
  arrayValue: any[];
  currentIndex: number;
  changeCurrentIndex: changeCurrentIndexFunc;
  changeValue: changeValueFunc;
  error: errorOTP;
}
