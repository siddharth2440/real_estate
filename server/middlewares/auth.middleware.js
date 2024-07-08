import jwt from "jsonwebtoken"
export const isLoggged = async (req,res,next) => {
    // console.log(req.cookies);
    const {JWT} = req.cookies;
    // console.log(JWT);
    if(!JWT){
        return res.status(401).json({message: 'You are not logged in'});
    }
    await jwt.verify(JWT,process.env.JWT_SECRET_KEY,(error,payload) => {
        if(error){
            return res.status(403).json({message: 'Invalid token'});
        }
        req.user = payload;
        next();
    } )
}