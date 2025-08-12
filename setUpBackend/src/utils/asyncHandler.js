const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}


export { asyncHandler }

/*
// asyncHandler takes one parameter: requestHandler, which is expected to be a controller 
    function like:

// Instead of running the controller directly, asyncHandler returns a new middleware function 
    that Express can use.

This returned function has the same signature as any Express route handler:
req → Request object
res → Response object
next → Next middleware function

// If requestHandler is async, it returns a Promise → Promise.resolve just waits for it.
    If it’s not async (normal function), Promise.resolve wraps its return value in a resolved 
    Promise anyway.
    This ensures we always have a Promise, so we can chain .catch().


// If the Promise rejects (because your async function threw an error or rejected), .catch 
    catches it.
    next(err) sends the error to Express’s error-handling middleware (the one with (err, 
    req, res, next) signature).
    Without this, an async error would crash your server unless you manually wrote try...catch 
    in every controller.
  
    
    Why it’s useful
    Same behavior, but without repetitive try...catch everywhere.
*/


/*
// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => { async () => {} }



// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
*/