import { mount} from '@vue/test-utils'
import App from './App'

describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(App)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
