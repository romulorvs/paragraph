/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import {
  addParagraph,
  removeParagraph,
  updateParagraph,
} from '../../redux/actions/paragraphs-actions';
import { configDebounce } from '../../utils';

import './paragraph.css';

const placeHolder = 'Escreva algo...';

export default function Paragraph({
  paragraph,
  tabId,
  paragraphIndex,
  paragraphsLength,
  previousParagraphId,
  nextParagraphId,
  previousParagraphText,
}) {
  const dispatch = useDispatch();

  const [_paragraph, _setParagraph] = useState(paragraph);
  const [classes, setClasses] = useState('');
  const [containerclasses, setContainerClasses] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const paragraphRef = useRef(null);
  const isKeyDown = useRef(false);
  const currentCursorPos = useRef(-1);
  const moveToAddedParagraph = useRef(false);
  const debounceUpdateParagraph = useRef(configDebounce());

  // keeping local state synchronized with redux state when chrome tab is not active
  useEffect(() => {
    console.log('passou 1');
    if (!document.hasFocus()) {
      console.log('passou 2');
      _setParagraph(paragraph);
    }
  }, [paragraph]);

  useEffect(() => {
    _setParagraph(paragraph);
  }, [tabId]);

  const handleTextInput = e => {
    const newParagraph = {};
    let newEditingText;
    if (_paragraph.coverText) {
      newEditingText =
        e.target.value + _paragraph.editingText.substring(_paragraph.coverText.length);
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

    if (_paragraph.coverText && newCoverText) {
      newParagraph.coverText = newCoverText;

      _setParagraph({
        ..._paragraph,
        ...newParagraph,
      });

      debounceUpdateParagraph.current(() =>
        dispatch(
          updateParagraph({
            tabId,
            paragraphId: paragraph.id,
            newParagraph,
          }),
        ),
      );
      return;
    }

    newParagraph.editingText = newEditingText;
    newParagraph.text = newText;
    newParagraph.coverText = newCoverText;

    _setParagraph({
      ..._paragraph,
      ...newParagraph,
    });

    debounceUpdateParagraph.current(() =>
      dispatch(
        updateParagraph({
          tabId,
          paragraphId: paragraph.id,
          newParagraph,
        }),
      ),
    );
  };

  useEffect(() => {
    let newClasses = '';
    let newContainerClasses = '';

    if (_paragraph.editingText.startsWith('###')) newClasses += ' header3';
    else if (_paragraph.editingText.startsWith('##')) newClasses += ' header2';
    else if (_paragraph.editingText.startsWith('#')) newClasses += ' header1';

    if (_paragraph.editingText.startsWith('---')) {
      newContainerClasses += ' line_through';
    }

    setContainerClasses(newContainerClasses);
    setClasses(newClasses);
  }, [_paragraph.editingText]);

  useEffect(() => {
    if (paragraphRef.current) {
      paragraphRef.current.style.height = 'auto';
      paragraphRef.current.style.height = `${paragraphRef.current.scrollHeight}px`;
    }
  }, [_paragraph.editingText, classes, containerclasses]);

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

    const previousParagraphElem = document.querySelector(
      `textarea.paragraph[paragraph_id="${previousParagraphId}"]`,
    );
    const nextParagrapElem = document.querySelector(
      `textarea.paragraph[paragraph_id="${nextParagraphId}"]`,
    );

    // when cursor is on first char
    if (currentCursorPos === 0) {
      // Backspace
      if (keyCode === 8) {
        if (previousParagraphElem && !previousParagraphText.trim()) {
          e.preventDefault();
          dispatch(removeParagraph({ tabId, paragraphId: previousParagraphId }));
          return;
        }

        if (!value.trim() && previousParagraphElem) {
          e.preventDefault();
          previousParagraphElem.focus();
          dispatch(removeParagraph({ tabId, paragraphId: paragraph.id }));
          return;
        }

        if (!value.trim() && !previousParagraphElem && paragraphRef.current) {
          e.preventDefault();
          if (paragraphsLength > 2 && nextParagrapElem) {
            nextParagrapElem.focus();
          }
          dispatch(removeParagraph({ tabId, paragraphId: paragraph.id }));
          return;
        }
      }
    }

    // Delete
    if (keyCode === 46) {
      if (!value && previousParagraphElem) {
        e.preventDefault();
        dispatch(removeParagraph({ tabId, paragraphId: paragraph.id }));
        if (paragraphIndex >= paragraphsLength - 2) {
          previousParagraphElem.focus();
        } else if (nextParagrapElem) {
          nextParagrapElem.focus();
        }
        return;
      }

      if (!value && !previousParagraphElem && paragraphRef.current) {
        e.preventDefault();
        if (paragraphsLength > 2 && nextParagrapElem) {
          nextParagrapElem.focus();
        }
        dispatch(removeParagraph({ tabId, paragraphId: paragraph.id }));
        return;
      }
    }

    // Enter and Shift
    if (keyCode === 13 && e.shiftKey) return;

    // Enter
    if (keyCode === 13) {
      e.preventDefault();
      if (paragraphIndex + 1 < paragraphsLength - 1) {
        dispatch(
          addParagraph({
            tabId,
            afterId: paragraph.id,
          }),
        );
        moveToAddedParagraph.current = true;
      } else if (paragraphIndex === paragraphsLength - 2 && nextParagrapElem) {
        nextParagrapElem.focus();
      }

      return;
    }

    // when cursor is on first line
    if (currentCursorPos >= firstLinePos.start && currentCursorPos <= firstLinePos.end) {
      // Up Arrow
      if (keyCode === 38) {
        if (previousParagraphElem) {
          e.preventDefault();
          previousParagraphElem.focus();
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

  useEffect(() => {
    if (moveToAddedParagraph.current) {
      const nextParagraphElem = document.querySelector(
        `textarea.paragraph[paragraph_id="${nextParagraphId}"]`,
      );

      if (nextParagraphElem) nextParagraphElem.focus();

      moveToAddedParagraph.current = false;
    }
  }, [paragraphsLength]);

  const onParagraphFocus = () => {
    setHasFocus(true);
    if (paragraphIndex === paragraphsLength - 1) {
      dispatch(
        addParagraph({
          tabId,
        }),
      );
    }
  };

  useEffect(() => {
    if (paragraphRef.current && currentCursorPos.current >= 0) {
      paragraphRef.current.selectionEnd = currentCursorPos.current;
      currentCursorPos.current = -1;
    }
  }, [_paragraph.editingText]);

  useEffect(() => {
    return () => {
      debounceUpdateParagraph.current.clear();
    };
  }, []);

  if (hasFocus) {
    return (
      <div className={`paragraph_container focusing${containerclasses}`}>
        <textarea
          paragraph_id={paragraph.id}
          ref={paragraphRef}
          className={`paragraph focusing${classes}`}
          value={_paragraph.coverText || _paragraph.editingText}
          rows={1}
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
        paragraph_id={paragraph.id}
        ref={paragraphRef}
        className={`paragraph${classes}`}
        value={_paragraph.coverText || _paragraph.text}
        readOnly
        rows={1}
        onFocus={onParagraphFocus}
        placeholder={paragraphIndex === paragraphsLength - 1 ? placeHolder : undefined}
      />
    </div>
  );
}

Paragraph.propTypes = {
  paragraph: PropTypes.object.isRequired,
  tabId: PropTypes.string.isRequired,
  paragraphIndex: PropTypes.number.isRequired,
  paragraphsLength: PropTypes.number.isRequired,
  previousParagraphId: PropTypes.string.isRequired,
  nextParagraphId: PropTypes.string.isRequired,
  previousParagraphText: PropTypes.string.isRequired,
};
