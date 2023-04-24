import React, { Component } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
  Platform,
  StatusBar,
  ImageBackground,
  Dimensions,
  SafeAreaView,
  Switch,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
SplashScreen.preventAutoHideAsync();
let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      name: '',
      isEnabled: false,
      light_theme: true,
    };
  }
  async loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  async fetchUser() {
    let theme, name, image;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', data=> {
        theme = data.val().current_theme;
        name = `${data.val().first_name} ${data.val().last_name}`;
      });

    this.setState({
      light_theme: theme == 'light' ? true : false,
      isEnabled: theme == 'light' ? false : true,
      name: name,
    });

  }
  componentDidMount() {
    this.loadFontsAsync();
    this.fetchUser();
  }
  toggleSwitch() {
    const previous_state = this.state.isEnabled;
    const theme = !this.state.isEnabled ? 'dark' : 'light';
    var updates = {};
    updates['/users/' + firebase.auth().currentUser.uid + '/current_theme'] =
      theme;
    firebase.database().ref().update(updates);
    this.setState({
      isEnabled: !previous_state,
      light_theme: previous_state,
    });
  }
  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View
          style={
            this.state.light_theme ? styles.containerLight : styles.container
          }>
          <SafeAreaView style={styles.android} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                style={styles.iconImage}
                source={require('../assets/logo.png')}
              />
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={this.state.light_theme ? styles.appTitleTextLight: styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>
          <View style={styles.screenContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                style={styles.profileImage}
                source={require('../assets/profile_img.png')}
              />
              <Text style={this.state.light_theme ? styles.nameTextLight:styles.nameText}>{this.state.name}</Text>
            </View>
            <View style={styles.themeContainer}>
              <Text style={this.state.light_theme ? styles.themeTextLight: styles.themeText}>Dark Theme</Text>
              <Switch
                style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                trackColor={{
                  false: '#767577',
                  true: this.state.light_theme ? '#eee' : 'white',
                }}
                thumbColor={this.state.isEnabled ? '#ee8249' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => 
                  this.toggleSwitch()
                }
              value = {this.state.isEnabled}
              />
            </View>
            <View style ={{flex:0.3}}/>
          </View>
          <View style ={{flex:0.08}}/>

        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
  },
  containerLight: {
    flex: 1,
    backgroundColor: 'white',
  },
  android: {
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextLight:{
    color: '#15193c',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
  },
  screenContainer: {
    flex: 0.85,
  },
  profileImageContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: RFValue(150),
    height: RFValue(150),
    borderRadius: 70,
  },
  nameContainer: {},
  nameText: {
    color: 'white',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
    marginTop: 20,
    textAlign:"center"
  },  
  nameTextLight: {
    color: '#15193c',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
    marginTop: 20,
    textAlign:"center"

  },
  themeContainer: {
    flex: 0.2,
    justifyContent: 'center',
    marginTop: 20,
    flexDirection: 'row',
  },
  themeText: {
    color: 'white',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
    marginRight: 20,
  },
  themeTextLight:{
    color: '#15193c',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
    marginRight: 20,
  }
});
