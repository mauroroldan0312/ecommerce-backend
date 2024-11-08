import express from "express";
import mongoose from "mongoose";
import { ApolloServer } from "apollo-server-express";
import { authRoutes, productRoutes } from "./routes";
import { typeDefs, resolvers } from "./graphql";
import {
  MONGO_DB,
  MONGO_HOST,
  MONGO_OPTIONS,
  MONGO_PASSWORD,
  MONGO_USER,
} from "./constants";
import { authMiddleware } from "./routes/middleware";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB connection
const MONGO_URI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}${MONGO_OPTIONS}${MONGO_DB}`;
mongoose
  .connect(MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// Apollo Server
const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }), // Asegúrate de pasar el objeto req en el contexto
  });
  await server.start();
  server.applyMiddleware({ app: app as any });

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/products", authMiddleware, productRoutes); // Protege todas las rutas de productos

  app.get("/get-state", (req, res) => {
    res.send({ state: "on", message: "Server is running" });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
