/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';

import Tab from '../../../../components/tab';
import { ifff } from '../../../../utils';
import './tabs.css';

const startingTab = 0;

export default function Tabs({ tabs, onTabChange }) {
  const [currentTabId, setCurrentTabId] = useState(tabs[startingTab] && tabs[startingTab].id);
  const [leftTabPos, setLeftTabPos] = useState(0);
  const tabTitlesRef = useRef(null);

  function handleTabClick(e, tab) {
    if (tab.id !== currentTabId) {
      e.preventDefault();

      if ('activeElement' in document) document.activeElement.blur();

      setCurrentTabId(tab.id);
      onTabChange(tab);
    }
  }

  useEffect(() => {
    if (!currentTabId) return;

    const tabWrapperElem = document.querySelector(`div.tab-title-wrapper[tabid="${currentTabId}"]`);

    if (tabWrapperElem) {
      setLeftTabPos(tabWrapperElem.offsetLeft);
    }
  }, [currentTabId, tabs]);

  useEffect(() => {
    if (tabs.length) onTabChange(tabs[startingTab] || null);
  }, []);

  useEffect(() => {
    if (!tabs.length) onTabChange(null);
  }, [tabs]);

  if (!tabs.length) {
    return <div>Começar</div>;
  }

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
            const nextTabId = ifff(tabs[index + 1], tab => tab.id, '');
            const previousTabId = ifff(tabs[index - 1], tab => tab.id, '');

            return (
              <Tab
                key={tab.id}
                tab={tab}
                onClick={handleTabClick}
                nextTabId={nextTabId}
                previousTabId={previousTabId}
                isCurrentTab={currentTabId === tab.id}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
}
Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  onTabChange: PropTypes.func.isRequired,
};
