import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setMessage } from './message.slice';
import AuthService from '../services/auth.service';
import { setInvestment } from './investments.slice';
import UserService from '../services/user.service';

const user = JSON.parse(localStorage.getItem('user'));

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await AuthService.register(name, email, password);
      thunkAPI.dispatch(setMessage(response.message));
      return response.data;
    } catch (error) {
      const message = (error.message || error.toString()).split(/ (.*)/);
      thunkAPI.dispatch(setMessage(message[1]));
      return thunkAPI.rejectWithValue();
    }
  },
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, thunkAPI) => {
    try {
      const data = await AuthService.login(email, password);
      const investment = await UserService.getMyInvestment(data.userId);
      thunkAPI.dispatch(setMessage(data.message));
      thunkAPI.dispatch(setInvestment(investment));
      return { user: data };
    } catch (errors) {
      const message = errors.message || errors.toString();
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue();
    }
  },
);

export const logout = createAsyncThunk('auth/logout', () => {
  AuthService.logout();
});

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  extraReducers: {
    [register.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
    },
    [register.rejected]: (state, action) => {
      state.isLoggedIn = false;
    },
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
    },
    [login.rejected]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
    [logout.fulfilled]: (state, action) => {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

const { reducer } = authSlice;
export default reducer;
