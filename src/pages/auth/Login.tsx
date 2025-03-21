
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const fillMockUser = (type: string) => {
    switch (type) {
      case 'consumer':
        form.setValue('email', 'consumer@example.com');
        form.setValue('password', 'password123');
        break;
      case 'retailer':
        form.setValue('email', 'retailer@example.com');
        form.setValue('password', 'password123');
        break;
      case 'logistics':
        form.setValue('email', 'logistics@example.com');
        form.setValue('password', 'password123');
        break;
      case 'admin':
        form.setValue('email', 'admin@example.com');
        form.setValue('password', 'password123');
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-soft-pink flex items-center justify-center mx-auto mb-4">
            <span className="font-bold text-white text-xl">CH</span>
          </div>
          <h1 className="text-2xl font-bold">Chiqui</h1>
          <p className="text-muted-foreground">Transforming Sustainable Retail</p>
        </div>
        
        <Card className="w-full backdrop-blur-sm bg-white/80 border-none shadow-lg animate-fade-up">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} />
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
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign In
                </Button>
              </form>
            </Form>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="demo-accounts">
                    <AccordionTrigger className="text-sm text-muted-foreground py-2">
                      <span className="flex items-center">
                        <Info className="h-4 w-4 mr-2" />
                        Demo Accounts
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 p-2 bg-muted/50 rounded-md text-sm">
                        <div className="flex justify-between">
                          <span>Consumer:</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs" 
                            onClick={() => fillMockUser('consumer')}
                          >
                            Use
                          </Button>
                        </div>
                        <div className="flex justify-between">
                          <span>Retailer:</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs" 
                            onClick={() => fillMockUser('retailer')}
                          >
                            Use
                          </Button>
                        </div>
                        <div className="flex justify-between">
                          <span>Logistics:</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs" 
                            onClick={() => fillMockUser('logistics')}
                          >
                            Use
                          </Button>
                        </div>
                        <div className="flex justify-between">
                          <span>Admin:</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs" 
                            onClick={() => fillMockUser('admin')}
                          >
                            Use
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Password for all accounts: password123
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            )}
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full"
            >
              {googleLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <Link to="/auth/forgot-password" className="underline underline-offset-4 hover:text-primary">
                Forgot password?
              </Link>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-soft-pink hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
