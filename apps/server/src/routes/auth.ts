//wiring instructions from chatgpt
import { Router } from "express";
import { supabaseAuthClient } from "../lib/supabase";
import pool from "../db/connection";

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

    try {                                                                                                                                                                                 
      await pool.query(                                                                                                                                                                 
      `INSERT INTO users (id, username) VALUES ($1, $2)`,                                                                                                                               
        [user.id, username]                                
      );                                                                                                                                                                                  
    } catch (insertErr) {                                                                                                                                                               
      try {              
        await supabaseAuthClient.auth.admin.deleteUser(user.id);
      } catch (cleanupErr) {                                                                                                                                                              
        console.error("Failed to clean up Supabase auth user:", cleanupErr);
      }                                                                                                                                                                                   
      return res.status(400).json({ error: "Failed to insert user into database" });                                                                                                      
    }             

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        email: user.email,
        username,
        role: 'member' // default to 'member' role for new users, don't know if admin will be directly injected into database
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

    let existingUser = null;                                                                                                                                                          
      try {                                                                                                                                                                             
          const { rows } = await pool.query(                                                                                                                                            
              `SELECT * FROM users WHERE id = $1`,                                                                                                                                      
              [user.id]                                                                                                                                                                 
          );
          existingUser = rows[0] || null;                                                                                                                                               
      } catch (selectErr) {                                                                                                                                                           
          return res.status(400).json({ error: "Failed to query user from database" });
        }      

    return res.status(200).json({
      message: "Login successful",
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      user: existingUser ?? {
        id: user.id,
        email: user.email,
        role: existingUser?.role || 'member', // default to 'member' if role is not set, this was researched through Google Gemini
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
