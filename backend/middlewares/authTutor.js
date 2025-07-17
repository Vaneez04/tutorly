import jwt from 'jsonwebtoken'

// tutor authentication middleware
const authTutor = async (req, res, next) => {
    const { ttoken } = req.headers
    if (!ttoken) {
        return res.json({ success: false, message: 'Not Authorized Login Again' })
    }
    try {
        const token_decode = jwt.verify(ttoken, process.env.JWT_SECRET)
        req.body.tutid = token_decode.id
        next()
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// const authTutor = async (req, res, next) => {
//   const { ttoken } = req.headers;
//   if (!ttoken) {
//     return res.status(401).json({ success: false, message: 'Not Authorized, Login Again' });
//   }

//   try {
//     const token_decode = jwt.verify(ttoken, process.env.JWT_SECRET);
//     req.user = { id: token_decode.id }; // ✅ use req.user instead of req.body
//     next();
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ success: false, message: error.message });
//   }
// };
export default authTutor;



