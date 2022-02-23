import propTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from '../../redux';
import css from './style.module.css';
import modes from '../../utilities/modes';
import LoginPage from '../LoginPage';
import NoteEditor from '../NoteEditor';
import { selectUser, setUser } from '../../app/reducers/userSlice';
import { selectMode, setMode } from '../../app/reducers/modeSlice';
import newNoteIcon from '../../assets/images/new-note.png';
import noteList from '../../assets/images/notelist.png';
import logoutIcon from '../../assets/images/logout.png';
import ErrorPage from '../ErrorPage';
import Notes from '../Notes';
import { setCurrentNote } from '../../app/reducers/notesSlice';

const menuItems = { ...modes };
delete menuItems.edit;

const modeIcons = {
  logout: logoutIcon,
  [modes.new]: newNoteIcon,
  [modes.noteList]: noteList,
};

const MenuButton = ({
  mode,
  activeMode,
  setMode,
}) => {
  if (mode === activeMode) return <></>;

  const handleClick = () => setMode(mode);
  return (
    <button className={css.menuItem} type="button" onClick={handleClick}>
      <img src={modeIcons[mode]} alt={mode} />
    </button>
  );
};

MenuButton.propTypes = {
  mode: propTypes.string.isRequired,
  activeMode: propTypes.string.isRequired,
  setMode: propTypes.func.isRequired,
};

const Container = ({ mode, children }) => {
  const [menuVisible, showMenu] = useState(false);
  const dispatch = useDispatch();

  const menuClass = menuVisible ? `${css.menu} ${css.open}` : css.menu;

  const openMenu = () => showMenu(true);

  const closeMenu = () => showMenu(false);

  const setActiveMode = (mode) => {
    if (mode === 'logout') {
      dispatch(setUser(null));
      return;
    }
    if (mode === modes.new) {
      dispatch(setCurrentNote(null));
    }
    dispatch(setMode(mode));
  };

  return (
    <div className={css.container}>
      {children}
      {!menuVisible && <div className={css.showMenuBtn} onMouseEnter={openMenu} />}
      <div className={menuClass} onMouseLeave={closeMenu}>
        <MenuButton mode="logout" activeMode={mode} icon={logoutIcon} setMode={setActiveMode} />
        {Object.keys(menuItems).map((k) => (
          <MenuButton
            key={k}
            mode={menuItems[k]}
            activeMode={mode}
            setMode={setActiveMode}
          />
        ))}
      </div>
    </div>
  );
};

Container.propTypes = {
  mode: propTypes.string.isRequired,
  children: propTypes.node.isRequired,
};

const Panel = () => {
  const user = useSelector(selectUser);
  const currentMode = useSelector(selectMode);

  if (!user) return <LoginPage />;

  if (currentMode === modes.new || currentMode === modes.edit) {
    return (
      <Container mode={currentMode}>
        <NoteEditor />
      </Container>
    );
  }

  if (currentMode === modes.noteList) {
    return (
      <Container mode={currentMode}>
        <Notes />
      </Container>
    );
  }

  return (
    <Container mode={currentMode}>
      <ErrorPage error="Selected Page not Found" />
    </Container>
  );
};

export default Panel;
