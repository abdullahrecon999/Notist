import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const HorizontalRule = (props) => {
    return(
      <View style={{flexDirection: 'row', alignItems: 'center', width:'100%', paddingLeft:30, paddingRight:30}}>
        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        <View>
          <Text style={{width: props.width, textAlign: 'center'}}>{props.title}</Text>
        </View>
        <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
      </View>
    );
}
  
export const InputField = (props) => {
    return(
        <View>
        <View style={{borderWidth:1, borderRadius:5, borderLeftWidth:3, borderBottomWidth:3, flexDirection:"row", paddingTop:2, paddingBottom:2, justifyContent:"center", alignItems:"center", paddingLeft:0, paddingRight:0}}>
            <Icon name={props.icon1} style={{marginLeft:3}} size={25} />
            <TextInput
            secureTextEntry={props.pass}
            style={[props.style,{width:280, height:45, paddingLeft:10, color:"#3A4B40", fontWeight:'300', fontSize:15, padding:10}]}
            placeholder={props.placeholder}
            onChangeText={props.onChangeText}
            value={props.value}
            />
            <Icon name="close" style={{marginRight:3}} size={22} onPress={() => props.onChangeText('')} />
        </View>
        <Text style={{color:'red', fontSize:12, marginLeft:10}}>{props.error}</Text>
        </View>
    );
}

export const NoteItem = (props) => {
  return(
    <View style={{ marginHorizontal:20 ,elevation:2 ,borderWidth:1, borderBottomWidth:6, borderRightWidth:5, borderColor:'#000000B3' ,paddingHorizontal:3, paddingTop:5, backgroundColor:'#F7E382', borderRadius:16, marginVertical:10}}>
      <View style={{flexDirection:'row', paddingLeft:5}}>
        <ScrollView horizontal={true} contentContainerStyle={{flexDirection:'row', justifyContent:'flex-end', flexGrow:1}}>
          {(props.tags !== undefined)? props.tags.map((item) => {
            return(
              <Tag key={Math.random()} text={item.name} color={item.color} />
            )
          }):<Text></Text>}
        </ScrollView>
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

export const Tag = (props) => {
  return(
    <View style={[{backgroundColor: props.color, paddingHorizontal:12, paddingVertical:2, borderRadius:15, marginHorizontal:1, justifyContent:'center', alignItems:'center'},props.Tagstyle]}>
      <Text style={[{fontSize:10, color:'white' , fontWeight:'bold'}]}>{props.text}</Text>
    </View>
  )
}
