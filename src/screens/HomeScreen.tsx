// src/screens/HomeScreen.tsx

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const fakeAlbums = [
  { id: 1, name: "Meu Álbum", date: "10/07/2022", progress: 35 },
  { id: 2, name: "Meu Álbum", date: "10/07/2022", progress: 50 },
  { id: 3, name: "Meu Álbum", date: "10/07/2022", progress: 15 },
  { id: 4, name: "Meu Álbum", date: "10/07/2022", progress: 75 },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Botões principais */}
      <View style={styles.topButtons}>
        <View style={styles.row}>
          <Button title="asd QasRCode" />
          <Button title="Compartilhar álbum" />
        </View>
        <View style={styles.row}>
          <Button title="Visualizar Álbum externo" />
          <Button title="Visualizar relatório" />
        </View>
      </View>

      {/* Lista de álbuns */}
      <Text style={styles.title}>Álbuns</Text>
      {fakeAlbums.map(album => (
        <View key={album.id} style={styles.albumCard}>
          <Image source={require('../assets/sticker-sample.jpg')} style={styles.albumImage} />
          <View style={styles.albumInfo}>
            <Text style={styles.albumName}>{album.name}</Text>
            <Text style={styles.albumDate}>{album.date}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${album.progress}%` }]} />
            </View>
          </View>
          <Ionicons name="ellipsis-vertical" size={20} color="gray" />
        </View>
      ))}

      {/* Botão flutuante */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );
}

function Button({ title }: { title: string }) {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  topButtons: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: '#EEE',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  albumCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  albumImage: {
    width: 50,
    height: 70,
    borderRadius: 5,
    marginRight: 10,
  },
  albumInfo: {
    flex: 1,
  },
  albumName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  albumDate: {
    color: 'gray',
    fontSize: 12,
  },
  progressBarContainer: {
    backgroundColor: '#DDD',
    borderRadius: 5,
    height: 6,
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    borderRadius: 5,
    backgroundColor: '#00C851',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#2196F3',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});
