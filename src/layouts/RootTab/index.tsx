import {IonBadge, IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs} from '@ionic/react';
import {cartOutline, chatboxEllipsesOutline, gift, home, person} from 'ionicons/icons';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Redirect, Route} from 'react-router';
import {useAppSelector} from '../../app/hook';
import {selectAllVendors, selectSelectedVendor} from '../../features/vendor/vendorSlice';
import GoodWill from '../../pages/GoodWill';
import Home from '../../pages/Home';
import Login from '../../pages/Login';
import Orders from '../../pages/Orders';
import Profile from '../../pages/Profile';
import Vendor from '../../pages/Vendor';

const TabRootPage: React.FC = () => {
  const selectedVendor = useAppSelector(selectSelectedVendor);
  const listAllVendors = useAppSelector(selectAllVendors);
  const {t} = useTranslation();

  return (
    <IonTabs>
      <IonRouterOutlet id="main-content">
        <Route
          exact
          path="/tabs/home"
          render={(props) => {
            return !!listAllVendors?.find((item) => item.id === selectedVendor?.id) ? (
              <Home />
            ) : (
              <Redirect to={'/vendors'} />
            );
          }}
        />
        <Route exact path="/tabs/good-will" component={GoodWill} />
        <Route exact path="/tabs/profile" component={Profile} />
        <Route path="/tabs/orders" component={Orders} />
      </IonRouterOutlet>
      <IonTabBar mode="md" slot="bottom" selectedTab="home">
        <IonTabButton tab="home" href="/tabs/home" className="ion-no-padding">
          <IonLabel>{t(`home`)}</IonLabel>
          <IonIcon icon={home} />
        </IonTabButton>
        {/* <IonTabButton tab="cart" href="/tabs/cart" className="ion-no-padding" >
                    <IonBadge style={{ marginLeft: "6px" }} color="danger"></IonBadge>
                    <IonLabel>Đơn hàng</IonLabel>
                    <IonIcon icon={cartOutline} />
                </IonTabButton>
                <IonTabButton tab="message" href="/tabs/message" className="ion-no-padding" >
                    <IonBadge style={{ marginLeft: "6px" }} color="danger"></IonBadge>
                    <IonLabel>Tin nhắn</IonLabel>
                    <IonIcon icon={chatboxEllipsesOutline} />
                </IonTabButton> */}
        {/* <IonTabButton tab="orders" href="/tabs/orders" className="ion-no-padding">
          <IonBadge style={{marginLeft: '6px'}} color="danger"></IonBadge>
          <IonLabel>{t(`order`)}</IonLabel>
          <IonIcon icon={gift} />
        </IonTabButton> */}
        <IonTabButton tab="good-will" href="/tabs/good-will" className="ion-no-padding">
          <IonBadge style={{marginLeft: '6px'}} color="danger"></IonBadge>
          <IonLabel>{t(`endow`)}</IonLabel>
          <IonIcon icon={gift} />
        </IonTabButton>
        <IonTabButton tab="profile" href="/tabs/profile" className="ion-no-padding">
          <IonLabel>{t(`account`)}</IonLabel>
          <IonIcon icon={person} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabRootPage;
