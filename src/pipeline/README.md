### Pipeline Functions

Each of the files in this module exposes a "pipeline" function
(or "plugin") that has the signature:

```javascript
(ctx, callback) => { ... }
```

`ctx` is the runtime context, which can be used to store and get
information shared between plugins. `callback` is the callback
function that each plugin must execute in order to continue
processing the next function in the series.
