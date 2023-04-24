import React, { Component } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import StoryCard from './StoryCard';
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
} from 'react-native';
SplashScreen.preventAutoHideAsync();
import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native-gesture-handler';
let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};
//let stories = require('./temp_stories.json');

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme:true,
      stories:[]
    };
  }
  async loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  componentDidMount() {
    this.loadFontsAsync();
    this.fetchUser();
    this.fetchStories()
  }
    fetchStories=()=>{
      firebase
      .database()
      .ref("/posts/")
      .on('value', snapshot =>{
        let stories = []
        if(snapshot.val()){
          Object.keys(snapshot.val())
          .forEach(function(i){
            stories.push({
              key:i,
              value:snapshot.val()[i]
              
            })
          })

        }

        this.setState({
          stories:stories
        })

      },
      function(error){
        console.log("read failed: "+error.code)
        alert("read failed: "+error.code)
      }
      )
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
  keyExtractor = (item, index) => {
    index.toString();
  };
  renderItem = ({ item: story }) => {
    return <StoryCard story={story} navigation={this.props.navigation} />;
  };
  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();

      return (
        <View style = {this.state.light_theme ? styles.containerLight : styles.container}>
          <SafeAreaView style={styles.android} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                style={styles.iconImage}
                source={require('../assets/logo.png')}
              />
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style = {this.state.light_theme ? styles.appTitleTextLight : styles.appTitleText}>Story Telling App</Text>
            </View>
          </View>
          <View style={styles.cardContainer}>
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.stories}
              renderItem={this.renderItem}
            />
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
  containerLight:{
    flex:1,
    backgroundColor:"white"
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
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextLight: {
    color: '#15193c',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleTextContainer: {
    justifyContent: 'center',
    flex: 0.5,
  },
  cardContainer: {
    flex: 0.93,
  },
  iconImage: {
    height: '100%',
    width: '100%',
    resizeMode: 'contain',
  },
});
