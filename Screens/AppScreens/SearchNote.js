import { Text, View, ScrollView, Alert, LayoutAnimation, Platform, UIManager,TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Appbar, Button, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NoteItem } from '../../Components/UIessentials';
import { Tag } from '../../Components/UIessentials';
import Modal from "react-native-modal";

export const SearchNote = ({ route, navigation }) => {

    const [expanded, setExpanded] = useState(false)
    const [data, setData] = useState([])
    const [newData, setNewData] = useState([])
    const [query, setQuery] = useState()
    const [queryData, setQueryData] = useState()
    const [tagData, setTag] = useState()

    const [isModalVisible, setModalVisible] = useState(false);
    const [isReadModalVisible, setReadModalVisible] = useState(false);
  
    const toggleModal = (keyValue) => {
      setModalVisible(!isModalVisible);
      setKey(keyValue);
    };
  
    const [selectedKey, setKey] = useState('')
    const [modal2, setModal2] = useState()

    UIManager.setLayoutAnimationEnabledExperimental(true);
    const changeLayout = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        setExpanded(!expanded);
    }

    const modifyData = async () =>{
        if(route.params !== undefined){
            let ModData = Object.keys(route.params.data).map((key)=>{
                Object.assign(route.params.data[key], {keyVal: key})
                return route.params.data[key]
            })
            setNewData(ModData)
            setQueryData(ModData)
            setData(route.params.data)
            return route.params.data
        }
    }

    useEffect(()=>{
        async function get(){
            let resp = await modifyData()
            setData(resp)
          }
          get()
    },[])

    useEffect(()=>{
        setData(route.params.data)
        let filteredData = newData.filter((item)=>{
            return item.title.includes(query)
        })
        let tagData = filteredData.map((item)=>{
            return item.tags
        })
        // console.log(tagData.flat(Infinity))
        setTag(tagData)
        setQueryData(filteredData)
    },[query])

  return (
    <View style={{backgroundColor:'#EFFDF3', flex:1}}>
        <Appbar.Header style={{backgroundColor:'#6DDD9D'}}>
            <Appbar.BackAction onPress={()=>navigation.goBack()} />
            <Searchbar
                style={{width:'80%', elevation:0}}
                placeholder="Search"
                value={query}
                clearIcon={() => <Icon name="close" size={20}/>}
                onChangeText={setQuery}
            />
        </Appbar.Header>
        
        <View style={{alignItems:'center'}}>
            <View style={{backgroundColor:'#fff', elevation:5, flexDirection:'row', height:25, width:'100%', paddingLeft:10}}>
                <Text style={{fontSize:15}}>Tags:</Text>
            </View>
            <TouchableOpacity activeOpacity={0.8} onPress={()=>changeLayout(true)}> 
                <View style={{backgroundColor:'#fff', flexDirection:'row'}}>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', width:'100%'}}>
                        <Icon name={(expanded) ? "chevron-up":"chevron-down"} size={25}/>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{ height: expanded ? null : 0, overflow: 'hidden',width:'90%',borderBottomLeftRadius:10, borderBottomRightRadius:10 }}>
                <View style={{backgroundColor:'#fff', width:'100%', height:150, borderWidth:5, borderTopWidth:1, borderBottomLeftRadius:10, borderBottomRightRadius:10}}>
                    <ScrollView contentContainerStyle={{flex:1, flexDirection:'row', flexWrap:'wrap', padding:15}}>
                        {
                            (tagData !== undefined && tagData.length > 0) ? 
                                tagData.flat(1).map((item)=>{
                                    return(
                                        <Tag Tagstyle={{height:25, marginLeft:5, marginBottom:5}} key={item.key} text={item.name} color={item.color} />
                                    )
                                })
                                : <Text>Search Something First!</Text>
                        }
                    </ScrollView>
                </View>
            </View>
            
            <View style={{width:'90%'}}>
                <ScrollView style={{borderWidth:0, marginBottom:57, width:'100%'}} contentContainerStyle={{width:'100%'}}>
                    {
                    (queryData !== undefined && queryData !== null && queryData.length > 0)? queryData.map((item) => {
                        return(
                        <NoteItem
                            menu={()=>toggleModal(item.keyVal)}
                            key={item.keyVal}
                            UniqueVal={item.keyVal}
                            tags={item.tags}
                            title= {item.title} 
                            body= {item.body}
                            date={item.date}
                        />
                        )
                    }):<View style={{alignItems:'center', marginTop:'50%'}}>
                        <Text style={{fontSize:25, fontWeight:'bold', color:'#4B4737'}}>No Data Found</Text>
                    </View>
                    }
                </ScrollView>
            </View>

        </View>

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