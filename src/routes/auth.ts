import { Router } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import { User } from "../shared";
import { authMiddleware } from "./middleware";

const router = Router();

export const register = async (
  username: string,
  password: string,
  name: string,
  lastName: string,
  email: string,
  userType: string
) => {
  try {
    const newUser = new User({
      username,
      password,
      name,
      lastName,
      email,
      userType,
    });
    await newUser.save();
    return { user: newUser, status: 201 };
  } catch (error) {
    return { message: "Error registering user", status: 500 };
  }
};

// Register route
router.post("/register", async (req, res) => {
  const { username, password, name, lastName, email, userType } = req.body;
  try {
    const response = await register(
      username,
      password,
      name,
      lastName,
      email,
      userType
    );

    if (response.status === 500) {
      res.status(500).json({ message: response.message });
    }

    res.status(201).json(response.user);
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

export const login = async (username: string, password: string) => {
  const user = await User.findOne({ username });
  if (!user) {
    return { message: "Invalid credentials", status: 401 };
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return { message: "Invalid credentials", status: 401 };
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

  return { token, user, status: 200 };
};

// Login route
router.post("/login", async (req: any, res: any) => {
  const { username, password } = req.body;
  try {
    const response = await login(username, password);

    if (response.status === 401) {
      return res.status(401).json({ message: response.message });
    }

    res.status(200).json({ token: response.token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

export const updateUser = async (
  id: string,
  username: string,
  name: string,
  lastName: string,
  email: string,
  userType: string
) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, name, lastName, email, userType },
      { new: true, runValidators: true }
    );
    return { updatedUser, status: 200 };
  } catch (error) {
    return { message: "Error updating user", status: 500 };
  }
};

// Update user route
router.put("/update/:id", async (req: any, res: any) => {
  const { id } = req.params;
  const { username, name, lastName, email, userType } = req.body;
  try {
    const response = await updateUser(
      id,
      username,
      name,
      lastName,
      email,
      userType
    );

    if (response.status === 500) {
      res.status(500).json({ message: response.message });
    }

    res.status(200).json(response.updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
});

// Route to get user data using token
router.get("/me", authMiddleware, async (req: any, res: any) => {
  res.status(200).json(req.user);
});

export const authRoutes = router;
