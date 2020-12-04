import {StyleSheet} from 'react-native';
import {spacings} from '../../constants/fonts';
import * as colors from '../../constants/colors';

const styles = StyleSheet.create({
  MainBox: {
    flex: 1,
    marginTop: '2%',
  },
alert:{
  flexDirection: 'row',
  // alignItems: 'center',
  marginTop: 15,
},
  menuicon: {
    width: 15,
    height: 15,
    marginLeft: 10,
  },
  Item1: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 15,
  },
  pickericon: {
    alignSelf: 'center',
    height: 15,
    width: 20,
  },
  pickericon2: {
    // alignSelf: 'center',
    height: 15,
    width: 20,
  },
  SubView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  datatext: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    lineHeight: 25,
  },
  titleText: {
    marginLeft: '1%',
    fontSize: 14,
    paddingTop: 1,
    lineHeight: 25,
  },
  datatext1: {
    alignItems: 'center',
  },
  datatext12: {
    color: 'black',
    alignItems: 'center',
  },
  TextView: {
    flex: 1,
    flexDirection: 'row',

    margin: 10,
  },
  Button: {
    marginTop: 40,
    backgroundColor: colors.btnColor,
    height: 40,
    borderRadius: 8,
  },
  ButtonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5987',
    paddingTop: 5,
  },
  container: {
    flex: 1,
    // alignItems:'center'
    width: '100%',
    height: '100%',
  },
  textstyle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#8ea6e6',
    textAlign: 'center',
    marginTop: spacings.xxsmall,
    marginBottom: spacings.medium,
  },
  menuicon: {
    width: 15,
    height: 15,
    marginLeft: 10,
  },
  inputBox: {
    //borderBottomWidth:2,
    width: '100%',
    height: 40,
    // borderBottomWidth: 2,
    // borderBottomColor: '#dadada',
    padding: 0,
  },
  horizontalline: {
    // marginLeft: 13,
    width: '100%',
    height: 1,
    backgroundColor: '#dadada',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,

    elevation: 1,
  },
  dropDownLine: {
    width: '80%',
    height: 1,
    backgroundColor: '#adadad',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
    alignSelf: 'flex-end',
  },
  dropDownLine1: {
    width: '80%',
    height: 1,
    backgroundColor: '#adadad',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  Text: {
    fontSize: 16,
    color: '#006596',
    marginBottom: 5,
    width: '100%',
  },
  Textinputbox: {
    color: '#a0a0a0',
    paddingTop: 16,
  },
  inputView: {
    //flex:1,
    //justifyContent:'center',
    //marginTop:20,
    alignItems: 'stretch',
    width: '100%',
    height: '100%',
  },
  middleView: {
    flex: 1,
    flexDirection: 'row',
  },
  MiddleFirstView: {
    flex: 0.5,
  },
  MiddleSecondView: {
    flex: 0.5,
  },
  inputBox1: {
    borderBottomWidth: 2,
    borderBottomColor: '#dadada',
    width: '90%',
    height: 30,
    padding: 0,
  },
  focusedInputBox1: {
    borderBottomWidth: 2,
    borderBottomColor: colors.headerColor,
    width: '80%',
    height: 30,
    padding: 0,
  },
  dropDown: {
    height: 50,
    width: '80%',
    alignSelf: 'flex-end',
    marginTop: 15,
  },
  PickerView1: {
    borderBottomWidth: 2,
    borderBottomColor: '#dadada',
    flexDirection: 'row',
  },
  dropDown1: {
    color: colors.blackColor,
    backgroundColor: 'red',
  },
  Button: {
    marginTop: 25,
    backgroundColor: colors.btnColor,
    width: '100%',
    height: 45,
    borderRadius: 8,
  },
  ButtonText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5987',
    paddingTop: 5,
  },
  BottomView: {
    alignItems: 'center',
    height: 200,
    marginTop: 5,
  },
  buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  BottomText: {
    color: colors.headerColor,
    fontSize: 12,
    textDecorationLine: 'underline',
    //  letterSpacing:1
  },
  // autoCompleteContainer: {
  //   height: 10,
  //   backgroundColor:'red'
  // },

  autoCompleteContainer: {
    height: 0,
  },
  autoCompleteContainerAuto: {
    height: 'auto',
  },
  autoCompleteContainer1: {
    height: 0,
  },
  autoCompleteContainer1Auto: {
    height: 'auto',
  },
  autocompleteText: {
    width: '100%',
    height: 40,
    fontSize: 16,
  },
  autocompleteListContainerStyle: {
    width: '100%',
    borderWidth: 0,
  },
  autocompleteListStyle: {
    width: '100%',
    marginLeft: 0,
    backgroundColor: '#fafafa',
  },
  autocompleteInputContainer: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
  },
});
export default styles;
