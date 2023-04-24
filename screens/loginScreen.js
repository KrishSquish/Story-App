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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';

SplashScreen.preventAutoHideAsync();
let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};
export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      email: '',
      password: '',
      userSignedIn: false,
    };
  }
  async loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    this.loadFontsAsync();
  }
  signIn = async (email, password) => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("Login Successfull!")
        this.props.navigation.replace('Dashboard');
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      const { email, password } = this.state;

      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.android} />

          <Text style={styles.appTitleText}>Story Telling App</Text>
          <Image
            source={require('../assets/logo.png')}
            style={styles.appIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder={'Enter Email'}
            placeholderTextColor={'white'}
            autoFocus
            onChangeText={(text) => {
              this.setState({
                email: text,
              });
            }}
          />
          <TextInput
            style={[styles.textInput, { marginTop: RFValue(10) }]}
            placeholder={'Enter Password'}
            placeholderTextColor={'white'}
            secureTextEntry
            onChangeText={(text) => {
              this.setState({
                password: text,
              });
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.signIn(email, password);
            }}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('RegisterScreen');
            }}>
            <Text style={styles.newUser}>New User?</Text>
          </TouchableOpacity>
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
  android: {
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(40),
    fontFamily: 'Bubblegum-Sans',
    textAlign: 'center',
    marginBottom: RFValue(20),
  },
  appIcon: {
    width: RFValue(200),
    height: RFValue(200),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: RFValue(30),
  },
  textInput: {
    alignSelf: 'center',
    width: RFValue(250),
    height: RFValue(50),
    borderColor: 'white',
    borderWidth: RFValue(4),
    borderRadius: RFValue(10),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
    fontSize: RFValue(25),
    padding: RFValue(10),
  },
  button: {
    alignSelf: 'center',
    width: RFValue(180),
    height: RFValue(40),
    backgroundColor: 'white',
    borderRadius: RFValue(30),
    marginTop: RFValue(70),
    alignItems: 'center',
  },
  buttonText: {
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    color: '#15193c',
  },
  newUser: {
    alignSelf: 'center',
    fontSize: RFValue(15),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
    marginTop:RFValue(15),
    textDecorationLine:"underline"
    
  },
});
