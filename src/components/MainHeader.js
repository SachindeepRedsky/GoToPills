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
    let search = '';
    let GenericName = '';
    const menuBtn = (
      <Image source={menu} resizeMode="cover" style={{width: 20, height: 20}} />
    );
    if (navigate.state.routeName === 'Bulletindetails') {
      search = this.props.searchNavigationRougt;
      GenericName = this.props.searchNavigationParams;
    }

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
              paddingLeft: '6%',
            }}>
            {this.props.title}
          </Text>
        </Body>
        <Right>
          {navigate.state.routeName === 'Bulletindetails' ? (
            <TouchableOpacity
              onPress={() => {
                this.props.navigate.navigate(search, {
                  GenericName: GenericName,
                });
              }}>
              <Image
                source={require('../assets/search2.png')}
                style={{
                  width: 30,
                  height: 30,
                  marginTop: '1%',
                }}
              />
            </TouchableOpacity>
          ) : null}
        </Right>
      </Header>
    );
  }
}
