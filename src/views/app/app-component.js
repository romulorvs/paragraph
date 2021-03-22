/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import './app.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import logoImg from '../../assets/logo.png';
import Paragraphs from './elements/paragraphs';
import Tabs from './elements/tabs';

function App() {
  const { tabs } = useSelector(state => state.storedParagraphs);
  const [currentTab, setCurrentTab] = useState(null);

  function handleTabChange(currentTab) {
    setCurrentTab(currentTab);
  }

  return (
    <main>
      <Tabs tabs={tabs} onTabChange={handleTabChange} />
      {currentTab && <Paragraphs currentTabId={currentTab.id} paragraphs={currentTab.paragraphs} />}
      <img src={logoImg} alt="logo" className="logo" />
    </main>
  );
}

export default App;
