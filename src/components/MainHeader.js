import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {Header, Left, Right, Body} from 'native-base';
import {NavigationActions, StackActions} from 'react-navigation';
import {DrawerActions} from 'react-navigation-drawer';
import {menu} from '../assets/image';

export default class mainHeader extends Component {
  constructor(props) {
    super(props);
  }

  goBack = (navigate) => {
    navigate.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Home'})],
        // actions: [NavigationActions.navigate({ routeName: 'SignIn' })]
      }),
    );
    navigate.navigate('BottomTab2');
  };

  render() {
    let navigate = this.props.navigate;
    const menuBtn = (
      <Image source={menu} resizeMode="cover" style={{width: 20, height: 20}} />
    );

    return (
      <Header style={[{backgroundColor: '#4458e4'}]}>
        <Left>
          <TouchableOpacity
            style={{padding: 10, paddingLeft: 0}}
            onPress={() => navigate.dispatch(DrawerActions.toggleDrawer())}>
            {menuBtn}
          </TouchableOpacity>
        </Left>
        <Body style={{flex: 6, alignItems: 'center'}}>
            <Text
              allowFontScaling={false}
              style={{
                color: '#fff',
                fontSize: 24,
                fontWeight: 'bold',
                textTransform: 'uppercase',
                paddingLeft:'6%'
              }}>
              {this.props.title}
            </Text>
        </Body>
        <Right>{null}</Right>
      </Header>
    );
  }
}
