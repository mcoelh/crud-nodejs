import UsersQuery from "../models/user.model.js";
import  Jwt from "jsonwebtoken";


const dbUser = new UsersQuery();

export class ControllerUsers{
    
    async createUser(request, reply){
        const { name, fancyname, email, document, phone, password,  } = request.body;
   
        await dbUser.create({
           name,
           fancyname,
           email, 
           document,
           phone,
           password
        })
        return reply.status(201).send();
    }

    async listUsers(request, reply){
        const users = await dbUser.list(request, reply);

        return reply.send(users);
    }

    async updateUser(request, reply){

        const userId = request.params.id;
        const { name, fancyname, email, document, phone, password } = request.body;
        
        await dbUser.update(userId, {
            name, 
            fancyname,
            email, 
            document, 
            phone, 
            password
        })
        return reply.status(204).send();
    }

    async deleteUser(request, reply){
        const userId = request.params.id;

        await dbUser.delete(userId);
        return reply.status(204).send();
    }

    async authLogin(request, reply, app){
        const {email, document, phone, password} = request.body;
        const type = email ? 'email' : (document ? 'document' : (phone ? 'phone' : undefined));
        if (!type)
            return reply.code(400).send({ success: false, message: 'Selecione o tipo de login: e-mail OU CPF OU número de telefone'});

        const data = { login: email || document || phone, password };
        const response = await dbUser.authenticate(type, data);
        if (response.success)
        {
            const user = response.user;
            const token = Jwt.sign({user}, process.env.SECRET, {expiresIn: '1d'});
            //console.log(token);
            reply.code(201).send({response, token});
        }
        return reply.code(401).send(response);
    }
}
