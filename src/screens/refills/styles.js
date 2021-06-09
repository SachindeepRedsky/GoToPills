import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: "center",
    bottom:'25%'
  },
  btn:{ color: "#5c70be",fontSize:20,fontWeight:'bold' },
  flexContainer: {
    flex: 1,
  },
  tabBarContainer: {
    height: 56,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingLeft: 2,
    justifyContent: "flex-start",
    backgroundColor:"#fff"
  },
  button: {
    fontSize: 24,
  },
  arrow: {
    color: "#ef4771",
  },
  icon: {
    width: 20,
    height: 20,
  },
});
export default styles;
