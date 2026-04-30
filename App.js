import "./global.css";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";

import { AuthProvider, useAuth } from "./app/context/AuthContext";
import { C } from "./app/theme/colors";

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
  headerStyle: { backgroundColor: C.smoke },
  headerTintColor: C.skyWarm,
  headerTitleStyle: { fontWeight: "bold", fontFamily: "Inter_700Bold" },
};

const TAB_ROUTES = {
  Scan: { active: "camera", inactive: "camera-outline", title: "Scan" },
  History: { active: "time", inactive: "time-outline", title: "Riwayat" },
  Info: { active: "newspaper", inactive: "newspaper-outline", title: "Info" },
  Tips: { active: "bulb", inactive: "bulb-outline", title: "Tips" },
  Profile: { active: "person", inactive: "person-outline", title: "Profil" },
};

/* ── Custom Tab Bar ── */
function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: C.tabBg,
        paddingTop: 10,
        paddingBottom: insets.bottom + 8,
        paddingHorizontal: 6,
      }}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const meta = TAB_ROUTES[route.name] ?? {
          active: "help",
          inactive: "help-outline",
          title: route.name,
        };

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented)
            navigation.navigate(route.name);
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: "center" }}
            activeOpacity={0.7}
          >
            <View
              style={{
                backgroundColor: isFocused ? C.skyWarm : "transparent",
                borderRadius: 14,
                padding: 8,
                marginBottom: 3,
              }}
            >
              <Ionicons
                name={isFocused ? meta.active : meta.inactive}
                size={22}
                color={isFocused ? C.smoke : "rgba(255,255,255,0.45)"}
              />
            </View>
            <Text
              style={{
                color: isFocused ? C.skyWarm : "rgba(255,255,255,0.45)",
                fontSize: 10,
                fontFamily: isFocused
                  ? "Inter_600SemiBold"
                  : "Inter_400Regular",
              }}
            >
              {meta.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

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
      <Stack.Screen
        name="ArtikelList"
        component={ArtikelListScreen}
        options={{ title: "Artikel Gizi" }}
      />
      <Stack.Screen
        name="ArtikelDetail"
        component={ArtikelDetailScreen}
        options={{ title: "Artikel" }}
      />
    </Stack.Navigator>
  );
}

function TipsStack() {
  return (
    <Stack.Navigator screenOptions={HEADER_OPTS}>
      <Stack.Screen
        name="TipsList"
        component={TipsListScreen}
        options={{ title: "Tips Gizi" }}
      />
      <Stack.Screen
        name="TipsDetail"
        component={TipsDetailScreen}
        options={{ title: "Tips" }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Scan"
    >
      <Tab.Screen name="Info" component={InfoStack} />
      <Tab.Screen name="Tips" component={TipsStack} />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          headerShown: true,
          ...HEADER_OPTS,
          headerTitle: "Scan Makanan",
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ headerShown: true, ...HEADER_OPTS, headerTitle: "Riwayat" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: true, ...HEADER_OPTS, headerTitle: "Profil" }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: C.skyWarm,
        }}
      >
        <ActivityIndicator size="large" color={C.smoke} />
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: C.skyWarm,
        }}
      >
        <ActivityIndicator size="large" color={C.smoke} />
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
