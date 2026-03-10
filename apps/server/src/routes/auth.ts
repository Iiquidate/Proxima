//wiring instructions from chatgpt
import { Router } from "express";
import { supabaseAuthClient, supabaseAdmin } from "../lib/supabase";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ error: "Email, password, and username are required" });
    }

    const { data, error } = await supabaseAuthClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const user = data.user;

    if (!user) {
      return res.status(400).json({ error: "User was not created" });
    }

    const { error: insertError } = await supabaseAdmin.from("users").insert({
      id: user.id,
      username,
    });

    if (insertError) {
      return res.status(400).json({ error: insertError.message });
    }

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        username,
      },
      session: data.session,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const { data, error } = await supabaseAuthClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    const user = data.user;
    const session = data.session;

    if (!user || !session) {
      return res.status(401).json({ error: "Invalid login" });
    }

    const { data: existingUser, error: selectError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (selectError) {
      return res.status(400).json({ error: selectError.message });
    }

    return res.status(200).json({
      message: "Login successful",
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      user: existingUser ?? {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;