import {RankType} from '../constants/constants';

// API Body Request Types:
export type RequestContentType = 'application/x-www-form-urlencoded' | 'application/json';

// User:
export interface IUser {
  identity?: string;
  displayName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  birthday?: string;
  gender?: number;
  image?: string;
  status?: number;
}

export interface IPointOfUser {
  totalPoint?: number;
  id?: number;
  vendorIf?: number;
  point?: number;
  type?: number;
  expirationDate?: string;
}

export interface IAboutToExpire {
  vendorId?: string;
  point?: number;
  expirationDate?: string;
}

export interface IRankOfUser {
  point?: number;
  rank?: string;
  aboutToExpire?: IAboutToExpire; // ***
}

export interface IUserLoyalty {
  totalGift?: number,
  totalPoint?: number,
  rankOfUser?: IRankOfUser,
  aboutToExpire?: IAboutToExpire,
  luckyWheelTurns?: number
}

// Product:
export interface IProduct {
  readonly id?: number | string;
  readonly productCode?: string;
  name?: string;
  price: number;
  pricePromotion?: number;
  unit?: string;
  descr?: string;
  imgBannerUrl?: string;
  parentProductId?: string | number;
  unitRate?: string | number;
  qty: number;
  isPromotion?: boolean;
  promotionTag?: string;
  tstamp?: string;
  barcode?: string;
  productImages?: string[];
}

export interface IAttributes {
  id?: number;
  name?: string;
  attributeValues?: string[];
}

export interface IProductParent {
  id?: number;
  categoryId?: number;
  parentCategoryId?: number;
  vendorId?: number;
  productCode?: string;
  descr?: string;
  barcode?: string;
  brandName?: string;
  groupCode?: string;
  hightlight?: number;
  imgBanner?: string;
  name?: string;
  products?: IProduct[];
  status?: string;
  stkUnit?: string;
  vendor?: IVendor;
  videoUrl?: string;
}

// Vendor:
export interface IVendor {
  readonly id?: number | string | undefined;
  readonly name?: string | undefined;
  readonly address?: string | undefined;
  readonly email?: string | undefined;
  readonly phone?: string | undefined;
  readonly contactName?: string | undefined;
  readonly contactPhone?: string | undefined;
  readonly contactEmail?: string | undefined;
  readonly userId?: string | undefined;
  readonly website?: string | undefined;
  readonly image?: string | undefined;
  readonly logo?: string | undefined;
  readonly info?: string | undefined;
  readonly status?: string | number | undefined;
  readonly statusName?: string | undefined;
  readonly isDeleted?: boolean | undefined;
  readonly fax?: string | undefined;
  readonly taxCode?: string | undefined;
  readonly rating?: number | undefined;
  readonly vendorKey?: number | undefined;
  readonly totalFeedback?: number | undefined;
  readonly shortName?: string | undefined;
  readonly domainEvents?: string | undefined;
  readonly code?: any;
  products?: any; // ******
}

export interface IVendorOfUser extends IVendor {
  totalGift?: number;
  totalPoint?: number;
  loyaltyProgram?: ILoyaltyProgram[];
  configRankOfVendor?: IConfigRankOfVendor;
  aboutToExpire?: IAboutToExpire;
}

export interface IVendorWithLuckyWheelTurn extends IVendor {
  luckyWheelTurns?: number;
}

// ========================= Category: =========================
export interface ICategory {
  id: string | number;
  categoryCode?: string;
  name?: string;
  imageUrl?: string;
  sort?: number;
  parentId?: string | number;
  level?: string | number;
  category?: ICategory[];
}

// ========================= Loyalty Program: =========================
export interface productParticipatingLoyalties {
  id?: string;
  product?: IProduct;
  amountOfMoney?: number;
  points?: number;
  type?: number;
}

