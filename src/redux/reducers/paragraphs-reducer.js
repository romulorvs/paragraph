/* eslint-disable no-case-declarations */

import { ifff } from '../../utils';

const BLANK_PARAGRAPH = {
  text: '',
  editingText: '',
  coverText: '',
  rows: 1,
};
const INITIAL_STATE = {
  tabs: [
    {
      title: 'Hoje',
      titleWidth: 30,
      paragraphs: [BLANK_PARAGRAPH],
      paragraphsLength: 1,
    },
    {
      title: 'novo...',
      titleWidth: 167,
      paragraphs: [BLANK_PARAGRAPH],
      paragraphsLength: 1,
    },
  ],
  version: 1,
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  if (typeof type !== 'string' || typeof payload === 'undefined') {
    return state;
  }

  const { tabIndex, paragraphIndex, after, newParagraph, title, titleWidth } = payload;
  const tabs = [...state.tabs];

  const documentHasFocus = document.hasFocus();

  switch (type) {
    case 'ADD_PARAGRAPH':
      if (!documentHasFocus) return state;

      if (after !== null && after >= 0) {
        tabs[tabIndex].paragraphs.splice(after + 1, 0, BLANK_PARAGRAPH);
      } else {
        tabs[tabIndex].paragraphs.push(BLANK_PARAGRAPH);
      }
      tabs[tabIndex].paragraphsLength = tabs[tabIndex].paragraphs.length;

      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'REMOVE_PARAGRAPH':
      if (!documentHasFocus) return state;
      const existingParagraphIndex = tabs[tabIndex].paragraphs.findIndex(
        (p, pIndex) => pIndex === paragraphIndex,
      );
      if (existingParagraphIndex === -1) return state;

      tabs[tabIndex].paragraphs.splice(existingParagraphIndex, 1);
      tabs[tabIndex].paragraphsLength = tabs[tabIndex].paragraphs.length;

      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'UPDATE_PARAGRAPH':
      if (!documentHasFocus) return state;
      const updatedParagraphs = tabs[tabIndex].paragraphs.map((paragraph, pIndex) => {
        if (pIndex === paragraphIndex) {
          return {
            ...paragraph,
            ...newParagraph,
          };
        }
        return paragraph;
      });

      tabs[tabIndex].paragraphs = updatedParagraphs;
      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'UPDATE_TAB_TITLE':
      if (!documentHasFocus) return state;
      tabs[tabIndex].title = title;
      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'UPDATE_TAB_WIDTH':
      if (!documentHasFocus) return state;
      tabs[tabIndex].titleWidth = titleWidth;
      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'UPDATE_STATE':
      if (documentHasFocus) return state;
      const { storedParagraphs: storedState } = ifff(localStorage.getItem('@paragraph:data'), r =>
        JSON.parse(r),
      );

      if (storedState && state.version >= storedState.version) return state;

      return typeof storedState.version === 'number' ? storedState : { ...storedState, version: 1 };

    default:
      return state;
  }
};
