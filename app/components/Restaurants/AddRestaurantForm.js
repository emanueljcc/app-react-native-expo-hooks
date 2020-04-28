import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions, Text } from 'react-native';
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import Modal from '../Modal';
import uuid from 'react-native-uuid';
import { getCircularReplacer } from '../../utils/Validation';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

// capturar ancho de la pantalla del movil
const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
    const { navigation, setIsLoading, toastRef, setIsReloadRestaurants } = props;

    const [imagesSelected, setImagesSelected] = useState([]);
    const [restaurantName, setRestaurantName] = useState('');
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [restaurantDescription, setRestaurantDescription] = useState('');
    const [restaurantPhone, setRestaurantPhone] = useState('');
    const [restaurantEmail, setRestaurantEmail] = useState('');
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    const addRestaurant = () => {
        if (!restaurantName ||
            !restaurantAddress ||
            !restaurantDescription ||
            !restaurantPhone ||
            !restaurantEmail) {
            toastRef.current.show('Todos los campos del formulario son obliogatorios');
        } else if(imagesSelected.length === 0) {
            toastRef.current.show('El restaurante tiene que tener al menos una foto');
        } else if(!locationRestaurant) {
            toastRef.current.show('Tienes que localizar el restaurante en el mapa');
        } else {
            // TODO: SUBIR TODO AL STORAGE
            setIsLoading(true);

            uploadImageStorage(imagesSelected).then(arrayImages => {
                // TODO: GUARDAR EN FIREBASE
                db.collection("restaurants").add({
                    name: restaurantName,
                    address: restaurantAddress,
                    description: restaurantDescription,
                    phone: restaurantPhone,
                    email: restaurantEmail,
                    location: locationRestaurant,
                    images: arrayImages,
                    rating: 0,
                    quantityVoting: 0,
                    createAt: new Date(),
                    createBy: firebaseApp.auth().currentUser.uid
                }).then(() => {
                    setIsLoading(false);
                    setIsReloadRestaurants(true);
                    navigation.navigate("Restaurants");
                }).catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                    toastRef.current.show('Error al subir restaurante, intente mas tarde');
                })
            })

        }
    }

    const uploadImageStorage = async imageArray => {

        const imagesBlob = [];
        await Promise.all(
            imageArray.map(async image => {
                console.log(image)
                const response = await fetch(image);
                const blob = await response.blob();

                const ref = firebase
                    .storage()
                    .ref("restaurant-images")
                    .child(uuid.v4());

                await ref.put(blob).then(result => {
                    imagesBlob.push(result.metadata.name);
                    // TODO: FIX ERROR JSON stringify
                    // console.log(JSON.stringify(result, getCircularReplacer()));
                });
            })
        );
        return imagesBlob;
    };

    return (
        <ScrollView>
            <ImageRestaurant imageRestaurant={imagesSelected[0]} />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setRestaurantPhone={setRestaurantPhone}
                setRestaurantEmail={setRestaurantEmail}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
                toastRef={toastRef}
            />
            <Button
                title="Crear restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnRestaurant}
            />
            <Map
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function ImageRestaurant(props) {
    const { imageRestaurant } = props;

    return (
        <View style={styles.viewPhoto}>
            {imageRestaurant ? (
                <Image
                    source={{ uri: imageRestaurant }}
                    style={{width: widthScreen, height: 200}}
                />
            ) : (
                <Image
                    source={ require("../../../assets/img/no-image.png") }
                    style={{width: widthScreen, height: 200}}
                />
            )}
        </View>
    );
}

function UploadImage(props) {
    const { imagesSelected, setImagesSelected, toastRef } = props;

    const imageSelect = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

        if (resultPermissionCamera !== 'granted') {
            toastRef.current.show('Es necesario aceptar los permisos de la galeria, si lo has rechazado tienes que ir a ajustes y activarlos manualmente.', 5000)
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            })

            if (result.cancelled) {
                toastRef.current.show('Has cerrado la galeria sin seleccionar ninguna imagen', 2000);
            } else {
                setImagesSelected([...imagesSelected, result.uri]);
            }
        }
    }

    const removeImage = (image) => {
        const arrayImages = imagesSelected;
        Alert.alert(
            'Eliminar imagen',
            '¿Estas seguro de que quieres eliminar la imagen?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: () => setImagesSelected(arrayImages.filter(imageUrl => imageUrl !== image))
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <View style={styles.viewImage}>
            {imagesSelected.length < 5 &&
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            }

            {imagesSelected.map((imageRestaurant, i) => (
                <Avatar
                    key={i}
                    onPress={() => removeImage(imageRestaurant)}
                    style={styles.miniatureStyle}
                    source={{ uri: imageRestaurant }}
                />
            ))}
        </View>
    );
}

function FormAdd(props) {
    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setRestaurantPhone, setRestaurantEmail, setIsVisibleMap, locationRestaurant } = props;

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Direccion"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680": "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)
                }}
                onPress={() => console.log('direccion actualizada')}
            />
            <Input
                placeholder="Descripcion del restaurante"
                multiline
                inputContainerStyle={styles.textArea}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
            <Input
                placeholder="Telefono del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantPhone(e.nativeEvent.text)}
            />
            <Input
                placeholder="Email del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantEmail(e.nativeEvent.text)}
            />
        </View>
    );
}

function Map(props) {
    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef } = props;

    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            );
            const statusPermissions = resultPermissions.permissions.location.status;

            if (statusPermissions !== 'granted') {
                toastRef.current.show('Tienes que aceptar los Permisos de localizacion para crear un restaurante', 3000);
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                });
            }
        })();
    }, []);

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show('Localizacion guardada correctamente');
        setIsVisibleMap(false);
    }

    return(
        <Modal isVisible={isVisibleMap} setIsVisibleMap={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar ubicacion"
                        onPress={confirmLocation}
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                    />
                    <Button
                        title="Cancelar ubicacion"
                        onPress={() => setIsVisibleMap(false)}
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                    />
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    viewImage: {
        flexDirection: 'row',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: '#e3e3e3',
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewPhoto: {
        alignItems: 'center',
        height: 200,
        marginBottom: 20,
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: '100%',
        padding: 0,
        margin: 0,
    },
    mapStyle: {
        width: '100%',
        height: 150,
    },
    viewMapBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnSave: {
        backgroundColor: '#00a680',
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: '#a60d0d',
    },
    btnRestaurant: {
        backgroundColor: '#00a680',
        margin: 20,
    }
});