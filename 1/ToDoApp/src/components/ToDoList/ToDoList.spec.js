import ToDoList from '../ToDoList/ToDoList.vue';
import ToDoItem from '../ToDoItem/ToDoItem.vue';
import {mount} from "@vue/test-utils";

describe('ToDoList', () => {
  it('renders 10 initial example-items on the list', () => {
    const wrapper = mount(ToDoList);
    expect(wrapper.findAll(ToDoItem)).toHaveLength(10)
  });
});

