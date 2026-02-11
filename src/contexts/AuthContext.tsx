import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  couple_id: string | null;
  invite_code: string | null;
  gender: string | null;
  created_at: string;
  updated_at: string;
}

interface CoupleInfo {
  couple_id: string;
  partner_name: string;
  joined_at: string;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  coupleId: string | null;
  couples: CoupleInfo[];
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  linkPartner: (inviteCode: string) => Promise<{ success: boolean; error?: string; partnerName?: string }>;
  switchCouple: (coupleId: string) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [couples, setCouples] = useState<CoupleInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    if (!error && data) {
      setProfile(data as Profile);
    }
  };

  const fetchCouples = async () => {
    const { data, error } = await supabase.rpc('get_user_couples');
    if (!error && data) {
      setCouples((data as any) || []);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await Promise.all([fetchProfile(user.id), fetchCouples()]);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
            fetchCouples();
          }, 0);
        } else {
          setProfile(null);
          setCouples([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        fetchCouples();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName || email },
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setCouples([]);
  };

  const linkPartner = async (inviteCode: string) => {
    const { data, error } = await supabase.rpc('link_partner', {
      partner_invite_code: inviteCode,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    const result = data as any;
    if (result?.success) {
      await refreshProfile();
      return { success: true, partnerName: result.partner_name };
    }
    return { success: false, error: result?.error || 'Unknown error' };
  };

  const switchCouple = async (coupleId: string) => {
    const { data, error } = await supabase.rpc('switch_active_couple', {
      target_couple_id: coupleId,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    const result = data as any;
    if (result?.success) {
      await refreshProfile();
      return { success: true };
    }
    return { success: false, error: result?.error || 'Unknown error' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        coupleId: profile?.couple_id ?? null,
        couples,
        signUp,
        signIn,
        signOut,
        linkPartner,
        switchCouple,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
