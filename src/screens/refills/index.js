import React, {useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import {WebView} from 'react-native-webview';
import MainHeader from '../../components/MainHeader';
import {backBtn} from '../../assets/image';
import styles from './styles';

function WebViewUI(props) {
  const webviewRef = React.useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  // const [canGoForward, setCanGoForward] = useState(false)
  // const [currentUrl, setCurrentUrl] = useState('')

  function webViewgoback() {
    if (webviewRef.current) webviewRef.current.goBack();
  }
  // function webViewNext() {
  //   if (webviewRef.current) webviewRef.current.goForward();
  // }

  function LoadingIndicatorView() {
    return (
      <ActivityIndicator
        color="#4458e4"
        size="large"
        style={styles.ActivityIndicatorStyle}
      />
    );
  }

  return (
    <>
      <View style={{flex: 1}}>
        <MainHeader navigate={props.navigation} title={'Refills'} />
        <SafeAreaView style={styles.flexContainer}>
          {canGoBack ? (
            <View style={styles.tabBarContainer}>
              <Image
                source={backBtn}
                resizeMode="cover"
                style={{width: 30, height: 30}}
              />
              {canGoBack ? (
                <TouchableOpacity onPress={webViewgoback}>
                  <Text style={styles.btn}>Back</Text>
                </TouchableOpacity>
              ) : null}
              {/* {canGoForward ? (  <TouchableOpacity onPress={webViewNext}>
            <Text style={styles.btn}>Next</Text>
          </TouchableOpacity>) : null} */}
            </View>
          ) : null}
          <WebView
            source={{uri: 'https://gotopills.com/gtp-wallgreens-backend'}}
            renderLoading={LoadingIndicatorView}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
              // setCanGoForward(navState.canGoForward)
              // setCurrentUrl(navState.url)
            }}
            startInLoadingState={true}
            ref={webviewRef}
          />
        </SafeAreaView>
      </View>
    </>
  );
}

export default WebViewUI;
