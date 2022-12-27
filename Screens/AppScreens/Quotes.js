import { View } from 'react-native'
import React, { useEffect } from 'react'
import { Appbar, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { useState } from 'react';

export const QuotesScreen = ({ navigation }) => {

  const [data, setData] = useState('')

  const getQuote = async () => {
    return await fetch('https://zenquotes.io/api/random', {method:'GET'})
      .then(response => response.json())
      .then(result => {
        setData(result)
        return result
      }).catch(error => console.log('error', error));
  }

  useEffect(() => {
    async function get(){
      let resp = await getQuote()
      setData(resp)
    }
    get()
  }, [])
  

  return (
    <View style={{backgroundColor:'#EFFDF3', flex:1}}>
      <Appbar.Header style={{backgroundColor:'#6DDD9D'}}>
        <Appbar.Content title="Random Quotes" />
      </Appbar.Header>
      
      <View style={{padding:10, justifyContent:'center', alignItems:'center'}}>
        <Card style={{height:'50%', width:'90%', padding:10, marginBottom:30, elevation:5}}>
          <Card.Content style={{borderWidth:0, flex:4, justifyContent:'center', alignItems:'center'}}>
            <Paragraph style={{fontStyle:'italic'}}>{(data[0] !== undefined )? data[0]['q'] : ''}</Paragraph>
          </Card.Content>
          <View style={{borderWidth:0, flex:1, justifyContent:'flex-end', alignItems:'flex-end'}}>
            <Title style={{fontStyle:'italic'}}>--{(data[0] !== undefined )? data[0]['a'] : ''}</Title>
          </View>
        </Card>

        <IconButton
          icon="refresh"
          size={50}
          onPress={() => {getQuote()}}
        />
      </View>

    </View>
  )
}
