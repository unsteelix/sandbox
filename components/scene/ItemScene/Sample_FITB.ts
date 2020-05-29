export default {
  title: 'Sample FITB widget',
  units: [
    {
      type: 'text',
      value: {
        text: 'It is sample of FITB widget (subtype: text)',
      },
    },
    {
      type: 'widget',
      value: {
        type: 'fitb',
        placeholder: 'placeholder sample',
        align: 'center',
        width: '200px',
        answer: 'some init text',
        hint: ['you right', 'you wrong'],
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'text',
      value: {
        text: 'It is sample of FITB widget (subtype: math)',
      },
    },
    {
      type: 'widget',
      value: {
        type: 'fitb',
        subtype: 'math',
        placeholder: 'placeholder sample',
        align: 'left',
        width: '200px',
        answer: 'some init text',
        hint: ['you right', 'you wrong'],
      },
    },
    {
      type: 'divider',
    },
  ],
};
