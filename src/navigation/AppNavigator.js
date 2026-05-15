import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, View, Text, StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants/theme';
import icons from '../constants/icons';

import HomeScreen       from '../screens/HomeScreen';
import SearchScreen     from '../screens/SearchScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import RemindersScreen  from '../screens/RemindersScreen';
import TasksScreen      from '../screens/TasksScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ iconDefault, iconSelected, label, focused }) {
  return (
    <View style={styles.tabItem}>
      <Image
        source={focused ? iconSelected : iconDefault}
        style={[styles.tabIcon, { tintColor: focused ? COLORS.accent : COLORS.textMuted }]}
        resizeMode="contain"
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconDefault={icons.homeDefault}
              iconSelected={icons.homeSelected}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconDefault={icons.searchDefault}
              iconSelected={icons.searchSelected}
              label="Search"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconDefault={icons.categoriesDefault}
              iconSelected={icons.categoriesSelected}
              label="Categories"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconDefault={icons.remindersDefault}
              iconSelected={icons.remindersSelected}
              label="Reminders"
              focused={focused}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              iconDefault={icons.moreDefault}
              iconSelected={icons.moreSelected}
              label="Tasks"
              focused={focused}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === 'web' ? 64 : 82,
    paddingBottom: Platform.OS === 'web' ? 6 : 18,
    paddingTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#2C2416',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  tabIcon: {
    width: 22,
    height: 22,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  tabLabelActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },
});