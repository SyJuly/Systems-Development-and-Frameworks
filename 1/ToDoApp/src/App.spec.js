import { mount} from '@vue/test-utils'
import {shallowMount} from '@vue/test-utils'
import App from './App'

describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(App)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  it('is rendering welcome-heading', () =>{
    const wrapper=shallowMount(App)
    expect(wrapper.find('h1').text()).toEqual('Simple Todo App');
  })
})


