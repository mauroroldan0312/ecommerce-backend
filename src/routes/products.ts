import { Router } from "express";
import axios from "axios";
import { VTEX_API_SEARCH_PATH, VTEX_API_URL } from "../constants";

const router = Router();

export const getProducts = async (queryParams: any) => {
  try {
    const url = `${VTEX_API_URL}${VTEX_API_SEARCH_PATH}?${queryParams}`;
    console.log("URL", url);
    const response = await axios.get(url);
    return {
      products: response.data,
      status: 200,
    };
  } catch (error) {
    console.error(error);
    return { message: "Error fetching products", status: 500, error };
  }
};

// Ruta para obtener productos desde la API de VTEX
router.get("/", async (req, res) => {
  try {
    const queryParams = req.query;
    const response = await getProducts(queryParams);

    if (response.message) {
      res.status(500).json({ message: response.message });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

export const productRoutes = router;
