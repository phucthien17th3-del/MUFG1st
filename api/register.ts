import { users } from "./db";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { username, password } = req.body;

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: "Tài khoản đã tồn tại" });
  }

  const user = { username, password, balance: 0 };
  users.push(user);

  return res.json({ success: true });
}