import React from 'react';
import Header from './Header';
import MainToggle from './MainToggle';
import MessagesNoti from './MessagesNoti';
import GroupNoti from './GroupNoti';
import CallsNoti from './CallsNoti';
import StatusNoti from './StatusNoti';

const App = ({ goBack }) => { 
  return (
    <div className="container py-3">
      <Header goBack={goBack} /> 
      <MainToggle />
      <MessagesNoti />
      <GroupNoti />
      <CallsNoti />
      <StatusNoti />
    </div>
  );
};

export default App;
