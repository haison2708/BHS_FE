import _ from 'lodash';

// export const getDeepObject = <TObject,
//     TFirstKey extends keyof TObject,
//     TSecondKey extends keyof TObject[TFirstKey]
// >(
//     obj: TObject,
//     firstKey: TFirstKey,
//     secondKey: TSecondKey,
// ) => {
//     return obj[firstKey][secondKey];
// }
// getDeepObject({ name: { firstName: 'name or key' } }, 'name', 'firstName');

// export function sortObjectToFirstArray<TObject, TArray extends TObject[]>(_object: TObject, _array: TArray): TObject[] {
//     for (let i = _array.length - 1; i >= 0; i--) {
//         let isExsitsObject = false;
//         const _keysObjectInArray = (JSON.stringify(Object.keys(_array[i])) === JSON.stringify((Object.keys(_object))));
//         if (_keysObjectInArray) {
//             for (const [key, value] of Object.entries(_array[i])) {
//                 if (_.get(_array[i], key) === _.get(_object, key)) {
//                     isExsitsObject = true;
//                     continue;
//                 }
//                 else {
//                     isExsitsObject = false;
//                     break;
//                 }
//             }
//             if (isExsitsObject) {
//                 const _arrayResult: TObject[] = _array.filter(function (item, index) {
//                     if (index !== i) {
//                         return item
//                     }
//                 })
//                 return [_object, ..._arrayResult]
//             }
//         }
//     }
//     return _array;
// }
