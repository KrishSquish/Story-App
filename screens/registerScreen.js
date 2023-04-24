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
export default class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      email: '',
      password: '',
      userSignedIn: false,
      first_name:'',
      last_name:'',
      confirmPassword:''
    };
  }
  async loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    this.loadFontsAsync();
  }
  registerUser = async (email, password, confirmPassword,first_name,last_name) => {
    if (password == confirmPassword){

    
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("User Registered!!")
        this.props.navigation.replace('Login');
        firebase.database()
        .ref("/users/"+userCredential.user.uid)
        .set({
          email:userCredential.user.email,
          first_name:first_name,
          last_name:last_name,
          current_theme:"dark"
        })
      })
      .catch((error) => {
        alert(error.message);
      });
      }
      else{
        alert("Passwords do not match!")
      }

  };

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      const { email, password,confirmPassword ,first_name, last_name } = this.state;

      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.android} />

          <Text style={styles.appTitleText}>Register</Text>
          <TextInput
            style={styles.textInput}
            placeholder={'Enter First Name'}
            placeholderTextColor={'white'}
            autoFocus
            onChangeText={(text) => {
              this.setState({
                first_name: text,
              });
            }}
          />          <TextInput
            style={styles.textInput}
            placeholder={'Enter Last Name'}
            placeholderTextColor={'white'}
            autoFocus
            onChangeText={(text) => {
              this.setState({
                last_name: text,
              });
            }}
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
                    <TextInput
            style={[styles.textInput, { marginTop: RFValue(10) }]}
            placeholder={'Re-Enter Password'}
            placeholderTextColor={'white'}
            secureTextEntry
            onChangeText={(text) => {
              this.setState({
                confirmPassword: text,
              });
            }}
          />
          //Ended class here
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.registerUser(email, password, confirmPassword,first_name,last_name);
            }}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}>
            <Text style={styles.newUser}>Already a User?</Text>
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
    marginTop:RFValue(10)
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
    marginTop:RFValue(5)  },
  newUser: {
    alignSelf: 'center',
    fontSize: RFValue(15),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
    marginTop:RFValue(15),
    textDecorationLine:"underline"
    
  },
});
