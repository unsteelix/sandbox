export default {
  title: 'Sample Essay widget',
  units: [
    {
      type: 'text',
      value: {
        text: 'It is test essay widget',
      },
    },
    {
      type: 'widget',
      value: {
        type: 'essay',
        answer: 'some init text',
        hint: ['you right', 'you wrong'],
      },
    },
    {
      type: 'divider',
    },
  ],
};
