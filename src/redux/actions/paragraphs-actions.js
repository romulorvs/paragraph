export function addParagraph({ tabId, afterId = '' }) {
  return {
    type: 'ADD_PARAGRAPH',
    payload: {
      tabId,
      afterId,
    },
  };
}

export function removeParagraph({ tabId, paragraphId }) {
  return {
    type: 'REMOVE_PARAGRAPH',
    payload: {
      tabId,
      paragraphId,
    },
  };
}

export function updateParagraph({ tabId, paragraphId, newParagraph }) {
  return {
    type: 'UPDATE_PARAGRAPH',
    payload: {
      tabId,
      paragraphId,
      newParagraph,
    },
  };
}

export function updateTabTitle({ tabId, title }) {
  return {
    type: 'UPDATE_TAB_TITLE',
    payload: {
      tabId,
      title,
    },
  };
}

export function updateTabWidth({ tabId, titleWidth }) {
  return {
    type: 'UPDATE_TAB_WIDTH',
    payload: {
      tabId,
      titleWidth,
    },
  };
}

export function updateState() {
  return {
    type: 'UPDATE_STATE',
  };
}

export function createTab({ tabId = '' } = {}) {
  return {
    type: 'CREATE_TAB',
    payload: {
      tabId,
    },
  };
}

export function removeTab({ tabId = '' }) {
  return {
    type: 'REMOVE_TAB',
    payload: {
      tabId,
    },
  };
}

export function setCurrentTabId({ tabId = '' }) {
  return {
    type: 'SET_CURRENT_TAB_ID',
    payload: {
      tabId,
    },
  };
}
