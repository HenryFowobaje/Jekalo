import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";

import HomeScreen from "./index";
import GoalsScreen from "./goals";
import FriendsScreen from "./friends";

const Tabs = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" component={HomeScreen} options={{ title: "Home", tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} /> }} />
      <Tabs.Screen name="goals" component={GoalsScreen} options={{ title: "Goals", tabBarIcon: ({ color }) => <FontAwesome name="check-circle" size={24} color={color} /> }} />
      <Tabs.Screen name="friends" component={FriendsScreen} options={{ title: "Friends", tabBarIcon: ({ color }) => <FontAwesome name="users" size={24} color={color} /> }} />
    </Tabs.Navigator>
  );
}
