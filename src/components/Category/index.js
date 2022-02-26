import propTypes from 'prop-types';
import css from './style.module.css';

const Category = ({ category, isSelected, onSelect }) => {
  const handleClick = () => onSelect(category);

  let btnClass = css.btn;
  if (isSelected) {
    btnClass += ` ${css.selected}`;
  }

  return (
    <section className={css.container}>
      <button type="button" className={btnClass} onClick={handleClick}>{category.name}</button>
    </section>
  );
};

Category.propTypes = {
  category: propTypes.shape({
    id: propTypes.number,
    name: propTypes.string,
  }).isRequired,
  isSelected: propTypes.bool.isRequired,
  onSelect: propTypes.func.isRequired,
};

export default Category;
