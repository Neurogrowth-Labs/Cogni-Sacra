
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jqvszhyikmoqssdhktyu.supabase.co';
const supabaseKey = 'sb_publishable_I_eSyldqlLUCdiuXdMVgPA_cyQMwcle';

export const supabase = createClient(supabaseUrl, supabaseKey);
