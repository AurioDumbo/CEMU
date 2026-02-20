import axios from 'axios';

export async function refreshAccessToken() {
  const refreshToken = sessionStorage.getItem('refreshToken');
  if (!refreshToken) return null;
  try {
    const res = await axios.post('/api/auth/refresh', { refreshToken });
    sessionStorage.setItem('token', res.data.accessToken);
    return res.data.accessToken;
  } catch {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    return null;
  }
}