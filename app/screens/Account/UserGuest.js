import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

function UserGuest(props) {

    const { navigation } = props;

    return (
        <ScrollView style={styles.viewBody} centerContent>
            <Image
                source={require('../../../assets/img/UserGuest.jpg')}
                style={styles.image}
                resizeMode="contain"
            />
            <Text style={styles.title}>Consulta tu perfil de App Restaurants</Text>
            <Text style={styles.description}>¿Como describirias tu mejor Restaurante? Busca y visualiza los mejores restaurantes de una forma sencilla, vota cual te ha gustadi mas y comenta cual ha sido tu mejor experiencia.</Text>
            <View style={styles.viewBtn}>
                <Button
                    buttonStyle={styles.buttonStyle}
                    containerStyle={styles.btnContainer}
                    title="Ver tu perfil"
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30,
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 19,
        marginBottom: 10,
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        marginBottom: 20,
    },
    viewBtn: {
        flex: 1,
        alignItems: 'center',
    },
    buttonStyle: {
        backgroundColor: '#00a680',
    },
    btnContainer: {
        width: '70%',
    }
});

export default withNavigation(UserGuest);