export interface ILoyaltyProgram {
  id?: number;
  name?: string;
  imgBannerUrl?: string;
  pointOfUser?: number;
  type?: number;
  typeName?: string;
  startDate?: string;
  endDate?: string;
  expirationDate?: string;
  vendor?: IVendorOfUser;
  productParticipatingLoyalties?: productParticipatingLoyalties[];
  loyaltyProgramImages?: string[];
  giftOfLoyalty?: IGiftOfLoyalty[];
}

export interface IUserGiftOfLoyalty {
  id: number;
  giftOfLoyalty: IGiftOfLoyalty;
  expirationDate: string;
  isUsed: boolean;
}

export interface IGiftOfLoyalty {
  id?: number;
  name?: string;
  product?: IProduct;
  fortune?: IFortune;
  loyaltyProgram?: ILoyaltyProgram;
  quantity?: number;
  point?: number;
  limit?: number;
  qtyAvailable?: number;
}

export interface ILoyaltyType {
  title?: string;
  shortTitle?: string;
  icon?: any;
  color?: string;
  description?: string;
  rank?: string;
  nextRank?: string;
  point?: number;
  typeNextRank?: RankType;
  typeRank?: RankType;
}

// ========================= Vendors Overview: =========================
export interface IConfigRankOfVendor {
  id?: number;
  vendorId?: number;
  pointOfSilverMember?: number;
  pointOfGoldMember?: number;
  pointOfDiamondMember?: number;
  rankOfUser?: IRankOfUser;
}

export interface IRankOfUserByVendor {
  vendor?: IVendor;
  rankOfUser?: IRankOfUser;
  rankOfVendor?: IConfigRankOfVendor;
}

// Fortune:

export interface IFortune {
  id?: number;
  descr?: string;
  points?: number;
  fromDate?: string;
  toDate?: string;
  imageBanner?: string;
  vendor?: IVendor;
  fortuneDetails: IReward[];
  turnsOfUser?: number;
}

export interface IReward {
  id?: number;
  fortuneId?: number;
  descr?: string;
  limit?: number;
  qtyAvailable?: number;
  fortuneType?: number;
  quantity?: number;
  color?: string;
  image?: string;
}

export interface IFortuneRewardHistoryItem {
  id?: number;
  fortune?: IFortune;
  createdAt?: string;
}

// Setting:
export interface IUserAppSetting {
  isFingerprintLogin: boolean;
  isGetNotifications: boolean;
  langId: string;
  vendorId?: number | string;
}

export interface ILanguage {
  langId: string;
  displayName: string;
  image?: string;
}

// Notification Message:
export interface INotificationData {
  notifyMessages?: INotificationMessage[];
  notSeen?: number;
}

export interface INotificationMessage {
  id?: number;
  notificationSetupId?: number;
  remark?: string;
  userId?: string;
  vendorId?: number;
  seenTime?: any;
  seen?: boolean;
  isShow?: boolean;
  fcmMessage?: string;
  createdAt?: string;
  notificationSetup?: INotificationSetUp;
}

export interface INotificationSetUp {
  title?: string;
  subTitle?: string;
  type?: number;
  datetimeStart?: string;
  content?: string;
  attachFile?: any;
  vendorId?: number;
  status?: number;
  notifyMessages?: string;
  vendor?: IVendor;
  id?: number;
  createdAt?: string;
  remark?: string;
}

// API:

export interface IErrorResponse {
  data?: IErrorResponseData;
  status?: number | string;
  statusText?: string;
}

export interface IIdentityErrorResponse {
  data?: any;
  status?: number | string;
  statusText?: string;
}

export interface IErrorResponseData {
  ErrorCode?: string;
  ErrorMessage?: string;
  PropertyName?: string;
}

export type OTPAction = 'register' | 'forgotPassword';

export interface IProgramType {
  type: string | number;
  typeName: string;
}

export interface IListResponse {
  pageIndex?: number;
  pageSize?: number;
  count?: number;
  ids?: string;
  data?: any[];
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
// ========================= Eror: =========================
export interface IError {
  isError?: boolean;
  msgError?: string;
}
