export default function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.json({ success: false, message: "Thiếu dữ liệu" });
    }

    return res.json({
      success: true,
      message: "Đăng ký OK"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server lỗi"
    });
  }
}