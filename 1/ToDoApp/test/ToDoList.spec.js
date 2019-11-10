import { shallowMount } from '@vue/test-utils'
import ToDoList from '../src/components/ToDoList.vue'

describe('ToDoList', () => {
  it('renders 10 initial example-items on the list', () => {
    expect(ToDoList.data().todos.length).toBe(10)
  })
})
