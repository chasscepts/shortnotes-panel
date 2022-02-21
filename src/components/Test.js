import { useEffect, useRef, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import './NoteEditor/highlight.css';

const styles = {
  container: {
    width: '100vw',
    height: '100vh',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    padding: '10px',
    gap: '10px',
    backgroundColor: '#dadada',
  },
  left: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: '#fff',
  },
  right: {
    padding: '20px',
    height: '100%',
    width: '100%',
    overflow: 'auto',
    border: '1px solid #e8ecef',
    borderRadius: '3px',
    backgroundColor: '#e9ecf1',
  },
};

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

const highlightCode = (code) => hljs.highlight(code, { language: 'markdown' }).value;

const Test = () => {
  const [text, setText] = useState('');
  const [html, setHtml] = useState('');
  const display = useRef(null);

  useEffect(() => {
    const element = display.current;
    element.scrollTop = element.scrollHeight - element.clientHeight;
  });

  const setContent = (value) => {
    setText(value);
    setHtml(marked(value));
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <Editor
          highlight={highlightCode}
          placeholder="Enter Markdown"
          onValueChange={setContent}
          value={text}
          padding={10}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            width: '100%',
            minHeight: '100%',
            flex: 1,
          }}
        />
      </div>
      <div style={styles.right} ref={display}>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
};

export default Test;
