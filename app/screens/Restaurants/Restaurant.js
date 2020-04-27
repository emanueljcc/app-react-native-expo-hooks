import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import CarouselImages from '../../components/Carousel';
import * as firebase from 'firebase';

const screenWidth = Dimensions.get('window').width;

export default function Restaurant(props) {
    const { navigation } = props

    const item = navigation.state.params.restaurant.item.restaurant ? navigation.state.params.restaurant.item.restaurant : navigation.state.params.restaurant.item;

    const [imageRestaurant, setImageRestaurant] = useState([]);

    useEffect(() => {
        const arrayUrls = [];

        (async () => {
            await Promise.all(
                item.images.map(async (idImage) => {
                    await firebase.storage().ref(`restaurant-images/${idImage}`).getDownloadURL().then(imageUrl => {
                        // TODO: OBTENIENDO URL DE LA IMAGEN DE FIREBASE
                        arrayUrls.push(imageUrl);
                    });
                })

            );

            setImageRestaurant(arrayUrls);
        })();

    }, [])

    return (
        <View>
            <CarouselImages
                arrayImages={imageRestaurant}
                width={screenWidth}
                height={250}
            />
            <Text>{ item.address }</Text>
        </View>
    );
}