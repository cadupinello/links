import AsyncStorage from "@react-native-async-storage/async-storage";

const LINKS_STORAGE_KEY = 'links-storage';

export type linkStorageProps = {
  id: string;
  name: string;
  url: string;
  category: string;
}

async function get(): Promise<linkStorageProps[]> {
  const storage = await AsyncStorage.getItem(LINKS_STORAGE_KEY);
  const response = storage ? JSON.parse(storage) : [];

  return response;
}

async function save(mewLink: linkStorageProps) {
  try {
    const storage = await get();
    
    await AsyncStorage.setItem(
      LINKS_STORAGE_KEY,
      JSON.stringify([...storage, mewLink])
    );

  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function remove(id: string) {
  try {
    const storage = await get();

    await AsyncStorage.setItem(
      LINKS_STORAGE_KEY,
      JSON.stringify(storage.filter((item) => item.id !== id))
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const linkStorage = { get, save, remove };
