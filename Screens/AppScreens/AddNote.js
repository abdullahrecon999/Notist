import { StyleSheet, Text, View, TextInput, ScrollView, Alert } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Appbar, TextInput as TextInputPaper, FAB, Chip, Modal, Portal, Provider, Button } from 'react-native-paper';
import database from '@react-native-firebase/database';
import { HorizontalRule } from '../../Components/UIessentials';
import { AuthContext } from '../../Navigation/AuthProvider'
import ColorPalette from 'react-native-color-palette'

export const AddNoteScreen = ({ route, navigation }) => {

    const {user, logout} = useContext(AuthContext)
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')
    const [tagTitle, setTagTitle] = useState('')
    const [tagColor, setTagColor] = useState('#FF5555')
    const [tag, setTag] = useState([])
    const [update, setUpdate] = useState(false)
    const [Notekey, setNoteKey] = useState('')

    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const WriteData = () => {   // Remove .push() to update
        database()
        .ref('/users/'+ user.uid )
        .push()
        .set({
            title: title,
            body: body,
            tags: tag,
            date: new Date().toUTCString()
        })
        .then(() => {
          Alert.alert('Success', 'Note has been Added!')
          navigation.goBack();
        });
    }

    const updateData = (keyVal) => {
      database()
        .ref('/users/'+ user.uid + '/' + keyVal )
        .set({
            title: title,
            body: body,
            tags: tag,
            date: new Date().toUTCString()
        })
        .then(() => {
          Alert.alert('Success', 'Note Updated!')
          navigation.goBack();
        });
    }

    const AddTag = (item) => {
      // console.log("Curr: "+tagColor)
      setTag([
        ...tag,
        { key: Math.random().toString(), name: item.name, color:item.color },
      ]);
    }

    const RemoveTag = (key) => {
      setTag((list) => tag.filter((element) => element.key != key));
    }

    const TagItem = (item, idx) => {
      const field = [];
      field.push(
        <Chip key={item.key} style={{height:35, margin:2, backgroundColor:item.color}} textStyle={{color:'#FFF'}} icon="information" color="#fff" closeIcon="close" onClose={() => RemoveTag(item.key)} >{item.name}</Chip>
      )
      return field
    }

    const UncontrolledColorPicker = () => (
      <ColorPalette
        onChange={color => setTagColor(color)}
        colors={['#FF5555','#AA00AA', '#55FF55', '#5555FF', '#AAAAAA', '#00AAAA']}
        title={""}
      />
    )

    useEffect(() => {
      if(route.params !== undefined){
        if(route.params.func === 'Edit'){
          setUpdate(true)
          setTitle(route.params.title)
          setBody(route.params.body)
          setTag(route.params.tags)
          setNoteKey(route.params.keyVal)
        }
        else{
          setUpdate(false)
        }
      }
      else {
        setUpdate(false)
      }
    },[])

  return (
    <Provider>
      <View style={{backgroundColor:'#EFFDF3', flex:1}}>
        <View style={{backgroundColor:'#EFFDF3', flex:1}}>
          <Appbar.Header style={{backgroundColor:'#6DDD9D'}}>
            <Appbar.BackAction onPress={()=>navigation.goBack()} />
            <TextInput value={title} style={{fontSize:20, width:'58%'}} placeholder='New Title' onChangeText={setTitle} />
            <Appbar.Action onPress={()=>navigation.goBack()} icon="close-box-outline" size={25} style={{ backgroundColor:'#fff'}} color="#ee1667" />
            <Appbar.Action icon="checkbox-outline" size={25} style={{backgroundColor:'#fff'}} color="#66c293" onPress={() => {(update)? updateData(Notekey):WriteData()}} />
          </Appbar.Header>
          
          <View style={{paddingTop:25, paddingLeft:10}}>
            <Text style={{fontSize:16, fontWeight:'bold', color:'#4B4737'}}>Note Body</Text>
          </View>
          <View style={{maxHeight:'50%', minHeight:'40%' ,padding:7}}>
            <TextInputPaper style={{backgroundColor:'#E8DCB8'}} multiline={true} onChangeText={setBody} value={body} activeUnderlineColor={'#009177'} />
          </View>
          <HorizontalRule />
          
          <View style={{flex:1}}>
            <Text style={{fontSize:16, fontWeight:'bold', color:'#4B4737', paddingVertical:10, paddingLeft:10}}>Tags</Text>
            <View style={{flex:1, flexDirection:'row', flexWrap:'wrap'}}>
              <ScrollView contentContainerStyle={{flex:1, flexDirection:'row', flexWrap:'wrap'}}>
                {/* <Chip style={{height:35, margin:2}} icon="information" onPress={() => console.log('Pressed')} closeIcon="close" onClose={{}} >TODO</Chip> */}
                {tag.map((item, index) => {
                  return TagItem(item, index);
                })}
              </ScrollView>
            </View>
          </View>

        </View>
          <FAB
            icon="plus"
            style={{position: 'absolute', margin: 16, right: 0, bottom: 0}}
            onPress={() => showModal()}
          />

        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={{backgroundColor: 'white', padding: 20}}>
            <Text style={{fontSize:15}}>Add the Tag title and choose it's color</Text>
            <View style={{marginVertical:15, borderLeftWidth:3, paddingLeft:5}}>
              <Text style={{fontSize:20}}>Title</Text>
              <TextInput placeholder='Enter Title' value={tagTitle} style={styles.inputbox} onChangeText={setTagTitle} />
            </View>
            <View style={{flexDirection:'row', justifyContent:'space-around'}}>
              <Button color='#DFDFDF' mode='contained' onPress={() => {
                if (tagTitle.length > 0) {
                  AddTag({name:tagTitle, color:tagColor});
                  setTagTitle('');
                  }
                }} 
                >Add Tag</Button>
              <Button color='#DFDFDF' mode='contained' onPress={() => hideModal()} >Cancel</Button>
            </View>
            <View style={{marginVertical:25}}>
              <Text style={{fontSize:20, color:'#fff', backgroundColor:tagColor}}> Color</Text>
              <UncontrolledColorPicker />
            </View>
          </Modal>
        </Portal>

      </View>
    </Provider>
  )
}

const styles = StyleSheet.create({
  inputbox: {
    marginTop: 0,
    borderBottomWidth: 1,
    paddingVertical:10
  },
})