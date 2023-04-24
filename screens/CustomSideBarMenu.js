import React, { Component } from 'react';
import firebase from 'firebase';

import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
  ImageBackground,
} from 'react-native';

import { RFValue } from 'react-native-responsive-fontsize';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

export default class CustomSideBarMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      light_theme: true,
    };
  }
  componentDidMount() {
    let theme;
    firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', data => {
        theme = data.val().current_theme;
        this.setState({
          light_theme: theme == 'light' ? true : false,
        });
      });
      console.log(theme)
  }

  render() {
    let props = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.light_theme ? 'white' : '#15193c',
        }}>
        <Image
          style={styles.sidemenuIcon}
          source={require('../assets/logo.png')}></Image>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sidemenuIcon: {
    width: RFValue(140),
    height: RFValue(140),
    alignSelf: 'center',
    resizeMode: 'contain',
    borderRadius: RFValue(70),
    marginTop: RFValue(60),
  },
});
