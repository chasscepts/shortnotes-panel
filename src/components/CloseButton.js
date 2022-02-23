import propTypes from 'prop-types';
import icon from '../assets/images/close.png';
import { styleValidator } from '../utilities/prop-validators';

const styles = {
  btn: {
    width: '32px',
    height: '24px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
  },
  img: {
    width: '100%',
    height: '100%',
  },
};

const CloseButton = ({ style, className, onClose }) => {
  let btnStyle = styles.btn;
  if (style) {
    btnStyle = { ...btnStyle, ...style };
  }

  return (
    <button
      style={btnStyle}
      className={className}
      type="button"
      title="Close"
      onClick={onClose}
    >
      <img src={icon} alt="close" style={styles.img} />
    </button>
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
