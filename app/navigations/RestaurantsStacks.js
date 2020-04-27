import { createStackNavigator } from 'react-navigation-stack';
import RestaurantsScreen from '../screens/Restaurants';
import AddRestaurant from '../screens/Restaurants/AddRestauntant';
import RestaurantScreen from '../screens/Restaurants/Restaurant';

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
    },
    Restaurant: {
        screen: RestaurantScreen,
        navigationOptions: (props) => ({
            // TODO: params que recibe el componnente padre
            title: props.navigation.state.params.restaurant.item.name
        }),
    }
});

export default RestaurantsScreenStacks;