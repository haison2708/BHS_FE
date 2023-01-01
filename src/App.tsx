/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/display.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';

/* Theme variables */
import './theme/app.scss';
import './theme/variables.scss';
import './theme/mixin.scss';
import './theme/ui/ui-reponsive.css';
import './theme/ui/ui.scss';

// Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

import {IonApp, IonRouterOutlet, IonSplitPane, isPlatform, setupIonicReact} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';
import {Redirect, Route, useHistory} from 'react-router-dom';

import _ from 'lodash';
import React, {useEffect, useState} from 'react';
import RootTab from './layouts/RootTab';
import ForgotPassword from './pages/ForgotPassword';
import FormRegister from './pages/FormRegister';
import FormForgotPassword from './pages/FormForgotPassword';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import Vendors from './pages/Vendors';
import Vendor from './pages/Vendor';
import ProfileInfo from './pages/ProfileInfo';
import MyGift from './pages/MyGift';
import {useAppDispatch, useAppSelector} from './app/hook';
import {
  getGiftsFromSelectedVendor,
  getUser,
  getUserAppSetting,
  resetUserSlice,
  selectUser,
  getVendorOverview,
  getUserLoyalty,
} from './features/user/userSlice';
import EditProfile from './pages/EditProfile';
import ProfileLoyalty from './pages/ProfileLoyalty';
import QRScanner from './pages/QRScanner';
import Login from './pages/Login';
import AccumulatePointsProgramDetail from './pages/AccumulatePointsProgramDetail';
import GiftExchangeProgramDetail from './pages/GiftExchangeProgramDetail';
import ChangePassword from './pages/ChangePassword';
import Setting from './pages/Setting';
import {getAllCategories} from './features/category/categorySlice';
import {getAllVendors, getFollowingVendors} from './features/vendor/vendorSlice';
import Splash from './pages/Splash';
import MyGiftDetail from './pages/MyGiftDetail';
import ExchangeGiftDetail from './pages/ExchangeGiftDetail';
import EarnPointHistory from './pages/EarnPointHistory';
import LuckyWheel from './pages/LuckyWheel';
import VendorOverview from './pages/VendorOverview';
import LuckyWheelHistory from './pages/LuckyWheelHistory';
import Notification from './pages/Notification';
import {getNotifications} from './features/notification/notificationSlice';
import {getAccessToken, getRefreshToken, refreshAppToken} from './utils/utils';
import {Preferences} from '@capacitor/preferences';
import Protected from './components/Protected';
import {StatusBar} from '@capacitor/status-bar';
import PushNotification from './components/PushNotifcation';
import Signalr from './components/Signalr';
import AllCategory from './pages/AllCategory';
import ProductsByCategory from './pages/ProductsByCategory';
import ProductDetail from './pages/ProductDetail';
import NotificationDetail from './pages/NotificationDetail';
import AllPromotionProducts from './pages/AllPromotionProducts';
import { getAllProgram } from './features/program/programSlice';

setupIonicReact({
  swipeBackEnabled: true,
});

const SPLASH_PAGE_TIME = 700;

