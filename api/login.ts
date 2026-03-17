export default function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { username, password } = req.body || {};

    if (username === "admin" && password === "admin123") {
      return res.json({
        success: true,
        user: { username: "admin", balance: 999999 }
      });
    }

    return res.json({
      success: false,
      message: "Sai tài khoản"
    });

  } catch (err) {
    return res.status(500).json({
      success: false
    });
  }
}