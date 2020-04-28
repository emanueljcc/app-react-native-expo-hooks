import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AirbnbRating, Button } from 'react-native-elements';

export default function AddReviewRestaurant(props) {
    const { navigation } = props;
    const { idRestaurant } = navigation.state.params;

    const [rating, setRating] = useState(null);

    const addReview = () => {
        console.log(rating)
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
            <View>
                <Button
                    title="Enviar Comentario"
                    onPress={addReview}
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