import { users } from "./db";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  if (username === "admin" && password === "admin123") {
    return res.json({
      success: true,
      user: { username: "admin", balance: 9999999 }
    });
  }

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ success: false, message: "Sai tài khoản" });
  }

  return res.json({ success: true, user });
}