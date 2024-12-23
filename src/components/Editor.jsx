/* eslint-disable react/prop-types */
import { Controlled as ControlledEditor } from 'react-codemirror2';

import '../../node_modules/codemirror/lib/codemirror.css';
import '../../node_modules/codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { useEffect, useRef } from 'react';
import ACTIONS from '../../Actions.js'

const Editor = ({ value, onChange, socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current
      const handleChanges = (instance, changes) => {
        console.log('Code changes:', changes);
        const { origin } = changes
        const code = instance.getValue()
        onCodeChange(code)
        if (origin !== 'setValue') {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          })
        }
        console.log("updated code:", code)
      };

      editor.on('changes', handleChanges)

      return () => {
        editor.off('changes', handleChanges)
      }
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
        const handleCodeChange = ({ code }) => {
            // Avoid resetting value if the code is already in the editor
            if (editorRef.current && editorRef.current.getValue() !== code) {
                editorRef.current.setValue(code);
            }
        };

        socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
        };
    }
}, [socketRef.current]);


  const handleBeforeChange = (editor, data, value) => {
    onChange(value);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <ControlledEditor
      onBeforeChange={handleBeforeChange}
      editorDidMount={handleEditorDidMount}
      value={value}
      options={{
        lineWrapping: true,
        lint: true,
        mode: 'javascript',
        theme: 'dracula',
        lineNumbers: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
      }}
    />
  );
};

export default Editor;
