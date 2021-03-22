/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Paragraph from '../../../../components/paragrah';
import './paragraphs.css';
import { addParagraph } from '../../../../redux/actions/paragraphs-actions';
import { ifff } from '../../../../utils';

export default function Paragraphs({ currentTabId, paragraphs }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (paragraphs.length === 0) {
      dispatch(addParagraph({ tabId: currentTabId }));
    }
  }, [currentTabId]);

  return (
    <ul className="paragraphs">
      {paragraphs.map((paragraph, index) => {
        const previousParagraphId = ifff(paragraphs[index - 1], paragraph => paragraph.id, '');
        const nextParagraphId = ifff(paragraphs[index + 1], paragraph => paragraph.id, '');
        const previousParagraphText = ifff(
          paragraphs[index - 1],
          paragraph => paragraph.editingText,
          '',
        );

        return (
          <Paragraph
            key={paragraph.id}
            paragraph={paragraph}
            tabId={currentTabId}
            paragraphIndex={index}
            paragraphsLength={paragraphs.length}
            previousParagraphId={previousParagraphId}
            nextParagraphId={nextParagraphId}
            previousParagraphText={previousParagraphText}
          />
        );
      })}
    </ul>
  );
}
Paragraphs.propTypes = {
  currentTabId: PropTypes.string.isRequired,
  paragraphs: PropTypes.array.isRequired,
};
