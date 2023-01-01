import {faClipboardList} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/react';
import styles from './styles.module.scss';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Redirect, Route} from 'react-router';
import CartButton from '../../components/CartButton';
import NotificationButton from '../../components/NotificationButton';
import SearchBar from '../../components/SearchBar';
import GoodWill from '../../pages/GoodWill';
import Profile from '../../pages/Profile';
import VendorOverview from '../VendorOverview';
import Setting from '../Setting';
import MyGift from '../MyGift';

interface ITabButton {
  tab: string;
  faIcon?: string;
  label?: string;
  page: React.FC;
}

const Orders: React.FC = () => {
  const {t} = useTranslation();
  const initialSelectedTab = 'pending';
  // Use selectedTab in order to check which tab is being focus to apply custom styles
  const [selectedTab, setSelectedTab] = useState<string>(initialSelectedTab);

  const renderHeaderNavigator = () => {
    return (
      <div className={styles.headerNavigator}>
        <div className={styles.row}>
          <SearchBar searchPlaceholder={t('search')} />
          <CartButton />
          <NotificationButton />
        </div>
      </div>
    );
  };

  const onSelected = (e: any) => {
    setSelectedTab(e.detail.tab);
  };

  const listButtons: ITabButton[] = [
    {
      tab: 'pending',
      faIcon: 'fa-ballot-check',
      label: 'Chờ xác nhận',
      page: VendorOverview,
    },
    {
      tab: 'preparing',
      faIcon: 'fa-hand-holding-box',
      label: 'Đang soạn hàng',
      page: GoodWill,
    },
    {
      tab: 'delivering',
      faIcon: 'fa-truck-clock',
      label: 'Đang giao hàng',
      page: Profile,
    },
    {
      tab: 'delivered',
      faIcon: 'fa-box-circle-check',
      label: 'Đã nhận hàng',
      page: Setting,
    },
    {
      tab: 'cancel',
      faIcon: 'fa-file-excel',
      label: 'Đơn hàng hủy',
      page: MyGift,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.headerBackground} />
      <IonTabs>
        <IonTabBar translucent mode="md" slot="top" className={styles.tabBar} selectedTab={initialSelectedTab}>
          {listButtons.map((item, index) => {
            const isSelected = item.tab === selectedTab;
            return (
              <IonTabButton
                key={index}
                tab={item.tab}
                href={`/tabs/orders/${item.tab}`}
                className={'ion-no-padding ' + (isSelected && styles.selected)}
                onClick={onSelected}
              >
                <i className={styles.icon + ` ${isSelected ? 'fa-solid' : 'fa-light'} ${item.faIcon}`}></i>
                <IonLabel>{item?.label}</IonLabel>
              </IonTabButton>
            );
          })}
        </IonTabBar>
        <IonRouterOutlet>
          <Redirect to={`/tabs/orders/${initialSelectedTab}`} />
          {listButtons?.map((item, index) => {
            return <Route key={index} exact path={`/tabs/orders/${item.tab}`} component={item.page} />;
          })}
        </IonRouterOutlet>
      </IonTabs>
      {renderHeaderNavigator()}
    </div>
  );
};

export default Orders;
