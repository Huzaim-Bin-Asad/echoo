import React from 'react';
import Message from './Message';

const MessageList = () => {
  const messages = [
    {
      id: 1,
      sender: "Deep Keen",
      recipient: "You",
      date: "19/03/2025",
      type: "audio",
      fileName: "voiceover5.mp3",
      size: "676 kB",
      time: "8:20 pm",
    },
    {
      id: 2,
      sender: "You",
      recipient: "Chachu",
      date: "08/12/2024",
      type: "image",
    },
    {
      id: 3,
      sender: "You",
      recipient: "Me",
      date: "04/11/2024",
      type: "forwarded",
      title: "Sendups Syllabus & Date Sheet 2024-25 (Grade X)",
      tableData: [
        { date: "Friday", subtest: "PassiveNotes" },
        { date: "Monday", subtest: "Paylist (Teeny+Fail)" },
      ],
    },
  ];

  return (
    <div className="divide-y overflow-y-auto bg-black text-white" style={{ height: 'calc(100vh - 60px)' }}>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
