import { Platform, Alert } from 'react-native';
import { Dimensions, PixelRatio } from 'react-native';
import * as titles from '../constants/title';
export var deviceHeight = Dimensions.get('window').height;
export var deviceWidth = Dimensions.get('window').width;

export const getPageLimit = () => {
    return 10;
};

export const isFieldEmpty = text => {
    if (text == '') {
        return true;
    }
    return false;
};
export const passwordPattern = password => {
    const reg = /.*[0-9]+.*/i;
    if (reg.test(password) === true) {
        return true;
    }
    return false;
};

export const isValidEmail = email => {
    var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (reg.test(email) != true) {
        return true;
    }
    return false;
};


export let isValidOtp = otp => {
    if (otp.length < 4) {
        return false;
    }
    return true;
};

export const isValidPhoneNumber = phoneNo => {
    if (phoneNo.length < 8) {
        return false;
    }
    return true;
};

export const isValidComparedPassword = (newpassword, confirmPassword) => {
    if (newpassword != confirmPassword) {
        return true;
    }
    return false;
};
export const getOS = () => {
    if (Platform.OS === 'ios') {
        return 'ios';
    }
    return 'android';
};

export const showAlert = message => {
    Alert.alert(
        titles.APP_NAME,
        message,
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
    );
};

export const showAlertWithCallBack = (msg, onOkClick) => {
    Alert.alert(
        '',
        msg,
        [
            {
                text: 'OK',
                onPress: () => {
                    console.log(' CLICK CALLED ');
                    onOkClick();
                },
            },
        ],
        {
            cancelable: false,
        },
    );
};

export const widthPercentageToDP = widthPercent => {
    const screenWidth = Dimensions.get('window').width;
    const elemWidth = parseFloat(widthPercent);
    return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};
export const heightPercentageToDP = heightPercent => {
    const screenHeight = Dimensions.get('window').height;
    // Convert string input to decimal number
    const elemHeight = parseFloat(heightPercent);
    return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

