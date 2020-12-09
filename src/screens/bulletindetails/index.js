import React, {Component} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import MainHeader from '../../components/MainHeader';
import * as api from '../../api/bulletin-service';
import styles from './styles';
import HTMLView from 'react-native-htmlview';
import {deviceWidth} from '../../utility';
import {Dimensions, PixelRatio} from 'react-native';

function renderNode(node, index, siblings, parent, defaultRenderer) {
  // if (node.name == undefined) {
  //   return null
  // }
}

export default class BulletinDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bulletin: {},
      header: 'Searching...',
      isLoading: false,
      skip: 0,
      width: PixelRatio.roundToNearestPixel(deviceWidth),
      fromBD: false,
    };
  }
  componentDidMount() {
    this.getbullprops();
  }
  componentDidUpdate() {
    this.getbullprops();
  }
  getbullprops() {
    try {
      let bullID = this.props.navigation.state.params.bullID;
      if (
        bullID !== undefined &&
        bullID !== '' &&
        this.state.fromBD === false
      ) {
        this.setState({
          fromBD: true,
        });
        this.getBullitenById(bullID);
      }
    } catch {}
  }
  UNSAFE_componentWillReceiveProps() {
    this.setState({
      bulletin: {},
      header: 'Searching...',
      isLoading: false,
      skip: 0,
      width: PixelRatio.roundToNearestPixel(deviceWidth),
      fromBD: false,
    });
  }
  getBullitenById = async (bullID) => {
    this.setState({isLoading: true});
    try {
      let data = await api.bulletinByID(bullID);
      this.setState({
        fromBD: true,
        bulletin: data,
        header: data.brandName,
        isLoading: false,
      });
    } catch {
    }
  };

  render() {
    return (
      <View style={styles.MainBox}>
        <MainHeader
          navigate={this.props.navigation}
          title={this.state.header}
          searchNavigationRougt={'Search'}
          searchNavigationParams={this.state.bulletin.brandName}
        />
        <ScrollView style={{margin: 12}}>
          <View style={styles.Item1}>
            <Text style={styles.datatext}>{'Generic Name:'}</Text>
            <Text style={styles.titleText}>
              {this.state.bulletin && this.state.bulletin.GenericName
                ? this.state.bulletin.GenericName
                : 'Searching...'}
            </Text>
          </View>
          <View style={styles.Item1}>
            <Text style={styles.datatext}>{'Drug Category:'}</Text>
            <Text style={styles.titleText}>
              {this.state.bulletin && this.state.bulletin.drugCat
                ? this.state.bulletin.drugCat
                : 'Searching...'}
            </Text>
          </View>
          <View style={styles.Item1}>
            <Text style={styles.datatext}>{'Litigation Alert Level:'}</Text>
            <Text style={styles.titleText}>
              {this.state.bulletin && this.state.bulletin.litAlertLvl
                ? this.state.bulletin.litAlertLvl
                : 'Searching...'}
            </Text>
          </View>
          <View style={styles.Item}>
            <View>
              <Text style={styles.datatext}>{'Cautionary Conditions:'}</Text>
            </View>
            <Text style={styles.titleText1}>
              {this.state.bulletin && this.state.bulletin.excond
                ? this.state.bulletin.excond
                : 'Searching...'}
            </Text>
          </View>
          <View style={styles.Item}>
            <View>
              <Text style={styles.datatext}>{'Off-label Uses:'}</Text>
            </View>
            <Text style={styles.titleText1}>
              {this.state.bulletin && this.state.bulletin.uses
                ? this.state.bulletin.uses
                : 'Searching...'}
            </Text>
          </View>
          <View style={styles.Item}>
            <View style={{flexWrap: 'wrap'}}>
              <Text style={styles.datatext}>{'Approved Uses:'}</Text>
            </View>
            <Text style={styles.titleText1}>
              {this.state.bulletin && this.state.bulletin.approvedUse ? (
                <View
                  style={{
                    width: this.state.width - 25,
                    flexWrap: 'wrap',
                  }}>
                  <HTMLView
                    addLineBreaks={false}
                    value={this.state.bulletin.approvedUse}
                    stylesheet={stylesHtml}></HTMLView>
                </View>
              ) : (
                <Text style={styles.titleText1}>{'Searching...'}</Text>
              )}
            </Text>
          </View>
          <View style={styles.Item}>
            <View>
              <Text style={styles.datatext}>{'Off-label Uses:'}</Text>
            </View>
            <Text style={styles.titleText1}>
              {this.state.bulletin && this.state.bulletin.offLabelUse ? (
                <View
                  style={{
                    width: this.state.width - 25,
                    flexWrap: 'wrap',
                  }}>
                  <HTMLView
                    addLineBreaks={false}
                    value={this.state.bulletin.offLabelUse}
                    stylesheet={stylesHtml}></HTMLView>
                </View>
              ) : (
                <Text style={styles.titleText1}>{'Searching...'}</Text>
              )}
            </Text>
          </View>
          <View style={styles.Item}>
            <View>
              <Text style={styles.datatext}>{'Adverse Events:'}</Text>
            </View>
            {this.state.bulletin && this.state.bulletin.adverseEvents ? (
              <View
                style={{
                  width: this.state.width - 25,
                  flexWrap: 'wrap',
                }}>
                <HTMLView
                  addLineBreaks={false}
                  value={this.state.bulletin.adverseEvents}
                  renderNode={renderNode}></HTMLView>
              </View>
            ) : (
              <Text style={styles.titleText1}>{'Searching...'}</Text>
            )}
          </View>

          <View style={[styles.Item, {width: this.state.width - 25}]}>
            <View>
              <Text style={styles.datatext}>{'Litigation:'}</Text>
            </View>
            {this.state.bulletin && this.state.bulletin.litigation ? (
              <HTMLView
                addLineBreaks={false}
                value={this.state.bulletin.litigation}
                stylesheet={stylesHtml}></HTMLView>
            ) : (
              <Text style={styles.titleText1}>{'Searching...'}</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const stylesHtml = StyleSheet.create({
  body: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
    margin: 0,
    padding: 0,
  },
});
