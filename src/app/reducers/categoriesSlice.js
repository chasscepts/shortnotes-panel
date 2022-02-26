import {
  createCategory, deleteCategory, getCategories, updateCategory,
} from '../../api';
import createSlice from '../../redux/create-slice';
import { removeNotesOfCategory } from './notesSlice';

/* eslint-disable no-param-reassign */
const slice = createSlice({
  name: 'categories',
  initialState: {
    all: {
      items: null,
      error: null,
      loading: false,
    },
    posting: {
      item: null,
      error: null,
      loading: false,
    },
    deleting: {
      item: null,
      error: null,
      loading: false,
    },
    current: {
      id: 0,
      name: '',
    },
  },
  reducers: {
    setCategories: (state, { payload }) => {
      state.all = { ...state.all, ...payload };
    },
    setCurrentCategory: (state, { payload }) => {
      state.current = payload;
    },
    updateCurrentCategory: (state, { payload }) => {
      state.current.name = payload.name;
      state.current = { ...payload };
      state.posting = { ...state.posting, error: null, loading: false };
    },
    setPostingCategory: (state, { payload }) => {
      state.posting = { ...state.posting, ...payload };
    },
    setDeletingCategory: (state, { payload }) => {
      state.deleting = { ...state.deleting, ...payload };
    },
    addCategory: (state, { payload }) => {
      const items = state.all.items ? [...state.all.items] : [];
      items.push(payload);
      state.all = { ...state.all, items };
      state.current = payload;
    },
    removeCategory: (state, { payload }) => {
      const items = state.all.items.filter((item) => item.id !== payload);
      state.all = { ...state.all, items };
      if (state.current.id === payload) {
        state.current = { id: 0, name: '' };
      }
    },
  },
});
/* eslint-enable no-param-reassign */

export const {
  setCategories,
  setCurrentCategory,
  updateCurrentCategory,
  addCategory,
  setPostingCategory,
  setDeletingCategory,
  removeCategory,
} = slice.actions;

export const selectCategories = (state) => state.categories.all;
export const selectCurrentCategory = (state) => state.categories.current;
export const selectPostingCategory = (state) => state.categories.posting;
export const selectDeletingCategory = (state) => state.categories.deleting;

export const loadCategoriesAsync = () => (dispatch, getState) => {
  if (getState().categories.all.loading) return;
  dispatch(setCategories({ loading: true }));
  getCategories()
    .then((categories) => {
      dispatch(setCategories({ items: categories, error: null, loading: false }));
    })
    .catch((err) => {
      dispatch(setCategories({ error: err.message, loading: false }));
    });
};

export const createCategoryAsync = (token, name) => (dispatch) => {
  dispatch(setPostingCategory({ loading: true }));
  createCategory(token, { name })
    .then((category) => {
      dispatch(addCategory(category));
      dispatch(setPostingCategory({ loading: false, error: null }));
    })
    .catch((err) => dispatch(setPostingCategory({ loading: false, error: err.message })));
};

export const updateCategoryAsync = (token, category) => (dispatch) => {
  dispatch(setPostingCategory({ loading: true }));
  updateCategory(token, category)
    .then(() => {
      dispatch(updateCurrentCategory(category));
    })
    .catch((err) => dispatch(setPostingCategory({ loading: false, error: err.message })));
};

export const deleteCategoryAsync = (token, id) => (dispatch) => {
  dispatch(setDeletingCategory({ item: id, loading: true }));
  deleteCategory(token, id)
    .then(() => {
      dispatch(removeCategory(id));
      dispatch(removeNotesOfCategory(id));
      dispatch(setDeletingCategory({ loading: false, item: null }));
    })
    .catch((err) => dispatch(setDeletingCategory({ loading: false, error: err.message })));
};

export default slice.reducer;
