import propTypes from 'prop-types';
import { selectNotes } from '../../app/reducers/notesSlice';
import { selectUser } from '../../app/reducers/userSlice';
import { useSelector } from '../../redux';
import ErrorPage from '../ErrorPage';

const Note = ({ note }) => <div>{note.title}</div>;

Note.propTypes = {
  note: propTypes.shape({
    id: propTypes.number,
    title: propTypes.string,
    content: propTypes.string,
  }).isRequired,
};

const Notes = () => {
  const notes = useSelector(selectNotes);
  const user = useSelector(selectUser);

  if (!user) {
    return <ErrorPage error="You must be logged in to access this page!" />;
  }

  if (!notes.items) {
    return <ErrorPage error="There are no notes to display" />;
  }

  if (notes.error) {
    return <ErrorPage error={notes.error} />;
  }

  return (
    <ul>
      {notes.items.map((note) => (
        <li key={note.id}>
          <Note note={note} />
        </li>
      ))}
    </ul>
  );
};

export default Notes;
