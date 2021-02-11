import React, { useState } from 'react';
import { View, Text, Image, Button, PermissionsAndroid, ScrollView, TextInput } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob'
import axios from 'axios'
// import FileSystem from 'react-native-filesystem';
import { PersistGate } from 'redux-persist/integration/react'
import RNFS from 'react-native-fs'
import * as Actions from './store/actions'
import { useDispatch, useSelector } from 'react-redux';

const createFormData = (photo, body) => {
    const data = new FormData();
    data.append('photo', { photo: photo });
    Object.keys(body).forEach((key) => {
        data.append(key, body[key]);
    });
    return data;
};


export default function Home() {
    const [photo, setPhoto] = useState([])
    const [nameFile, setNameFile] = useState([])
    const [folder, setfolder] = useState('');

    const dispatch = useDispatch();
    const {image} = useSelector(state => state.gambar)

    const handleChoosePhoto = () => {
        if (folder !== ''){
            launchImageLibrary({
                mediaType: 'photo',
                saveToPhotos: true,
                includeBase64: true
            }, async (response) => {
                if (response.base64) {
                    let waktu = String(Date.now());
                    let nameImageLocal = folder + '_' + waktu + '.jpg';
                    await RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DocumentDir + '/' + nameImageLocal, response.base64, 'base64')
                        .then(() => {
                            dispatch(Actions.saveImage(nameImageLocal, folder))
                        })
                        .catch((err) => {
                            alert(err.message, 'gagal')
                        })
                }
            })
        }
    };
    const camera = async() => {
        if (folder !== ''){
            launchCamera({
                mediaType: 'photo',
                saveToPhotos: true,
                includeBase64: true
            }, async(response) => {
                if (response.base64) {
                    let waktu = String(Date.now());
                    let nameImageLocal = folder + '_' + waktu + '.jpg';
                    await RNFetchBlob.fs.writeFile(RNFetchBlob.fs.dirs.DocumentDir + '/' + nameImageLocal, response.base64, 'base64')
                        .then(() => {
                            dispatch(Actions.saveImage(nameImageLocal, folder))
                        })
                        .catch((err) => {
                            alert(err.message, 'gagal')
                        })
                }
            });
        }
        
    }
    const handleUploadPhoto = async () => {
        // const body = createFormData(photo, { userId: '123' });
        await axios.post('http://localhost:3000/api/upload', { item: photo }, {})
            .then((res) => {
                if (res.data.status) {
                    setPhoto([])
                    nameFile.map((item, index) => {
                        RNFetchBlob.fs.unlink(RNFetchBlob.fs.dirs.DocumentDir + `/${name}`)
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

    const testing = async () => {
        await setPhoto([]);
        image.map( async (item, index) => {
            await RNFetchBlob.fs.readFile(RNFetchBlob.fs.dirs.DocumentDir + `/${item.name}`, 'base64')
                .then((data) => {
                    setPhoto(p => [...p, {image: `data:image/jpg;base64,${data}`, folder: item.folder, name: item.name}])
                }).catch(err => {
                    console.log(err, 'ini error')
                })
        })

        // await RNFS.readDir(RNFS.DocumentDirectoryPath)
        //     .then((result) => {
        //         result.map((item, i) => {
        //             if (item.name.search('ReactNativeDevBundle.js') < 0) {
        //                 RNFetchBlob.fs.readFile(RNFetchBlob.fs.dirs.DocumentDir + `/${item.name}`, 'base64')
        //                     .then((data) => {
        //                         setNameFile(p => [...p, item.name])
        //                         setPhoto(p => [...p, `data:image/jpg;base64,${data}`])
        //                     }).catch(err => {
        //                         console.log(err, 'ini error')
        //                     })
        //             }
        //         })
        //     })
        //     .catch((err) => {
        //         console.log(err.message, err.code);
        //     });
    }

    console.log(photo, 'ini list image title')

    
    return (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 10 }}>
            <TextInput
                style={{ width: '100%', borderWidth: 1, marginBottom: 5 }}
                onChangeText={text => setfolder(text)}
                value={folder}

            />
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {
                    photo.map((item, i) => (
                        <Image
                            source={{ uri: item.image, }}
                            style={{ width: 100, height: 100, backgroundColor: 'red', marginHorizontal: 3, marginVertical: 5, borderRadius: 5 }}
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
            <Button title="Testing" onPress={() => testing()} />
        </View>
    );
}