import React, { useEffect, useState } from "react";
import {
    IonAvatar,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCol,
    IonContent,
    IonFab,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonPage,
    IonRow,
    IonText,
    IonToolbar,
    useIonViewWillEnter,
} from "@ionic/react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import {
    call,
    chevronBack,
    globeOutline,
    homeOutline,
    locationOutline,
    mail,
} from "ionicons/icons";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
    getGiftsFromSelectedVendor,
    getUserAppSetting,
    selectUser,
    selectUserAppSetting,
    getVendorOverview,
    getUserLoyalty,
} from "../../features/user/userSlice";
import styles from "./styles.module.scss";
import vendorAPIs from "../../api/vendor";
import productAPIs from "../../api/product";
import { IProduct, IVendor } from "../../types/interface";
import * as _ from "lodash";
import ProductCard from "../../components/ProductCard";
import {
    getAllVendors,
    getFollowingVendors,
} from "../../features/vendor/vendorSlice";
import userAPIs from "../../api/user";
import { updateAppSetting } from "../../utils/utils";
import { getAllCategories } from "../../features/category/categorySlice";
import { useTranslation } from "react-i18next";
import { getNotifications } from "../../features/notification/notificationSlice";

export interface IParamsProps {
    id: string;
}

const productsPerPage = 10;

