import UsersQuery from "../models/user.model.js";
import  Jwt from "jsonwebtoken";


const dbUser = new UsersQuery();

export class ControllerUsers{
    
    async createUser(request, reply){
        
            try{
                const { name, fancyname, email, document, phone, password,} = request.body;
           
                const response = await dbUser.create({
                   name,
                   fancyname,
                   email, 
                   document,
                   phone,
                   password
                })
                return (reply.status(201).send(response));
            }catch(error){
                return (reply.status(401).send({message: 'falha ao criar o usuário', error}));
            }
                
    }

    async listUsers(request, reply){
        try{
            const users = await dbUser.list(request, reply);
            if(users.success)
                return (reply.code(201).send(users));
        }catch(error){
            return (reply.code(401).send({message: 'Falha ao listar os usuários', erro: error}));
        }
    }

    async updateUser(request, reply){

        try{
            const userId = request.params.id;
            const { name, fancyname, email, document, phone, password } = request.body;
            
            const response = await dbUser.update(userId, {
                name, 
                fancyname,
                email, 
                document, 
                phone, 
                password
            })
            return (reply.status(204).send(response));

        }catch(error){
            return (reply.status(401).send({message: 'Erro ao autalizar os dados do usuário'}))
        }
    }

    async deleteUser(request, reply){
        
        
        try{
            const userId = request.params.id;
            if(!userId)
                return (reply.status(401).send({message: 'Id necessário'}));
            let response = await dbUser.delete(userId);
            return (reply.status(204).send(response));

        }catch(error){
            return (reply.status(401).send(error));
        }
    }

    async authLogin(request, reply, app){
        const {email, document, phone, password} = request.body;
        const type = email ? 'email' : (document ? 'document' : (phone ? 'phone' : undefined));
        if (!type)
            return (reply.code(400).send({ success: false, message: 'Selecione o tipo de login: e-mail OU CPF OU número de telefone'}));

        const data = { login: email || document || phone, password };
        try{
            const response = await dbUser.authenticate(type, data);
            if (response.success)
            {
                const user = response.user;
                const token = Jwt.sign({user}, process.env.SECRET, {expiresIn: '1d'});
                return (reply.code(201).send({response, token}));
            }
            return (reply.code(401).send(response));
        }catch(error){
            return (reply.code(401).send(error));
        }
    }
}