const App: React.FC = () => {
  // Controls:
  const dispatch = useAppDispatch();
  const router = useHistory();

  // Redux:
  const user = useAppSelector(selectUser);

  // State:
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getUserIfLogined = async () => {
      try {
        setIsLoading(true);
        const accessToken = await getAccessToken();
        const refreshToken = await getRefreshToken();
        if (!!accessToken && !!refreshToken) {
          const refreshSuccess = await refreshAppToken(refreshToken);
          if (refreshSuccess) {
            await dispatch(getUser());
            await dispatch(getUserAppSetting());
            await dispatch(getAllVendors());
          } else {
            await Preferences.remove({key: '_accessToken'});
            await Preferences.remove({key: '_refreshToken'});
            dispatch(resetUserSlice());
          }
        }
      } catch (e) {
        // handle token expired || null
        // 1. delete token => user.identity = null
        // 2. direction --> login page
        await Preferences.remove({key: '_accessToken'});
        await Preferences.remove({key: '_refreshToken'});
        // 3. rest User in Redux
        dispatch(resetUserSlice());
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, SPLASH_PAGE_TIME);
      }
    };

    settingStatusbar();
    getUserIfLogined();
  }, [dispatch]);

  useEffect(() => {
    const getData = async () => {
      //already get allvendors and user setting when logining or first time get into app (if already logined before)
      dispatch(getAllCategories());
      dispatch(getFollowingVendors());
      dispatch(getGiftsFromSelectedVendor());
      dispatch(getNotifications());
      dispatch(getUserLoyalty());
      dispatch(getAllProgram());
    };

    if (user.identity) {
      getData();
    }
  }, [dispatch, user]);

  const settingStatusbar = async () => {
    if (isPlatform('capacitor')) {
      if (isPlatform('android')) {
        StatusBar.setOverlaysWebView({overlay: true});
      }
      await StatusBar.hide();
    }
  };

  if (isLoading)
    return (
      <IonApp>
        <Splash></Splash>
      </IonApp>
    );

  return (
    <IonApp>
      <IonReactRouter basename="/1CXAPP">
        <PushNotification />
        <Signalr />
        <IonSplitPane contentId="main-content">
          <IonRouterOutlet id="main-content">
            <Route component={Splash} />
            <Route
              path="/login"
              render={() => {
                return <Login />;
              }}
            ></Route>
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/otp-verification" component={OTPVerification} />
            <Route path="/form-forgot-password" component={FormForgotPassword} />
            <Route path="/register" component={Register} />
            <Route path="/form-register" component={FormRegister} />
            <Route
              exact
              path="/vendors"
              component={Vendors}
              render={() => (
                <Protected>
                  <Vendors />
                </Protected>
              )}
            />
            <Route
              exact
              path="/vendor/:id"
              render={() => (
                <Protected>
                  <Vendor />
                </Protected>
              )}
            />
            <Route
              path="/profile-info"
              render={() => (
                <Protected>
                  <ProfileInfo />
                </Protected>
              )}
            />
            <Route
              path="/edit-profile"
              render={() => (
                <Protected>
                  <EditProfile />
                </Protected>
              )}
            />
            <Route
              path="/profile-loyalty"
              render={() => (
                <Protected>
                  <ProfileLoyalty />
                </Protected>
              )}
            />
            <Route
              path="/qr-scanner"
              render={() => (
                <Protected>
                  <QRScanner />
                </Protected>
              )}
            />
            <Route
              path="/change-password"
              render={() => (
                <Protected>
                  <ChangePassword />
                </Protected>
              )}
            />
            <Route
              path="/setting"
              render={() => (
                <Protected>
                  <Setting />
                </Protected>
              )}
            />
            <Route
              path="/accumulate-points-program-detail/:id/:type"
              render={() => (
                <Protected>
                  <AccumulatePointsProgramDetail />
                </Protected>
              )}
            />
            <Route
              path="/gift-exchange-program-detail/:id/:type"
              render={() => (
                <Protected>
                  <GiftExchangeProgramDetail />
                </Protected>
              )}
            />
            <Route
              exact
              path="/my-gift"
              render={() => (
                <Protected>
                  <MyGift />
                </Protected>
              )}
            />
            <Route
              exact
              path="/my-gift/:id"
              render={() => (
                <Protected>
                  <MyGiftDetail />
                </Protected>
              )}
            />
            <Route
              path="/exchange-gift-detail"
              render={() => (
                <Protected>
                  <ExchangeGiftDetail />
                </Protected>
              )}
            />
            <Route
              path="/earn-point-history"
              render={() => (
                <Protected>
                  <EarnPointHistory />
                </Protected>
              )}
            />
            <Route
              path="/lucky-wheel/:id"
              render={() => (
                <Protected>
                  <LuckyWheel />
                </Protected>
              )}
            />
            <Route
              exact
              path="/overview-provider"
              render={() => (
                <Protected>
                  <VendorOverview />
                </Protected>
              )}
            />
            <Route
              path="/lucky-wheel"
              render={() => (
                <Protected>
                  <LuckyWheel />
                </Protected>
              )}
            />
            <Route
              path="/lucky-wheel-history/:id"
              render={() => (
                <Protected>
                  <LuckyWheelHistory />
                </Protected>
              )}
            />
            <Route
              path="/notification"
              render={() => (
                <Protected>
                  <Notification />
                </Protected>
              )}
            />
            <Route
              path="/notification-detail/:id"
              render={() => (
                <Protected>
                  <NotificationDetail />
                </Protected>
              )}
            />
            <Route
              path="/all-category"
              render={() => (
                <Protected>
                  <AllCategory />
                </Protected>
              )}
            />
            <Route
              path="/category/:id"
              render={() => (
                <Protected>
                  <ProductsByCategory />
                </Protected>
              )}
            />
            <Route
              path="/product/:id"
              render={() => (
                <Protected>
                  <ProductDetail />
                </Protected>
              )}
            />
            <Route
              path="/all-promotion-products"
              render={() => (
                <Protected>
                  <AllPromotionProducts />
                </Protected>
              )}
            />
            <Route
              path="/tabs"
              render={(props) => (
                <Protected>
                  <RootTab />
                </Protected>
              )}
            />
            <Route
              exact
              path="/"
              render={(props) => (
                <Protected>
                  <Redirect to={'/tabs/home'} />
                </Protected>
              )}
            />
            <Route render={(prosp) => 'can not page'} />
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
