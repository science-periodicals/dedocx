import asyncSeries from 'async/series';
import debug from 'debug';

/**
 * Iterate through an array of functions (steps) serially, calling each one
 * with the current context (ctx) and the next function in the chain.
 *
 * Each step function accepts two arguments: a context and a callback
 * function that must be called to continue the chain of execution.
 * The callback accepts as its first argument the error, if any,
 * and as its remaining arguments any return values the user wishes
 * to pass along to the final callback.
 *
 * Important: in order to pass values between functions you must
 * leverage the context; the values passed to the individual
 * callback functions within each step are not provided to the next
 * function in the pipeline (but they are provided to the final
 * callback).
 *
 * @param {Function[]} steps - A list of functions to run as a pipeline.
 * @param {Object} ctx - The dedocx context.
 * @param {Function} callback - A final callback to execute, if any.
 */
export default function pipeline(steps, ctx, callback) {
  asyncSeries(
    steps.map(step => cb => {
      try {
        debug(`# ${step.name}`);
        step(ctx, cb);
      } catch (e) {
        ctx.log.error(`Error in ${step.name}:`, e);
        cb();
      }
    }),
    callback
  );
}
