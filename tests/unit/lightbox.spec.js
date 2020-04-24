/**
 * @fileoverview Lightbox component unit tests
 */

//Imports
import {expect} from 'chai';
import {shallowMount, createLocalVue} from '@vue/test-utils';
import lightbox from '@/components/lightbox.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

//Bootstrap Vuetify
Vue.use(Vuetify);
const vuetify = new Vuetify();
const localVue = createLocalVue();

//Tests
describe('lightbox.vue', () => 
{
  it('excepts props', () =>
  {
    expect(lightbox).to.haveOwnProperty('props');
    expect(lightbox.props).to.haveOwnProperty('value');
    expect(lightbox.props.value).to.haveOwnProperty('required');
    expect(lightbox.props.value).to.haveOwnProperty('type');

    expect(lightbox.props.value.required).to.equal(true);
    expect(lightbox.props.value.type).to.equal(Boolean);
  });

  it('is visible when enabled', () => 
  {
    const wrapper = shallowMount(lightbox, {
      localVue,
      vuetify,
      slots: {
        title: '<h1>Lightbox Title</h1>',
        content: '<p>Some lightbox content.</p>'
      },
      propsData: {
        value: true
      }
    });

    expect(wrapper.contains('v-dialog-stub')).to.be.true;
    expect(wrapper.attributes('value')).to.equal('true');

    expect(wrapper.contains('h1')).to.be.true;
    expect(wrapper.find('h1').text()).to.equal('Lightbox Title');

    expect(wrapper.contains('p')).to.be.true;
    expect(wrapper.find('p').text()).to.equal('Some lightbox content.');
  });

  it('is not visible when disabled', () => 
  {
    const wrapper = shallowMount(lightbox, {
      localVue,
      vuetify,
      slots: {
        title: '<h1>Lightbox Title</h1>',
        content: '<p>Some lightbox content.</p>'
      },
      propsData: {
        value: false
      }
    });

    expect(wrapper.contains('v-dialog-stub')).to.be.true;
    expect(wrapper.attributes('value')).to.be.undefined;

    expect(wrapper.contains('h1')).to.be.true;
    expect(wrapper.find('h1').text()).to.equal('Lightbox Title');

    expect(wrapper.contains('p')).to.be.true;
    expect(wrapper.find('p').text()).to.equal('Some lightbox content.');
  });
});
