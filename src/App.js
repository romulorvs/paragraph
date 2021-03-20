/* eslint-disable react/no-array-index-key */
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';
import logoImg from './assets/logo.png';
import Paragraph from './components/Paragrah';
import { addParagraph, updateTabTitle, updateTabWidth } from './redux/actions/paragraphs-actions';

function App() {
  const tabTitleRef = useRef(null);

  const { tabs } = useSelector(state => state.storedParagraphs);
  const [currentTabIndex, setTabIndex] = useState(0);
  const { paragraphs } = tabs[currentTabIndex];
  const currentTabTitle = tabs[currentTabIndex].title;
  const leftTabPos = useRef(0);
  const tabTitlesRef = useRef(null);
  const dispatch = useDispatch();

  const handleTabTitleChange = (e, trimmed = false) => {
    dispatch(
      updateTabTitle({
        tabIndex: currentTabIndex,
        title: trimmed ? e.target.value.trim() : e.target.value,
      }),
    );
  };

  const handleClickTabIndex = (e, tabIndex) => {
    if (tabIndex !== currentTabIndex) {
      e.preventDefault();
      e.target.blur();
      setTabIndex(tabIndex);
      leftTabPos.current = e.target.offsetLeft;
    }
  };

  useEffect(() => {
    if (paragraphs.length === 0) {
      dispatch(addParagraph({ currentTabIndex }));
    }
  }, [currentTabIndex]);

  useEffect(() => {
    if (!tabTitleRef.current) return;

    dispatch(
      updateTabWidth({
        tabIndex: currentTabIndex,
        titleWidth: tabTitleRef.current.clientWidth,
      }),
    );
  }, [currentTabTitle]);

  return (
    <>
      <main>
        <span className="tab-title-ref" ref={tabTitleRef}>
          {currentTabTitle || 'Título'}
        </span>
        <div className="tab-titles-wrapper">
          <ul
            className="tab-titles"
            ref={tabTitlesRef}
            style={{
              left: `calc(50% - ${450 + leftTabPos.current}px)`,
            }}
          >
            {tabs.map((tab, tabIndex) => (
              <>
                <input
                  key={tabIndex}
                  className={`tab-title${tabIndex === currentTabIndex ? ' current' : ''}`}
                  type="text"
                  value={tab.title}
                  style={{
                    width: tab.titleWidth > 30 ? `${tab.titleWidth}px` : `30px`,
                  }}
                  onChange={handleTabTitleChange}
                  onClick={e => handleClickTabIndex(e, tabIndex)}
                  placeholder="Título"
                />
              </>
            ))}
          </ul>
        </div>
        <ul className="paragraphs">
          {paragraphs.map((paragraph, index) => (
            <Paragraph
              key={index}
              text={paragraph.text}
              editingText={paragraph.editingText}
              coverText={paragraph.coverText}
              rows={paragraph.rows}
              tabIndex={currentTabIndex}
              paragraphIndex={index}
            />
          ))}
        </ul>
      </main>
      <img src={logoImg} alt="logo" className="logo" />
    </>
  );
}

export default App;
