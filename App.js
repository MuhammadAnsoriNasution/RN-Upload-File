import React, { useState } from 'react';
import { View, Text, Image, Button, PermissionsAndroid, ScrollView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'
import axios from 'axios'
// import FileSystem from 'react-native-filesystem';

import RNFS from 'react-native-fs'


const createFormData = (photo, body) => {
  const data = new FormData();
  data.append('photo', {photo: photo});
  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });
  return data;
};


export default function App() {
  const [photo, setPhoto] = useState([])
  const [nameFile, setNameFile] = useState([])

  const handleChoosePhoto = () => {
    launchImageLibrary({
      mediaType: 'photo',
      saveToPhotos: true,
      includeBase64: true
    }, async (response) => {

      if (response.base64){
        await RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DocumentDir + '/' + response.fileName, response.base64, 'base64')
        .then(() => {
          alert('berhasil')
        })
        .catch((err) => {
          alert(err.message, 'gagal')
        })
        await RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then((result) => {
          result.map((item, i) => {
            if (item.name.search('ReactNativeDevBundle.js') < 0) {
              RNFetchBlob.fs.readFile(RNFetchBlob.fs.dirs.DocumentDir + `/${item.name}`, 'base64')
                .then((data) => {
                  setNameFile(p=>[...p, item.name])
                  setPhoto(p => [...p, `data:image/jpg;base64,${data}`])
                }).catch(err => {
                  console.log(err, 'ini error')
                })
            }
          })
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
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
  const handleUploadPhoto = async() => {
    const body = createFormData(photo, { userId: '123' });
    await axios.post('http://localhost:3000/api/upload', {item: photo},{})
    .then((res) => {
      if (res.data.status){
        setPhoto([])
        nameFile.map((item, index) => {
          RNFetchBlob.fs.unlink(RNFetchBlob.fs.dirs.DocumentDir+ `/${name}`)
          .then(() => { 
            
          })
          .catch((err) => { 
            
          })
        })
      }
    })
    .catch((err) => {
      console.log(err)
    })
  };

  const testing = async() => {

    await RNFS.readDir(RNFS.DocumentDirectoryPath)
        .then((result) => {
          result.map((item, i) => {
            if (item.name.search('ReactNativeDevBundle.js') < 0) {
              RNFetchBlob.fs.readFile(RNFetchBlob.fs.dirs.DocumentDir + `/${item.name}`, 'base64')
                .then((data) => {
                  setNameFile(p=>[...p, item.name])
                  setPhoto(p => [...p, `data:image/jpg;base64,${data}`])
                }).catch(err => {
                  console.log(err, 'ini error')
                })
            }
          })
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
  }



  //   await RNFetchBlob.fs.cp(RNFetchBlob.fs.dirs.DCIMDir+'/IMG_20210117_112432_746.jpg', RNFetchBlob.fs.dirs.SDCardDir+'/uploadlocal/'+photo.fileName)
  //   .then((res) => {
  //     console.log(res)

  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
  //   await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DocumentDir)
  //   .then((files) => {
  //       console.log(files)
  //   })

  // }


  return (
    <View style={{alignItems: 'center', justifyContent: 'center' }}>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {
              photo.map((item, i) => (
                <Image
                  source={{ uri: item, }}
                  style={{ width: 100, height: 100, backgroundColor: 'red', marginHorizontal: 3, marginVertical: 5, borderRadius: 5}}
                  key={i}
                />
              ))
            }
          </ScrollView>
      {
        photo.length ? <Button title="Upload" onPress={() => handleUploadPhoto()} /> : null
      }
      <Button title="Choose Photo" onPress={() => handleChoosePhoto()} />
      <Button title="Camera" onPress={() => camera()} />
      <Button title="Camera" onPress={() => testing()} />
    </View>
  );
}