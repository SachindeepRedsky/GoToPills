import { Dimensions, StyleSheet } from 'react-native';
const window = Dimensions.get('window');
import * as colors from '../../constants/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from '../../utility/index';
const styles = StyleSheet.create({
    profilePicMainView:{ justifyContent: 'center', alignItems: 'center', marginTop: 48, marginBottom: 50,
 },
    profilePicBackground:{
        height: 100, width: 100,
       
    },
    profilePic:{ height: 160, width: 160, },
    container: {
        height: '100%'
    },
    name:{
        color:colors.whiteColor, fontSize:16,fontWeight:'bold',marginTop:10,
    },
    userDetailView:{ justifyContent: 'center', paddingLeft: 10 },
    color:{ color: colors.whiteColor, },
    divider:{
        ...Platform.select({
            ios: {
                borderWidth: wp('0.5%'),
            },
            android: {
                borderWidth: wp('0.2%'),

            }
        }),
        borderColor: colors.whiteColor,
    },
    txt: {
        fontSize: 20,
        color: colors.greyColor,
    },
    icon: {
        height: 28,
        width: 24,
        marginRight: "6%",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        height: window.height,
     
    },
});
export default styles;
