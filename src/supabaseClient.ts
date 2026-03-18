import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 👇 check lỗi rõ ràng hơn
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Thiếu SUPABASE ENV, kiểm tra file .env");
}

console.log("URL:", supabaseUrl);
console.log("KEY:", supabaseKey);

export const supabase = createClient(supabaseUrl, supabaseKey);