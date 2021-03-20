import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  addParagraph,
  removeParagraph,
  updateParagraph,
} from '../../redux/actions/paragraphs-actions';

import './paragraph.css';

const placeHolder = 'Escreva algo...';

export default function Paragraph({
  text,
  editingText,
  coverText,
  rows,
  tabIndex,
  paragraphIndex,
}) {
  const dispatch = useDispatch();

  const { tabs } = useSelector(state => state.storedParagraphs);
  const beforeParagraphText = tabs[tabIndex].paragraphs[paragraphIndex - 1]?.editingText || '';
  const { paragraphsLength } = tabs[tabIndex];

  const [classes, setClasses] = useState('');
  const [containerclasses, setContainerClasses] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const paragraphRef = useRef(null);
  const isKeyDown = useRef(false);
  const currentCursorPos = useRef(-1);

  const handleTextInput = e => {
    const newParagraph = {};
    let newEditingText;
    if (coverText) {
      newEditingText = e.target.value + editingText.substring(coverText.length);
      currentCursorPos.current = e.target.selectionEnd;
    } else {
      newEditingText = e.target.value;
    }

    let newText = newEditingText;
    let newCoverText = '';

    if (newEditingText.startsWith('#')) {
      let firstNonHashIndex = 0;
      // eslint-disable-next-line no-plusplus
      for (let index = 0; index < newEditingText.length; index++) {
        if (newEditingText[index] !== '#') {
          firstNonHashIndex = index;
          break;
        }
      }
      if (firstNonHashIndex) newText = newText.substring(firstNonHashIndex);
    }

    if (newEditingText.startsWith('---')) {
      newCoverText = '---';
    } else {
      newCoverText = '';
    }

    const lineCount = newCoverText
      ? newCoverText.split(/\r*\n/).length
      : newEditingText.split(/\r*\n/).length;

    newParagraph.rows = lineCount || 1;

    if (coverText && newCoverText) {
      newParagraph.coverText = newCoverText;
      dispatch(
        updateParagraph({
          tabIndex,
          paragraphIndex,
          newParagraph,
        }),
      );
      return;
    }

    newParagraph.editingText = newEditingText;
    newParagraph.text = newText;
    newParagraph.coverText = newCoverText;
    dispatch(
      updateParagraph({
        tabIndex,
        paragraphIndex,
        newParagraph,
      }),
    );
  };

  useEffect(() => {
    let newClasses = '';
    let newContainerClasses = '';

    if (editingText.startsWith('###')) newClasses += ' header3';
    else if (editingText.startsWith('##')) newClasses += ' header2';
    else if (editingText.startsWith('#')) newClasses += ' header1';

    if (editingText.startsWith('---')) {
      newContainerClasses += ' line_through';
    }

    setContainerClasses(newContainerClasses);
    setClasses(newClasses);
  }, [editingText]);

  useEffect(() => {
    if (paragraphRef.current) {
      paragraphRef.current.style.height = 'auto';
      paragraphRef.current.style.height = `${paragraphRef.current.scrollHeight}px`;
    }
  }, [editingText, classes, containerclasses]);

  const handleKeyDown = e => {
    if (!hasFocus || isKeyDown.current) return;
    isKeyDown.current = true;

    const currentCursorPos = e.target.selectionEnd;
    const { value } = e.target;
    const { keyCode } = e;
    const lines = value.split('\n');

    const firstLinePos = { start: 0, end: 0 };
    const lastLinePos = { start: 0, end: 0 };
    if (lines.length >= 0) {
      firstLinePos.end = lines[0].length;
      const charsBeforeLastLine = value.length - lines[lines.length - 1].length;
      lastLinePos.start = charsBeforeLastLine;
      lastLinePos.end = value.length;
    }

    const beforeParagraphElem = document.querySelector(
      `textarea.paragraph[focusid="${paragraphIndex - 1}"]`,
    );
    const nextParagrapElem = document.querySelector(
      `textarea.paragraph[focusid="${paragraphIndex + 1}"]`,
    );

    // when cursor is on first char
    if (currentCursorPos === 0) {
      // Backspace
      if (keyCode === 8) {
        if (beforeParagraphElem && !beforeParagraphText.trim()) {
          dispatch(removeParagraph({ tabIndex, paragraphIndex: paragraphIndex - 1 }));
          beforeParagraphElem.focus();
          return;
        }

        if (!value.trim() && beforeParagraphElem) {
          e.preventDefault();
          dispatch(removeParagraph({ tabIndex, paragraphIndex }));
          beforeParagraphElem.focus();
          return;
        }

        if (!value.trim() && !beforeParagraphElem && paragraphRef.current) {
          e.preventDefault();
          if (paragraphsLength <= 2) {
            paragraphRef.current.blur();
          }
          dispatch(removeParagraph({ tabIndex, paragraphIndex }));
          return;
        }
      }
    }

    // Delete
    if (keyCode === 46) {
      if (!value && beforeParagraphElem) {
        e.preventDefault();
        dispatch(removeParagraph({ tabIndex, paragraphIndex }));
        if (paragraphIndex >= paragraphsLength - 2) {
          beforeParagraphElem.focus();
        }
        return;
      }

      if (!value && !beforeParagraphElem && paragraphRef.current) {
        e.preventDefault();
        if (paragraphsLength <= 2) {
          paragraphRef.current.blur();
        }
        dispatch(removeParagraph({ tabIndex, paragraphIndex }));
        return;
      }
    }

    // Enter and Shift
    if (keyCode === 13 && e.shiftKey) {
      e.preventDefault();
      if (paragraphIndex + 1 < paragraphsLength - 1) {
        dispatch(
          addParagraph({
            tabIndex,
            after: paragraphIndex,
          }),
        );
      }
      if (nextParagrapElem) nextParagrapElem.focus();

      return;
    }

    // when cursor is on first line
    if (currentCursorPos >= firstLinePos.start && currentCursorPos <= firstLinePos.end) {
      // Up Arrow
      if (keyCode === 38) {
        if (beforeParagraphElem) {
          e.preventDefault();
          beforeParagraphElem.focus();
          return;
        }
      }
    }

    // when cursor is on last line
    if (currentCursorPos >= lastLinePos.start && currentCursorPos <= lastLinePos.end) {
      // Arrow Down
      if (keyCode === 40) {
        if (nextParagrapElem) {
          e.preventDefault();
          nextParagrapElem.focus();
        }
      }
    }
  };

  const onParagraphFocus = () => {
    setHasFocus(true);
    if (paragraphIndex === paragraphsLength - 1) {
      dispatch(
        addParagraph({
          tabIndex,
        }),
      );
    }
  };

  useEffect(() => {
    if (paragraphRef.current && currentCursorPos.current >= 0) {
      paragraphRef.current.selectionEnd = currentCursorPos.current;
      currentCursorPos.current = -1;
    }
  }, [editingText]);

  if (hasFocus) {
    return (
      <div className={`paragraph_container focusing${containerclasses}`}>
        <textarea
          ref={paragraphRef}
          className={`paragraph focusing${classes}`}
          value={coverText || editingText}
          rows={rows}
          onChange={handleTextInput}
          onBlur={() => setHasFocus(false)}
          placeholder={paragraphIndex === paragraphsLength - 1 ? placeHolder : undefined}
          onKeyDown={handleKeyDown}
          onKeyUp={() => {
            isKeyDown.current = false;
          }}
        />
      </div>
    );
  }

  return (
    <div className={`paragraph_container${containerclasses}`}>
      <textarea
        focusid={paragraphIndex}
        ref={paragraphRef}
        className={`paragraph${classes}`}
        value={coverText || text}
        readOnly
        rows={rows}
        onFocus={onParagraphFocus}
        placeholder={paragraphIndex === paragraphsLength - 1 ? placeHolder : undefined}
      />
    </div>
  );
}

Paragraph.propTypes = {
  text: PropTypes.string.isRequired,
  editingText: PropTypes.string.isRequired,
  coverText: PropTypes.string.isRequired,
  rows: PropTypes.number.isRequired,
  tabIndex: PropTypes.number.isRequired,
  paragraphIndex: PropTypes.number.isRequired,
};
