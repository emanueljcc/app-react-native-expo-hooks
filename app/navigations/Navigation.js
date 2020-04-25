import React from 'react';
import { Icon } from 'react-native-elements';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import RestaurantsScreenStacks from './RestaurantsStacks';

const NavigationStacks = createBottomTabNavigator({
        Restaurants: {
            screen: RestaurantsScreenStacks,
            navigationOptions: () => ({
                tabBarLabel: 'Restaurantes',
                tapBarIcon: ({ tintColor }) => (
                    <Icon
                        type="material-comunity"
                        name="compass-outline"
                        size="22"
                        color={tintColor}
                    />
                )
            }),
        }
    }
);

export default createAppContainer(NavigationStacks);