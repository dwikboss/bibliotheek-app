import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    import.meta.env.VITE_VUE_APP_SUPABASE_URL as string,
    import.meta.env.VITE_VUE_APP_SUPABASE_KEY as string
)