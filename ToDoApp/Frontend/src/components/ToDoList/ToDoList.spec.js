import ToDoList from '../ToDoList/ToDoList.vue';
import ToDoItem from '../ToDoItem/ToDoItem.vue';
import {mount} from "@vue/test-utils";

const data = {
    allTodos: [
      {
        id: 1,
        message: "message"
      }
    ]
  }
let wrapper;

describe('ToDoList', () => {
  beforeEach(() =>{
     wrapper = mount(ToDoList, {
       mocks: {
         $apollo: {
           query: jest.fn(() => Promise.resolve({
             data
           }))
         }
       }
    })
  })
  it('renders 1 initial example-items on the list', () => {
    expect(wrapper.findAll(ToDoItem)).toHaveLength(1)
  });

  it('decreases in size when Item is removed', () => {
    wrapper.find('#removeButton').trigger('click');
    expect(wrapper.findAll(ToDoItem)).toHaveLength(0);

  });
});

