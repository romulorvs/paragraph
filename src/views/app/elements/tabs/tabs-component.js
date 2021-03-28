/* eslint-disable react/forbid-prop-types */
import throttle from 'lodash.throttle';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ternary from 'ternary-function';

import { ReactComponent as AddSVG } from '../../../../assets/add.svg';
import { ReactComponent as LeftArrowSVG } from '../../../../assets/leftArrow.svg';
import { ReactComponent as RightArrowSVG } from '../../../../assets/rightArrow.svg';
import Tab from '../../../../components/tab';
import { createTab, setCurrentTabId } from '../../../../redux/actions/paragraphs-actions';

import './tabs.css';

let mouseMoveFn = null;

export default function Tabs() {
  const dispatch = useDispatch();
  const { currentTabId, tabs } = useSelector(state => state.storedParagraphs);
  const [leftTabPos, setLeftTabPos] = useState(0);
  const tabTitlesRef = useRef(null);
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

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

  useEffect(() => {
    let showLeftChanger = false;
    let showRightChanger = false;
    if (tabs.length > 1) {
      const currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);
      if (currentTabIndex < 0) {
        showLeftChanger = false;
        showRightChanger = false;
      } else if (currentTabIndex === 0) {
        showLeftChanger = false;
        showRightChanger = true;
      } else if (currentTabIndex === tabs.length - 1) {
        showLeftChanger = true;
        showRightChanger = false;
      } else {
        showLeftChanger = true;
        showRightChanger = true;
      }
    }

    if (mouseMoveFn !== null) {
      window.removeEventListener('mousemove', mouseMoveFn);
    }

    mouseMoveFn = throttle(e => {
      if (leftArrowRef.current) {
        if (showLeftChanger) {
          leftArrowRef.current.style.left = e.clientX > 120 ? '-60px' : `${e.clientX}px`;
        } else {
          leftArrowRef.current.style.left = '-60px';
        }
        leftArrowRef.current.style.top = `${e.clientY}px`;
      }

      if (rightArrowRef.current) {
        if (showRightChanger) {
          rightArrowRef.current.style.right =
            e.clientX < window.innerWidth - 120 ? `-60px` : `${window.innerWidth - e.clientX}px`;
        } else {
          rightArrowRef.current.style.right = '-60px';
        }
        rightArrowRef.current.style.top = `${e.clientY}px`;
      }
    }, 100);
    mouseMoveFn({ clientX: undefined, clientY: undefined });
    window.addEventListener('mousemove', e => mouseMoveFn(e));

    return () => {
      window.removeEventListener('mousemove', mouseMoveFn);
    };
  }, [currentTabId, tabs.length]);

  function handleSetPreviousTab() {
    const currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);
    const prevTabId = ternary(tabs[currentTabIndex - 1], t => t.id, '');
    dispatch(setCurrentTabId({ tabId: prevTabId }));
  }

  function handleSetNextTab() {
    const currentTabIndex = tabs.findIndex(tab => tab.id === currentTabId);
    const nextTabId = ternary(tabs[currentTabIndex + 1], t => t.id, '');
    dispatch(setCurrentTabId({ tabId: nextTabId }));
  }

  return (
    <>
      <div className="tab-changer tab-left">
        <button type="button" ref={leftArrowRef} tabIndex={-1} onClick={handleSetPreviousTab}>
          <LeftArrowSVG />
        </button>
      </div>

      <div className="tab-changer tab-right">
        <button type="button" ref={rightArrowRef} tabIndex={-1} onClick={handleSetNextTab}>
          <RightArrowSVG />
        </button>
      </div>

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
