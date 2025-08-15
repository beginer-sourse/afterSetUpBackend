class ApiError extends Error {
    constructor(
        statusCode,
        message= "Something went wrong",
        errors = [],
        stack = ""
    ) // message is passed form this constructor to error constructor after initailize it is passed
    // to this.message = message (this was initilized in error constructor)
    {

/*
You can remove super(message) and manually set this.message, but you’ll lose:

    Proper formatting in the stack trace
    Automatic inclusion of the message in Error string output
    Some internal metadata useful for debugging

*/

        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message 
        this.success = false;
        this.errors = errors

        if (stack) {
            this.stack = stack
/*
stack = the breadcrumb trail of function calls showing where the error happened.
    You either:

        Use an existing one (passed in),

        Or create a clean one skipping your custom error constructor.
*/

        } else{
            Error.captureStackTrace(this, this.constructor)
        }

/*
this refers to the current instance of the class where that line is written — in other words, 
the actual error object being created.


Error.captureStackTrace(targetObject, constructorOpt)
    targetObject → The object where the stack trace will be stored (usually this when inside a class).
    constructorOpt → A function to exclude from the stack trace (usually the constructor of the 
    current class).

Start the trace from after the function passed as the second argument (this.constructor, i.e., 
the MyError constructor), so it doesn’t clutter the trace.

*/

    }
}

export {ApiError}