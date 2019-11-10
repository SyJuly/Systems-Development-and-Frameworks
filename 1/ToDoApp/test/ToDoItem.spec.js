import { shallowMount } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import ToDoItem from '../src/components/ToDoItem.vue'

describe('ToDoItem', () => {
  describe('given a todo', () => {
    const wrapper = mount(ToDoItem, {
      propsData: {
        todo:{text: 'test-todo'}
      }
    })
    it('renders todo.text', () => {
      expect(wrapper.vm.todo.text).toBe('test-todo');
    })
    it('adds new todo', () => {
      wrapper.vm.$emit('todo','new task')
      expect(wrapper.emitted().todo).toBeTruthy()
      expect(wrapper.emitted().todo[0]).toEqual(['new task']);
    })
    describe('click on Edit Button', () => {
      const editButton=wrapper.find('#editButton');
      it('shows input field', () => {
        editButton.trigger('click')
        expect(wrapper.vm.editModeOn).toBe(true);
      })
      describe('edit text and submit', () => {
        it('$emits save with edited todo', () => {
          const updatedTodoText='updated todo'
          wrapper.vm.$emit('todo','update')

        })
      })
      describe('click on remove Button', () => {
        const removeButton=wrapper.find('#removeButton');
        it('$emits remove', () => {
          expect(wrapper.emitted('removeTodo'));
        //  expect(wrapper.vm.editModeOn).toBe(false);
        })
      })
    })
  })
})

