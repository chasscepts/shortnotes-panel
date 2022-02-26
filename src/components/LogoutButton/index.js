import propTypes from 'prop-types';
import { setUser } from '../../app/reducers/userSlice';
import { useDispatch } from '../../redux';
import css from './style.module.css';
import icon from '../../assets/images/logout.png';

const LogoutButton = ({ className }) => {
  const dispatch = useDispatch();

  const handleClick = () => dispatch(setUser(null));

  const btnClass = className ? `${css.btn} ${className}` : css.btn;

  return (
    <button type="button" className={btnClass} onClick={handleClick} title="Logout">
      <img src={icon} alt="logout" />
    </button>
  );
};

LogoutButton.propTypes = {
  className: propTypes.string,
};

LogoutButton.defaultProps = {
  className: '',
};

export default LogoutButton;
