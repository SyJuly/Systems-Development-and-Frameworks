import { mount } from '@vue/test-utils'
import ToDoItem from './ToDoItem.vue'

describe('ToDoItem', () => {
  describe('given a todo', () => {
    const wrapper = mount(ToDoItem, {
      propsData: {
        todo:{
          text: 'test-todo'
        }
      }
    })
    it('renders todo.text', () => {
      expect(wrapper.vm.todo.text).toBe('test-todo');
    })
    it('does not show input field', () => {
      expect(wrapper.vm.editModeOn).toBe(false);
    })
    describe('click on Edit Button', () => {
      const editButton=wrapper.find('#editButton');
      it('shows input field', () => {
        expect(wrapper.find('#editButton').exists()).toBe(true);
        editButton.trigger('click');
        expect(wrapper.vm.editModeOn).toBe(true);
      })
      describe('edit text and submit', () => {
        it('$emits save with edited todo', () => {
          const updatedTodoText='updated todo';
          wrapper.vm.$emit('editTodo', updatedTodoText);
          expect(wrapper.emitted()).toEqual([
            ['updated todo']
          ]);
          wrapper.vm.save();
          expect(wrapper.vm.editModeOn).toBe(false);
        })
      })
      describe('click on remove Button', () => {
        let removeButton
        beforeEach(() => {
          removeButton=wrapper.find('#removeButton')
        })
        it('$emits remove', () => {
          expect(wrapper.find('#removeButton').exists()).toBe(true);
          removeButton.trigger('click');
          expect(wrapper.emitted('removeTodo').toBeTruthy);
        })
      })
    })
  })
})

