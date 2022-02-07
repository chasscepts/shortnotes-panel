import {
  createNote, deleteNote, getNote, getNotes, updateNote,
} from '../../api';
import createSlice from '../../redux/create-slice';

/* eslint-disable no-param-reassign */
const slice = createSlice({
  name: 'notes',
  initialState: {
    all: {
      items: null,
      error: null,
      loading: false,
    },
    current: {
      item: null,
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
    setNotes: (state, { payload }) => {
      state.all = { ...state.all, ...payload };
    },
    setCurrentNote: (state, { payload }) => {
      state.current = { ...state.current, ...payload };
    },
    setPostingNote: (state, { payload }) => {
      state.editing = { ...state.editing, ...payload };
    },
    setDeletingNote: (state, { payload }) => {
      state.deleting = { ...state.deleting, ...payload };
    },
    addNote: (state, { payload }) => {
      let { all: { items } } = state;
      if (!items) {
        items = [];
      }
      items.push(payload);
      state.all = { ...state.all, items };
    },
    removeNote: (state, { payload }) => {
      const items = state.all.items.filter((item) => item.id !== payload);
      state.all = { ...state.all, items };
    },
  },
});
/* eslint-enable no-param-reassign */

export const {
  setNotes,
  addNote,
  setCurrentNote,
  setPostingNote,
  setDeletingNote,
  removeNote,
} = slice.actions;

export const selectNotes = (state) => state.notes.all;
export const selectCurrentNote = (state) => state.notes.current;
export const selectPostingNote = (state) => state.notes.posting;
export const selectDeletingNote = (state) => state.notes.deleting;

export const loadNotesAsync = () => (dispatch, getState) => {
  if (getState().notes.all.loading) return;
  dispatch(setNotes({ loading: true }));
  getNotes()
    .then((notes) => {
      dispatch(setNotes({ items: notes, error: null, loading: false }));
    })
    .catch((err) => {
      dispatch(setNotes({ error: err.message, loading: false }));
    });
};

export const createNoteAsync = (token, title, content) => (dispatch) => {
  dispatch(setPostingNote({ loading: true }));
  createNote(token, { title, content })
    .then((note) => {
      dispatch(addNote({ item: note }));
      dispatch(setPostingNote({ loading: false, error: null }));
    })
    .catch((err) => dispatch(setPostingNote({ loading: false, error: err.message })));
};

export const updateNoteAsync = (token, note) => (dispatch) => {
  dispatch(setPostingNote({ loading: true }));
  updateNote(token, note.id, note)
    .then(() => {
      dispatch(setPostingNote({ loading: false, error: null }));
    })
    .catch((err) => dispatch(setPostingNote({ loading: false, error: err.message })));
};

export const fetchNoteAsync = (id) => (dispatch, getState) => {
  const note = getState().notes.all.select((it) => it.id === id);
  if (note) {
    dispatch(setCurrentNote({ item: note, loading: false, error: null }));
    return;
  }
  dispatch(setCurrentNote({ loading: true }));
  getNote(id)
    .then((note) => {
      dispatch(setCurrentNote({ item: note, loading: false, error: null }));
      dispatch(addNote(note));
    })
    .catch((err) => dispatch(setCurrentNote({ loading: false, error: err.message })));
};

export const deleteNoteAsync = (token, id) => (dispatch) => {
  dispatch(setDeletingNote({ item: id, loading: true }));
  deleteNote(token, id)
    .then(() => {
      dispatch(removeNote(id));
      dispatch(setDeletingNote({ loading: false, item: null }));
    })
    .catch((err) => dispatch(setDeletingNote({ loading: false, error: err.message })));
};

export default slice.reducer;
