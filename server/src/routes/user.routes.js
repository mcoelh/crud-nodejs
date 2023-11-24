import { ControllerUsers } from "../controllers/user.controller.js";

const controller = new ControllerUsers();

export async function userRoutes(fastify, options){

    fastify.get('/users', controller.listUsers);
    fastify.post('/users', controller.createUser);
    fastify.put('/users/:id', controller.updateUser);
    fastify.delete('/users/:id', controller.deleteUser);
    fastify.post('/app/authenticate', controller.authLogin);
}