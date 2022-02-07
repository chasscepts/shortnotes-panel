import {
  createCategory, deleteCategory, getCategories, updateCategory,
} from '../../api';
import createSlice from '../../redux/create-slice';

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
  },
  reducers: {
    setCategories: (state, { payload }) => {
      state.all = { ...state.all, ...payload };
    },
    setPostingCategory: (state, { payload }) => {
      state.editing = { ...state.editing, ...payload };
    },
    setDeletingCategory: (state, { payload }) => {
      state.deleting = { ...state.deleting, ...payload };
    },
    addCategory: (state, { payload }) => {
      let { all: { items } } = state;
      if (!items) {
        items = [];
      }
      items.push(payload);
      state.all = { ...state.all, items };
    },
    removeCategory: (state, { payload }) => {
      const items = state.all.items.filter((item) => item.id !== payload);
      state.all = { ...state.all, items };
    },
  },
});
/* eslint-enable no-param-reassign */

export const {
  setCategories,
  addCategory,
  setPostingCategory,
  setDeletingCategory,
  removeCategory,
} = slice.actions;

export const selectCategories = (state) => state.categories.all;
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

export const createCategoriesAsync = (token, name) => (dispatch) => {
  dispatch(setPostingCategory({ loading: true }));
  createCategory(token, { name })
    .then((item) => {
      dispatch(addCategory({ item }));
      dispatch(setPostingCategory({ loading: false, error: null }));
    })
    .catch((err) => dispatch(setPostingCategory({ loading: false, error: err.message })));
};

export const updateCategoryAsync = (token, category) => (dispatch) => {
  dispatch(setPostingCategory({ loading: true }));
  updateCategory(token, category.id, category)
    .then(() => {
      dispatch(setPostingCategory({ loading: false, error: null }));
    })
    .catch((err) => dispatch(setPostingCategory({ loading: false, error: err.message })));
};

export const deleteCategoryAsync = (token, id) => (dispatch) => {
  dispatch(setDeletingCategory({ item: id, loading: true }));
  deleteCategory(token, id)
    .then(() => {
      dispatch(removeCategory(id));
      dispatch(setDeletingCategory({ loading: false, item: null }));
    })
    .catch((err) => dispatch(setDeletingCategory({ loading: false, error: err.message })));
};

export default slice.reducer;
