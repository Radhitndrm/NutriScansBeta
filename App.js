import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";

import ScanScreen from './app/screens/ScanScreen'
import HistoryScreen from './app/screens/HistoryScreen'
import ProfileScreen from './app/screens/ProfileScreen'

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          tabBarActiveTintColor: '#4CAF50',
          tabBarInactiveBackgroundColor: 'gray',
        }}
      >
        <Tab.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            title: 'Scan Makanan',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🍽️</Text>,
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{
            title: 'Riwayat',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🗒️</Text>,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profil',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
