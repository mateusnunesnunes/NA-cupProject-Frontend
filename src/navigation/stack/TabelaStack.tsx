import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabelaScreen from '../../screens/Tabela/TabelaScreen';

const Stack = createNativeStackNavigator();

export default function TabelaStack() {
  return (
    <Stack.Navigator id={undefined}>
      <Stack.Screen
        name="TabelaPrincipal"
        component={TabelaScreen}
        options={{ title: 'Tabela' }}
      />
    </Stack.Navigator>
  );
}
