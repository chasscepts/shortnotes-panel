import propTypes from 'prop-types';
import { styleValidator } from '../../utilities/prop-validators';
import css from './style.module.css';

const CloseButton = ({ style, className, onClose }) => {
  const btnClass = className ? `${css.btn} ${className}` : css.btn;

  return (
    <button
      style={style}
      className={btnClass}
      type="button"
      title="Close"
      aria-label="Close"
      onClick={onClose}
    />
  );
};

CloseButton.propTypes = {
  style: styleValidator,
  className: propTypes.string,
  onClose: propTypes.func.isRequired,
};

CloseButton.defaultProps = {
  style: {},
  className: '',
};

export default CloseButton;
