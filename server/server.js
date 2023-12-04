import { fastify } from "fastify";
import { userRoutes } from "./src/routes/user.routes.js";
import  pkg from "jsonwebtoken";


const { Jwt } = pkg;
const app = fastify();
app.register(userRoutes);



app.listen({
    port:3001,
})