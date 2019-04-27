import { mount, createLocalVue, createWrapper } from '@vue/test-utils';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import Users from '@/components/Users.vue';
import store from '@/store';

describe('Users.vue', () => {
  let wrapper: any;

  const router = new VueRouter({});

  beforeEach(() => {

    const localVue = createLocalVue();
    localVue.use(VueRouter);
    localVue.use(Vuetify);

    wrapper = mount(Users, {
        localVue,
        router,
        store,
    });
  });

  it('runs', () => {
    //   wrapper.setData({ username: 'test' });
    //   wrapper.find('button').trigger('click');
      expect(wrapper.props().username).toBe('test');
  });

  // `it' and `expect's ready to go now.
});
