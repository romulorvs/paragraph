/* eslint-disable no-case-declarations */
import ternary from 'ternary-function';
import { v4 as uuid } from 'uuid';

function getBlankParagraph() {
  const BLANK_PARAGRAPH = {
    id: uuid(),
    text: '',
    editingText: '',
    coverText: '',
  };
  return BLANK_PARAGRAPH;
}

function getBlankTab() {
  const BLANK_TAB = {
    id: uuid(),
    title: 'novo...',
    titleWidth: 142,
    paragraphs: [getBlankParagraph()],
  };
  return BLANK_TAB;
}

function getInitialState() {
  const INITIAL_STATE = {
    tabs: [
      {
        id: uuid(),
        title: '📝 Hoje',
        titleWidth: 141,
        paragraphs: [
          {
            id: uuid(),
            text: 'Comece escrevendo algo neste parágrafo ou abaixo.',
            editingText: '###Comece escrevendo algo neste parágrafo ou abaixo.',
            coverText: '',
          },
          getBlankParagraph(),
        ],
      },
      {
        id: uuid(),
        title: '💡 Dicas',
        titleWidth: 155,
        paragraphs: [
          {
            id: uuid(),
            text: ' #comece o texto com # para fonte extra-grande',
            editingText: '# #comece o texto com # para fonte extra-grande',
            coverText: '',
          },
          {
            id: uuid(),
            text: ' ##comece o texto com ## para fonte grande',
            editingText: '## ##comece o texto com ## para fonte grande',
            coverText: '',
          },
          {
            id: uuid(),
            text: ' ###comece o texto com ### para fonte média',
            editingText: '### ###comece o texto com ### para fonte média',
            coverText: '',
          },
          {
            id: uuid(),
            text: '---',
            editingText: '---',
            coverText: '---',
          },
          {
            id: uuid(),
            text: ' ---para criar uma linha divisória, como acima,  comece o texto com ---',
            editingText: ' ---para criar uma linha divisória, como acima,  comece o texto com ---',
            coverText: '',
          },
          {
            id: uuid(),
            text: 'Dicas do texto:',
            editingText: '###Dicas do texto:',
            coverText: '',
          },
          {
            id: uuid(),
            text:
              'Aperte Enter para criar um novo parágrafo e Shift+Enter para criar uma nova linha no mesmo parágrafo.',
            editingText:
              'Aperte Enter para criar um novo parágrafo e Shift+Enter para criar uma nova linha no mesmo parágrafo.',
            coverText: '',
          },
          getBlankParagraph(),
        ],
      },
      getBlankTab(),
    ],
    version: 1,
  };
  INITIAL_STATE.currentTabId = INITIAL_STATE.tabs[0].id;

  return INITIAL_STATE;
}

export default (state = getInitialState(), action) => {
  const { type } = action;

  if (typeof type !== 'string') return state;

  const { tabId, paragraphId, afterId, newParagraph, title, titleWidth } = action.payload || {};
  const tabs = [...state.tabs];
  let tabIndex;
  let paragraphIndex;

  const documentHasFocus = document.hasFocus();

  switch (type) {
    case 'ADD_PARAGRAPH':
      if (!documentHasFocus) return state;

      tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex < 0) return state;

      const afterIndex = afterId
        ? tabs[tabIndex].paragraphs.findIndex(paragraph => paragraph.id === afterId)
        : -1;

      if (afterIndex >= 0) {
        tabs[tabIndex].paragraphs.splice(afterIndex + 1, 0, getBlankParagraph());
      } else {
        tabs[tabIndex].paragraphs.push(getBlankParagraph());
      }

      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'REMOVE_PARAGRAPH':
      if (!documentHasFocus) return state;

      tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex < 0) return state;

      paragraphIndex = tabs[tabIndex].paragraphs.findIndex(
        paragraph => paragraph.id === paragraphId,
      );
      if (paragraphIndex === -1) return state;

      tabs[tabIndex].paragraphs.splice(paragraphIndex, 1);

      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'UPDATE_PARAGRAPH':
      if (!documentHasFocus) return state;

      tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex < 0) return state;

      paragraphIndex = tabs[tabIndex].paragraphs.findIndex(
        paragraph => paragraph.id === paragraphId,
      );
      if (paragraphIndex === -1) return state;

      const currentParagraph = tabs[tabIndex].paragraphs[paragraphIndex];

      tabs[tabIndex].paragraphs[paragraphIndex] = {
        ...currentParagraph,
        ...newParagraph,
      };

      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'SET_CURRENT_TAB_ID':
      if (!documentHasFocus) return state;

      tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex < 0) return state;

      return {
        ...state,
        currentTabId: tabId,
      };

    case 'UPDATE_TAB_TITLE':
      if (!documentHasFocus) return state;

      tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex < 0) return state;

      tabs[tabIndex].title = title;

      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'UPDATE_TAB_WIDTH':
      if (!documentHasFocus) return state;

      tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex < 0) return state;

      tabs[tabIndex].titleWidth = titleWidth;

      return {
        ...state,
        tabs,
        version: state.version + 1,
      };

    case 'CREATE_TAB':
      if (!documentHasFocus) return state;

      const blankTab = getBlankTab();

      tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex < 0) {
        tabs.push(blankTab);
      } else {
        tabs.splice(tabIndex + 1, 0, blankTab);
      }

      return {
        ...state,
        tabs,
        currentTabId: blankTab.id,
        version: state.version + 1,
      };

    case 'REMOVE_TAB':
      if (!documentHasFocus) return state;

      tabIndex = tabs.findIndex(tab => tab.id === tabId);
      if (tabIndex < 0) return state;

      tabs.splice(tabIndex, 1);
      return {
        ...state,
        tabs,
        currentTabId: !tabs.length ? '' : state.currentTabId,
        version: state.version + 1,
      };

    case 'UPDATE_STATE':
      if (documentHasFocus) return state;
      const { storedParagraphs: storedState } = ternary(
        localStorage.getItem('@paragraph:data'),
        r => JSON.parse(r),
      );

      if (storedState && state.version >= storedState.version) return state;

      return storedState;

    case 'RESET':
      const newState = getInitialState();
      return newState;

    default:
      return state;
  }
};
