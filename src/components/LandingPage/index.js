import propTypes, { arrayOf } from 'prop-types';
import { useEffect, useState } from 'react';
import css from './style.module.css';
import { loadCategoriesAsync, selectCategories } from '../../app/reducers/categoriesSlice';
import { loadNotesAsync, selectNotes } from '../../app/reducers/notesSlice';
// import { selectUser } from '../../app/reducers/userSlice';
import { useDispatch, useSelector } from '../../redux';
import loadErrorAlert from '../../assets/images/restart-alert.png';
import successAlert from '../../assets/images/success-alert.png';
// import LoadingBar from '../LoadingBar';
import LoginPage from '../LoginPage';
import screenshot from '../../assets/images/screenshot.gif';
import logo from '../../assets/images/logo192.png';
import LdsRing from '../LdsRing';
import { selectUser } from '../../app/reducers/userSlice';
import Panel from '../Panel';

/**
 * Both items and error will be falsy when loading has not started.
 * But we are returning that it is loading at this point because we know
 * we are eventually going to start it.
 * @param {Object} props
 * @param {string} props.label
 * @param {Array} props.items array of categories or notes. null if the resource has not been loaded
 * @param {string} props.error error message. Empty string if there is no error
 */
const LoadIndicator = ({ label, items, error }) => {
  if (error) {
    return (
      <div className={`${css.loadIndicatorWrap} ${css.column}`}>
        <div className={css.indicatorInnerWrap}>
          <img alt="alert" src={loadErrorAlert} className={css.indicatorIcon} />
          <div className={`${css.indicatorLabel} ${css.error}`}>
            {`An error occurred while loading ${label}!`}
          </div>
        </div>
        <div className={css.indicatorErrorMsg}>{error}</div>
      </div>
    );
  }

  if (items) {
    return (
      <div className={css.loadIndicatorWrap}>
        <img alt="completed" src={successAlert} className={css.indicatorIcon} />
        <div className={`${css.indicatorLabel} ${css.success}`}>
          {`Loading of ${label} was successfully completed.`}
        </div>
      </div>
    );
  }

  return (
    <div className={css.loadIndicatorWrap}>
      <div className={css.indicatorIcon}>
        <LdsRing width={20} color="#1d66b9" />
      </div>
      <div className={css.indicatorLabel}>{`Loading ${label} ...`}</div>
    </div>
  );
};

LoadIndicator.propTypes = {
  label: propTypes.string.isRequired,
  items: arrayOf(propTypes.oneOfType([
    propTypes.shape({
      id: propTypes.number,
      name: propTypes.string,
    }),
    propTypes.shape({
      id: propTypes.number,
      title: propTypes.string,
      content: propTypes.string,
      category_id: propTypes.number,
    }),
  ])),
  error: propTypes.string.isRequired,
};

LoadIndicator.defaultProps = {
  items: null,
};

const TestButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      display: 'block',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: 'none',
      outline: 'none',
      color: 'transparent',
      backgroundColor: 'transparent',
      backgroundSize: '100% 100%',
      backgroundImage: `url(${successAlert})`,
      cursor: 'pointer',
    }}
  >
    refresh
  </button>
);

TestButton.propTypes = {
  onClick: propTypes.func.isRequired,
};

const LoadingPanel = () => {
  const [loaded, setLoaded] = useState(false);
  const notes = useSelector(selectNotes);
  const categories = useSelector(selectCategories);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCategoriesAsync());
    dispatch(loadNotesAsync());
  }, []);

  if (loaded) return <Panel />;

  const proceed = () => setLoaded(true);

  const loadSuccessful = !!(categories.items && notes.items);
  let finishedWithErrors = true;
  if (loadSuccessful) {
    finishedWithErrors = false;
  } else if (categories.loading || notes.loading) {
    finishedWithErrors = false;
  }

  return (
    <div className={css.container}>
      <div>
        <header className={css.banner}>
          <img src={logo} alt="logo" />
          <h1>Short Notes</h1>
        </header>
        <section className={css.loaderPanel}>
          <div className="dim">
            <h2 className={css.loadingHeader}>Preparing your workspace.</h2>
            <LoadIndicator label="Categories" items={categories.items} error={categories.error || ''} />
            <LoadIndicator label="Notes" items={notes.items} error={notes.error || ''} />
            {finishedWithErrors && (
              <div className={css.reloadPanel}>
                Application encountered some errors while loading resources from the servers.
                <br />
                These resources are vital to the functioning of the Application and
                we cannot proceed without them.
                <br />
                Please
                <a href="/"> reload </a>
                the page for a better user experience.
              </div>
            )}
            {loadSuccessful && (
              <div className={css.proceedBtnWrap}>
                <button type="button" onClick={proceed} className={css.proceedBtn}>
                  Proceed
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      <div className={css.screenshotWrap}>
        <img src={screenshot} alt="screenshot" />
      </div>
    </div>
  );
};

const LandingPage = () => {
  const user = useSelector(selectUser);

  if (!user) return <LoginPage />;

  return <LoadingPanel />;
};

export default LandingPage;
