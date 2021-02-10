import React, { useState } from 'react';
import { View, Text, Image, Button, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'
// import FileSystem from 'react-native-filesystem';




const createFormData = (photo, body) => {
  const data = new FormData();

  data.append('photo', {
    name: photo.fileName,
    type: photo.type,
    uri:
      Platform.OS === 'android' ? photo.uri : photo.uri.replace('file://', ''),
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};


export default function App() {
  const [noData, setNoData] = useState(true)
  const [photo, setPhoto] = useState(null)
  const handleChoosePhoto = () => {
    launchImageLibrary({
      mediaType: 'photo',
      saveToPhotos: true,
      includeBase64: true
    }, async (response) => {
      if (response.base64) {

        // const granted = await PermissionsAndroid.request(
        //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        //   {
        //     title: "message...",
        //     message:
        //       "message...",
        //     buttonNeutral: "message..",
        //     buttonNegative: "No",
        //     buttonPositive: "Yes"
        //   }
        // );
        // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //   RNFetchBlob.fs.exists(RNFetchBlob.fs.dirs.DocumentDir + '/uploadlocal/')
        //     .then((exist) => {
        //       if (!exist) {
        //         RNFetchBlob.fs.mkdir(RNFetchBlob.fs.dirs.DocumentDir + '/uploadlocal/')
        //           .then(() => {
        //             console.log('file add')
        //           })
        //           .catch((err) => {
        //             console.log('error', err)
        //           })
        //       }
        //       RNFetchBlob.fs.mv(response, RNFetchBlob.fs.dirs.DocumentDir + '/uploadlocal/')
        //         .then(() => {
        //           alert('berhasil')
        //         })
        //         .catch((err) => {
        //           alert(err.message)
        //         })
        //     })
        //     .catch((error) => console.log('error', error))
        // }
        // console.log(response.uri)

        // const path = RNFetchBlob.fs.dirs.DocumentDir + '/uploadlocal';
        // const exist = await RNFetchBlob.fs.exists(path)
        // if (!exist) {
        //   await RNFetchBlob.fs.mkdir(path)
        // }else{
        //   alert('ada kok')
        // }

        // const fs = RNFetchBlob.fs
        // const base64 = RNFetchBlob.base64
        // // fs.createFile(path, response.uri, 'uri')
        // // fs.createFile(path, base64.encode(response.base64), 'base64')
        // RNFetchBlob.fs.writeStream(path, 'base64')
        // .then((stream) => {
        //     stream.write(RNFetchBlob.base64.encode(response.base64))
        //     alert('berhasil')
        //     return stream.close()
        // }).catch((err) => {
        //   console.log('gagal', err)
        // })

        // await RNFetchBlob.fs.writeFile(path, response.uri, 'uri')
        //   .then(() => {
        //     alert('berhasil')
        //   }).catch((err) => {
        //     alert(err, 'errorini pas menulis')
        //   })
        setPhoto(response)
      }
    })
  };
  const camera = () => {
    launchCamera({
      mediaType: 'photo',
      saveToPhotos: true
    }, (response) => {

      if (response.uri) {
        setPhoto(response)
      }
    });
  }

  const handleUploadPhoto = () => {
    fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: createFormData(photo, { userId: '123' }),
    })
      .then((response) => response.json())
      .then(async (response) => {
        setPhoto(null)
      })
      .catch((error) => {
        console.log('upload error', error);
        alert('Upload failed!');
      });
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {photo && (
        <React.Fragment>
          <Image
            source={{ uri: photo.uri }}
            style={{ width: 300, height: 300 }}
          />
          <Button title="Upload" onPress={() => handleUploadPhoto()} />
        </React.Fragment>
      )}
      <Button title="Choose Photo" onPress={() => handleChoosePhoto()} />
      <Button title="Camera" onPress={() => camera()} />

    </View>
  );
}