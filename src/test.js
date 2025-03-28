import { supabase } from './supabaseClient';

async function testConnection() {
  const { data, error } = await supabase
    .from('salary_submissions')
    .select('count')
    .limit(1);

  if (error) {
    console.error('Connection error:', error);
  } else {
    console.log('Connection successful:', data);
  }
}

testConnection(); 