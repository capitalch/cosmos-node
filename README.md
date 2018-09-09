# cosmos-node
A node.js based application to house several api's as independent modules

## knowledge base
### middleware handling
An express middleware makes use of ```app.use(...)``` construct.
I have used the express middleware in two ways.
1) ```app.use((err,req,res,next)=> {...}) ```
2) ```app.use((req,rex,next) => {...})```

In case of error you need to do ```next(error)```. 
In case of success you need to do ```res.locals.variable = value; next()``` with no parameter.
```res.locals``` is used to pass data to next middleware. See the code in server.js.

Why I use res.locals is because it is recommended way to pass data to middleware and res object is cleaned after every request.
