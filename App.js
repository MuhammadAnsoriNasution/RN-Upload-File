import React, { useState } from 'react';
import { View, Text, Image, Button, PermissionsAndroid } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'
// import FileSystem from 'react-native-filesystem';

import RNFS from 'react-native-fs'


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
console.log(data, 'ini data')
  return data;
};


export default function App() {
  const [noData, setNoData] = useState(true)
  const [photo, setPhoto] = useState(null)
  
  function urltoFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){
          console.log(res)
          return res.arrayBuffer();
        })
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
        .catch((err) => {
          console.log(err, 'er')
        })
    );
  }



  const handleChoosePhoto = () => {
    launchImageLibrary({
      mediaType: 'photo',
      saveToPhotos: true,
      includeBase64: true
    }, async(response) => {

      RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DCIMDir)
      .then((files) => {
          console.log(files)
      })

      // if (response.base64){
      //   console.log(response.base64)
      //   urltoFile(`data:image/jpg;base64,${response.base64}`,'hello.jpg','image/jpeg')
      //   // .then(function(file){ console.log(file);});

       
      // }
      
      // if (response.base64) {
      //   const fs = RNFetchBlob.fs
      //   const base64 = RNFetchBlob.base64
      //   // fs.createFile(RNFetchBlob.fs.dirs.DocumentDir + '/'+ response.fileName, response.uri, 'uri')
      //   RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DocumentDir + '/'+ response.fileName, RNFetchBlob.base64.encode(response.base64), 'base64')
      //         .then(()=>{ 
      //           alert('berhasil')
      //          })
      //          .catch((err) => {
      //            alert(err.message, 'gagal')
      //          })

      //   setPhoto(response)
      // }
      // RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      // .then((result) => {
      //   console.log('GOT RESULT', result);
    
      //   // stat the first file
      //   return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      // })
      // .then((statResult) => {
      //   if (statResult[0].isFile()) {
      //     // if we have a file, read it
      //     return RNFS.readFile(statResult[1], 'utf8');
      //   }
    
      //   return 'no file';
      // })
      // .then((contents) => {
      //   // log the file contents
      //   console.log(contents);
      // })
      // .catch((err) => {
      //   console.log(err.message, err.code);
      // });

      // RNFetchBlob.fs.readFile(RNFetchBlob.fs.dirs.DocumentDir + '/rn_image_picker_lib_temp_a96c9c33-1cf7-43b7-a801-55e31f69c3b0.jpg' , 'base64')
      // .then((data) => {
      //   // console.log(`data:image/jpg;base64,${RNFetchBlob.base64.decode(data)}`)
      //   // setPhoto(`data:image/jpg;base64,${RNFetchBlob.base64.decode(data)}`)
      //   // setPhoto(response.uri)
      //   urltoFile(RNFetchBlob.base64.decode(data), 'photo.jpg','image/jpeg')
      // }).catch(err => {
      //   console.log(err, 'ini error')
      // })

      // RNFetchBlob.fs.readStream(RNFetchBlob.fs.dirs.DocumentDir + '/rn_image_picker_lib_temp_a96c9c33-1cf7-43b7-a801-55e31f69c3b0.jpg', 'utf8')
      // .then((stream) => {
      //     let data = ''
      //     stream.open()
      //     stream.onData((chunk) => {
      //         data += chunk
      //     })
      //     stream.onEnd(() => {
      //         console.log(data)
      //     })
      // })


        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "message...",
            message:
              "message...",
            buttonNeutral: "message..",
            buttonNegative: "No",
            buttonPositive: "Yes"
          }
        );
        const path = RNFetchBlob.fs.dirs.SDCardDir + '/uploadlocal';
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          RNFetchBlob.fs.exists(path)
            .then((exist) => {
              if (!exist) {
                RNFetchBlob.fs.mkdir(path)
                  .then(() => {
                    console.log('file add')
                  })
                  .catch((err) => {
                    console.log('error', err)
                  })
              }

               if (response.base64) {
                // const fs = RNFetchBlob.fs
                // const base64 = RNFetchBlob.base64
                // RNFetchBlob.fs.writeFile(path + '/'+ response.fileName, response.uri, 'base64')
                //       .then(()=>{ 
                //         alert('berhasil')
                //        })
                //        .catch((err) => {
                //          alert(err.message, 'gagal')
                //        })



                setPhoto(response)
              }
              

            })
            .catch((error) => console.log('error', error))
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
      .then((response) => {
        setPhoto(null)
      })
      .catch((error) => {
        console.log('upload error', error);
      });
  };



 
  const testing = async() => {

    

    await RNFetchBlob.fs.cp(RNFetchBlob.fs.dirs.DCIMDir+'/IMG_20210117_112432_746.jpg', RNFetchBlob.fs.dirs.SDCardDir+'/uploadlocal/'+photo.fileName)
    .then((res) => {
      console.log(res)

    })
    .catch((err) => {
      console.log(err)
    })
    await RNFetchBlob.fs.ls(RNFetchBlob.fs.dirs.DocumentDir)
    .then((files) => {
        console.log(files)
    })

  }


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {photo && (
        <React.Fragment>
          <Image
            source={{ uri:photo.uri, }}
            style={{ width: 300, height: 300, }}
          />
          <Button title="Upload" onPress={() => handleUploadPhoto()} />
        </React.Fragment>
      )}
      <Button title="Choose Photo" onPress={() => handleChoosePhoto()} />
      <Button title="Camera" onPress={() => camera()} />
      <Button title="Testing" onPress={() => testing()} />

    </View>
  );
}