// src/navigation/stack/AlbumStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AlbumDetail from '../../screens/Album/AlbumDetails';
import AlbumScreen from '../../screens/Album/AlbumScreen';

// Definição dos parâmetros de cada rota
export type AlbumStackParamList = {
  AlbumList: undefined;
  AlbumDetails: { albumId: number };
};

const Stack = createNativeStackNavigator<AlbumStackParamList>();

export default function AlbumStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AlbumList" component={AlbumScreen} options={{ title: 'Meus Álbuns' }} />
      <Stack.Screen name="AlbumDetails" component={AlbumDetail} options={{ title: 'Detalhes do Álbum' }} />
    </Stack.Navigator>
  );
}
