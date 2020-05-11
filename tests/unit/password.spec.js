/**
 * @fileoverview Password component unit tests
 */

//Imports
import {expect} from 'chai';
import {shallowMount, createLocalVue} from '@vue/test-utils';
import password from '@/components/password.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

//Bootstrap Vuetify
Vue.use(Vuetify);
const vuetify = new Vuetify();
const localVue = createLocalVue();

//Tests
describe('password.vue', () => 
{
  it('excepts props', () =>
  {
    expect(password).to.haveOwnProperty('props');
    expect(password.props).to.haveOwnProperty('icon');
    expect(password.props).to.haveOwnProperty('value');
    expect(password.props.icon).to.haveOwnProperty('default');
    expect(password.props.icon).to.haveOwnProperty('type');
    expect(password.props.value).to.haveOwnProperty('type');
    expect(password.props.value).to.haveOwnProperty('validator');

    expect(password.props.icon.default).to.equal(false);
    expect(password.props.icon.type).to.equal(Boolean);
    expect(password.props.value.type).to.equal(String);
    expect(password.props.value.validator).to.be.a('function');
  });

  it('renders icon version correctly', () =>
  {
    const wrapper = shallowMount(password, {
      localVue,
      vuetify,
      propsData: {
        icon: true,
        value: 'Testingpassword123!'
      }
    });
    
    expect(wrapper.contains('v-text-field-stub')).to.be.true;
    expect(wrapper.attributes('rules')).to.equal('value => value != null || \'Required\',value => _filters.default.password.test(value) || \'Invalid password\'');
    expect(wrapper.attributes('value')).to.equal('Testingpassword123!');
    expect(wrapper.attributes('appendicon')).to.equal('visibility');
    expect(wrapper.attributes('label')).to.equal('Password');
    expect(wrapper.attributes('prependicon')).to.equal('lock');
    expect(wrapper.attributes('counter')).to.equal('256');
    expect(wrapper.attributes('type')).to.equal('password');
  });

  it('renders iconless version correctly', () =>
  {
    const wrapper = shallowMount(password, {
      localVue,
      vuetify,
      propsData: {
        value: 'Testingpassword123!'
      }
    });
    
    expect(wrapper.contains('v-text-field-stub')).to.be.true;
    expect(wrapper.attributes('rules')).to.equal('value => value != null || \'Required\',value => _filters.default.password.test(value) || \'Invalid password\'');
    expect(wrapper.attributes('value')).to.equal('Testingpassword123!');
    expect(wrapper.attributes('appendicon')).to.equal('visibility');
    expect(wrapper.attributes('label')).to.equal('Password');
    expect(wrapper.attributes('prependicon')).to.be.undefined;
    expect(wrapper.attributes('counter')).to.equal('256');
    expect(wrapper.attributes('type')).to.equal('password');
  });
});
