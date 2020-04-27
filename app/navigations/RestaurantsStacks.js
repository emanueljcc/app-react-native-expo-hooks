import { createStackNavigator } from 'react-navigation-stack';
import RestaurantsScreen from '../screens/Restaurants';
import AddRestaurant from '../screens/Restaurants/AddRestauntant';

const RestaurantsScreenStacks = createStackNavigator({
    Restaurants: {
        screen: RestaurantsScreen,
        navigationOptions: () => ({
            title: 'Restaurantes'
        }),
    },
    AddRestaurant: {
        screen: AddRestaurant,
        navigationOptions: () => ({
            title: 'Nuevo Restaurante'
        }),
    }
});

export default RestaurantsScreenStacks;