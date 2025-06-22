// AlbumDetailsScreen.tsx
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';
import * as Progress from 'react-native-progress';
import { summarizeAlbumItems } from '../../scripts/summarizeAlbumItems';
import { fetchAlbumById, updateStickerOwnership } from '../../services/albumService';

// Tipagem da rota
type AlbumDetailsRouteProp = RouteProp<{ params: { albumId: number } }, 'params'>;

// Tipagem de cada figurinha no álbum
type AlbumItem = {
  owned: boolean;
  sticker: {
    id: number;
    number: number;
    country: string;
  };
};

// Habilita animação no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AlbumDetailsScreen() {
  const route = useRoute<AlbumDetailsRouteProp>();
  const { albumId } = route.params;

  const [album, setAlbum] = useState<any>(null);
  const [summary, setSummary] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [isLoadingSticker, setIsLoadingSticker] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  const loadAlbum = async () => {
    try {
      const data = await fetchAlbumById(albumId);
      setAlbum(data);
      const summarized = summarizeAlbumItems(data.albumItems || []);
      setSummary(summarized);
    } catch (error) {
      console.error("Erro ao carregar álbum:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAlbum();
    setRefreshing(false);
  };

  useEffect(() => {
    setLoading(true);
    loadAlbum().finally(() => setLoading(false));
  }, []);


  const toggleExpand = (country: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [country]: !prev[country] }));
  };

  const renderStickersGrid = (country: string) => {
    const totalByCountry = 20;

    const countryItems = album.albumItems.filter(
      (item: AlbumItem) => item.sticker.country === country
    );

    const ownedMap: Record<number, { owned: boolean; stickerId: number }> = {};
    countryItems.forEach((item: any) => {
      ownedMap[item.sticker.number] = {
        owned: item.owned,
        stickerId: item.sticker.id
      };
    });

    const fullStickerList = Array.from({ length: totalByCountry }, (_, i) => {
      const number = i + 1;
      const owned = ownedMap[number]?.owned || false;
      const stickerId = ownedMap[number]?.stickerId;
      return { number, owned, stickerId };
    });

    const handleToggleSticker = async (number: number, stickerId?: number) => {
      if (!stickerId || isLoadingSticker) return;

      setIsLoadingSticker(true);

      const newOwned = !ownedMap[number].owned;

      try {
        await updateStickerOwnership(album.id, stickerId, newOwned);

        setAlbum((prev: any) => {
          const updatedItems = prev.albumItems.map((item: any) =>
            item.sticker.id === stickerId ? { ...item, owned: newOwned } : item
          );
          return { ...prev, albumItems: updatedItems };
        });
      } catch (err) {
        console.error('Erro ao atualizar figurinha:', err);
      } finally {
        setIsLoadingSticker(false);
      }
    };

    return (
      <View style={styles.grid}>
        {fullStickerList.map(({ number, owned, stickerId }) => (
          <TouchableOpacity
            key={number}
            onPress={() => handleToggleSticker(number, stickerId)}
          >
            <View
              style={[
                styles.sticker,
                { backgroundColor: owned ? '#28a745' : '#dc3545' }
              ]}
            >
              <Text style={styles.stickerText}>{number}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

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
          contentContainerStyle={{ paddingBottom: 32 }}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          renderItem={({ item }) => {
          const isExpanded = expanded[item.country];

          return (
            <View style={styles.card}>
              <TouchableOpacity onPress={() => toggleExpand(item.country)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.flag}>{item.flag}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.country}>{item.country.replace('_', ' ')}</Text>
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
              </TouchableOpacity>

              {isExpanded && (
                <View style={{ overflow: 'hidden' }}>{renderStickersGrid(item.country)}</View>
              )}
            </View>
          );
        }}
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
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  flag: { fontSize: 28, marginRight: 10 },
  country: { fontWeight: 'bold', fontSize: 16 },
  details: { fontSize: 13, color: '#555' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8
  },
  sticker: {
    width: 40,
    height: 40,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  stickerText: {
    color: 'white',
    fontWeight: 'bold'
  }
});
