import { createStackNavigator } from 'react-navigation-stack';
import TopRestaurantsScreen from '../screens/TopRestaurants';

const TopListsScreenStacks = createStackNavigator({
    TopRestaurants: {
        screen: TopRestaurantsScreen,
        navigationOptions: () => ({
            title: 'Los mejores restaurantes',
        })
    }
});

export default TopListsScreenStacks;