import React,{ useState, useEffect } from 'react';
import * as firebase from 'firebase';
import Loading from '../../components/Loading';

import { View, Text } from 'react-native';

export default function MyAccout() {

    const [login, setLogin] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            !user ? setLogin(false) : setLogin(true);
        })
    }, []);

    if (login === null) {
        return <Loading isVisible={true} text="Cargando..." />;
    }

    if (login) {
        return (
            <View>
                <Text>Usuario Logueado</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Usuario No Logueado</Text>
        </View>
    );
}