import React, { useState } from 'react';
import { StyleSheet,View } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { validateEmail } from '../../utils/Validation';
import * as firebase from 'firebase';
import { withNavigation } from 'react-navigation';
import Loading from '../Loading';

function RegisterForm(props) {
    const { navigation, toastRef } = props;

    const [hidePassword, setHidePassword] = useState({
        pass: true,
        rePass: true
    });

    const [form, setForm] = useState({
        email: '',
        password: '',
        repeatPassword: '',
    });

    const [isVisibleLoading, setIsVisibleLoading] = useState(false);

    const register = async () => {
        setIsVisibleLoading(true);
        try {
            if (!form.email || !form.password || !form.repeatPassword) {
                toastRef.current.show('Todos los campos son obligatorios.');
            } else {
                if (!validateEmail(form.email)) {
                    toastRef.current.show('El email no es correcto.');
                } else {
                    if (form.password !== form.repeatPassword) {
                        toastRef.current.show('Las contraseñas no son iguales.');
                    } else {
                        // TODO: BACKEND
                        // CREATE USER EMAIL FIREBASE
                        await firebase
                            .auth()
                            .createUserWithEmailAndPassword(form.email, form.password);

                        // REDIRECT
                        navigation.navigate('MyAccount');
                    }
                }
            }
            // hide loader
        } catch (error) {
            console.log(error);
            toastRef.current.show(String(error));
        }
        setIsVisibleLoading(false);
    }

    return (
        <View style={styles. formContainer} behavior="padding" enabled>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => setForm({ ...form, email: e.nativeEvent.text })}
                rightIcon={
                    <Icon
                        type="material-community"
                        name="at"
                        iconStyle={styles.iconRight}
                    />
                }
            />
            <Input
                placeholder="Contraseña"
                password
                secureTextEntry={hidePassword.pass}
                containerStyle={styles.inputForm}
                onChange={(e) => setForm({ ...form, password: e.nativeEvent.text })}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword.pass ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setHidePassword({ ...hidePassword, pass: !hidePassword.pass })}
                    />
                }
            />
            <Input
                placeholder="Repetir Contraseña"
                password
                secureTextEntry={hidePassword.rePass}
                containerStyle={styles.inputForm}
                onChange={(e) => setForm({ ...form, repeatPassword: e.nativeEvent.text })}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword.rePass ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setHidePassword({ ...hidePassword, rePass: !hidePassword.rePass })}
                    />
                }
            />
            <Button
                title="Unirse"
                containerStyle={styles.btnContainerRegister}
                buttonStyle={styles.btnRegister}
                onPress={register}
            />
            <Loading text="Creando cuenta" isVisible={isVisibleLoading} />
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    inputForm: {
        width: '100%',
        marginTop: 20,
    },
    iconRight: {
        color: '#c1c1c1',
    },
    btnContainerRegister: {
        marginTop: 20,
        width: '95%',
    },
    btnRegister: {
        backgroundColor: '#00a680',
    }
});

export default withNavigation(RegisterForm);