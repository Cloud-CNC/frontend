/**
 * @fileoverview Download component unit test
 */

//Imports
import {expect} from 'chai';
import {shallowMount} from '@vue/test-utils';
import download from '@/components/download.vue';

//Tests
describe('download.vue', () => 
{
  it('excepts props', () =>
  {
    expect(download).to.haveOwnProperty('props');
    expect(download.props).to.haveOwnProperty('data');
    expect(download.props).to.haveOwnProperty('filename');

    expect(download.props.data).to.equal(String);
    expect(download.props.filename).to.equal(String);
  });

  it('renders a link with valid attributes', () => 
  {
    const wrapper = shallowMount(download, {
      slots: {
        default: '<h1>Click to download</h1>'
      },
      propsData: {
        data: 'abc',
        filename: 'name.gcode',
        id: 'test-id'
      }
    });

    expect(wrapper.contains('v-btn-stub')).to.be.true;
    expect(wrapper.attributes('download')).to.equal('name.gcode');
    expect(wrapper.attributes('href')).to.equal('data:text/plain;charset=utf-8,abc');

    expect(wrapper.contains('h1')).to.be.true;
    expect(wrapper.find('h1').text()).to.equal('Click to download');
  });
});
