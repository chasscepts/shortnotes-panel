import configureStore from '../redux/configure-store';
import notesReducer from './reducers/notesSlice';
import categoriesReducer from './reducers/categoriesSlice';
import modeReducer from './reducers/modeSlice';
import userReducer from './reducers/userSlice';

const store = configureStore({
  categories: categoriesReducer,
  notes: notesReducer,
  mode: modeReducer,
  user: userReducer,
});

export default store;
