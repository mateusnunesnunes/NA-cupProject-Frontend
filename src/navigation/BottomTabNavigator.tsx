import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import AlbumStack from './stack/AlbumStack';
import PerfilStack from './stack/PerfilStack';
import TabelaStack from './stack/TabelaStack';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
      <Tab.Navigator
        initialRouteName="Album"
        id={undefined}
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: 'black',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 60,
            paddingBottom: 6,
            paddingTop: 6,
          },
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Album':
                iconName = focused ? 'book' : 'book-outline';
                break;
              case 'Tabela':
                iconName = focused ? 'calendar-clear' : 'calendar-clear-outline';
                break;
              case 'Perfil':
                iconName = focused ? 'person' : 'person-outline';
                break;
              default:
                iconName = 'ellipse-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Album" component={AlbumStack} />
        <Tab.Screen name="Tabela" component={TabelaStack} />
        <Tab.Screen name="Perfil" component={PerfilStack} />
      </Tab.Navigator>
  );
};

export default TabNavigator;
