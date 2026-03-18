import { supabase } from '../src/supabaseClient';

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { username, password } = req.body || {};

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .maybeSingle();

    if (!user) {
      return res.json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    return res.json({
      success: true,
      user
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server lỗi"
    });
  }
}