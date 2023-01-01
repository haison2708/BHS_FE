import {ILoyaltyProgram} from './../types/interface';
import {ICategory} from '../types/interface';
export const arrayAmount = <TKeyOfArray>(keyOfArray: TKeyOfArray, amount: number) => {
  const results = new Array(amount).fill(keyOfArray);
  return results;
};
export function pluck<T, K extends keyof T>(objs: T[], key: K): T[K][] {
  return objs.map((obj) => obj[key]);
}

export const arrayToString = (arr: string[]): string => {
  let result = '';
  arr.forEach((item, index) => {
    if (index < arr.length - 1) {
      result += item + ',';
    } else {
      result += item;
    }
  });
  return result;
};

export const flattenSubCategories = (categories: ICategory[], size?: number): ICategory[] => {
  let result: ICategory[] = [];
  categories?.forEach((parentCategory, index) => {
    parentCategory?.category?.forEach((childCategory, index) => {
      result.push(childCategory);
    });
  });
  if (size) return result.slice(0, size);
  return result;
};

export const mixPrograms = (arrA: ILoyaltyProgram[], arrB: ILoyaltyProgram[], size?: number): ILoyaltyProgram[] => {
  let result: ILoyaltyProgram[] = [];
  if (size === 0) return result;
  const itterator = arrA?.length > arrB?.length ? arrA?.length : arrB?.length;
  for (let i = 0; i < itterator; i++) {
    if (!!arrA[i]) result.push(arrA[i]);
    if (!!arrB[i]) result.push(arrB[i]);
  }
  if (!!size) return result.slice(0, size);
  return result;
};
