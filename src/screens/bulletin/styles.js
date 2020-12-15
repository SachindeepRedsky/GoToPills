import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({

  Item: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'red',
  },
  datatext: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  datatext1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingTop: 12,
  },
  boderline: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
});
export default styles;
