import { AntDesign } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const TabBar = ({ state, descriptors, navigation }) => {

    const icons = {
        home: (props) => ( <AntDesign name='home' size={20} color={'rgb(124, 126, 255)'} { ...props } /> ),
        commits: (props) => ( <Feather name="git-commit" size={20} color={'rgb(124, 126, 255)'} { ...props } /> ),
        profile: (props) => ( <AntDesign name='user' size={20} color={'rgb(124, 126, 255)'} { ...props } /> )
    };

    return(
        <View style={ styles.tabbar }>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                options.tabBarLabel !== undefined
                    ? options.tabBarLabel
                    : options.title !== undefined
                    ? options.title
                    : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name, route.params);
                }
                };

                const onLongPress = () => {
                navigation.emit({
                    type: 'tabLongPress',
                    target: route.key,
                });
                };

                return (
                <TouchableOpacity
                    style={ styles.tabbarItem }
                    key={index}
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    testID={options.tabBarButtonTestID}
                    onPress={onPress}
                    onLongPress={onLongPress}
                >
                    {
                        icons[route.name]({ color: isFocused ? 'rgb(124, 126, 255)' : 'gray' })
                    }
                    <Text style={{ color: isFocused ? 'rgb(124, 126, 255)' : 'gray', fontSize: 8,  } }>
                    {label}
                    </Text>
                </TouchableOpacity>
                );
            })}
        </View>
    );
} 

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 10,
        marginHorizontal: 20,
        width: '90%',
        borderRadius: 25,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        shadowOpacity: 0.1,
    },
    tabbarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
    }
});



export default TabBar;