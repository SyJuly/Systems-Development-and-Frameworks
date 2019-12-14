import ToDoList from '../ToDoList/ToDoList.vue';
import ToDoItem from '../ToDoItem/ToDoItem.vue';
import {mount} from "@vue/test-utils";

describe('ToDoList', () => {
  const wrapper = mount(ToDoList);

  it('renders 10 initial example-items on the list', () => {
    expect(wrapper.findAll(ToDoItem)).toHaveLength(10)
  });

  it('decreases in size when Item is removed', () => {
    wrapper.find('#removeButton').trigger('click');
    expect(wrapper.findAll(ToDoItem)).toHaveLength(9);

  });
});

