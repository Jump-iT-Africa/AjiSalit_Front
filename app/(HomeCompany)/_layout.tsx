import { Tabs } from "expo-router";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
export default function HomeLayouts()
{
    return(
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: 'black',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 0,
                }
            }}
        >   
            <Tabs.Screen
                name="index"
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color }) => (
                            <FontAwesome5 name="plus" size={24} color="black" />
                        ),
                    }}
                />

        </Tabs>
    )
}