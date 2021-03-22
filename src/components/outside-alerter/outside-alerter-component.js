import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';

function useOutsideAlerter(ref, onClickOutside) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

function OutsideAlerter({ className, onClickOutside, children }) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, onClickOutside);

  return (
    <div className={className} ref={wrapperRef}>
      {children}
    </div>
  );
}

OutsideAlerter.propTypes = {
  className: PropTypes.string,
  children: PropTypes.element.isRequired,
  onClickOutside: PropTypes.func.isRequired,
};

OutsideAlerter.defaultProps = {
  className: '',
};

export default OutsideAlerter;
