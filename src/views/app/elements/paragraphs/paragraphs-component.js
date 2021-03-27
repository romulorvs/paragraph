/* eslint-disable react/forbid-prop-types */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ternary from 'ternary-function';

import Paragraph from '../../../../components/paragrah';
import './paragraphs.css';
import { addParagraph } from '../../../../redux/actions/paragraphs-actions';

export default function Paragraphs() {
  const dispatch = useDispatch();

  const { tabs, currentTabId } = useSelector(state => state.storedParagraphs);
  const [paragraphs, setParagraphs] = useState([]);

  useEffect(() => {
    const storeTab = tabs.find(tab => tab.id === currentTabId);
    if (storeTab) {
      const { paragraphs: newParagraphs } = storeTab;
      setParagraphs(newParagraphs);

      if (newParagraphs.length === 0) {
        dispatch(addParagraph({ tabId: currentTabId }));
      }
    } else {
      setParagraphs([]);
    }
  }, [currentTabId, tabs]);

  return (
    <ul className="paragraphs">
      {paragraphs.map((paragraph, index) => {
        const previousParagraphId = ternary(paragraphs[index - 1], paragraph => paragraph.id, '');
        const nextParagraphId = ternary(paragraphs[index + 1], paragraph => paragraph.id, '');
        const previousParagraphText = ternary(
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
