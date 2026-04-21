import { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { AuthUser } from "@proxima/common";
import pool from "../db/connection";

export interface AuthenticatedRequest extends Request {
  AuthUser?: AuthUser & { role: string }; // Get the role from the database and include it in the AuthUser type
}

// validates bearer token via supabase and attaches user info to the request
export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing auth token" });
    }

    const token = authHeader.split(" ")[1];

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Call SQL in order to check user role
    const {rows} = await pool.query(
      `SELECT role FROM users WHERE id = $1`,
      [user.id]
    );

    const userRole = rows[0]?.role || 'member'; // default to 'member' if role is not set

    req.AuthUser = {
      id: user.id,
      email: user.email,
      role: userRole
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
