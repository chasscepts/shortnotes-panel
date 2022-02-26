import { useState } from 'react';
import {
  createCategoryAsync,
  deleteCategoryAsync,
  selectCategories,
  selectCurrentCategory,
  selectDeletingCategory,
  selectPostingCategory,
  setCurrentCategory,
  setDeletingCategory,
  setPostingCategory,
  updateCategoryAsync,
} from '../../app/reducers/categoriesSlice';
import { selectUser } from '../../app/reducers/userSlice';
import { useDispatch, useSelector } from '../../redux';
import Category from '../Category';
import ErrorPage from '../ErrorPage';
import LoadingSpinner from '../LoadingSpinner';
import css from './style.module.css';
import newIcon from '../../assets/images/plus.png';
import ConfirmDialog from '../ConfirmDialog';

const CategoriesPanel = () => {
  const [newName, setNewName] = useState('');
  const [toDelete, setToDelete] = useState();
  const user = useSelector(selectUser);
  const {
    items: categories,
    loading: loadingCategories,
    error: categoriesError,
  } = useSelector(selectCategories);

  const { loading: posting, error: postError } = useSelector(selectPostingCategory);
  const { loading: deleting, error: deleteError } = useSelector(selectDeletingCategory);

  const selected = useSelector(selectCurrentCategory);
  const dispatch = useDispatch();

  if (categoriesError) {
    return <ErrorPage error={categoriesError} />;
  }

  const clearPostError = () => dispatch(setPostingCategory({ error: null }));
  const clearDeleteError = () => dispatch(setDeletingCategory({ error: null }));

  if (postError) {
    return <ErrorPage error={postError} onClose={clearPostError} />;
  }

  if (deleteError) {
    return <ErrorPage error={deleteError} onClose={clearDeleteError} />;
  }

  if (loadingCategories) {
    return <LoadingSpinner message="Loading categories" />;
  }

  if (posting) {
    return <LoadingSpinner message="Posting category ..." />;
  }

  if (deleting) {
    return <LoadingSpinner message="Deleting category" />;
  }

  const setSelected = (category) => {
    setNewName(category.name);
    dispatch(setCurrentCategory(category));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!newName) {
      return;
    }

    if (selected.id) {
      dispatch(updateCategoryAsync(user.token, { id: selected.id, name: newName }));
    } else {
      dispatch(createCategoryAsync(user.token, newName));
    }
  };

  const deleteCategory = () => {
    if (!selected.id) return;
    setToDelete(selected);
  };

  const create = () => {
    setNewName('');
    dispatch(setCurrentCategory({ id: 0, name: '' }));
  };

  const handleNameInput = ({ target: { value } }) => setNewName(value);

  const confirmDelete = (confirm) => {
    setToDelete(null);
    if (confirm) {
      dispatch(deleteCategoryAsync(user.token, selected.id));
    }
  };

  return (
    <section className={css.container}>
      <div className={css.selectedContainer}>
        {selected.id ? (
          <div className={css.selectedHeader}>
            <h4 className={css.heading}>{selected.name}</h4>
            <button className={css.newBtn} type="button" onClick={create}>
              <img src={newIcon} alt="New" />
            </button>
          </div>
        ) : <></>}
        {!(selected.id) && <h4 className={css.heading}>Create New Category</h4>}
        <form className={css.selectedForm} onSubmit={submit}>
          <input
            type="text"
            value={newName}
            name="nameInput"
            className={`text-input ${css.nameInput}`}
            onInput={handleNameInput}
            required
          />
          <div className={css.formControls}>
            <button type="submit" className="btn-blue">{selected.id ? 'Update' : 'Create'}</button>
            {selected.id ? (
              <button type="button" onClick={deleteCategory} className="btn-red">
                Delete
              </button>
            ) : <></>}
          </div>
        </form>
      </div>
      <div className={css.listWrap}>
        <ul className={css.list}>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Category
                category={cat}
                isSelected={selected.id === cat.id}
                onSelect={setSelected}
              />
            </li>
          ))}
        </ul>
      </div>
      {toDelete && (
        <ConfirmDialog
          confirmLabel="Delete"
          onFeedback={confirmDelete}
          message={`The category - ${selected.name} - will be permanently deleted!\n\nDo you wish to continue`}
        />
      )}
    </section>
  );
};

export default CategoriesPanel;
