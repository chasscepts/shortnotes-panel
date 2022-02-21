import propTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from '../../redux';
import css from './style.module.css';
import modes from '../../utilities/modes';
import LoginPage from '../LoginPage';
import NoteEditor from '../NoteEditor';
import { selectUser, setUser } from '../../app/reducers/userSlice';
import { selectMode, setMode } from '../../app/reducers/modeSlice';

const note = {
  title: '',
  content: '',
};

const MenuButton = ({ mode, currentMode }) => {
  const dispatch = useDispatch();

  if (mode === currentMode) return <></>;

  const handleClick = () => dispatch(setMode(mode));

  return <button className={css.menuItem} type="button" onClick={handleClick}>{mode}</button>;
};

MenuButton.propTypes = {
  mode: propTypes.string.isRequired,
  currentMode: propTypes.string.isRequired,
};

const Container = ({ mode, children }) => {
  const [menuVisible, showMenu] = useState(false);
  const dispatch = useDispatch();

  const menuClass = menuVisible ? `${css.menu} ${css.open}` : css.menu;

  const openMenu = () => showMenu(true);

  const closeMenu = () => showMenu(false);

  const logout = () => dispatch(setUser(null));

  return (
    <div className={css.container}>
      {!menuVisible && <div className={css.showMenuBtn} onMouseEnter={openMenu} />}
      <div className={menuClass} onMouseLeave={closeMenu}>
        <button type="button" onClick={logout}>logout</button>
        {Object.keys(modes).map((k) => (
          <MenuButton key={k} mode={modes[k]} currentMode={mode} setCurrentMode={setMode} />
        ))}
      </div>
      {children}
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

  if (currentMode === modes.edit) {
    return (
      <Container mode={currentMode}>
        <NoteEditor note={note} token={user.token} />
      </Container>
    );
  }

  return (
    <Container mode={currentMode}>
      <div>Selected Page not Found</div>
    </Container>
  );
};

export default Panel;
