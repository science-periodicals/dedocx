import assert from 'assert';
import pipeline from '../pipeline';

describe('Pipeline', () => {
  it('should process a list of functions, calling each one in turn', done => {
    let fn = jest.fn();
    pipeline(
      [
        (_, cb) => {
          fn();
          cb();
        },
        (_, cb) => {
          fn();
          cb();
        },
        (_, cb) => {
          fn();
          cb();
        }
      ],
      null,
      (err, results) => {
        expect(fn).toHaveBeenCalledTimes(3);
        done();
      }
    );
  });

  it('should halt the pipeline on error', done => {
    let fn = jest.fn();
    pipeline(
      [
        (_, cb) => {
          fn();
          cb('error');
        },
        (_, cb) => {
          fn();
          cb();
        }
      ],
      null,
      (err, results) => {
        expect(fn).toHaveBeenCalledTimes(1);
        assert.equal(err, 'error');
        done();
      }
    );
  });
});
