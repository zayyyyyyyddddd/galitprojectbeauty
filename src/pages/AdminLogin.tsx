
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      
      console.log('Attempting admin login with:', values.email);
      
      // Query the admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', values.email)
        .single();
      
      if (error) {
        console.error('Admin query error:', error);
        toast({
          title: "Authentication Error",
          description: "Invalid admin credentials",
          variant: "destructive"
        });
        return;
      }
      
      // For simplicity in demo, we're directly comparing with the test password
      // In a real app, this would use proper password hashing verification
      if (values.password !== 'admin123') {
        toast({
          title: "Authentication Error",
          description: "Invalid password",
          variant: "destructive"
        });
        return;
      }
      
      // Store admin session in localStorage
      localStorage.setItem('admin_session', JSON.stringify({
        id: data.id,
        email: data.email,
        name: data.name,
        isAdmin: true
      }));
      
      toast({
        title: "Login Successful",
        description: "Welcome to Admin Dashboard",
      });
      
      navigate('/admin');
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Authentication Error",
        description: "Failed to log in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">Admin Login</CardTitle>
            <CardDescription>
              Sign in to manage your products and customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your password" 
                            {...field} 
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full mt-4" 
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <div className="text-center mt-2 text-sm text-muted-foreground">
                  <p>Default credentials for testing:</p>
                  <p className="font-mono">Email: admin@ilasbeauty.com</p>
                  <p className="font-mono">Password: admin123</p>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Admin access only. Regular users can <a href="/auth" className="text-skin-gold hover:underline">login here</a>.
            </p>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default AdminLogin;
