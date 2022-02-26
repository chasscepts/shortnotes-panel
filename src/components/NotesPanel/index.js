import { useState } from 'react';
import { selectCategories } from '../../app/reducers/categoriesSlice';
import { deleteNoteAsync, selectNotes, setCurrentNote } from '../../app/reducers/notesSlice';
import { selectUser } from '../../app/reducers/userSlice';
import { useDispatch, useSelector } from '../../redux';
import ConfirmDialog from '../ConfirmDialog';
import ErrorPage from '../ErrorPage';
import LoadingSpinner from '../LoadingSpinner';
import LogoutButton from '../LogoutButton';
import Note from '../Note';
import css from './style.module.css';

const NotesPanel = () => {
  const [category, setCategory] = useState(0);
  const [toDeleteNote, setToDeleteNote] = useState(null);
  const {
    items: notes,
    loading: notesLoading,
    error: notesError,
  } = useSelector(selectNotes);
  const { items: categories } = useSelector(selectCategories);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  if (notesError) {
    return <ErrorPage error={notesError} />;
  }

  if (notesLoading) {
    return <LoadingSpinner message="Loading Notes ..." />;
  }

  const confirmDelete = (confirmed) => {
    if (confirmed) {
      dispatch(deleteNoteAsync(user.token, toDeleteNote.id));
    }
    setToDeleteNote(null);
  };

  const create = () => dispatch(setCurrentNote({ item: { id: 0, title: '', content: '' } }));

  const filtered = category === 0 ? notes : notes.filter((note) => note.category.id === category);

  const handleSelection = ({ target: { value } }) => setCategory(+value);

  return (
    <div className={css.container}>
      <div className={css.header}>
        <div className="select">
          <select value={category} onChange={handleSelection}>
            <option value="0">All Categories</option>
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div className={css.logoutWrap}>
          <button type="button" className={css.newBtn} onClick={create}>
            <span>+</span>
          </button>
          <LogoutButton />
        </div>
      </div>
      <div className={css.listWrap}>
        <ul className={css.list}>
          {filtered.map((note) => (
            <li key={note.id}>
              <Note note={note} deleteNote={setToDeleteNote} />
            </li>
          ))}
        </ul>
      </div>
      {toDeleteNote && (
        <ConfirmDialog
          confirmLabel="Delete"
          onFeedback={confirmDelete}
          message={`The note - ${toDeleteNote.title} - will be permanently deleted.\n\nWill you like to continue?`}
        />
      )}
    </div>
  );
};

export default NotesPanel;
