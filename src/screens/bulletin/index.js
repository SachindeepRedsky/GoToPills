import React, {Component} from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity} from 'react-native';
import MainHeader from '../../components/MainHeader';
import {bulletinStrings} from '../../constants/title';
import * as api from '../../api/bulletin-service';
import styles from './styles';
export default class Bulletin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bullitens: [],
      isLoading: false,
      skip: 0,
    };
  }

  componentDidMount() {
    this.getBullitens(0);
  }
  getBullitens = async (skipc) => {
    this.setState({
      skip: this.state.skip + skipc,
    });
    this.setState({isLoading: true});
    let data = await api.allBulletins(this.state.skip);
    if (this.state.bullitens.length) {
      let r = this.state.bullitens;
      data.forEach((element) => {
        r.push(element);
      });
      this.setState({
        bullitens: r,
        isLoading: false,
      });
    } else {
      this.setState({
        bullitens: data,
        isLoading: false,
      });
    }
  };

  render() {
    const renderItem = ({item}) => (
      // console.log('itemitemitem',item)
      <TouchableOpacity
        onPress={() => {
          this.timerFlatlistRef.scrollToIndex({
            animated: true,
            index: 0,
          }); 
          this.props.navigation.navigate('Bulletindetails', {
            bullID: item.bullID,
            GenericName: item.GenericName,
            brandName: item.brandName,
          });
        }}
        activeOpacity={0.1}
        style={styles.Item}>
        <Text style={styles.datatext}>{item.GenericName}</Text>
        <Text style={styles.datatext1}>{item.brandName}</Text>
      </TouchableOpacity>
    );
    return (
      <View style={{flex: 1}}>
        <MainHeader
          navigate={this.props.navigation}
          title={bulletinStrings.headerTitle}
        />
        <FlatList
           ref={ref => (this.timerFlatlistRef = ref)}
          data={this.state.bullitens}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          initialNumToRender={10}
          onEndReachedThreshold={1200}
          onScrollBeginDrag={() => this.getBullitens(10)} // LOAD MORE DATA
          onMomentumScrollBegin={() => {
            this.onEndReachedCalledDuringMomentum = false;
          }}
          disableVirtualization={false}
          onScrollAnimationEnd={false}
          onEndReached={(distance) => {
            if (!this.onEndReachedCalledDuringMomentum) {
              this.getBullitens(10); // LOAD MORE DATA
              this.onEndReachedCalledDuringMomentum = true;
            }
          }}
        />
      </View>
    );
  }
}
