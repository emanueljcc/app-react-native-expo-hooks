import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Input, Button } from 'react-native-elements';
import * as firebase from 'firebase';
import { reauthenticate } from '../../utils/Api';

export default function ChangePasswordForm(props) {
    const { setIsVisibleModal, toastRef } = props;

    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [hidePassword, setHidePassword] = useState({
        password: true,
        newPassword: true,
        newPasswordRepear: true,
    });

    const updatePassword = () => {
        setError({});

        if (!password || !newPassword || !newPasswordRepeat) {
            let objError = {};

            !password && (objError.password = 'No puede estar vacia');
            !newPassword && (objError.newPassword = 'No puede estar vacia');
            !newPasswordRepeat && (objError.newPasswordRepeat = 'No puede estar vacia');


            setError(objError);

        } else {
            if (newPassword !== newPasswordRepeat) {
                setError({
                    newPassword: 'Las nuevas contraseñas tienen que ser iguales',
                    newPasswordRepeat: 'Las nuevas contraseñas tienen que ser iguales',
                })
            } else {
                setIsLoading(true);

                reauthenticate(password)
                    .then(() => {
                        firebase
                            .auth()
                            .currentUser
                            .updatePassword(newPassword)
                            .then(() => {
                                console.log('Contraseña actualizada');
                                setIsLoading(false);
                                toastRef.current.show('Contraseña actualizada');
                                setIsVisibleModal(false);

                                // TODO: logout para que el user vuelva a loguear
                                // firebase.auth().signOut();
                            })
                            .catch(() => {
                                setError({ general: 'Error al actualizar la contraseña'});
                                setIsLoading(false);
                            })
                    })
                    .catch(() => {
                        setError({ password: 'La contraseña no es correcta'});
                        setIsLoading(false);
                    })
            }
        }
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password
                secureTextEntry={hidePassword.password}
                onChange={(e) => setPassword(e.nativeEvent.text)}
                rightIcon={{
                    type: 'material-community',
                    name: hidePassword.password ? 'eye-outline' : 'eye-off-outline',
                    color: '#c2c2c2',
                    onPress:() => setHidePassword({ ...hidePassword, password: !hidePassword.password})
                }}
                errorMessage={error.password}
            />
            <Input
                placeholder="Nueva contraseña"
                containerStyle={styles.input}
                password
                secureTextEntry={hidePassword.newPassword}
                onChange={(e) => setNewPassword(e.nativeEvent.text)}
                rightIcon={{
                    type: 'material-community',
                    name: hidePassword.newPassword ? 'eye-outline' : 'eye-off-outline',
                    color: '#c2c2c2',
                    onPress:() => setHidePassword({ ...hidePassword, newPassword: !hidePassword.newPassword})
                }}
                errorMessage={error.newPassword}
            />
            <Input
                placeholder="Repita nueva contraseña"
                containerStyle={styles.input}
                password
                secureTextEntry={hidePassword.newPasswordRepeat}
                onChange={(e) => setNewPasswordRepeat(e.nativeEvent.text)}
                rightIcon={{
                    type: 'material-community',
                    name: hidePassword.newPasswordRepeat ? 'eye-outline' : 'eye-off-outline',
                    color: '#c2c2c2',
                    onPress:() => setHidePassword({ ...hidePassword, newPasswordRepeat: !hidePassword.newPasswordRepeat})
                }}
                errorMessage={error.newPasswordRepeat}
            />
            <Button
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={updatePassword}
                loading={isLoading}
            />
            <Text>{error.general}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: '95%',
    },
    btn: {
        backgroundColor: '#00a680',
    }
})