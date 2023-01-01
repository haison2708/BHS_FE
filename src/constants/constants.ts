import {faGem} from '@fortawesome/free-solid-svg-icons';
import {faCrown} from '@fortawesome/free-solid-svg-icons';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {ILanguage, ILoyaltyType} from '../types/interface';

export const ProgramTypes = {
  LoyaltyPurchaseProgram: {
    type: 12345,
    typeName: 'LoyaltyProgramPurchase',
  },
  LoyaltyQrCodeProgram: {
    type: 12346,
    typeName: 'LoyaltyProgramQrCode',
  },
  LoyaltyGiftExchangeProgram: {
    type: 12347,
    typeName: 'LoyaltyProgramGiftExchange',
  },
};

export const Languages: ILanguage[] = [
  {
    langId: 'vi',
    displayName: 'Tiếng việt',
    image: require('../asset/system/vietnam_flag.png'),
  },
  {
    langId: 'en',
    displayName: 'English',
    image: require('../asset/system/usa_flag.png'),
  },
];

export type RankType = 'pointOfSilverMember' | 'pointOfGoldMember' | 'pointOfDiamondMember'
export const rankType: RankType[] = ['pointOfSilverMember', 'pointOfGoldMember', 'pointOfDiamondMember']

export const listLoyaltyType: ILoyaltyType[] = [
  {
    title: 'newMember',
    shortTitle: 'newMember',
    icon: faStar,
    color: '#A4A4A8',
    description: 'newbie',
    rank: 'New',
    nextRank: 'Silver',
    typeNextRank: 'pointOfSilverMember',
  },
  {
    title: 'silverRank',
    shortTitle: 'silver',
    icon: faStar,
    color: '#809ECF',
    rank: 'Silver',
    nextRank: 'Gold',
    typeNextRank: 'pointOfGoldMember',
    typeRank: 'pointOfSilverMember',
  },
  {
    title: 'goldRank',
    shortTitle: 'gold',
    icon: faCrown,
    color: '#F5A202',
    rank: 'Gold',
    nextRank: 'Diamond',
    typeNextRank: 'pointOfDiamondMember',
    typeRank: 'pointOfGoldMember',
  },
  {
    title: 'diamondRank',
    shortTitle: 'diamond',
    icon: faGem,
    color: '#096DC8',
    rank: 'Diamond',
    typeRank: 'pointOfDiamondMember',
  },
];

export const typeOfNotificationSetup = {
  promotionProgramPoint: 6610,
  promotionProgram: 6611,
  other: 6612,
  system: 6613,
};

export const ApiErrorResponseStatusCode = {
  IdNotExist: '0001',
  NullOrEmpty: '0002',
  LessThanValue: '0003',
  IncorrectType: '0004',
  IncorrectFormatDate: '0005',
  IdExist: '0006',
  Ended: '00067',
  OutOfTurns: '0008',
  IncorrectValue: '0009',
  NotEnoughPoint: '00010',
  OutOfGifts: '0011',
  NotExistOrUsedOrExpired: '0012',
};
