import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Input, Icon, Button } from 'react-native-elements';
import { validateEmail } from '../../utils/Validation';
import Loading from '../Loading';
import { withNavigation } from 'react-navigation';
import * as firebase from 'firebase';

function LoginForm(props) {
    const { toastRef, navigation } = props;
    const [form, setForm] = useState({
        email: '',
        password: '',
    })
    const [hidePassword, setHidePassword] = useState(true);
    const [isVisibleLoding, setIsVisibleLoading] = useState(false);

    const login = async () => {
        setIsVisibleLoading(true);
        try {
            if (!form.email || !form.password) {
                toastRef.current.show('Todos los campos son necesarios')
            } else {
                if (!validateEmail(form.email)) {
                    toastRef.current.show('correo no es correcto');
                } else {
                    toastRef.current.show('iniciando session')

                    await firebase
                        .auth()
                        .signInWithEmailAndPassword(form.email, form.password);

                    // REDIRECT
                    navigation.navigate('MyAccount');
                }
            }
        } catch (error) {
            console.log(error);
            toastRef.current.show(String(error));
        }
        setIsVisibleLoading(false);
    }

    return (
        <View style={styles.formContainer}>
            <Input
                placeholder="Correo Electronico"
                containerStyle={styles.inputForm}
                onChange={(e) => setForm({ ...form, email: e.nativeEvent.text})}
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
                secureTextEntry={hidePassword}
                containerStyle={styles.inputForm}
                onChange={(e) => setForm({ ...form, password: e.nativeEvent.text})}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={hidePassword ? "eye-outline" : "eye-off-outline"}
                        iconStyle={styles.iconRight}
                        onPress={() => setHidePassword(!hidePassword)}
                    />
                }
            />
            <Button
                title="Iniciar Sesion"
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={login}
            />
            <Loading isVisible={isVisibleLoding} text="Iniciando Sesion" />
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
        width: "100%",
        marginTop: 20,
    },
    iconRight: {
        color: '#c1c1c1',
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%",
    },
    btnLogin: {
        backgroundColor: '#00a680',
    }
});

export default withNavigation(LoginForm);