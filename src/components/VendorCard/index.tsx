import {
  IonButton,
  IonIcon,
  IonItem,
} from "@ionic/react";
import { checkmarkSharp } from "ionicons/icons";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import userAPIs from "../../api/user";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { selectUser } from "../../features/user/userSlice";
import { getAllVendors, getFollowingVendors } from "../../features/vendor/vendorSlice";
import { IVendor } from "../../types/interface";
import styles from "./styles.module.scss";

interface IVendorCardProps {
  vendor?: IVendor;
  isSelected?: boolean;
  onSelected?: () => void;
  onClickButton?: () => void;
}
const VendorCard: React.FC<IVendorCardProps> = ({ vendor, isSelected, onSelected, onClickButton, ...other }) => {
  // Redux:
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  // Controls:
  const checkboxRef = useRef<HTMLIonCheckboxElement | null>(null)
  const {t} = useTranslation()

  useEffect(()=>{
    checkboxRef.current?.toggleAttribute('checked', isSelected)
  }, [isSelected])
  const handleClickButton = async (event : React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
    vendor?.userId ? await unfollow() : await follow()
    dispatch(getAllVendors())
    dispatch(getFollowingVendors())
    onClickButton && onClickButton()
  }

  const follow = async () => {
    try {
      const res = await userAPIs.followVendor([vendor?.id] as string[])
    }
    catch (e) {
      console.log('Error follow vendor: ', e)
    }
  }

  const unfollow = async () => {
    try {
      const res = await userAPIs.unFollowVendor([vendor?.id] as string[])
    }
    catch (e) {
      console.log('Error unfollow vendor: ', e)
    }
  }

  return (
    <React.Fragment>
      <Link to={{ pathname: `/vendor/${vendor?.id}`}}>
        <div
          className={
            " ui-d-flex ui-w-100 ui-h-100 ui-align-items-center ui-justify-content-space-between ui-bg-white ui-border-radius-8 ui-spacing-1dot5"
          }
        >
          <IonItem 
            detailIcon={"false"}
            className={
              styles.IonItem + " ion-no-padding ui-w-80 ui-overflow-hidden"
            }
          >
            <div className={styles.logoBrand + " ui-w-20 ui-h-100"}>
              <div
                style={{ backgroundImage: `url(${vendor?.logo})` }}
                className={styles.listAvatar + ` ion-no-padding`}
              />
            </div>
            <div className="ui-d-flex ui-flex-direction-column ui-w-80 ui-mw-80">
              <h1 className="ion-no-padding ion-no-margin ui-mb-8 ui-font-medium ui-fs-16 ui-lh-19">
                {vendor?.name}
              </h1>
              {/* <p className="ui-lh-13 ui-mb-8">{starRating(vendor?.rating as number)}</p> */}
              <div className="ui-font-regular ui-fs-14 ui-text-one-line ui-lh-17 ui-mb-8 ui-mw-100 ui-sub-text ui-pd-r-20">
                {vendor?.address}
              </div>
            </div>
          </IonItem>
          <div className="ui-h-100 ui-d-flex ui-flex-direction-column ui-justify-content-space-between ui-w-20 ui-mw-20">
            <div className="ui-align-self-flex-end">
              <div onClick={(e)=>{
                e.stopPropagation()
                e.preventDefault()
                onSelected && onSelected()
              }} className={styles.checkbox + ' ' + (isSelected && styles['checkbox--active'])}>
                {isSelected && <IonIcon icon={checkmarkSharp}/>}
              </div>
            </div>
            <div className="ui-align-self-flex-end">
              <IonButton
                class={styles.buttonView}
                color={"primary"}
                fill={vendor?.userId ? "outline" : "solid"}
                mode="ios"
                onClick={handleClickButton}
              >
                <p className="ui-font-regular ui-text-initial ui-fs-14 ui-lh-17">
                  {vendor?.userId ? t(`unfollow`) : t(`follow`)}{" "}
                </p>
              </IonButton>
            </div>
          </div>
        </div>
      </Link>
    </React.Fragment>
  );
};

// export interface IRating {
//   value: number;
// }
// export const starRating = (rating: number) => {
//   const __rating: IRating[] = [];
//   const starEnd = Number.parseFloat(rating.toString()).toFixed(1);
//   const sliceEnd = starEnd.slice(2, starEnd.length);
//   for (let index = 0; index < 5; index++) {
//     if (index.toString() === starEnd.slice(0, 1)) {
//       if (Number(sliceEnd) > 7.5) {
//         __rating.push({ value: 1 });
//         continue;
//       }
//       if (Number(sliceEnd) < 7.5 && Number(sliceEnd) > 2.5) {
//         __rating.push({ value: 0.5 });
//         continue;
//       }
//       __rating.push({ value: 0 });
//       continue;
//     }
//     __rating.push({ value: Number(starEnd.slice(0, 1)) > index ? 1 : 0 });
//   }
//   return (
//     <React.Fragment>
//       {__rating.map((__rating, key) => {
//         return (
//           <span key={key}>
//             {__rating.value === 1 && (
//               <IonIcon color="danger" key={key} icon={starSharp}></IonIcon>
//             )}
//             {__rating.value === 0.5 && (
//               <IonIcon
//                 color="danger"
//                 key={key}
//                 icon={starHalfOutline}
//               ></IonIcon>
//             )}
//             {__rating.value === 0 && (
//               <IonIcon color="dark" key={key} icon={starOutline}></IonIcon>
//             )}
//           </span>
//         );
//       })}
//     </React.Fragment>
//   );
// };

export default VendorCard;
