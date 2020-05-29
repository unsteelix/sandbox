export default {
  title: 'Sample MC widget',
  units: [
    {
      type: 'text',
      value: {
        text: 'It is sample of MC widget (subtype: checkbox)',
      },
    },
    {
      type: 'widget',
      value: {
        type: 'mc',
        subtype: 'checkbox',
        horizontal: true,
        choices: [
          {
            value: 'a',
            display: '100',
            speech: '100',
            hint: 'wrong',
          },
          {
            value: 'b',
            display: '200',
            speech: '200',
            hint: 'wrong',
          },
          {
            value: 'c',
            display: '300',
            speech: '300',
            hint: 'right',
          },
          {
            value: 'd',
            display: '400',
            speech: '400',
            hint: 'right',
          },
        ],
        answer: ['a', 'c'],
      },
    },
    {
      type: 'divider',
    },
  ],
};
