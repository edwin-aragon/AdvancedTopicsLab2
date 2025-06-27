import { Tabs } from 'expo-router';
import { colors } from '../../styles/globalStyles';
import { JSX } from 'react';

export default function TabLayout(): JSX.Element {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="add-transaction"
        options={{
          title: 'Add Transaction',
          tabBarIcon: () => null,
        }}
      />
    </Tabs>
  );
}
