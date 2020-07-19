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
    expect(download.props).to.haveOwnProperty('mime');

    expect(download.props.data).to.eql([String, Function]);
    expect(download.props.filename).to.equal(String);
    expect(download.props.mime).to.eql({
      default: 'text/plain',
      type: String
    });
  });

  it('renders a link with valid attributes', async () => 
  {
    const propsData = {
      data: 'abc def',
      filename: 'name.gcode',
      id: 'test-id',
      mime: 'text/plain'
    };

    const wrapper = shallowMount(download, {
      slots: {
        default: '<h1>Click to download</h1>'
      },
      propsData
    });

    //Test the href in a mock download
    const downloadMethod = download.methods.download.bind({
      $refs: {
        link: {
          click()
          {
            expect(this.href).to.equal('data:text/plain;charset=utf-8,abc%20def');
          },
          href: ''
        }
      },
      ...propsData
    });
    
    //Trigger the mock download
    await downloadMethod({
      target: 'not-even-an-element'
    });

    expect(wrapper.contains('v-btn-stub')).to.be.true;
    expect(wrapper.contains('h1')).to.be.true;
    expect(wrapper.find('h1').text()).to.equal('Click to download');
  });
});
