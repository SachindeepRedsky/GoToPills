import React, {Component} from 'react';
import {View, Image} from 'react-native';
import styles from './styles';
import {mainLogo} from '../../assets/image';

export default class Splash extends Component {
  componentDidMount() {
    this.timeoutHandle = setTimeout(() => {
      this.props.navigation.navigate('Search');
    }, 2000);
  }

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }
  componentWillUnmount() {
    clearTimeout(this.timeoutHandle);
  }
  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.logoContainer}>
          <Image source={mainLogo} style={styles.logo} />
        </View>
      </View>
    );
  }
}
