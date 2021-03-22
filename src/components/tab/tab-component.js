/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import './tab.css';

import { updateTabTitle, updateTabWidth, removeTab } from '../../redux/actions/paragraphs-actions';
import { configDebounce } from '../../utils';
import DeleteButton from '../delete-button';

const placeHolder = 'Título';
const minTabWidth = 30; // pixels

const debounceUpdateTabTitle = configDebounce();
const debounceUpdateTabWidth = configDebounce();

export default function Tab({ tab, isCurrentTab, onClick, nextTabId, previousTabId }) {
  const dispatch = useDispatch();

  const [_title, _setTitle] = useState(tab.title);
  const [_titleWidth, _setTitleWidth] = useState(tab.title);

  const tabTitleRef = useRef(null);
  const wrapperRef = useRef(null);
  const currentClassName = isCurrentTab ? 'current' : '';

  function handleTabTitleChange(e) {
    _setTitle(e.target.value);

    debounceUpdateTabTitle(() =>
      dispatch(
        updateTabTitle({
          tabId: tab.id,
          title: e.target.value,
        }),
      ),
    );
  }

  function handleClick(e) {
    onClick(e, tab);
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

  useEffect(() => {
    if (!tabTitleRef.current) return;
    _setTitleWidth(tabTitleRef.current.clientWidth);

    debounceUpdateTabWidth(() =>
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
      debounceUpdateTabTitle.clear();
      debounceUpdateTabWidth.clear();
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
      </div>
    </>
  );
}

Tab.propTypes = {
  tab: PropTypes.object.isRequired,
  isCurrentTab: PropTypes.bool,
  onClick: PropTypes.func,
  nextTabId: PropTypes.string.isRequired,
  previousTabId: PropTypes.string.isRequired,
};

Tab.defaultProps = {
  isCurrentTab: false,
  onClick: () => {},
};
