import { supabase } from '../supabase';

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    console.log('🔐 Attempting sign in for:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      console.error('❌ Sign in error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Sign in successful for:', email);
    return { user: data.user, session: data.session };
    
  } catch (error) {
    console.error('❌ Error in signIn:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    console.log('🚪 Signing out...');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Sign out error:', error);
      throw new Error(error.message);
    }

    console.log('✅ Sign out successful');
    return true;
    
  } catch (error) {
    console.error('❌ Error in signOut:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Get user error:', error);
      return null;
    }

    return user;
    
  } catch (error) {
    console.error('❌ Error in getCurrentUser:', error);
    return null;
  }
};

// Get current session
export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Get session error:', error);
      return null;
    }

    return session;
    
  } catch (error) {
    console.error('❌ Error in getCurrentSession:', error);
    return null;
  }
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 Auth state change:', event, session?.user?.email);
    callback(event, session);
  });
};

// Check if user is authenticated
export const isAuthenticated = async () => {
  const user = await getCurrentUser();
  return user !== null;
};
