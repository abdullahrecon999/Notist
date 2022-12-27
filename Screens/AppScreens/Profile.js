import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../../Navigation/AuthProvider'
import { Button } from 'react-native-elements'
import { Appbar } from 'react-native-paper';
import { Surface, Text } from 'react-native-paper';

export const Profile = ({ navigation }) => {

  const {user, logout} = useContext(AuthContext)

  return (
    <View style={{backgroundColor:'#EFFDF3', flex:1}}>
      <Appbar.Header style={{backgroundColor:'#6DDD9D'}}>
        <Appbar.Content title="Profile" />
      </Appbar.Header>

      <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
        <Surface style={styles.surface} elevation={4}>
          <View style={{flexDirection:'row', marginBottom:10}}>
            <Text style={{fontSize:16, backgroundColor:'#F9D62E', color:'#5B9A4C'}}>Email: </Text>
            <Text style={{fontSize:16, backgroundColor:'#5B9A4C', color:'#F9D62E'}}>{user.email}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={{fontSize:14, backgroundColor:'#F9D62E', color:'#5B9A4C'}}>UserID: </Text>
            <Text style={{fontSize:15, backgroundColor:'#5B9A4C', color:'#F9D62E'}}>{user.uid}</Text>
          </View>
        </Surface>

        <View style={{padding:20}}>
          <Button title="Logout" onPress={()=>logout()} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  surface: {
    padding: 10,
    height: '20%',
    width: '91%',
    justifyContent: 'center',
    alignItems:'center'
  },
});