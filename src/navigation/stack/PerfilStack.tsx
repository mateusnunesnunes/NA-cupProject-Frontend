import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PerfilScreen from '../../screens/Perfil/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function PerfilStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen
        name="PerfilPrincipal"
        component={PerfilScreen}
        options={{ title: 'Perfil' }}
      />
    </Stack.Navigator>
  );
}
