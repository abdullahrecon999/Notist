import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NotesScreen } from './AppScreens/NotesScreen'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppContext } from '../Navigation/AppContext';
import { Button } from 'react-native-elements'
import { useIsFocused } from '@react-navigation/native';
import { FilesScreen } from './AppScreens/FileScreen'
import { Profile } from './AppScreens/Profile'
import { QuotesScreen } from './AppScreens/Quotes';

const Tab = createBottomTabNavigator();

function AddNoteScreen() {
  return (
    <View>
        <Text>Not Here!</Text>
    </View>
  );
}

function MainAppStack({ navigation }) {

    const [screenName, setScreenName] = useState('Notes')

    useEffect(()=>{
        console.log(screenName)
    },[screenName])

  return (
    <AppContext.Provider value={{screenName, setScreenName}}>
        <Tab.Navigator screenOptions={{
        tabBarShowLabel:false,
        tabBarStyle: {
            position:'absolute',
            bottom:5,
            marginHorizontal:5,
            height:50,
            borderRadius:10,
            backgroundColor:'#6DDD9D',
            // marginTop:5,
            paddingHorizontal:10
        }}
        } >
        <Tab.Screen name="Notes" component={NotesScreen} options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
            return <Icon 
                name='note-outline' 
                size={25} 
                color={(focused)? 'black' : 'grey' }  
            />
            }
        }}
        />
        <Tab.Screen name="Files" component={FilesScreen} 
            options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
            return <Icon 
                name='file-cloud-outline' 
                size={25} 
                color={(focused)? 'black' : 'grey' }  
            />
            }
        }}
        />
        <Tab.Screen name="AddNote" component={AddNoteScreen} 
            options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => (
            <TouchableOpacity onPress={() => 
            {
                (screenName === 'Note')? navigation.navigate('AddNotes'):navigation.navigate('AddFile')
            }}>
                <View style={{
                borderWidth:3,
                borderRadius:50,
                justifyContent:'center',
                alignItems:'center',
                width:60,
                height:60,
                top:-15,
                backgroundColor:'#EFFDF3',
                borderColor:'#6DDD9D',
                elevation:15,
                }}>
                <Icon name='plus' size={50} color={'grey'} />
                </View>
            </TouchableOpacity>
            )
        }}
        />
        <Tab.Screen name="Quotes" component={QuotesScreen} 
            options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
            return <Icon 
                name='comment-quote' 
                size={25} 
                color={(focused)? 'black' : 'grey' }  
            />
            }
        }}
        />
        <Tab.Screen name="Profile" component={Profile} 
            options={{
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
            return <Icon 
                name='account-circle-outline' 
                size={25} 
                color={(focused)? 'black' : 'grey' }  
            />
            }
        }}
        />
        </Tab.Navigator>
    </AppContext.Provider>
  );
}

export default MainAppStack;