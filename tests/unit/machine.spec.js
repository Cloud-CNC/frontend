/**
 * @fileoverview Machine component unit tests
 */

//Imports
import {expect} from 'chai';
import {shallowMount, createLocalVue} from '@vue/test-utils';
import machine from '@/components/machine.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

//Bootstrap Vuetify
Vue.use(Vuetify);
const vuetify = new Vuetify();
const localVue = createLocalVue();

//Tests
describe('machine.vue', () => 
{
  it('excepts props', () =>
  {
    expect(machine).to.haveOwnProperty('props');
    expect(machine.props).to.haveOwnProperty('machine');
    expect(machine.props).to.haveOwnProperty('visible');

    expect(machine.props.machine).to.haveOwnProperty('required');
    expect(machine.props.machine).to.haveOwnProperty('type');

    expect(machine.props.visible).to.haveOwnProperty('required');
    expect(machine.props.visible).to.haveOwnProperty('type');

    expect(machine.props.machine.required).to.equal(true);
    expect(machine.props.machine.type).to.equal(Object);

    expect(machine.props.visible.required).to.equal(true);
    expect(machine.props.visible.type).to.equal(Boolean);
  });

  it('renders correctly', () => 
  {
    const wrapper = shallowMount(machine, {
      localVue,
      vuetify,
      propsData: {
        machine: {
          tags: [
            'Machine tag 1',
            'Machine tag 2'
          ],
          _id: 'machine-id',
          controller: 'machine-controller-id',
          name: 'Machine Name',
          length: 10,
          width: 11.1,
          height: 12.0
        },
        visible: true
      }
    });

    expect(wrapper.contains('v-container-stub')).to.be.true;

    expect(wrapper.findAll('v-row-stub')).to.have.length(11);
    expect(wrapper.findAll('v-col-stub')).to.have.length(9);

    expect(wrapper.findAll('v-btn-stub').at(0).text()).to.equal('Emergency Stop');
    expect(wrapper.findAll('v-btn-stub').at(1).text()).to.equal('Stop');
    expect(wrapper.findAll('v-btn-stub').at(2).text()).to.equal('Off');
    expect(wrapper.findAll('v-btn-stub').at(3).text()).to.equal('Home');
    expect(wrapper.findAll('v-btn-stub').at(4).text()).to.equal('keyboard_arrow_up');
    expect(wrapper.findAll('v-btn-stub').at(5).text()).to.equal('keyboard_arrow_left');
    expect(wrapper.findAll('v-btn-stub').at(6).text()).to.equal('keyboard_arrow_right');
    expect(wrapper.findAll('v-btn-stub').at(7).text()).to.equal('keyboard_arrow_down');
    expect(wrapper.findAll('v-btn-stub').at(8).text()).to.equal('keyboard_arrow_up');
    expect(wrapper.findAll('v-btn-stub').at(9).text()).to.equal('keyboard_arrow_down');
    expect(wrapper.findAll('v-btn-stub').at(10).text()).to.equal('Send');
  });
});
