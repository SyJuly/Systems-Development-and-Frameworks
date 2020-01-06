let todos = [{
  id: '1',
  message: 'first todo',
  finished: false,
  publishedBy: '1'
},
  {
    id: 2,
    message: 'second todo',
    finished: true,
    publishedBy: '2'
  },
];

let users = [{
  id: '1',
  name: 'eva testuser',
  email: 'your@email.com',
  password: '$2y$10$3IUx11G0mcJfSpFWn3Lru.xac9OqHDzqLOAhdZovaUyKa2DhgCaOS' // "password"
},
  {
    id: '2',
    name: 'anna testuser',
    email: '2your@email.com',
    password: '$2y$10$3IUx11G0mcJfSpFWn3Lru.xac9OqHDzqLOAhdZovaUyKa2DhgCaOS' // "password"
  }
];

let events = [{
    id: '1',
    motto: '90s Party',
    date:"31.01.2020"
    },
    {
      id: '2',
      motto: 'SDF Vortrag',
      date:"15.01.2020"
    }
]

module.exports.todos = todos;
module.exports.users = users;
module.exports.events = events;