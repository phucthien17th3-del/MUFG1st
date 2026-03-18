import { supabase } from '../src/supabaseClient';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.json({ success: false, message: "Thiếu dữ liệu" });
    }

    // Check if user already exists
    const { data: existing, error: findError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (existing) {
      return res.json({ success: false, message: "Tài khoản đã tồn tại" });
    }

    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password }]);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
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