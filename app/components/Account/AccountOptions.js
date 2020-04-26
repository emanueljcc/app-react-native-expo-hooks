import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ListItem } from 'react-native-elements';

export default function AccountOptions() {

    const menuOptions = [
        {
            title: 'Cambiar nombres y apellidos',
            iconType: 'material-community',
            iconNameLeft: 'account-circle',
            iconColorLeft: '#ccc',
            iconNameRight: 'chevron-right',
            iconColorRight: '#ccc',
            onPress: () => {
                console.log('change display name');
            }
        },
        {
            title: 'Cambiar email',
            iconType: 'material-community',
            iconNameLeft: 'at',
            iconColorLeft: '#ccc',
            iconNameRight: 'chevron-right',
            iconColorRight: '#ccc',
            onPress: () => {
                console.log('change email');
            }
        },
        {
            title: 'Cambiar contraseña',
            iconType: 'material-community',
            iconNameLeft: 'lock-reset',
            iconColorLeft: '#ccc',
            iconNameRight: 'chevron-right',
            iconColorRight: '#ccc',
            onPress: () => {
                console.log('change pass');
            }
        }
    ];

    return (
        <View>
            {menuOptions.map((menu, i) => (
                <ListItem
                    key={i}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft
                    }}
                    rightIcon= {{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight
                    }}
                    onPress={menu.onPress}
                    containerStyle={styles.menuItem}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#e3e3e3',
    }
})