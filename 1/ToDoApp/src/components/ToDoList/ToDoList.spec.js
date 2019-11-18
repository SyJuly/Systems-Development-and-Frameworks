import ToDoList from './ToDoList.vue'

describe('ToDoList', () => {
  it('renders 10 initial example-items on the list', () => {
import ToDoList from './ToDoList.vue'
import ToDoItem from '../ToDoItem/ToDoItem.vue'

describe('ToDoList', () => {
  it('renders 10 initial example-items on the list', () => {
    wrapper = // .. setup
    expect(wrapper.findAll(TodoItem)).toHaveLength(10)
  })
})
  })
})
