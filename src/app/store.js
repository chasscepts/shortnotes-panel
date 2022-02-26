import configureStore from '../redux/configure-store';
import notesReducer from './reducers/notesSlice';
import categoriesReducer from './reducers/categoriesSlice';
import userReducer from './reducers/userSlice';

const store = configureStore({
  categories: categoriesReducer,
  notes: notesReducer,
  user: userReducer,
});

export default store;
