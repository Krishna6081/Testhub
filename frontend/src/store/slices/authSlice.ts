import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialToken = localStorage.getItem('testhub_token');
const initialUserJson = localStorage.getItem('testhub_user');
let parsedUser: User | null = null;
if (initialUserJson) {
  try {
    parsedUser = JSON.parse(initialUserJson);
  } catch (e) {
    parsedUser = null;
  }
}

const initialState: AuthState = {
  user: parsedUser,
  token: initialToken,
  isAuthenticated: !!initialToken && !!parsedUser,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem('testhub_token', action.payload.token);
      localStorage.setItem('testhub_user', JSON.stringify(action.payload.user));
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem('testhub_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('testhub_token');
      localStorage.removeItem('testhub_user');
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setCredentials, updateUser, logout, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
