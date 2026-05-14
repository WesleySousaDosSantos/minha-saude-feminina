import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useQuickAction } from '../../lib/QuickAction';

function CenterPlusButton() {
  const { open } = useQuickAction();
  return (
    <TouchableOpacity
      style={styles.plusWrap}
      onPress={() => open()}
      activeOpacity={0.85}
    >
      <View style={styles.plusButton}>
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#C56682',
        tabBarInactiveTintColor: '#9E9E9E',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 12,
          elevation: 12,
        },
      }}
    >
      <Tabs.Screen
        name="hoje"
        options={{
          title: 'Hoje',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ciclo"
        options={{
          title: 'Ciclo',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'calendar' : 'calendar-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="registrar"
        options={{
          title: '',
          tabBarButton: (props) => <CenterPlusButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="conteudos"
        options={{
          title: 'Conteúdos',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'book' : 'book-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  plusWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#C43A4A',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    shadowColor: '#C43A4A',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 10,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
});
