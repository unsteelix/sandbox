export default {
  title: 'Sample Dropdown widget',
  units: [
    {
      type: 'text',
      value: {
        text: 'It is test dropdown widget',
      },
    },
    {
      type: 'widget',
      value: {
        type: 'dropdown',
        randomOrder: true,
        choices: [
          {
            value: 'a',
            display: 'odd',
            speech: 'odd',
            hint: 'not true',
          },
          {
            value: 'b',
            display: 'even',
            speech: 'even',
            hint: 'not true',
          },
          {
            value: 'c',
            display: 'turning',
            speech: 'turning',
            hint: 'true',
          },
          {
            value: 'd',
            display: 'decreasing',
            speech: 'decreasing',
            hint: 'not true',
          },
          {
            value: 'e',
            display: 'increasing',
            speech: 'increasing',
            hint: 'not true',
          },
        ],
      },
    },
    {
      type: 'divider',
    },
  ],
};
