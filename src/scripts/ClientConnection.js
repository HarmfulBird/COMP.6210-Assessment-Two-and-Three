import { createClient } from "@supabase/supabase-js";


const URI = 'https://tbzcwamaopbgxqewkgon.supabase.co'
const PUBLICKEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRiemN3YW1hb3BiZ3hxZXdrZ29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU5MTc0NDksImV4cCI6MjA0MTQ5MzQ0OX0.xJxLVqpqeEPnYhyBPFTcwUr1kU41DrLt52BFiAWb4a8'
let connection;

try{
  connection = createClient(URI, PUBLICKEY);
  console.log("Database Client Connected Successfully");
}
catch (error) {
  console.log("Database Client Could Not Connect:\n" + error.message);
}


export const client = connection;