import { shallowMount } from '@vue/test-utils'
import Extended from '@/components/Extended.vue'

describe('Extended.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'Here goes the mapaa'
    const wrapper = shallowMount(Extended)
    expect(wrapper.text()).toContain(msg)
  })
})
