
// using promioses
const asyncHandler =(requestHandler) => {
  return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch( (err) => next(err))
    }
}

export {asyncHandler}

// high orders function funtiocn that pass function as paramenrter or return simplit treate as varaibel

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
//const asyncHandler = (func) => async() => {} 
    // genrela (err, req, res, next) 
    // usung try catch
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     }catch(error) {
//         res.staus(err.code || 500).json( {
//             success : false,
//             message : err.message
//         })
//     }
// }