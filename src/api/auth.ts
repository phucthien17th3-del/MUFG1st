import { supabase } from '../supabaseClient';

export async function register(username: string, password: string) {
  // Check if user exists
  const { data: existing, error: findError } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle(); // ✅ FIX

  if (findError) {
    return { success: false, message: findError.message };
  }

  if (existing) {
    return { success: false, message: 'Tài khoản đã tồn tại' };
  }

  const { error } = await supabase
    .from('users')
    .insert([{ username, password, role: 'user' }]); // 👈 thêm role luôn

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Đăng ký OK' };
}

export async function login(username: string, password: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('password', password)
    .maybeSingle(); // ✅ FIX

  if (error) {
    console.log("LOGIN ERROR:", error);
    return { success: false, message: error.message };
  }

  if (!user) {
    return { success: false, message: 'Sai tài khoản hoặc mật khẩu' };
  }

  return { success: true, user };
}