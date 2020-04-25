import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default function UserLogged() {
    return (
        <Button
            title="Cerrar Sesion"
            onPress={() => firebase.auth().signOut()}
        />
    );
}