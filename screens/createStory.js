import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { RFValue } from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from 'firebase'
let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class CreateStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      previewImage: 'image_1',
      dropDownHeight: 40,
      light_theme: true,
      name:''
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
      .on('value', data => {
        theme = data.val().current_theme;
        name = `${data.val().first_name} ${data.val().last_name}`;
      });

    this.setState({
      light_theme: theme == 'light' ? true : false,
      isEnabled: theme == 'light' ? false : true,
      name: name,
    });
  }
  async addStory(){
    if (this.state.title && this.state.moral && this.state.description && this.state.story){

      var d = new Date()
      let storyData = {
        preview_image:this.state.previewImage,
        title:this.state.title,
        description:this.state.description,
        story:this.state.story,
        moral:this.state.moral,
        author:this.state.name,
        created_on:d.toString(),
        author_uid:firebase.auth().currentUser.uid,
        likes:0
      }
      console.log(this.state.name)
      console.log(storyData)
      await firebase.database()
      .ref("/posts/"+(Math.random().toString(36).slice(2)))
      .set(storyData)
      .then(function(snapshot){

      })
      this.props.navigation.navigate("Feed")

    }
    else{
      alert("Please fill out all the fields")
      Alert.alert(
        "Error",
        "please fill out all the fields",
        [
          {text:"OK", onPress:()=>console.log("Okay pressed")},
        ],
        {cancelable:false}
      )
    }
  }

  componentDidMount() {
    this.loadFontsAsync();
    this.fetchUser();

  }
  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      let preview_images = {
        image_1: require('../assets/story_image_1.png'),
        image_2: require('../assets/story_image_2.png'),
        image_3: require('../assets/story_image_3.png'),
        image_4: require('../assets/story_image_4.png'),
        image_5: require('../assets/story_image_5.png'),
      };
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
                source={require('../assets/logo.png')}></Image>
            </View>
            <View style={styles.textContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.appTitleTextLight
                    : styles.appTitleText
                }>
                New Story
              </Text>
            </View>
          </View>
          <View style={styles.fieldsContainer}>
            <ScrollView>
              <Image
                source={preview_images[this.state.previewImage]}
                style={styles.previewImage}></Image>
              <View style={{ height: RFValue(this.state.dropDownHeight) }}>
                <DropDownPicker
                  items={[
                    { label: 'Image 1', value: 'image_1' },
                    { label: 'Image 2', value: 'image_2' },
                    { label: 'Image 3', value: 'image_3' },
                    { label: 'Image 4', value: 'image_4' },
                    { label: 'Image 5', value: 'image_5' },
                  ]}
                  defaultValue={this.state.previewImage}
                  open={this.state.dropDownHeight == 170 ? true : false}
                  onOpen={() => {
                    this.setState({ dropDownHeight: 170 });
                  }}
                  onClose={() => {
                    this.setState({ dropDownHeight: 40 });
                  }}
                  style={
                    this.state.light_theme
                      ? styles.dropDownLight
                      : styles.dropDown
                  }
                  textStyle={{
                    color: this.state.dropDownHeight == 170 ? 'black' : 'tomato',
                    fontFamily: 'Bubblegum-Sans',
                  }}
                  onSelectItem={(item) => {
                    this.setState({ previewImage: item.value });
                  }}
                />
              </View>
              <TextInput
              //style={ this.state.light_theme ? styles.containerLight : styles.container}
                style={[this.state.light_theme ? styles.inputFontLight : styles.inputFont, { marginTop: 28 }]}
                onChangeText={(title) => {
                  this.setState({ title });
                }}
                placeholder={'Title : '}
                placeholderTextColor={
                  this.state.light_theme ? 'tomato' : 'white'
                }
              />
              <TextInput
                style={[
                  this.state.light_theme ? styles.inputFontLight : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(description) => {
                  this.setState({ description });
                }}
                placeholder={'Description : '}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={
                  this.state.light_theme ? 'tomato' : 'white'
                }
              />
              <TextInput
                style={[
                  this.state.light_theme ? styles.inputFontLight : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(story) => {
                  this.setState({ story });
                }}
                multiline={true}
                numberOfLines={20}
                placeholder={'Story : '}
                placeholderTextColor={
                  this.state.light_theme ? 'tomato' : 'white'
                }
              />
              <TextInput
                style={[
                  this.state.light_theme ? styles.inputFontLight : styles.inputFont,
                  styles.inputFontExtra,
                  styles.inputTextBig,
                ]}
                onChangeText={(moral) => {
                  this.setState({ moral });
                }}
                placeholder={'Moral of the Story : '}
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={
                  this.state.light_theme ? 'tomato' : 'white'
                }
              />
            </ScrollView>
            <TouchableOpacity
            onPress={()=>{
              this.addStory()
            }}
              style={
                this.state.light_theme
                  ? styles.submitButtonLight
                  : styles.submitButton
              }>
              <Text
                style={
                  this.state.light_theme
                    ? styles.submitButtonTextLight
                    : styles.submitButtonText
               }>
                Submit Story
              </Text>
            </TouchableOpacity>
          </View>
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
    paddingTop: 10,
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextLight: {
    color: 'tomato',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
  },
  fieldsContainer: {
    flex: 0.85,
  },
  dropDown: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
  },
  dropDownLight: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'tomato',
  },
  previewImage: {
    width: '85%',
    height: RFValue(200),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  inputFont: {
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    borderColor: 'white',
    paddingLeft: RFValue(10),
    color: 'white',
    fontFamily: 'Bubblegum-Sans',
  },
  inputFontLight:{
    borderWidth: RFValue(1),
    borderRadius: RFValue(10),
    borderColor: 'tomato',
    paddingLeft: RFValue(10),
    color: 'tomato',
    fontFamily: 'Bubblegum-Sans',
  },
  inputFontExtra: {
    marginTop: RFValue(15),
  },
  inputTextBig: {
    textAlignVertical: 'top',
    padding: RFValue(5),
  },
  submitButton: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: RFValue(10),
    marginBottom: RFValue(10),
    borderRadius: RFValue(20),
    width: '70%',
    alignSelf: 'center',
  },
  submitButtonLight:{
    backgroundColor: 'tomato',
    alignItems: 'center',
    marginTop: RFValue(10),
    marginBottom: RFValue(10),
    borderRadius: RFValue(20),
    width: '70%',
    alignSelf: 'center',
  },
  submitButtonText: {
    fontFamily: 'Bubblegum-sans',
    fontSize: RFValue(25),
    margin: RFValue(10),
    color: '#15193c',
  },
  submitButtonTextLight:{
    fontFamily: 'Bubblegum-sans',
    fontSize: RFValue(25),
    margin: RFValue(10),
    color: 'white',
  },
});
