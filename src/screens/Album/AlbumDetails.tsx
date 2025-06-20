import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View
} from 'react-native';
import * as Progress from 'react-native-progress';
import { summarizeAlbumItems } from '../../scripts/summarizeAlbumItems';
import { fetchAlbumById } from '../../services/albumService';

type AlbumDetailsRouteProp = RouteProp<{ params: { albumId: number } }, 'params'>;

export default function AlbumDetailsScreen() {
  const route = useRoute<AlbumDetailsRouteProp>();
  const { albumId } = route.params;

  const [album, setAlbum] = useState<any>(null);
  const [summary, setSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlbum() {
      try {
        const data = await fetchAlbumById(albumId);
        setAlbum(data);
        const summarized = summarizeAlbumItems(data.albumItems || []);
        setSummary(summarized);
      } catch (error) {
        console.error("Erro ao carregar álbum:", error);
      } finally {
        setLoading(false);
      }
    }
    loadAlbum();
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

  const total = summary.reduce((acc, cur) => acc + cur.total, 0);
  const owned = summary.reduce((acc, cur) => acc + cur.owned, 0);
  const missing = total - owned;
  const percent = total ? owned / total : 0;

  return (
    <View style={styles.container}>
      {album?.image && <Image source={{ uri: album.image }} style={styles.headerImage} />}
      <Text style={styles.title}>{album.name}</Text>
      <Text style={styles.subtitle}>{album.description}</Text>

      <View style={styles.metrics}>
        <Text>Total: {total} figurinhas</Text>
        <Text>Obtidas: {owned}</Text>
        <Text>Faltam: {missing}</Text>
        <Progress.Bar progress={percent} width={null} color="#28a745" style={{ marginTop: 8 }} />
        <Text style={{ alignSelf: 'flex-end', fontSize: 12 }}>{Math.round(percent * 100)}%</Text>
      </View>

      <FlatList
        data={summary}
        keyExtractor={(item) => item.country}
        renderItem={({ item }) => (
            <View style={styles.card}>
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={{ flex: 1 }}>
                <Text style={styles.country}>{item.country}</Text>
                <Text style={styles.details}>
                {item.owned}/{item.total} figurinhas — Faltam {item.missing}
                </Text>
                <Progress.Bar
                progress={item.percent}
                width={null}
                color="#007AFF"
                style={{ marginTop: 6 }}
                />
                <Text style={{ alignSelf: 'flex-end', fontSize: 12 }}>
                    {isNaN(item.percent) ? '0%' : `${Math.round(item.percent * 100)}%`}
                    </Text>
            </View>
            </View>
        )}
        contentContainerStyle={{ paddingBottom: 32 }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', paddingHorizontal: 16 },
  headerImage: { width: '100%', height: 180, borderRadius: 8, marginTop: 8 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 12 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 12 },
  metrics: {
    backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3,
    elevation: 3
  },
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', marginBottom: 10, borderRadius: 8,
    padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1,
    shadowRadius: 3, elevation: 2
  },
  flag: { fontSize: 28, marginRight: 10 },
  country: { fontWeight: 'bold', fontSize: 16 },
  details: { fontSize: 13, color: '#555' }
});
