import { useEffect, useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import propTypes from 'prop-types';
import './highlight.css';
import css from './style.module.css';
import { useDispatch, useSelector } from '../../redux';
import {
  createNoteAsync,
  selectCurrentNote,
  selectPostingNote,
  setPostingNote,
  updateNoteAsync,
} from '../../app/reducers/notesSlice';
import { selectCategories } from '../../app/reducers/categoriesSlice';
import Header from './Header';
import { selectUser } from '../../app/reducers/userSlice';
import ErrorPage from '../ErrorPage';

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: (code, language) => {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(code, { language: validLanguage }).value;
  },
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false,
});

/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */

const highlightCode = (code) => hljs.highlight(code, { language: 'markdown' }).value;

const ColumnResizer = ({ leftWidth, minWidth, setWidth }) => {
  const [left, setLeft] = useState(leftWidth);
  const [className, setClassName] = useState(css.columnResizer);
  const resizer = useRef(null);
  const resizing = useRef(false);
  const startX = useRef(0);
  const parentWidth = useRef(0);

  const move = (evt) => {
    if (!resizing.current) return;
    const w = left + evt.clientX - startX.current;
    if (w < minWidth || (parentWidth.current - w) < minWidth) {
      return;
    }
    setLeft(w);
  };

  const up = (evt) => {
    resizing.current = false;
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    let w = left + evt.clientX - startX.current;
    if (w < minWidth) {
      w = minWidth;
    } else if (parentWidth.current - w < minWidth) {
      w = parentWidth.current - minWidth;
    }
    setClassName(css.columnResizer);
    setWidth(w);
    setLeft(w);
  };

  const down = (evt) => {
    startX.current = evt.clientX;
    parentWidth.current = resizer.current.parentNode.getBoundingClientRect().width;
    resizing.current = true;
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
    setClassName(`${css.columnResizer} ${css.resizing}`);
  };

  return (
    <div
      ref={resizer}
      className={className}
      style={{ left: `${left}px` }}
      onMouseDown={down}
      role="slider"
      aria-valuenow={left}
      tabIndex={0}
      aria-label="resize"
    />
  );
};

ColumnResizer.propTypes = {
  minWidth: propTypes.number,
  setWidth: propTypes.func.isRequired,
  leftWidth: propTypes.number.isRequired,
};

ColumnResizer.defaultProps = {
  minWidth: 300,
};

const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: '100%',
    maxWidth: '450px',
    border: '1px solid #ddd',
    borderRadius: '7px',
    padding: '15px 20px',
  },
  heading: {
    fontSize: '1.2rem',
    color: '#62b5e5',
  },
  input: {
    margin: '10px 0',
  },
  controls: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '15px',
  },
  donBtn: {
    color: '#fff',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    borderRadius: '3px',
    padding: '6px 15px',
  },
};

const TextInput = ({ label, initialText, onDone }) => {
  const [text, setText] = useState(initialText);

  const handleTextChange = ({ target: { value } }) => {
    setText(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) {
      return;
    }
    onDone(text);
  };

  return (
    <div style={styles.container}>
      <form style={styles.body} onSubmit={handleSubmit}>
        <h4 style={styles.heading}>{label}</h4>
        <input style={styles.input} className="text-input" type="text" value={text} onInput={handleTextChange} />
        <div style={styles.controls}>
          <button style={styles.donBtn} className="btn-blue" type="submit">Done</button>
        </div>
      </form>
    </div>
  );
};

TextInput.propTypes = {
  label: propTypes.string.isRequired,
  initialText: propTypes.string,
  onDone: propTypes.func.isRequired,
};

TextInput.defaultProps = {
  initialText: '',
};

const toHtml = (content) => marked(content);

const SimpleEditor = ({ content, setContent }) => (
  <div className={css.editorBorder}>
    <div className={css.editorFlow}>
      <Editor
        highlight={highlightCode}
        placeholder="Enter Markdown"
        onValueChange={setContent}
        value={content}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          width: '100%',
          flex: 1,
        }}
      />
    </div>
  </div>
);

SimpleEditor.propTypes = {
  content: propTypes.string,
  setContent: propTypes.func.isRequired,
};

SimpleEditor.defaultProps = {
  content: '',
};

const SplitPane = ({ content, setContent }) => {
  const [html, setHtml] = useState('');
  const [leftWidth, setLeftWidth] = useState(0);
  const parent = useRef(null);

  useEffect(() => {
    setLeftWidth(parent.current.clientWidth / 2);
  }, []);

  useEffect(() => {
    setHtml(toHtml(content));
  }, [content]);

  return (
    <div ref={parent} className={css.main}>
      <div className={`${css.mainResizeWrap} ${css.splitEditorWrap}`} style={{ flex: `0 0 ${leftWidth}px` }}>
        <SimpleEditor content={content} setContent={setContent} />
      </div>
      {leftWidth && (
        <ColumnResizer leftWidth={leftWidth} minWidth={300} setWidth={setLeftWidth} />
      )}
      <div className={`${css.mainResizeWrap} ${css.displayWrap}`}>
        {/* eslint-disable-next-line react/no-danger */}
        <div className={css.display} dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

SplitPane.propTypes = {
  content: propTypes.string.isRequired,
  setContent: propTypes.func.isRequired,
};

const NoteEditor = () => {
  const { item: note } = useSelector(selectCurrentNote);
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isSplit, setIsSplit] = useState(true);
  const [inputMode, setInputMode] = useState(!(note.id));
  const user = useSelector(selectUser);
  const { items: categories } = useSelector(selectCategories);
  const { error: postError } = useSelector(selectPostingNote);
  const dispatch = useDispatch();

  if (!user) {
    return <ErrorPage error="You must be logged in to access this page!" />;
  }

  const clearPostError = () => dispatch(setPostingNote({ error: null }));

  if (postError) {
    return <ErrorPage error={postError} onClose={clearPostError} />;
  }

  if (inputMode) {
    const done = (text) => {
      setTitle(text);
      setInputMode(false);
    };

    return <TextInput label="Enter New Title" onDone={done} initialText={title} />;
  }

  const save = (category) => {
    if (!(title && content)) {
      return;
    }
    if (note.id) {
      dispatch(updateNoteAsync(user.token, note.id, title, content, category, note.author));
    } else {
      dispatch(createNoteAsync(user.token, title, content, category.id));
    }
  };

  return (
    <div className={css.noteEditor}>
      <Header
        title={title}
        categories={categories}
        save={save}
        setInputMode={setInputMode}
        setIsSplit={setIsSplit}
      />
      {isSplit && <SplitPane content={content} setContent={setContent} />}
      {!isSplit && (
        <div className={css.singleContainer}>
          <div className={`${css.wrap} ${css.singleEditorWrap}`}>
            <SimpleEditor content={content} setContent={setContent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteEditor;

/* eslint-enable jsx-a11y/label-has-associated-control */
/* eslint-enable no-param-reassign */
