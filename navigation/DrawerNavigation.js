import React, {Component} from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import StackNavigator from './stackNavigator';
import Logout from '../screens/logout';
//import TabNavigator from "./TabNavigator"
import Profile from '../screens/profile';
import firebase from 'firebase';
import CustomSideBarMenu from '../screens/CustomSideBarMenu'
const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends Component {
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
  }
  render() {
    let props = this.props
    return (
    <Drawer.Navigator
    drawerContent = {props => <CustomSideBarMenu {...props}/>}
    screenOptions = {{
      drawerActiveTintColor:"#e91e63",
      drawerInactiveTintColor:"gray",
      itemStyle:{marginVerticle:5,},
      
    }}
    >
      <Drawer.Screen name="Home" component={StackNavigator} options = {{unmountOnBlur:true}} />
      <Drawer.Screen name="Profile" component={Profile} options = {{unmountOnBlur:true}}/>
      <Drawer.Screen name="Logout" component={Logout} options = {{unmountOnBlur:true}}/>
    </Drawer.Navigator>
  )
}

  }
