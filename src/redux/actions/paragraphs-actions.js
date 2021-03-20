export function addParagraph({ tabIndex, after = null }) {
  return {
    type: 'ADD_PARAGRAPH',
    payload: {
      tabIndex,
      after,
    },
  };
}

export function removeParagraph({ tabIndex, paragraphIndex }) {
  return {
    type: 'REMOVE_PARAGRAPH',
    payload: {
      tabIndex,
      paragraphIndex,
    },
  };
}

export function updateParagraph({ tabIndex, paragraphIndex, newParagraph }) {
  return {
    type: 'UPDATE_PARAGRAPH',
    payload: {
      tabIndex,
      paragraphIndex,
      newParagraph,
    },
  };
}

export function updateTabTitle({ tabIndex, title }) {
  return {
    type: 'UPDATE_TAB_TITLE',
    payload: {
      tabIndex,
      title,
    },
  };
}

export function updateTabWidth({ tabIndex, titleWidth }) {
  return {
    type: 'UPDATE_TAB_WIDTH',
    payload: {
      tabIndex,
      titleWidth,
    },
  };
}

export function updateState() {
  return {
    type: 'UPDATE_STATE',
    payload: {},
  };
}
