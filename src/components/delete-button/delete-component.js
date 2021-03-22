import PropTypes from 'prop-types';
import { useState } from 'react';
import './delete.css';

import { ReactComponent as DeleteSVG } from '../../assets/delete.svg';
import OutsideAlerter from '../outside-alerter';

export default function DeleteButton({ className, onClick }) {
  const [pending, setPending] = useState(false);
  const pendingClassName = pending ? 'pending' : '';

  function handleDelete(e) {
    if (!pending) {
      setPending(true);
    } else {
      onClick(e);
    }
  }

  function handleClickOutside() {
    setPending(false);
  }

  return (
    <OutsideAlerter className={className} onClickOutside={handleClickOutside}>
      <button type="button" className={`delete-btn ${pendingClassName}`} onClick={handleDelete}>
        <DeleteSVG />
      </button>
    </OutsideAlerter>
  );
}

DeleteButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
};

DeleteButton.defaultProps = {
  onClick: () => {},
  className: '',
};
