# cosmos-node
A node.js based application to house several api's as independent modules

## knowledge base
### middleware handling
A middleware makes use of ```app.use(...)```. I have used two flavours. 1) app.use((err,req,res,next)=> {...}) and 2) app.use((req,rex,next) => {...});
In case of error you need to do next(error). In case of success you need to do res.locals.variable = value; next() with no parameter. res.locals is used to pass data to next middleware. See the code in server.js.
