import React, { useState } from 'react';
import { SocialIcon } from 'react-native-elements';
import * as firebase from 'firebase';
import * as Facebook from 'expo-facebook';
import { FacebookApi } from '../../utils/Social';
import Loading from '../Loading';

export default function LoginFacebook(props) {
    const { toastRef, navigation } = props;

    const [isLoading, setIsLoading] = useState(false);

    const login = async () => {
        setIsLoading(true);
        try {
            await Facebook.initializeAsync(FacebookApi.application_id, 'app-restaurants');

            const { type, token } = await Facebook.logInWithReadPermissionsAsync(
                FacebookApi.application_id,
                { permissions: FacebookApi.permissions }
            );

            if (type === 'success') {
                const credentials = firebase.auth.FacebookAuthProvider.credential(token);
                // LOGIN FB
                await firebase
                    .auth()
                    .signInWithCredential(credentials);

                // LOGIN CORRECTO
                navigation.navigate('MyAccount');

            } else if(type === 'cancel') {
                toastRef.current.show('inicio de sesion cancelado');
            }

        } catch (error) {
            toastRef.current.show(error);
        }
        setIsLoading(false);
    };

    return (
        <>
            <SocialIcon
                title="Iniciar sesion con Facebook"
                button
                type="facebook"
                onPress={login}
            />
            <Loading isVisible={isLoading} text="Iniciando sesion" />
        </>
    );
}