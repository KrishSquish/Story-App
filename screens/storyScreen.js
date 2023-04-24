import React, { Component } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as Speech from 'expo-speech'
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase'

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
  Dimensions,
  ScrollView,
  
} from 'react-native';

SplashScreen.preventAutoHideAsync();
let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class StoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      speakerIcon: 'volume-high-outline',
      speakerColor: 'gray',
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
      .on('value', function (data) {
        theme = data.val().current_theme;
        name = `${data.val().first_name} ${data.val().last_name}`;
      });

    this.setState({
      light_theme: theme == 'light' ? true : false,
      isEnabled: theme == 'light' ? false : true,
      name: name,
    });
  }
  componentDidMount () {
    this.loadFontsAsync();
    this.fetchUser();
  }
    async tts(title,author,story,moral){
      const activeColor=this.state.speakerColor
      this.setState({speakerColor:activeColor=="gray"?"#ee8249":"gray"})
      if (activeColor == "gray"){
        Speech.speak(`${title} by ${author} `)
        Speech.speak(story)
        Speech.speak(`The moral of the story is !`)
        Speech.speak(moral)
      }
      else{
        Speech.stop()
      }
    }
  render() {
    if (!this.props.route.params) {
      this.props.navigation.navigate('Home');
    } else if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.android} />
          <View style = {styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                style={styles.iconImage}
                source={require('../assets/logo.png')}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style = {this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>StoryTelling App</Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView style = {this.state.light_theme ? styles.storyCardLight : styles.storyCard}>
              <Image
                style={styles.image}
                source={require('../assets/story_image_1.png')}></Image>
              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text style = {this.state.light_theme ? styles.storyTitleTextLight : styles.storyTitleText}>
                    {this.props.route.params.story.value.title}
                  </Text>
                  <Text style = {this.state.light_theme ? styles.storyAuthorTextLight : styles.storyAuthorText}>
                    {this.props.route.params.story.value.author}
                  </Text>
                  <Text style = {this.state.light_theme ? styles.storyAuthorTextLight : styles.storyAuthorText}>
                    {this.props.route.params.story.value.created_on}
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity onPress={() => {
                    this.tts(
                      this.props.route.params.story.value.title, 
                      this.props.route.params.story.value.author,
                      this.props.route.params.story.value.story,
                      this.props.route.params.story.value.moral
                    )

                  }}>
                    <Ionicons
                      name={this.state.speakerIcon}
                      size={RFValue(30)}
                      color={this.state.speakerColor}
                      style={{ margin: RFValue(20) }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.storyTextContainer}>
                <Text style = {this.state.light_theme ? styles.storyTextLight : styles.storyText}>
                  {this.props.route.params.story.value.story}
                </Text>
                <Text style = {this.state.light_theme ? styles.moralTextLight : styles.moralText}>
                  {this.props.route.params.story.value.moral}
                </Text>
              </View>
              <View style={styles.actionContainer}>
                <View style={styles.likeButton}>
                  <Ionicons name={'heart'} size={RFValue(30)} color={'white'} />
                  <Text style={styles.likeText}>{this.props.route.params.story.value.likes}</Text>
                </View>
              </View>
            </ScrollView>
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
  android: {
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },
  appTitle: {
    flexDirection: 'row',
    flex: 0.07,
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
    color: '#2f345d',
    fontSize: RFValue(30),
    fontFamily: 'Bubblegum-Sans',
  },
  storyContainer: {
    flex: 1,
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: '#2f345d',
    borderRadius: RFValue(20),
  },
  storyCardLight:{
    margin: RFValue(20),
    backgroundColor: 'white',
    borderRadius: RFValue(20),
  },
  image: {
    width: '100%',
    height: RFValue(200),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  dataContainer: {
    flexDirection: 'row',
    padding: RFValue(20),
  },
  titleTextContainer: {
    flex: 0.8,
  },
  storyTitleText: {
    color: 'white',
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    textDecorationLine:"underline",
    fontWeight:"bold"
  },
  storyTitleTextLight:{
    color: '#2f345d',
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    textDecorationLine:"underline",
    fontWeight:"bold"
  },
  storyAuthorText: {
    color: ' white',
    fontSize: RFValue(20), 
    fontFamily: 'Bubblegum-Sans',
    fontStyle:"italic"
  },
  storyAuthorTextLight:{
    color: ' #2f345d',
    fontSize: RFValue(20), 
    fontFamily: 'Bubblegum-Sans',
    fontStyle:"italic"
  },
  iconContainer: {
    flex: 0.2,
  },
  storyTextContainer: { padding: RFValue(20) },
  storyText: {
    color: 'lavender',
    fontSize: RFValue(18),
    fontFamily: 'Bubblegum-Sans',
  },
  storyTextLight:{
    color: 'tangerine',
    fontSize: RFValue(18),
    fontFamily: 'Bubblegum-Sans',
  },
  moralText: {
    color: 'tomato',
    fontSize: RFValue(22),
    fontFamily: 'Bubblegum-Sans',
  },
  moralTextLight:{
    color: 'lavender',
    fontSize: RFValue(22),
    fontFamily: 'Bubblegum-Sans',
  },
  actionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: RFValue(10),
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: 'row',
    backgroundColor: '#eb3948',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(30),
  },
  likeText: {
    color: 'white',
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    marginLeft:RFValue(10)
  },
});
