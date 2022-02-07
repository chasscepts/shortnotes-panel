import createSlice from '../../redux/create-slice';
import modes from '../../utilities/modes';

/* eslint-disable no-param-reassign */
const slice = createSlice({
  name: 'mode',
  initialState: {
    current: modes.edit,
  },
  reducers: {
    setMode: (state, { payload }) => {
      state.current = payload;
    },
  },
});
/* eslint-enable no-param-reassign */

export const { setMode } = slice.actions;

export const selectMode = (state) => state.mode.current;

export default slice.reducer;
