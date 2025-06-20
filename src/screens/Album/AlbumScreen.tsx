import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { fetchAlbumsByUser } from '../../services/albumService';

interface Album {
  id: number;
  name: string;
  description?: string;
  image?: string;
  albumItems: { id: number; owned: boolean }[]; // importante!
}
type RootStackParamList = {
  AlbumDetails: { albumId: number };
  // add other routes here if needed
};

export default function AlbumScreen() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    async function loadAlbums() {
      try {
        setLoading(true);
        const data = await fetchAlbumsByUser(1); // usuário fixo para testes
        setAlbums(data);
      } catch (err: any) {
        setError(err.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }
    loadAlbums();
  }, []);

  useEffect(() => {
  //console.log("Álbuns atualizados: ", albums);
  }, [albums]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Nenhum álbum encontrado.</Text>
      </View>
    );
  }

  function renderAlbum({ item }: { item: Album }) {
    return (
      <TouchableOpacity
        style={styles.albumContainer}
        onPress={() => navigation.navigate('AlbumDetails', { albumId: item.id })}

      >
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.albumImage} />
        ) : (
          <View style={[styles.albumImage, { backgroundColor: '#ccc' }]} />
        )}
        <View style={styles.albumInfo}>
          <Text style={styles.albumName}>{item.name}</Text>
          {item.description ? (
            <Text style={styles.albumDescription}>{item.description}</Text>
          ) : null}
          <Text style={styles.stickersCount}>
            Figurinhas: {item.albumItems.length}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      data={albums}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderAlbum}
      contentContainerStyle={{ padding: 16 }}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  albumContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  albumImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  albumInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  albumName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  albumDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 6,
  },
  stickersCount: {
    fontSize: 12,
    color: '#999',
  },
});
