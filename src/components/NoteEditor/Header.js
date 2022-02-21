import { useState } from 'react';
import propTypes from 'prop-types';
import css from './header.module.css';
import { useSelector } from '../../redux';
import { selectPostingNote } from '../../app/reducers/notesSlice';
import { noteValidator, requirableValidator } from '../../utilities/prop-validators';

/* eslint-disable jsx-a11y/label-has-associated-control */
const CategoriesSelect = ({ category, categories, onChange }) => {
  const [selected, setSelected] = useState(category || categories[0]);

  const handleSelectionChange = ({ target: { value } }) => {
    const val = +value;
    const cat = categories.select((item) => item.id === val);
    if (!cat) return;
    setSelected(cat);
    onChange(cat);
  };

  return (
    <div>
      <select
        className={css.categoriesSelect}
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
  note,
  save,
  setInputMode,
  setIsSplit,
  categories,
}) => {
  const [splitMode, setSplitMode] = useState(true);
  const { loading: saving } = useSelector(selectPostingNote);

  const noteLocalCopy = { ...note };

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
      if (!noteLocalCopy.category) return;
      save({ category_id: noteLocalCopy.category.id });
    }
  };

  const onCategoryChange = (category) => {
    noteLocalCopy.category = category;
  };

  let saveBtnClass = css.saveNoteBtn;
  let doneText;
  if (saving) {
    saveBtnClass = `${saveBtnClass} ${css.saving}`;
    doneText = note.id ? 'Updating' : 'Saving';
  } else {
    doneText = note.id ? 'Update' : 'Save';
  }

  return (
    <div className={css.header}>
      <div>
        <div className={css.categoriesSelectWrap}>
          <CategoriesSelect
            category={note.category}
            categories={categories}
            onChange={onCategoryChange}
          />
        </div>
        <div>
          <h4 className={css.noteTitle}>{title}</h4>
          <button className={css.noteTitleBtn} name="edit" type="button" onClick={handleClick}>edit</button>
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
          <button className={saveBtnClass} name="save" type="button" onClick={handleClick} disabled>
            {doneText}
          </button>
        )}
        {!saving && (
          <button className={saveBtnClass} name="save" type="button" onClick={handleClick}>
            {doneText}
          </button>
        )}
      </div>
    </div>
  );
};
/* eslint-enable jsx-a11y/label-has-associated-control */

Header.propTypes = {
  title: propTypes.string.isRequired,
  note: requirableValidator(noteValidator).isRequired,
  categories: propTypes.arrayOf(propTypes.shape({
    id: propTypes.number,
    name: propTypes.string,
  })).isRequired,
  save: propTypes.func.isRequired,
  setInputMode: propTypes.func.isRequired,
  setIsSplit: propTypes.func.isRequired,
};

export default Header;
