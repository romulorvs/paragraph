/* eslint-disable react/forbid-prop-types */
import debounce from 'dbouncer';
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ReactComponent as AddSVG } from '../../assets/add.svg';
import {
  setCurrentTabId,
  updateTabTitle,
  updateTabWidth,
  removeTab,
  createTab,
} from '../../redux/actions/paragraphs-actions';
import DeleteButton from '../delete-button';

import './tab.css';

const placeHolder = 'Título';
const minTabWidth = 30; // pixels

export default function Tab({ tab, isCurrentTab, nextTabId, previousTabId }) {
  const dispatch = useDispatch();

  const [_title, _setTitle] = useState(tab.title);
  const [_titleWidth, _setTitleWidth] = useState(tab.titleWidth);

  const tabTitleRef = useRef(null);
  const wrapperRef = useRef(null);
  const debounceUpdateTabTitle = useRef(debounce());
  const debounceUpdateTabWidth = useRef(debounce());
  const currentClassName = isCurrentTab ? 'current' : '';

  // keeping local state synchronized with redux state when chrome tab is not active
  useEffect(() => {
    if (!document.hasFocus()) {
      _setTitle(tab.title);
      _setTitleWidth(tab.titleWidth);
    }
  }, [tab.title, tab.titleWidth]);

  function handleTabTitleChange(e) {
    _setTitle(e.target.value);

    debounceUpdateTabTitle.current(() =>
      dispatch(
        updateTabTitle({
          tabId: tab.id,
          title: e.target.value,
        }),
      ),
    );
  }

  function handleClick(e) {
    if (!isCurrentTab) {
      e.preventDefault();

      if ('activeElement' in document) {
        document.activeElement.blur();
      }

      dispatch(setCurrentTabId({ tabId: tab.id }));
    }
  }

  function handleDeleteTab() {
    if (wrapperRef.current) {
      wrapperRef.current.classList.add('removing');
      wrapperRef.current.style.maxWidth = `${wrapperRef.current.clientWidth}px`;
    }

    setTimeout(() => {
      if (wrapperRef.current) {
        wrapperRef.current.style.maxWidth = `0px`;
      }

      setTimeout(() => {
        const nextTabElement = document.querySelector(`input.tab-title[tabid="${nextTabId}"]`);
        const previousTabElement = document.querySelector(
          `input.tab-title[tabid="${previousTabId}"]`,
        );

        if (nextTabElement) {
          nextTabElement.click();
        } else if (previousTabElement) {
          previousTabElement.click();
        }

        dispatch(
          removeTab({
            tabId: tab.id,
          }),
        );
      }, 300);
    }, 10);
  }

  function handleAddNewTab() {
    dispatch(createTab({ tabId: tab.id }));
  }

  useEffect(() => {
    if (!tabTitleRef.current) return;
    _setTitleWidth(tabTitleRef.current.clientWidth);

    debounceUpdateTabWidth.current(() =>
      dispatch(
        updateTabWidth({
          tabId: tab.id,
          titleWidth: tabTitleRef.current.clientWidth,
        }),
      ),
    );
  }, [_title]);

  useEffect(() => {
    return () => {
      debounceUpdateTabTitle.current.clear();
      debounceUpdateTabWidth.current.clear();
    };
  }, []);

  return (
    <>
      <span className="tab-title-ref" ref={tabTitleRef}>
        {_title || placeHolder}
      </span>
      <div
        key={tab.id}
        tabid={tab.id}
        className={`tab-title-wrapper ${currentClassName}`}
        ref={wrapperRef}
      >
        <input
          className={`tab-title ${currentClassName}`}
          type="text"
          value={_title}
          style={{
            width: _titleWidth > minTabWidth ? `${_titleWidth}px` : `${minTabWidth}px`,
          }}
          tabid={tab.id}
          onChange={handleTabTitleChange}
          onClick={handleClick}
          placeholder={placeHolder}
        />
        <DeleteButton className="delete_button_wrapper" onClick={handleDeleteTab} />
        <button type="button" className="add-button" title="Adicionar" onClick={handleAddNewTab}>
          <AddSVG />
        </button>
      </div>
    </>
  );
}

Tab.propTypes = {
  tab: PropTypes.object.isRequired,
  isCurrentTab: PropTypes.bool.isRequired,
  nextTabId: PropTypes.string.isRequired,
  previousTabId: PropTypes.string.isRequired,
};
