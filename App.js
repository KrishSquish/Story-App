import * as React from 'react';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from "./navigation/DrawerNavigation";
global.__reanimatedWorkletInit = () => {};
import firebase from "firebase"
import {firebaseConfig} from "./config"
//if (!firebase){
  firebase.initializeApp(firebaseConfig)
//}

const Stack = createStackNavigator();
const StackNav = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false, gestureEnabled:false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="Dashboard" component={DrawerNavigator} />
    </Stack.Navigator>
  );
};

export default function App() {
  return ( 
    <NavigationContainer>
      <StackNav />
    </NavigationContainer>
  );
}