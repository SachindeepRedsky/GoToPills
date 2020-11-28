import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SplashScreen from '../screens/splash';
import SearchScreen from '../screens/search';
import BulletinScreen from '../screens/bulletin';
import BulletinDetailScreen from '../screens/bulletindetails/index';
import DarwerMenu from '../screens/drawer/index';
import * as colors from '../constants/colors';

// navigation stack
const AppStack = createStackNavigator(
  {
    Splash: {
      screen: SplashScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    Bulletin: {
      screen: BulletinScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    Bulletindetails: {
      screen: BulletinDetailScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: 'Splash',
  },
);

// Drawer
const DrawerNavigator = createDrawerNavigator({
  Search: {
    screen: SearchScreen,
  },
  Bulletin: {
    screen: BulletinScreen,
  },
  Bulletindetails: {
    screen: BulletinDetailScreen,
  }
},
  {
    contentOptions: {
      style: {
        backgroundColor: colors.whiteColor,
        flex: 1,
      }
    },
    navigationOptions: {
      drawerLockMode: 'locked-closed'
    },
    contentComponent: DarwerMenu,
  },
);

const Routes = createAppContainer(
  createSwitchNavigator({
    App: AppStack,
    Drawer: DrawerNavigator,
  }),
);
export default Routes;
