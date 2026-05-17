import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NotesProvider } from './src/context/NotesContext';
import AppNavigator from './src/navigation/AppNavigator';
import CreateNoteScreen from './src/screens/CreateNoteScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NotesProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main" component={AppNavigator} />
            <Stack.Screen
              name="CreateNote"
              component={CreateNoteScreen}
              options={{ presentation: 'card' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NotesProvider>
    </SafeAreaProvider>
  );
}