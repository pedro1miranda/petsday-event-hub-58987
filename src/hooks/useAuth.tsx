import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

export function useAuth(requireStaff = false) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Check staff role after state update
          setTimeout(() => {
            checkStaffRole(session.user.id);
          }, 0);
        } else {
          setIsStaff(false);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        checkStaffRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkStaffRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("status")
        .eq("auth_uid", userId)
        .eq("status", true)
        .maybeSingle();

      if (error) {
        console.error("Error checking staff role:", error);
        setIsStaff(false);
      } else {
        setIsStaff(!!data);
      }
    } catch (error) {
      console.error("Error checking staff role:", error);
      setIsStaff(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && requireStaff) {
      if (!user) {
        toast.error("Você precisa fazer login para acessar esta página");
        navigate("/auth");
      } else if (!isStaff) {
        toast.error("Acesso negado. Apenas funcionários podem acessar.");
        navigate("/");
      }
    }
  }, [loading, user, isStaff, requireStaff, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsStaff(false);
    navigate("/");
    toast.success("Logout realizado com sucesso");
  };

  return { user, session, isStaff, loading, signOut };
}
