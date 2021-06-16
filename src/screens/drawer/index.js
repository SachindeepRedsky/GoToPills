import React, { Component } from 'react';
import {
  Alert,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Styles from './style';
import { search, bulletin, profile, refills } from '../../assets/image';
import { NavigationActions, StackActions } from 'react-navigation';
import styles from './style';

export default class DrawerMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Guest User'
    };
  }

  bulletins = () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Bulletin' })],
      }),
    );
    this.props.navigation.navigate('Bulletin');
  };

  search = () => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Search' })],
      }),
    );
    this.props.navigation.navigate('Search');
  };

  Route = (routeName) => {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: routeName })],
      }),
    );
    this.props.navigation.navigate(routeName);
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={Styles.container}>
          <View style={{ backgroundColor: '#4458e4' }}>
            <View style={styles.profilePicMainView}>
              <ImageBackground
                source={profile}
                style={styles.profilePicBackground}
              />
              <Text style={styles.name} allowFontScaling={false}>{this.state.name}</Text>

            </View>
          </View>
          <View style={{ marginLeft: 20, marginTop: 20 }}>
            <TouchableOpacity onPress={()=>this.Route('Search')}>
              <View style={{ flexDirection: 'row', marginBottom: "10%" }}>
                <Image source={search} style={Styles.icon} />
                <Text allowFontScaling={false} style={Styles.txt}>
                  Search
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.Route('Bulletin')}>
              <View style={{ flexDirection: 'row', marginBottom: "10%" }}>
                <Image source={bulletin} style={Styles.icon} />
                <Text allowFontScaling={false} style={Styles.txt}>
                  Bulletins
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>this.Route('Refills')}>
              <View style={{ flexDirection: 'row', marginBottom: "10%" }}>
                <Image source={refills} style={[{
                  height: 28,
                  width: 30,
                  marginRight: "3%",
                }]} />
                <Text allowFontScaling={false} style={Styles.txt}>
                  Refills
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