const Vendor: React.FC = () => {
    const location = useLocation();
    const router = useHistory();
    const { id } = useParams<IParamsProps>();

    // Redux:
    const user = useAppSelector(selectUser);
    const appSetting = useAppSelector(selectUserAppSetting);
    const dispatch = useAppDispatch();

    // State:
    const [vendor, setVendor] = useState<IVendor>();
    const [statusView, setStatusView] = React.useState<
        "products" | "infomation"
    >("products");
    const [isNotHeaderSummary, setIsNotHeaderSummary] = useState<boolean>(true);
    const [listProducts, setListProducts] = useState<IProduct[]>([]);

    // Controls:
    const [disabledBackButton, setDisabledBackButton] =
        useState<boolean>(false);
    const [disabledInfiniteScroll, setDisabledInfiniteScroll] =
        useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const {t} = useTranslation()

    useIonViewWillEnter(() => {
        if (_.get(location.state, "from") === "/login") {
            setDisabledBackButton(true);
        }
    });

    useEffect(() => {
        if (user?.identity) getVendorInfo();
    }, [user, id]);

    useEffect(() => {
        getListProduct();
    }, [currentPage]);

    const getVendorInfo = async () => {
        try {
            vendorAPIs.getById(id).then((res: IVendor) => {
                return setVendor(res);
            });
        } catch (e) {
            console.log("Error get vendor info: ", e);
        }
    };

    const getListProduct = async () => {
        try {
            const res = await productAPIs.getProductsByVendor(
                id,
                productsPerPage,
                currentPage
            );
            setListProducts(listProducts.concat(res?.data || []));
            if (!res?.hasNextPage) setDisabledInfiniteScroll(true);
        } catch (e) {
            console.log("Error get list products", e);
        }
    };

    const handleInfiniteScroll = (ev: any) => {
        if (statusView === "products") {
            setCurrentPage((currentPage) => (currentPage += 1));
            setTimeout(() => {
                ev.target.complete();
            }, 500);
        }
    };

    const handleClickButton = async (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        vendor?.userId ? await unfollow() : await follow();
        await getVendorInfo();
        dispatch(getAllVendors());
        dispatch(getFollowingVendors());
    };

    const handleSubmit = async () => {
        if (!!vendor) {
            await userAPIs.updateUserAppSetting({
                vendorId: id || "",
                langId: appSetting.langId || "vi",
                isFingerprintLogin: appSetting.isFingerprintLogin || false,
                isGetNotifications: appSetting.isGetNotifications || false,
            });
            await dispatch(getUserAppSetting());
            dispatch(getNotifications())
            dispatch(getGiftsFromSelectedVendor());
            dispatch(getAllCategories());
            dispatch(getUserLoyalty());
            router.push("/tabs/home");
        }
    };

    const follow = async () => {
        try {
            const res = await userAPIs.followVendor([vendor?.id] as string[]);
        } catch (e) {
            console.log("Error follow vendor: ", e);
        }
    };

    const unfollow = async () => {
        try {
            const res = await userAPIs.unFollowVendor([vendor?.id] as string[]);
        } catch (e) {
            console.log("Error unfollow vendor: ", e);
        }
    };

    return (
        <IonPage id="main-content">
            <IonHeader mode="md">
                <IonToolbar
                    className={
                        styles.ionToolbar +
                        " ui-spacing-2 ui-position-relative " +
                        styles.toolbar
                    }
                    style={
                        isNotHeaderSummary
                            ? {
                                  background: `url('${vendor?.image}') no-repeat 100% center/cover`,
                                  height: "248px",
                              }
                            : {
                                  height: "140px",
                                  background: `url('${vendor?.image}') no-repeat 100% center/cover`,
                              }
                    }
                >
                    <div
                        id="maginScroll"
                        className={'ui-mt-50'}
                        style={{transition: "all 0.4s"}}
                    ></div>
                    <div className="ui-w-100 ui-d-flex ui-align-items-center ui-justify-content-space-between">
                        <div className="ui-d-flex ui-align-items-center">
                            <IonButtons
                                slot="end"
                                className="ui-align-self-center"
                            >
                                <IonButton
                                    className={styles.header__button}
                                    fill="solid"
                                    color={"light"}
                                    onClick={() => {
                                        router.goBack();
                                    }}
                                >
                                    <IonIcon
                                        icon={chevronBack}
                                        color={"primary"}
                                    />
                                </IonButton>
                            </IonButtons>
                        </div>
                        <div className="ui-d-flex ui-align-items-center">
                            <IonButtons
                                slot="end"
                                className="ui-align-self-center"
                            >
                                <IonButton
                                    className={styles.header__button}
                                    fill="solid"
                                    color={"light"}
                                    onClick={() => {
                                        router.replace("/tabs/home");
                                    }}
                                >
                                    <IonIcon
                                        icon={homeOutline}
                                        color={"primary"}
                                    />
                                </IonButton>
                            </IonButtons>
                        </div>
                    </div>
                </IonToolbar>
                <div className={styles.cardHolder}>
                    <IonCard
                        mode="ios"
                        className={
                            "ui-w-100 ui-postion-relative " +
                            styles.header__card + ' ' + (!isNotHeaderSummary && styles['header__card--shrink'])
                        }
                    >
                        <IonAvatar className={styles.header__cardAvatar + ' ' + (!isNotHeaderSummary && styles['header__cardAvatar--hiden'])}>
                                <img
                                    src={`${vendor?.logo}`}
                                    alt="logo-vendor"
                                />
                            </IonAvatar>
                        <IonButton
                            onClick={handleClickButton}
                            mode="ios"
                            fill={!!vendor?.userId ? "outline" : "solid"}
                            color={"primary"}
                            className={styles.followButton}
                        >
                            {vendor?.userId ? t(`unfollow`) : t(`follow`)}
                        </IonButton>
                        <IonText className={"ion-text-center "}>
                            <h1 className={styles.vendorTitle}>
                                {vendor?.name}
                            </h1>
                        </IonText>
                    </IonCard>
                </div>
            </IonHeader>
            <IonContent 
                class={styles.content}
                fullscreen
                className="ion-padding"
                scrollEvents={true}
                onIonScroll={(e) => {
                    if (e.detail.scrollTop > 300) {
                        setIsNotHeaderSummary(false);
                    } else {
                        setIsNotHeaderSummary(true);
                    }
                }}
            >
                <IonGrid
                    className={
                        "ui-mt-50 " +
                        (statusView === "infomation" && "ui-mb-50") +
                        (disabledInfiniteScroll && " ui-mb-40")
                    }
                >
                    <IonRow>
                        <IonCol
                            className="ui-pd-r-5 ui-pd-l-5 ui-pd-t-10"
                            size="6"
                        >
                            <IonButton
                                mode="ios"
                                className={"ui-w-100 " + styles.statusButton}
                                color={
                                    statusView === "products"
                                        ? "primary"
                                        : "medium"
                                }
                                fill={
                                    statusView === "products"
                                        ? "solid"
                                        : "outline"
                                }
                                onClick={() => {
                                    setStatusView("products");
                                }}
                            >
                                {t(`product`)}
                            </IonButton>
                        </IonCol>
                        <IonCol
                            className="ui-pd-r-5 ui-pd-l-5 ui-pd-t-10"
                            size="6"
                        >
                            <IonButton
                                mode="ios"
                                className={"ui-w-100 " + styles.statusButton}
                                color={
                                    statusView === "infomation"
                                        ? "primary"
                                        : "medium"
                                }
                                fill={
                                    statusView === "infomation"
                                        ? "solid"
                                        : "outline"
                                }
                                onClick={() => {
                                    setStatusView("infomation");
                                }}
                            >
                                {t(`information`)}
                            </IonButton>
                        </IonCol>
                    </IonRow>
                    {statusView === "products" && (
                        <IonRow className="ui-w-flatform-mobile ui-mx-auto ui-mt-20">
                            {listProducts?.map((item, index) => {
                                return (
                                    <IonCol
                                        className="ui-pd-b-12 ui-pd-r-5 ui-pd-l-5"
                                        size="6"
                                        key={index}
                                        sizeLg="3"
                                        sizeMd="4"
                                    >
                                        <ProductCard product={item} />
                                    </IonCol>
                                );
                            })}
                        </IonRow>
                    )}
                    {statusView === "infomation" && (
                        <IonRow className="ui-w-flatform-mobile ui-mx-auto ui-mt-20 ui-mb-50">
                            <IonCol size="12">
                                <IonCard mode="ios" className={styles.infoCard}>
                                    <IonCardHeader>
                                        <IonCardTitle className="ui-fs-16">
                                            {vendor?.name}
                                        </IonCardTitle>
                                    </IonCardHeader>
                                    <div className={styles.divider}></div>
                                    <IonCardContent>
                                        <p className="ui-fs-16">
                                            {vendor?.info}
                                        </p>
                                        <div
                                            className={
                                                styles.infoCard__attribute
                                            }
                                        >
                                            <div>
                                                <IonIcon icon={call}></IonIcon>
                                            </div>
                                            <IonText>
                                                <p>{vendor?.phone}</p>
                                            </IonText>
                                        </div>
                                        <div
                                            className={
                                                styles.infoCard__attribute
                                            }
                                        >
                                            <div>
                                                <IonIcon icon={mail}></IonIcon>
                                            </div>
                                            <IonText>
                                                <p>{vendor?.email}</p>
                                            </IonText>
                                        </div>{" "}
                                        <div
                                            className={
                                                styles.infoCard__attribute
                                            }
                                        >
                                            <div>
                                                <IonIcon
                                                    icon={globeOutline}
                                                ></IonIcon>
                                            </div>
                                            <a
                                                href={vendor?.website}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <IonText>
                                                    <p>{vendor?.website}</p>
                                                </IonText>
                                            </a>
                                        </div>{" "}
                                        <div
                                            className={
                                                styles.infoCard__attribute
                                            }
                                        >
                                            <div>
                                                <IonIcon
                                                    icon={locationOutline}
                                                ></IonIcon>
                                            </div>
                                            <IonText>
                                                <p>{vendor?.address}</p>
                                            </IonText>
                                        </div>
                                    </IonCardContent>
                                </IonCard>
                            </IonCol>
                        </IonRow>
                    )}
                </IonGrid>
                {statusView === "products" && (
                    <IonInfiniteScroll
                        onIonInfinite={handleInfiniteScroll}
                        threshold="100px"
                        disabled={disabledInfiniteScroll}
                    >
                        <IonInfiniteScrollContent loadingSpinner="dots"></IonInfiniteScrollContent>
                    </IonInfiniteScroll>
                )}
                <IonFab
                    className="ui-w-100vw  ui-pd-r-32 ui-pd-l-16"
                    vertical="bottom"
                    horizontal="start"
                    slot="fixed"
                >
                    <IonButton
                        mode="ios"
                        color={"primary"}
                        className="ui-w-100 ui-fw-300"
                        onClick={handleSubmit}
                    >
                        {t(`chooseVendor`)}
                    </IonButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default Vendor;
