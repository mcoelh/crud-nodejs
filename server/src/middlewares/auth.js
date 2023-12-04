export async function auth(req, reply){

    const apiKey = req.headers.authorization?.replace(/^Bearer /, "");
    const myKey = process.env.SECRET;

    console.log('apikey: ', apiKey, '\n','myKey: ', myKey);
    if (!apiKey)
        return reply.code(401).send({error: 'Não autorizado'});
    const decodedToken = jwt.verify(apiKey, myKey);
    console.log(decodedToken);
}