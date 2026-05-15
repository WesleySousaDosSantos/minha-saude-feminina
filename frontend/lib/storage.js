import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'msf.auth.token';
const USER_KEY = 'msf.auth.user';

export async function saveSession(token, user) {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(user)],
  ]);
}

export async function loadSession() {
  const pairs = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
  const map = Object.fromEntries(pairs);
  const token = map[TOKEN_KEY];
  const userRaw = map[USER_KEY];
  if (!token || !userRaw) return null;
  try {
    return { token, user: JSON.parse(userRaw) };
  } catch {
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
}

export async function updateStoredUser(user) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}
