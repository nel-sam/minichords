import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import { useTranslation } from 'react-i18next';

import Colors from '../../constants/Colors';
import useColorScheme from '../../hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{ tabBarActiveTintColor: Colors[colorScheme].tint }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="add-songs"
        options={{
          title: t('add-songs'),
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="my-songs"
        options={{
          title: t('my-songs'),
          tabBarIcon: ({ color }) => <TabBarIcon name="music" color={color as string} />,
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} {...props} />;
}