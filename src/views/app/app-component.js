/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-array-index-key */
import './app.css';

import logoImg from '../../assets/logo.png';
import Paragraphs from './elements/paragraphs';
import Tabs from './elements/tabs';

function App() {
  return (
    <main>
      <Tabs />
      <Paragraphs />
      <img src={logoImg} alt="Logo Paragraphs" className="logo" />
    </main>
  );
}

export default App;
