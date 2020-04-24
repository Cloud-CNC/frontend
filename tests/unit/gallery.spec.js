/**
 * @fileoverview Gallery component unit tests
 */

//Imports
import {expect} from 'chai';
import {shallowMount, createLocalVue} from '@vue/test-utils';
import gallery from '@/components/gallery.vue';
import Vue from 'vue';
import Vuetify from 'vuetify';

//Bootstrap Vuetify
Vue.use(Vuetify);
const vuetify = new Vuetify();
const localVue = createLocalVue();

//Tests
describe('gallery.vue', () => 
{
  it('excepts props', () =>
  {
    expect(gallery).to.haveOwnProperty('props');
    expect(gallery.props).to.haveOwnProperty('entities');
    
    expect(gallery.props.entities).to.haveOwnProperty('required');
    expect(gallery.props.entities).to.haveOwnProperty('type');

    expect(gallery.props.entities.required).to.equal(true);
    expect(gallery.props.entities.type).to.equal(Array);
  });

  it('renders correctly', () => 
  {
    const wrapper = shallowMount(gallery, {
      localVue,
      vuetify,
      mocks: {
        props: {
          entity: {
            _id: 'entity-mock-id'
          }
        }
      },
      slots: {
        actions: '<p>{{props.entity._id}}</p>',
        empty: 'No entities available!'
      },
      propsData: {
        entities: [
          {
            name: 'Entity 1 Name',
            description: 'Entity 1 Description'
          },
          {
            name: 'Entity 2 Name',
            description: 'Entity 2 Description'
          }
        ]
      }
    });

    expect(wrapper.findAll('v-card-stub')).to.have.length(2);

    expect(wrapper.findAll('v-card-title-stub').at(0).text()).to.equal('Entity 1 Name');
    expect(wrapper.findAll('v-card-text-stub').at(0).text()).to.equal('Entity 1 Description');

    expect(wrapper.findAll('v-card-title-stub').at(1).text()).to.equal('Entity 2 Name');
    expect(wrapper.findAll('v-card-text-stub').at(1).text()).to.equal('Entity 2 Description');
  });
});
