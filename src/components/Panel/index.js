import { selectCurrentNote, setCurrentNote } from '../../app/reducers/notesSlice';
import CategoriesPanel from '../CategoriesPanel';
import ErrorPage from '../ErrorPage';
import LoadingSpinner from '../LoadingSpinner';
import NoteEditor from '../NoteEditor';
import NotesPanel from '../NotesPanel';
import { useDispatch, useSelector } from '../../redux';
import css from './style.module.css';

const Panel = () => {
  const { item: note, loading, error } = useSelector(selectCurrentNote);
  const dispatch = useDispatch();

  if (error) {
    const clearNote = () => dispatch(setCurrentNote({ error: null }));
    return <ErrorPage error={error} onClose={clearNote} />;
  }

  if (loading) {
    return <LoadingSpinner message="Loading content. Please wait ..." />;
  }

  if (note) {
    return <NoteEditor />;
  }

  return (
    <div className={css.container}>
      <section className={css.right}>
        <NotesPanel />
      </section>
      <section className={css.left}>
        <CategoriesPanel />
      </section>
    </div>
  );
};

export default Panel;
