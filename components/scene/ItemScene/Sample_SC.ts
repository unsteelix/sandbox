export default {
  title: 'Sample MC widget',
  units: [
    {
      type: 'text',
      value: {
        text: 'It is sample of MC widget (subtype: radio)',
      },
    },
    {
      type: 'widget',
      value: {
        type: 'mc',
        randomOrder: true,
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
            hint: 'right',
          },
          {
            value: 'c',
            display: '1000',
            speech: '1000',
            hint: 'wrong',
          },
          {
            value: 'd',
            display: '2000',
            speech: '2000',
            hint: 'wrong',
          },
          {
            value: 'e',
            display: '3300',
            speech: '3300',
            hint: 'wrong',
          },
        ],
        answer: 'd',
      },
    },
    {
      type: 'divider',
    },
  ],
};
