import jwt from 'jsonwebtoken';

const generateToken = (res,userId) => {
  const token =jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'30d'}) //jwt.sign(payload, secret, options)
  res.cookie('jwt',token,{
    httpOnly: true,// protects against XSS (Cross-Site Scripting) attacks.=> protecting jwt
    secure: process.env.NODE_ENV !== 'development',/* CSRF attacks try to trick your browser into making requests to your server using your own cookie.
With sameSite: 'strict', your browser says: "I’ll only send this cookie for same-site requests."
 */
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000

  })
}

export default generateToken
