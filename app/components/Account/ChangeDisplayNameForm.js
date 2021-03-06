import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';

export default function ChangeDisplayNameForm(props) {
    const { displayName, setIsVisibleModal, setReloadData, toastRef } = props;
    const [newDisplayName, setNewDisplayName] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const updateDisplayName = async () => {
        setError(null);
        setIsLoading(true);
        try {
            if (!newDisplayName) {
                setError('El nombre de usuario no ha cambiado');
            } else {

                await firebase
                    .auth()
                    .currentUser
                    .updateProfile({
                        displayName: newDisplayName
                    });

                setIsLoading(false);
                setReloadData(true);
                toastRef.current.show('Nombre actualizado correctamente');
                setIsVisibleModal(false);
            }
        } catch (error) {
            console.log(error);
            setError('Error al actualizar el nombre');
            setIsLoading(false);
            toastRef.current.show('Nombre actualizado correctamente');
        }
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Nombre"
                containerStyle={styles.input}
                defaultValue={displayName && displayName}
                onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
                rightIcon={{
                    type: 'material-community',
                    name: 'account-circle-outline',
                    color: '#c2c2c2',
                }}
                errorMessage={error}
            />
            <Button
                title="Cambiar Nombre"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={updateDisplayName}
                loading={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingBottom: 10,
        paddingTop: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: '100%',
    },
    btn: {
        backgroundColor: '#00a680',
    }
})