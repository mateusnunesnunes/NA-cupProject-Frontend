const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function fetchAlbums() {
  
  console.log(API_URL)
  const url = `${API_URL}/albums`;
  console.log('Fetch URL:', url);

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }
  
  const data = await response.json();
  console.log(data);
  return data;
}

export async function fetchAlbumsByUser(userId) {
  const response = await fetch(`${API_URL}/users/${userId}/albums`);
  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`);
  }
  return await response.json();
}

export async function fetchAlbumById(id) {
  const response = await fetch(`${API_URL}/albums/${id}`);
  if (!response.ok) throw new Error("Erro ao buscar álbum");
  return await response.json();
}