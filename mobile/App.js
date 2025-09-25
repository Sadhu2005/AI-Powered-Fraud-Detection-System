import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import SMSScannerScreen from './src/screens/SMSScannerScreen';
import QRScannerScreen from './src/screens/QRScannerScreen';
import TransactionScreen from './src/screens/TransactionScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import DashboardScreen from './src/screens/DashboardScreen';

// Theme
import { theme } from './src/theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'shield' : 'shield-outline';
          } else if (route.name === 'SMS') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'QR') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Transaction') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Dashboard') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4361ee',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#4361ee',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'SafeGuard AI' }}
      />
      <Tab.Screen 
        name="SMS" 
        component={SMSScannerScreen}
        options={{ title: 'SMS Scanner' }}
      />
      <Tab.Screen 
        name="QR" 
        component={QRScannerScreen}
        options={{ title: 'QR Scanner' }}
      />
      <Tab.Screen 
        name="Transaction" 
        component={TransactionScreen}
        options={{ title: 'Transactions' }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <StatusBar style="light" backgroundColor="#4361ee" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ 
              headerShown: true,
              title: 'Settings',
              headerStyle: { backgroundColor: '#4361ee' },
              headerTintColor: '#fff'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
