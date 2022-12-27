import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Button } from 'react-native-elements'
import { AuthContext } from '../../Navigation/AuthProvider'
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import storage from '@react-native-firebase/storage';
import { ActivityIndicator } from 'react-native';

export const AddFilesScreen = ({ navigation }) => {

    const [singleFile, setSingleFile] = useState('');
    const {user} = useContext(AuthContext)
    const [uploading, setUploading] = useState(false);
    const [uploadTaskSnapshot, setUploadTaskSnapshot] = useState({});

    const selectOneFile = async () => {
      try {
        const res = await DocumentPicker.pickSingle({
          type: [DocumentPicker.types.allFiles],
          copyTo: 'cachesDirectory'
        });
        
        setSingleFile(res);
      } catch (err) {
        if (DocumentPicker.isCancel(err)) {
          alert('Canceled from single doc picker');
        } else {
          alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
    };

    const UploadFun = async () => {
      setUploading(true);
      const reference = storage().ref(user.uid+'/'+singleFile.name);
      const task = reference.putFile(singleFile.fileCopyUri);

      task.on('state_changed', (taskSnapshot) => {
        setUploadTaskSnapshot(taskSnapshot);
      });

      task.then(() => {
        setUploading(false)
      }).catch((e) => console.log('uploading image error => ', e));
    };


  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <View>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={selectOneFile}
            style={{backgroundColor:'#FDEA8D', padding:5, elevation:10, borderRadius:10, flexDirection:'row', justifyContent:'center'}}
            >
            <Icon name="file-download-outline" size={30} />
            <Text style={{marginHorizontal:10, fontSize: 19}}>
              Click here to pick one file
            </Text>
          </TouchableOpacity>
          <Text style={{marginVertical:20}}>
            File Name: {singleFile.name ? singleFile.name : ''}
            {'\n'}
            Type: {singleFile.type ? singleFile.type : ''}
            {'\n'}
            File Size: {singleFile.size ? singleFile.size : ''}
            {'\n'}
            URI: {singleFile.uri ? singleFile.uri : ''}
            {'\n'}
          </Text>
          <Button title="Upload" onPress={()=>UploadFun()}/>
        </View>
        {uploading && (
            <View style={styles.uploading}>
                <ActivityIndicator size={60} color="#47477b"></ActivityIndicator>
                <Text style={styles.statusText}>Uploading</Text>
                <Text style={styles.statusText}>
                {`${((uploadTaskSnapshot.bytesTransferred / uploadTaskSnapshot.totalBytes) * 100).toFixed(2)}% / 100%`}
                </Text>
            </View>
            )}
    </View>
  );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 50,
      },
      uploading: {
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
      },
      statusText: {
        marginTop: 20,
        fontSize: 20,
      },
})