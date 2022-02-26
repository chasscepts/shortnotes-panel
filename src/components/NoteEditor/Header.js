import { useRef, useState } from 'react';
import propTypes from 'prop-types';
import css from './header.module.css';
import { useDispatch, useSelector } from '../../redux';
import { selectCurrentNote, selectPostingNote, setCurrentNote } from '../../app/reducers/notesSlice';
import LoadingBar from '../LoadingBar';
import CloseButton from '../CloseButton';
import LogoutButton from '../LogoutButton';

/* eslint-disable jsx-a11y/label-has-associated-control */
const CategoriesSelect = ({ category, categories, onChange }) => {
  const [selected, setSelected] = useState(category || categories[0]);

  const handleSelectionChange = ({ target: { value } }) => {
    const val = +value;
    const cat = categories.find((item) => item.id === val);
    if (!cat) return;
    setSelected(cat);
    onChange(cat);
  };

  return (
    <div className="select">
      <select
        value={selected && selected.id}
        onChange={handleSelectionChange}
      >
        {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
      </select>
    </div>
  );
};

CategoriesSelect.propTypes = {
  onChange: propTypes.func.isRequired,
  categories: propTypes.arrayOf(propTypes.shape({
    id: propTypes.number,
    name: propTypes.string,
  })).isRequired,
  category: propTypes.shape({
    id: propTypes.number,
    name: propTypes.string,
  }),
};

CategoriesSelect.defaultProps = {
  category: null,
};

const Header = ({
  title,
  save,
  setInputMode,
  setIsSplit,
  categories,
}) => {
  const [splitMode, setSplitMode] = useState(true);
  const { loading: saving } = useSelector(selectPostingNote);
  const { item: note } = useSelector(selectCurrentNote);
  const category = useRef(note.category || categories[0]);
  const dispatch = useDispatch();

  const setSplit = (value) => {
    setSplitMode(value);
    setIsSplit(value);
  };

  const handleRadioCheck = ({ target: { name, checked } }) => {
    if (checked) {
      if (name === 'split-view') {
        setSplit(true);
      } else if (name === 'editor-view') {
        setSplit(false);
      }
    }
  };

  const handleClick = ({ target: { name } }) => {
    if (name === 'edit') {
      setInputMode(true);
    } else if (name === 'save') {
      if (!category.current) return;
      save(category.current);
    }
  };

  const onCategoryChange = (_category) => {
    category.current = _category;
  };

  let doneText;
  if (saving) {
    doneText = note && note.id ? 'Updating' : 'Saving';
  } else {
    doneText = note && note.id ? 'Update' : 'Save';
  }

  const handleClose = () => dispatch(setCurrentNote({ item: null }));

  return (
    <div className={css.headerWrap}>
      <div className={css.header}>
        <div>
          <div>
            <h4 className={css.noteTitle}>{title}</h4>
            <button className={css.noteTitleBtn} name="edit" type="button" onClick={handleClick}>edit title</button>
          </div>
          <div className={css.categoriesSelectWrap}>
            <CategoriesSelect
              category={category.current}
              categories={categories}
              onChange={onCategoryChange}
            />
          </div>
          <div>
            <fieldset className={css.fieldset}>
              <span className={css.legend}>Mode</span>
              <div className={css.labelWrap} role="form">
                <label className={css.splitLabel}>
                  <input name="split-view" type="radio" onChange={handleRadioCheck} checked={splitMode} />
                  <span>Split View</span>
                </label>
                <label className={css.splitLabel}>
                  <input name="editor-view" type="radio" onChange={handleRadioCheck} checked={!splitMode} />
                  <span>Editor View</span>
                </label>
              </div>
            </fieldset>
          </div>
        </div>
        <div>
          {saving && (
            <div className={`${css.saveNoteBtn} ${css.saving}`}>{doneText}</div>
          )}
          {!saving && (
            <button className={css.saveNoteBtn} name="save" type="button" onClick={handleClick}>
              {doneText}
            </button>
          )}
          <CloseButton className={css.closeBtn} onClose={handleClose} />
          <LogoutButton />
        </div>
      </div>
      {saving && (
        <div className={css.loaderWrap}><LoadingBar /></div>
      )}
    </div>
  );
};
/* eslint-enable jsx-a11y/label-has-associated-control */

Header.propTypes = {
  title: propTypes.string.isRequired,
  categories: propTypes.arrayOf(propTypes.shape({
    id: propTypes.number,
    name: propTypes.string,
  })).isRequired,
  save: propTypes.func.isRequired,
  setInputMode: propTypes.func.isRequired,
  setIsSplit: propTypes.func.isRequired,
};

export default Header;
