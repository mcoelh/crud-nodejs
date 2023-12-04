import { ControllerUsers } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";

const controller = new ControllerUsers();

export async function userRoutes(app, options){

    app.get('/users', controller.listUsers);
    app.post('/users',  controller.createUser);
    app.put('/users/:id', controller.updateUser);
    app.delete('/users/:id', controller.deleteUser);
    app.post('/app/authenticate', controller.authLogin);
}