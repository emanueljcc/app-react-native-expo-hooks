import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';

export default function InfoUser(props) {
    // DOBLE DESTRUCTURING
    const { userInfo: { uid, photoURL, email, displayName, providerId }, setReloadData, toastRef, setIsLoading, setTextLoading } = props;

    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

        if (resultPermissionCamera === 'denied') {
            toastRef.current.show('Es necesario aceptar los permisos de la galeria');
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            })

            if (result.cacelled) {
                toastRef.current.show('Has cerrado la galeria de imagenes');
            } else {
                // validation type login
                if ( providerId.includes('facebook') ) {
                    toastRef.current.show(`No puede actualizar la img de perfil ya que esta logueado con ${providerId}`)
                } else {
                    uploadImage(result.uri, uid).then(() => {
                        updatePhotoUrl(uid, displayName);
                    });
                }
            }
        }

    }

    const uploadImage = async (uri, nameImage) => {
        setTextLoading("Actualizando Avatar...")
        setIsLoading(true);
        const response = await fetch(uri);
        const blob = await response.blob();

        const ref = firebase.storage().ref().child(`avatar/${nameImage}`);

        return ref.put(blob);
        // console.log(JSON.stringify(blob))
    }

    const updatePhotoUrl = (uid, displayName) => {
            firebase
                .storage()
                .ref(`avatar/${uid}`)
                .getDownloadURL()
                .then(async (result) => {
                    const update = {
                        displayName,
                        photoURL: result,
                    };
                    await firebase.auth().currentUser.updateProfile(update);
                    // update foto
                    setReloadData(true);
                    setIsLoading(false);
                    toastRef.current.show("Imagen subida al servidor");
                })
                .catch(() => {
                    toastRef.current.show("Error al recuperar la imagen del servidor");
                });
    };

    return (
        <View style={styles.viewUserInfo}>
            <Avatar
                rounded
                size="large"
                showEditButton
                onEditPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={{
                    uri: photoURL ? photoURL : 'https://api.adorable.io/avatars/200/abott@adorable.png'
                }}
            />
            <View>
                <Text style={styles.displayName}>
                    {displayName ? displayName : 'Anonimo'}
                </Text>
                <Text>{email}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingTop: 30,
        paddingBottom:30,
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: 'bold'
    }
});