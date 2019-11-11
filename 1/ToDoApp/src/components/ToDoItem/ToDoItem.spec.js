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
          expect(wrapper.emitted().editTodo[0]).toEqual([updatedTodoText]);
          wrapper.vm.save();
          expect(wrapper.vm.editModeOn).toBe(false);
        })
      })
      describe('click on remove Button', () => {
        const removeButton=wrapper.find('#removeButton');
        it('$emits remove', () => {
          expect(wrapper.find('#removeButton').exists()).toBe(true);
          removeButton.trigger('click');
          expect(wrapper.emitted('removeTodo').toBeTruthy);
        })
      })
    })
  })
})

