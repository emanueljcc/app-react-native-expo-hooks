import React, { useState, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { AirbnbRating, Button, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {
    const { navigation } = props;
    const { idRestaurant, setReviewsReload } = navigation.state.params;

    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toastRef = useRef();

    const addReview = () => {
        if (rating === null) {
            toastRef.current.show('No has dado ninguna puntuacion');
        } else if(!title) {
            toastRef.current.show('El titulo es obligatorio');
        } else if(!review) {
            toastRef.current.show('El comentario es obligatorio');
        } else {
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant,
                title,
                review,
                rating,
                createAt: new Date(),
            }

            // TODO: GUARDAR REVIEW EN FIREBASE
            db.collection("review").add(payload)
            .then(() => {
                updateRestaurant();
                setReviewsReload(true);
            })
            .catch(() => {
                setIsLoading(false);
                toastRef.current.show('Error al enviar la review, intentelo mas tarde');
            });
        }
    }

    const updateRestaurant = () => {
        const restaurantRef = db.collection("restaurants").doc(idRestaurant);

        restaurantRef.get().then(res => {
            const restaurantData = res.data();
            const ratingTotal = restaurantData.ratingTotal + rating;
            const quantityVoting = restaurantData.quantityVoting + 1;
            const ratingResult = ratingTotal / quantityVoting;

            restaurantRef.update({ rating: ratingResult, ratingTotal, quantityVoting })
                .then(() => {
                    setIsLoading(false);
                    navigation.goBack();
                })
                .catch(err => {
                    console.log(err);
                });
        });
    }

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={["Pésimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={value => setRating(value)}
                />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder="Titulo"
                    containerStyle={styles.input}
                    onChange={e => setTitle(e.nativeEvent.text)}
                />
                <Input
                    placeholder="Comentario"
                    multiline
                    inputContainerStyle={styles.textArea}
                    onChange={e => setReview(e.nativeEvent.text)}
                />
                <Button
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    title="Enviar Comentario"
                    onPress={addReview}
                />
                <Toast ref={toastRef} position="center" opacity={0.5} />
                <Loading
                    isVisible={isLoading}
                    text="Enviando comentario"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRating: {
        height: 110,
        backgroundColor: '#f2f2f2'
    },
    formReview: {
        flex: 1,
        alignItems: 'center',
        margin: 10,
        marginTop: 40
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 150,
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginTop: 20,
        marginBottom: 10,
        width: '95%'
    },
    btn: {
        backgroundColor: '#00a680'
    }
});