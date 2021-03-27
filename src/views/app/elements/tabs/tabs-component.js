/* eslint-disable react/forbid-prop-types */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ternary from 'ternary-function';

import { ReactComponent as AddSVG } from '../../../../assets/add.svg';
import Tab from '../../../../components/tab';
import { createTab } from '../../../../redux/actions/paragraphs-actions';

import './tabs.css';

export default function Tabs() {
  const dispatch = useDispatch();
  const { currentTabId, tabs } = useSelector(state => state.storedParagraphs);
  const [leftTabPos, setLeftTabPos] = useState(0);
  const tabTitlesRef = useRef(null);

  function handleAddNewTab() {
    dispatch(createTab());
  }

  useEffect(() => {
    if (!currentTabId) return;

    const tabWrapperElem = document.querySelector(`div.tab-title-wrapper[tabid="${currentTabId}"]`);

    if (tabWrapperElem) {
      setLeftTabPos(tabWrapperElem.offsetLeft);
    }
  }, [currentTabId]);

  return (
    <>
      <div className="tab-titles-wrapper">
        <ul
          className="tab-titles"
          ref={tabTitlesRef}
          style={{
            left: `calc(50% - ${450 + leftTabPos}px)`,
          }}
        >
          {tabs.map((tab, index) => {
            const nextTabId = ternary(tabs[index + 1], tab => tab.id, '');
            const previousTabId = ternary(tabs[index - 1], tab => tab.id, '');

            return (
              <Tab
                key={tab.id}
                tab={tab}
                nextTabId={nextTabId}
                previousTabId={previousTabId}
                isCurrentTab={currentTabId === tab.id}
              />
            );
          })}
          {!tabs.length && (
            <button
              type="button"
              className="add-button new-tab"
              title="Adicionar"
              onClick={handleAddNewTab}
            >
              <AddSVG /> Novo
            </button>
          )}
        </ul>
      </div>
    </>
  );
}
