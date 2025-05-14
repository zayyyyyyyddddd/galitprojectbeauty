
import React from 'react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/user';

interface RegisterFormProps {
  setActiveTab: (tab: string) => void;
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["customer", "reseller"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const RegisterForm: React.FC<RegisterFormProps> = ({ setActiveTab }) => {
  const { register, loading } = useAuth();
  const [resellerInfoOpen, setResellerInfoOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "customer",
    },
  });

  const watchRole = form.watch("role");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await register(values.email, values.password, values.role as UserRole);
      if (values.role === 'customer') {
        // Customer is auto-registered and logged in
      } else {
        // Reseller needs approval, redirect to login
        setActiveTab('login');
      }
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
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
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Account Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="customer" id="customer" />
                    <label htmlFor="customer" className="text-sm font-medium leading-none cursor-pointer">
                      Customer
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reseller" id="reseller" />
                    <div className="flex items-center gap-2">
                      <label htmlFor="reseller" className="text-sm font-medium leading-none cursor-pointer">
                        Reseller
                      </label>
                      <Dialog open={resellerInfoOpen} onOpenChange={setResellerInfoOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-6 px-2 text-xs">Info</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Reseller Program Information</DialogTitle>
                            <DialogDescription>
                              Join our tiered reseller program and earn discounts on all purchases.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-3 gap-4">
                              <div className="flex flex-col items-center p-3 border rounded-md">
                                <Badge className="bg-skin-brown text-white mb-2">Brown</Badge>
                                <p className="text-lg font-bold">10%</p>
                                <p className="text-sm text-muted-foreground">Discount</p>
                              </div>
                              <div className="flex flex-col items-center p-3 border rounded-md">
                                <Badge className="bg-gray-400 text-white mb-2">Silver</Badge>
                                <p className="text-lg font-bold">15%</p>
                                <p className="text-sm text-muted-foreground">Discount</p>
                              </div>
                              <div className="flex flex-col items-center p-3 border rounded-md">
                                <Badge className="bg-skin-gold text-white mb-2">Gold</Badge>
                                <p className="text-lg font-bold">20%</p>
                                <p className="text-sm text-muted-foreground">Discount</p>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              All reseller accounts require approval before activation. New resellers start at Brown level.
                            </p>
                          </div>
                          <DialogFooter>
                            <Button onClick={() => setResellerInfoOpen(false)}>Close</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchRole === "reseller" && (
          <div className="p-3 bg-muted/40 rounded-md">
            <p className="text-sm text-muted-foreground">
              Reseller accounts require approval. After registration, you'll start at the Brown level with a 10% discount.
            </p>
          </div>
        )}

        <Button type="submit" className="w-full bg-skin-gold hover:bg-amber-600" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </Button>
      </form>
    </Form>
  );
};
