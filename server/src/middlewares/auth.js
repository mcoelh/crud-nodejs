import  Jwt from "jsonwebtoken";

export async function auth(req, reply, next){

    const apiKey = req.headers.authorization?.replace(/^Bearer /, "");
    const myKey = process.env.SECRET;

    if (!apiKey)
        return reply.code(401).send({error: 'Não autorizado'});
    try{
        const decodedToken = Jwt.verify(apiKey, myKey);
        if (!decodedToken.user)
            return reply.code(401).send({message: 'invalid Token!'})
        req.headers['user'] = decodedToken.user;
        return next();

    }catch(error){
        return reply.code(401).send({message: error})
    }
}