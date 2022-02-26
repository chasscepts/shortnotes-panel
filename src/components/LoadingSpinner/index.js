import propTypes from 'prop-types';
import css from './style.module.css';

const LoadingSpinner = ({ message }) => (
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

LoadingSpinner.propTypes = {
  message: propTypes.string,
};

LoadingSpinner.defaultProps = {
  message: 'Application Busy. Please wait ...',
};

export default LoadingSpinner;
