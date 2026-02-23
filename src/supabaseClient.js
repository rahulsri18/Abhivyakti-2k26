
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mncxfnxytfxayscxldso.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uY3hmbnh5dGZ4YXlzY3hsZHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3OTMyOTgsImV4cCI6MjA4NTM2OTI5OH0.KVJrMBaOCMdt1g2dEGXpVQCKm1MNBafEPypgECyQvNU';

export const supabase = createClient(supabaseUrl, supabaseKey);
