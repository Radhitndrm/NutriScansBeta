import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";

import { AuthProvider, useAuth } from "./app/context/AuthContext";

// Auth
import LoginScreen from "./app/screens/auth/LoginScreen";
import RegisterScreen from "./app/screens/auth/RegisterScreen";
import ForgotPasswordScreen from "./app/screens/auth/ForgotPasswordScreen";

// Main tabs
import ScanScreen from "./app/screens/user/ScanScreen";
import HistoryScreen from "./app/screens/user/HistoryScreen";
import ProfileScreen from "./app/screens/user/ProfileScreen";

// Info (Artikel)
import ArtikelListScreen from "./app/screens/user/ArtikelListScreen";
import ArtikelDetailScreen from "./app/screens/user/ArtikelDetailScreen";

// Tips
import TipsListScreen from "./app/screens/user/TipsListScreen";
import TipsDetailScreen from "./app/screens/user/TipsDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HEADER_OPTS = {
  headerStyle: { backgroundColor: "#4a4f42" },
  headerTintColor: "#ccc9be",
  headerTitleStyle: { fontWeight: "bold" },
};

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}

function InfoStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="ArtikelList" component={ArtikelListScreen} options={{ title: "Artikel Gizi" }} />
      <Stack.Screen name="ArtikelDetail" component={ArtikelDetailScreen} options={{ title: "Artikel" }} />
    </Stack.Navigator>
  );
}

function TipsStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen name="TipsList" component={TipsListScreen} options={{ title: "Tips Gizi" }} />
      <Stack.Screen name="TipsDetail" component={TipsDetailScreen} options={{ title: "Tips" }} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#4a4f42",
        tabBarInactiveTintColor: "#9a9a90",
        tabBarStyle: { backgroundColor: "#ccc9be", borderTopColor: "#b8bdb2" },
      }}
    >
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          title: "Scan",
          headerShown: true,
          ...HEADER_OPTS,
          headerTitle: "Scan Makanan",
          tabBarIcon: ({ color, size }) => <Ionicons name="camera-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: "Riwayat",
          headerShown: true,
          ...HEADER_OPTS,
          headerTitle: "Riwayat",
          tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Info"
        component={InfoStack}
        options={{
          title: "Artikel",
          tabBarIcon: ({ color, size }) => <Ionicons name="newspaper-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Tips"
        component={TipsStack}
        options={{
          title: "Tips",
          tabBarIcon: ({ color, size }) => <Ionicons name="bulb-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profil",
          headerShown: true,
          ...HEADER_OPTS,
          headerTitle: "Profil",
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ccc9be" }}>
        <ActivityIndicator size="large" color="#4a4f42" />
      </View>
    );
  }

  return user ? <MainTabs /> : <AuthStack />;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#ccc9be" }}>
        <ActivityIndicator size="large" color="#4a4f42" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
