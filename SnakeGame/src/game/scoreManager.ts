import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@snake_high_score';

export const loadHighScore = async (): Promise<number> => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
};

export const saveHighScore = async (score: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, score.toString());
  } catch (error) {
    console.error('Erro ao guardar pontuação:', error);
  }
};