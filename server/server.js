import { fastify } from "fastify";
import { userRoutes } from "./src/routes/user.routes.js";


const app = fastify();


app.register(userRoutes);


app.listen({
    port:3001,
})