import { Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { AppContext } from '../../Navigation/AppContext';
import { Button } from 'react-native-paper';
import { AuthContext } from '../../Navigation/AuthProvider'
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import storage from '@react-native-firebase/storage';
import Modal from "react-native-modal";
import { Linking } from 'react-native';

export const FilesScreen = ({ navigation }) => {

    const FileItem = (props) => {
      return(
        <View style={{ marginHorizontal:20 ,elevation:2 ,borderWidth:1, borderBottomWidth:6, borderRightWidth:5, borderColor:'#000000B3' ,paddingHorizontal:3, paddingTop:5, backgroundColor:'#F7E382', borderRadius:16, marginVertical:10}}>
          <View style={{flexDirection:'row', paddingLeft:5, justifyContent:'flex-end'}}>
            <TouchableOpacity style={{paddingHorizontal:4}} onPress={()=>props.menu(props.UniqueVal)}>
              <Icon name="dots-horizontal-circle-outline" size={24} />
            </TouchableOpacity>
          </View>
          
          <Text numberOfLines={2} adjustsFontSizeToFit
                style={{fontSize:25, fontWeight:'bold', color:'#4B4737', paddingLeft:10, paddingVertical:5}}>{props.title}</Text>
          <Text numberOfLines={3} style={{color:'#3A4B40', paddingHorizontal:2, fontSize:13}}>{props.body}</Text>
          
          <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
            <Text style={{fontSize:11, paddingHorizontal:5, paddingVertical:5}}>{props.date}</Text>
          </View>
        
        </View>
      )
    }

    const {screenName, setScreenName} = useContext(AppContext)
    const {user} = useContext(AuthContext)
    const [files, setFiles] = useState()
    const isFocused = useIsFocused();
    const [selectedFile, setSelectedFile] = useState('')

    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = (obj) => {
      setModalVisible(!isModalVisible);
      setSelectedFile(obj);
    };

    const RemoveFile = (path) => {
      var desertRef = storage().ref().child(path);

      desertRef.delete().then(function() {
        Alert.alert('Success','File Deleted')
        getData()
      }).catch(function(error) {
        console.log(error)
      });
    }

    const getData = async () => {
      const imageRefs = await storage().ref().child(user.uid+'/').listAll();
      const urls = await Promise.all(imageRefs.items.map((ref) => ref.getDownloadURL()));
      let meta = await Promise.all(imageRefs.items.map((ref) => ref.getMetadata()))
      let fileData = meta.map((item, idx)=>{
        return {name:item.name, size:item.size, type:item.contentType, date:item.updated, downloadURL:urls[idx], fullPath:item.fullPath}
      })
      setFiles(fileData)
    }

    useEffect(()=>{
        if(isFocused){
          setScreenName('File')
          getData()
        }
    },[isFocused])

  return (
    <View>
      <Appbar.Header style={{backgroundColor:'#6DDD9D'}}>
          <Appbar.Content title="All Files" />
        </Appbar.Header>

        <View>
          <ScrollView style={{height:'87%'}}>
            {
              (files !== undefined && files !== null)? files.map((item) => {
                return(
                  <FileItem
                    menu={() => toggleModal({url: item.downloadURL, path:item.fullPath})}
                    key={Math.random()}
                    title={item.name} 
                    body={<Text>
                            File: {item.name}{'\n'}
                            Content-Type: {item.type}{'\n'}
                            Size: {item.size} B
                          </Text>}
                    date={item.date}
                  />
                )
              }):<Text></Text>
            }
          </ScrollView>
        </View>

        <Modal 
          isVisible={isModalVisible}
          style={{ justifyContent: 'flex-end', alignItems:'flex-end' , margin:0, marginBottom:100}}
          onBackdropPress={() => toggleModal(selectedFile)}
          animationIn="slideInRight"
          animationOut="slideOutRight"
          backdropTransitionOutTiming={0}
        >
          <View 
            style={{ 
              backgroundColor: '#fff',
              width:'50%',
              height:100, 
              borderBottomLeftRadius:15, 
              borderTopLeftRadius:15,
              justifyContent:'center' 
          }}>
            <View style={{padding:4, height:'100%', justifyContent:'space-around'}}>
              <Button style={{height:'45%'}} dark color='#6E99CA' icon="download" mode="contained" onPress={() => {
                Linking.openURL(selectedFile.url)
                toggleModal(selectedFile)
              }}>
                Dowload
              </Button>
              <Button style={{height:'45%'}} dark color='#FF5959' icon="delete-forever-outline" mode="contained" onPress={() => {
                RemoveFile(selectedFile.path)
                toggleModal(selectedFile)  
              }}>
                Delete
              </Button>
            </View>
          </View>
      </Modal>

    </View>
  );
}