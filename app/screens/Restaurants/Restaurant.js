import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Dimensions } from 'react-native';
import { Rating, ListItem, Icon } from 'react-native-elements';
import CarouselImages from '../../components/Carousel';
import Map from '../../components/Map';
import ListReviews from '../../components/Restaurants/ListReviews';
import Toast from 'react-native-easy-toast';

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const screenWidth = Dimensions.get('window').width;

export default function Restaurant(props) {
    const { navigation } = props;
    const toastRef = useRef();

    const item = navigation.state.params.restaurant.item.restaurant ? navigation.state.params.restaurant.item.restaurant : navigation.state.params.restaurant.item;

    const [imageRestaurant, setImageRestaurant] = useState([]);
    const [rating, setRating] = useState(item.rating);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const arrayUrls = [];

        (async () => {
            await Promise.all(
                item.images.map(async (idImage) => {
                    // TODO: obtener ruta imagen firebase
                    await firebase.storage().ref(`restaurant-images/${idImage}`).getDownloadURL().then(imageUrl => {
                        // TODO: OBTENIENDO URL DE LA IMAGEN DE FIREBASE
                        arrayUrls.push(imageUrl);
                    });
                })
            );

            setImageRestaurant(arrayUrls);
        })();
    }, []);

    useEffect(() => {
        db.collection("favorites")
            .where("idRestaurant", "==", item.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then(response => {
                if (response.docs.length === 1) {
                    setIsFavorite(true);
                }
            });
    }, []);

    const addFavorite = () => {
        const payload = {
            idUser: firebase.auth().currentUser.uid,
            idRestaurant: item.id
        };

        db.collection("favorites").add(payload).then(() => {
            setIsFavorite(true);
            toastRef.current.show('Restaurante añadido a la lista de favoritos.');
        })
        .catch(() => {
            toastRef.current.show('Error al añadir el restaurante a la lista de favoritos, intentelo mas tarde.');
        })
    }

    const removeFavorite = () => {
        // TODO: where firebase
        db.collection('favorites')
            .where("idRestaurant", "==", item.id)
            .where("idUser", "==", firebase.auth().currentUser.uid)
            .get()
            .then(response => {
                response.forEach(doc => {
                    const idFavorite = doc.id;

                    // TODO: delete firebase
                    db.collection('favorites')
                        .doc(idFavorite)
                        .delete()
                        .then(() => {
                            setIsFavorite(false);
                            toastRef.current.show('Restaurante eliminado de la lista de favoritos.');
                        })
                        .catch(() => {
                            toastRef.current.show('No se ha podido eliminar el restaurante de la lista de favoritos.')
                        })
                })
            })

    }

    return (
        <ScrollView style={styles.viewBody}>
            <View style={styles.viewFavorite}>
                <Icon
                    type="material-community"
                    name={isFavorite ? "heart" : "heart-outline"}
                    onPress={isFavorite ? removeFavorite : addFavorite}
                    color={isFavorite ? "#00a680" : "#000"}
                    size={35}
                    underlayColor="transparent"
                />
            </View>
            <CarouselImages
                arrayImages={imageRestaurant}
                width={screenWidth}
                height={250}
            />
            <TitleRestaurant
                name={item.name}
                description={item.description}
                rating={rating}
            />
            <RestaurantInfo
                location={item.location}
                name={item.name}
                address={item.address}
                phone={item.phone}
                email={item.email}
            />
            <ListReviews
                navigation={navigation}
                idRestaurant={item.id}
                setRating={setRating}
            />
            <Toast ref={toastRef} position="center" opacity={0.5} />
        </ScrollView>
    );
}

function TitleRestaurant(props) {
    const { name, description, rating } = props;

    return (
        <View style={styles.viewRestaurantTitle}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={styles.nameRestaurant}>{name}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={rating}
                />
            </View>
            <Text style={styles.descriptionRestaurant}>{description}</Text>
        </View>
    );
}

function RestaurantInfo(props) {
    const { location, name, address, phone, email } = props;

    const listInfo = [
        {
            text: address,
            iconName: 'map-marker',
            iconType: "material-community",
            action: null
        },
        {
            text: phone ? phone : ' - ',
            iconName: 'phone',
            iconType: 'material-community',
            action: null
        },
        {
            text: email ? email : ' - ',
            iconName: 'at',
            iconType: 'material-community',
            action: null
        }
    ]

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.restaurantInfoTitle}>Informacion sobre el restaurante</Text>
            <Map
                location={location}
                name={name}
                height={100}
            />
            {listInfo.map((item, i) => (
                <ListItem
                    key={i}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: '#00a680',
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    viewFavorite: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 2,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 100,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 15,
        paddingRight: 5,
    },
    viewBody: {
        flex: 1,
        backgroundColor: '#fff',
    },
    viewRestaurantTitle: {
        margin: 15,
    },
    nameRestaurant: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    rating: {
        position: 'absolute',
        right: 0,
    },
    descriptionRestaurant: {
        marginTop: 5,
        color: 'gray',
    },
    viewRestaurantInfo: {
        marginTop: 15,
        marginTop: 25,
    },
    restaurantInfoTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    containerListItem: {
        borderBottomColor: '#d8d8d8',
        borderBottomWidth: 1,
    }
});