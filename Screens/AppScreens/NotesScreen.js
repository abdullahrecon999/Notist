import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../Navigation/AuthProvider'
import { useIsFocused } from '@react-navigation/native';
import { Appbar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppContext } from '../../Navigation/AppContext';
import database from '@react-native-firebase/database';
import Modal from "react-native-modal";
import { NoteItem } from '../../Components/UIessentials';
import { Tag } from '../../Components/UIessentials';
database().setPersistenceEnabled(true);

export const NotesScreen = ({ navigation }) => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [isReadModalVisible, setReadModalVisible] = useState(false);

  const toggleModal = (keyValue) => {
    setModalVisible(!isModalVisible);
    setKey(keyValue);
    console.log("Key is: "+selectedKey)
  };

  const {user} = useContext(AuthContext)
  const {screenName, setScreenName} = useContext(AppContext)
  const isFocused = useIsFocused();
  const [data, setData] = useState()
  const [ModData, setModData] = useState()
  const [selectedKey, setKey] = useState('')
  const [modal2, setModal2] = useState()
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('na')

  const removeNote = async (keyValue) => {
    console.log('Key Received: '+keyValue)
    await database().ref('/users/' + user.uid +'/'+ keyValue).remove();
    getData()
  }

  const getData = () => {
    database()
      .ref('/users/'+ user.uid)
      .once('value')
      .then(snapshot => {
        console.log('User data: ', snapshot.val());
        setData(snapshot.val())
        setModData(Object.keys(snapshot.val()).map((key)=>{
          let newObj = Object.assign(snapshot.val()[key], {keyVal: key})
          return newObj
        }))
        setLoading(false)
      });
  }

  const sortToggle = () => {
    if(sort === 'na'){
      setSort('Asc')
      setModData(ModData.sort(function(a, b) {
        var c = new Date(a.date);;
        var d = new Date(b.date);
        return c-d;
    }))
    } else if (sort === 'Asc'){
      setSort('Dsc')
      setModData(ModData.sort(function(a, b) {
        var c = new Date(a.date);;
        var d = new Date(b.date);
        return d-c;
      }))
    } else {
      setSort('Asc')
      setModData(ModData.sort(function(a, b) {
        var c = new Date(a.date);;
        var d = new Date(b.date);
        return c-d;
      }))
    }

  }

  useEffect(()=>{
    setLoading(true)
    if(isFocused){
      setScreenName('Note')
      getData()
    }
  },[isFocused])

  return (
    <View style={{backgroundColor:'#EFFDF3', flex:1}}>
      <Appbar.Header style={{backgroundColor:'#6DDD9D'}}>
        <Appbar.Content title="All Notes" />
        <Appbar.Action icon="magnify" onPress={() => {navigation.navigate('SearchNote', {data:data})}} />
        <Appbar.Action icon={(sort === 'na') ? "calendar-text": (sort === 'Asc') ? "sort-calendar-ascending" : "sort-calendar-descending"} onPress={()=>sortToggle()} />
      </Appbar.Header>
      {(loading) ? (
          <ActivityIndicator
            visible={loading}
            textContent={'Loading...'}
            size="large" color="#00ff00"
          />):<Text></Text>}
      <ScrollView style={{borderWidth:0, marginBottom:57}}>
        {
          (ModData !== undefined && ModData !== null)? ModData.map((item) => {
            return(
              <NoteItem
                menu={()=>toggleModal(item.keyVal)}
                key={Math.random()}
                UniqueVal={item.keyVal}
                tags={item.tags}
                title= {item.title} 
                body= {item.body}
                date={item.date}
              />
            )
          }):<Text></Text>
        }
      </ScrollView>

      <Modal 
        onModalHide = {()=>{
          if(modal2){
            setReadModalVisible(true)
          }
        }}
        isVisible={isModalVisible} 
        style={{ justifyContent: 'flex-end', alignItems:'flex-end' , margin:0, marginBottom:50}}
        onBackdropPress={() => toggleModal(selectedKey)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropTransitionOutTiming={0}
        >
        <View 
          style={{ 
            backgroundColor: '#fff',
            width:'32%',
            height:150, 
            borderBottomLeftRadius:15, 
            borderTopLeftRadius:15,
            justifyContent:'center' 
          }}>
          <View style={{padding:4, height:'100%', justifyContent:'space-around'}}>
            <Button style={{height:'25%'}} dark color='#6E99CA' icon="book" mode="contained" onPress={() => {
              setModal2(true)
              toggleModal(selectedKey)
            }}>
              Read
            </Button>
            <Button style={{height:'25%'}} color='#FDEA8D' icon="file-edit-outline" mode="contained" onPress={
               () => navigation.navigate('AddNotes', {func:'Edit', title:data[selectedKey].title, body:data[selectedKey].body, tags:data[selectedKey].tags, keyVal:selectedKey})
              }>
              Edit
            </Button>
            <Button style={{height:'25%'}} dark color='#FF5959' icon="delete-forever-outline" mode="contained" onPress={() => {
              removeNote(selectedKey)
              toggleModal(selectedKey)  
            }}>
              Delete
            </Button>
          </View>
        </View>
      </Modal>

      <Modal 
        isVisible={isReadModalVisible}
        >
        <View style={{ 
            backgroundColor: '#fff',
            width:'100%',
            height:'80%',
            alignItems:'center',
          }}>
          <Text style={{fontSize:25, fontWeight:'bold', color:'#4B4737', paddingVertical:5}}>{(data !== undefined && data[selectedKey] !== undefined)? data[selectedKey].title:''}</Text>
          <View style={{flex:1, width:'90%', flexWrap:'wrap', padding:5, paddingTop:10}}>
            <ScrollView contentContainerStyle={{flex:1, flexDirection:'row', flexWrap:'wrap'}}>
              {(data !== undefined && data[selectedKey] !== undefined && data[selectedKey].tags)? data[selectedKey].tags.map((item) => {
                return(
                  <Tag Tagstyle={{height:25, marginLeft:5}} key={Math.random()} text={item.name} color={item.color} />
                )
              }):<Text></Text>}
            </ScrollView>
          </View>

          <View style={{flex:4, width:'90%', elevation:10}}>
            <Text style={{fontSize:20, fontWeight:'bold', color:'#4B4737', backgroundColor:'#FDEA8D', padding:5}}>Note Text</Text>
            <View style={{paddingTop:10, backgroundColor:'#FDEA8D', flex:1, padding:5}}>
              <ScrollView>
                <Text>{(data !== undefined && data[selectedKey] !== undefined)? data[selectedKey].body:''}</Text>
              </ScrollView>
            </View>
          </View>

          <Button onPress={() => {
            setReadModalVisible(false)
            setModal2(false)
          }}>Close</Button>
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({})