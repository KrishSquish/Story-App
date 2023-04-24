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

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme: false,
      story_id: this.props.story.key,
      story_data: this.props.story.value,
      is_liked: false,
      likes: this.props.story.value.likes,
    };
  }
  async loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  likeAction = () => {
    if (this.state.is_liked) {
      firebase
        .database()
        .ref('posts')
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(-1));
      this.setState({ likes: (this.state.likes -= 1), is_liked: false });
    } else {
      firebase
        .database()
        .ref('posts')
        .child(this.state.story_id)
        .child('likes')
        .set(firebase.database.ServerValue.increment(1));
      this.setState({ likes: (this.state.likes += 1), is_liked: true });
    }
  };
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
  componentDidMount() {
    this.loadFontsAsync();
    this.fetchUser();
  }
  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();

      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() => {
            this.props.navigation.navigate('StoryScreen', {
              story: this.props.story,
            });
          }}>
          <SafeAreaView style={styles.android} />
          <View
            style={
              this.state.light_theme
                ? styles.cardContainerLight
                : styles.cardContainer
            }>
            <Image
              style={styles.storyImage}
              source={require('../assets/story_image_1.png')}></Image>
            <View style={styles.titleContainer}>
              <Text
                style={
                  this.state.light_theme
                    ? styles.storyTitleLight
                    : styles.storyTitle
                }>
                {this.props.story.value.title}
              </Text>
              <Text
                style={
                  this.state.light_theme
                    ? styles.storyAuthorLight
                    : styles.storyAuthor
                }>
                {this.props.story.value.author}
              </Text>
              <Text
                style={
                  this.state.light_theme
                    ? styles.descriptionLight
                    : styles.description
                }>
                {this.props.story.value.description}
              </Text>
            </View>
            <View style={styles.actionContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.likeAction();
                }}
                style={
                  this.state.is_liked
                    ? styles.likeButtonLiked
                    : styles.likeButtonDisliked
                }>
                <Ionicons
                  name={'heart'}
                  size={RFValue(30)}
                  color={this.state.light_theme ? 'black' : 'white'}
                />
                <Text
                  style={
                    this.state.light_theme
                      ? styles.likeTextLight
                      : styles.likeText
                  }>
                  {this.props.story.value.likes}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  }
  q;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  android: {
    marginTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0,
  },
  cardContainer: {
    backgroundColor: '#2f345d',
    margin: RFValue(15),
    borderRadius: RFValue(20),
    paddingTop: RFValue(10),
  },
  cardContainerLight: {
    backgroundColor: '#B9BBB6',
    margin: RFValue(15),
    borderRadius: RFValue(20),
    paddingTop: RFValue(10),
  },
  storyImage: {
    resizeMode: 'contained',
    width: '95%',
    height: RFValue(250),
    alignSelf: 'center',
    borderRadius: RFValue(20),
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: 'center',
    paddingTop: 20,
  },
  storyTitle: {
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
  },
  storyTitleLight: {
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    color: '#eb3948',
  },
  storyAuthor: {
    fontSize: RFValue(18),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
  },
  storyAuthorLight: {
    fontSize: RFValue(18),
    fontFamily: 'Bubblegum-Sans',
    color: '#eb3948',
  },
  description: {
    fontSize: RFValue(13),
    fontFamily: 'Bubblegum-Sans',
    color: 'tomato',
    paddingTop: RFValue(10),
  },
  descriptionLight: {
    fontSize: RFValue(13),
    fontFamily: 'Bubblegum-Sans',
    color: 'tomato',
    paddingTop: RFValue(10),
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(10),
  },
  likeButtonLiked: {
    width: RFValue(160),
    height: RFValue(40),
    backgroundColor: '#eb3948',
    borderRadius: RFValue(30),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButtonDisliked: {
    width: RFValue(160),
    height: RFValue(40),
    borderColor: '#eb3948',
    borderRadius: RFValue(30),
    flexDirection: 'row',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeText: {
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
    marginLeft: RFValue(5),
  },
  likeTextLight: {
    fontSize: RFValue(25),
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
    marginLeft: RFValue(5),
  },
});
