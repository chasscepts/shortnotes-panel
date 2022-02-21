import propTypes from 'prop-types';
import css from './style.module.css';

const LoadingBar = ({ message }) => (
  <div className={css.container}>
    <div className={css.ldsSpinner}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
    <div className={css.message}>{message}</div>
  </div>
);

LoadingBar.propTypes = {
  message: propTypes.string,
};

LoadingBar.defaultProps = {
  message: 'Application Busy. Please wait ...',
};

export default LoadingBar;
