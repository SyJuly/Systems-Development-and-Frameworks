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
  name: 'testuser',
  email: 'your@email.com',
  password: '$2y$10$3IUx11G0mcJfSpFWn3Lru.xac9OqHDzqLOAhdZovaUyKa2DhgCaOS' // "password"
},
  {
    id: '2',
    name: '2. testuser',
    email: '2your@email.com',
    password: '$2y$10$3IUx11G0mcJfSpFWn3Lru.xac9OqHDzqLOAhdZovaUyKa2DhgCaOS' // "password"
  }
]

module.exports.todos = todos;
module.exports.users = users;