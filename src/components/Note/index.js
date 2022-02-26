import propTypes from 'prop-types';
import { useDispatch } from '../../redux';
import css from './style.module.css';
import editIcon from '../../assets/images/pencil.png';
import deleteIcon from '../../assets/images/delete.png';
import { fetchContentAsync } from '../../app/reducers/notesSlice';

const Note = ({ note, deleteNote }) => {
  const dispatch = useDispatch();

  const handleClick = ({ target: { name } }) => {
    if (name === 'edit') {
      dispatch(fetchContentAsync(note));
    } else if (name === 'delete') {
      deleteNote(note);
    }
  };

  return (
    <div className={css.container}>
      <section className={css.section}>
        <h4 className={css.title}>{note.title}</h4>
        <div className={css.details}>
          <span>By</span>
          <span>{note.author}</span>
        </div>
        <div className={css.details}>
          <span>In</span>
          <span>{note.category.name}</span>
        </div>
        <div className={css.controls}>
          <button name="edit" type="button" className={css.btn} onClick={handleClick}>
            <img src={editIcon} alt="edit" />
          </button>
          <button name="delete" type="button" className={css.btn} onClick={handleClick}>
            <img src={deleteIcon} alt="edit" />
          </button>
        </div>
      </section>
    </div>
  );
};

Note.propTypes = {
  note: propTypes.shape({
    id: propTypes.number,
    title: propTypes.string,
    content: propTypes.string,
    author: propTypes.string,
    category: propTypes.shape({
      id: propTypes.number,
      name: propTypes.string,
    }),
  }).isRequired,
  deleteNote: propTypes.func.isRequired,
};

export default Note;
