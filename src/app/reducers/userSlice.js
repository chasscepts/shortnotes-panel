import { login } from '../../api';
import createSlice from '../../redux/create-slice';

/* eslint-disable no-param-reassign */
const slice = createSlice({
  name: 'user',
  initialState: {
    current: null,
    isLogginIn: false,
    error: null,
  },
  reducers: {
    setUser: (state, { payload }) => {
      state.current = payload;
      state.isLogginIn = false;
      state.error = null;
    },
    setLoggingIn: (state, { payload }) => {
      state.error = null;
      state.isLogginIn = payload;
    },
    setUserError: (state, { payload }) => {
      state.error = payload;
      state.isLogginIn = false;
    },
  },
});
/* eslint-enable no-param-reassign */

export const {
  setUser,
  setLoggingIn,
  setUserError,
} = slice.actions;

export const selectUser = (state) => (state.user.current);
export const selectIsLoggingIn = (state) => (state.user.isLogginIn);
export const selectUserError = (state) => (state.user.error);

export const loginAsync = (email, password) => (dispatch, getState) => {
  if (getState().user.isLogginIn) return;
  dispatch(setLoggingIn(true));
  login({ email, password })
    .then((user) => {
      dispatch(setUser(user));
    })
    .catch((err) => {
      dispatch(setUserError(err.message));
    });
};

export default slice.reducer;
