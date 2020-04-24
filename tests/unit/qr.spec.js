/**
 * @fileoverview QR component unit tests
 */

//Imports
import {expect} from 'chai';
import qr from '@/components/qr.vue';

//Tests
describe('qr.vue', () => 
{
  it('excepts props', () =>
  {
    expect(qr).to.haveOwnProperty('props');
    expect(qr.props).to.haveOwnProperty('text');
    expect(qr.props.text).to.haveOwnProperty('required');
    expect(qr.props.text).to.haveOwnProperty('type');

    expect(qr.props.text.required).to.equal(true);
    expect(qr.props.text.type).to.equal(String);
  });
});
