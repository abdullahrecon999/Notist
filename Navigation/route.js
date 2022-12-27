import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from '../Screens/AuthStack'
import { HomeScreen } from '../Screens/AppScreens/NotesScreen'
import { AuthContext } from './AuthProvider'
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MainAppStack from '../Screens/MainAppStack';
import { AddNoteScreen } from '../Screens/AppScreens/AddNote'
import { SearchNote } from '../Screens/AppScreens/SearchNote';
import { AddFilesScreen } from '../Screens/AppScreens/AddFileScreen'

const Stack = createNativeStackNavigator();

function Route() {

    const {user, setUser} = useContext(AuthContext);
    const [initializing, setInitializing] = useState(true);

    const onAuthStateChanged = (user) => {
        setUser(user);
        if (initializing) setInitializing(false);
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return null;

  return (
    <NavigationContainer>
      {(user)? (
          <Stack.Navigator>
            <Stack.Screen name="MainApp" component={MainAppStack} options={{headerShown:false}} />
            <Stack.Screen name="AddNotes" component={AddNoteScreen} options={{headerShown:false}} />
            <Stack.Screen name="SearchNote" component={SearchNote} options={{headerShown:false}} />
            <Stack.Screen name="AddFile" component={AddFilesScreen}/>
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="Main" component={AuthStack} options={{headerShown:false}} />
          </Stack.Navigator>
        )
      }
      {/* <Stack.Navigator>
        <Stack.Screen name="Main" component={AuthStack} options={{headerShown:false}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}

export default Route;