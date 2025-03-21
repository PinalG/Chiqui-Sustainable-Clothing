
import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, User, Building2, Truck, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Password validation with specific requirements
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .refine((password) => /[A-Z]/.test(password), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((password) => /[a-z]/.test(password), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((password) => /[0-9]/.test(password), {
    message: "Password must contain at least one number",
  })
  .refine((password) => /[^A-Za-z0-9]/.test(password), {
    message: "Password must contain at least one special character",
  });

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: passwordSchema,
  confirmPassword: z.string(),
  role: z.enum(["consumer", "retailer", "logistics"]),
  organizationName: z.string().optional(),
  taxId: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the Terms and Conditions",
  }),
  privacyAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the Privacy Policy",
  }),
  marketingConsent: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine(
  (data) => {
    if (data.role === "retailer" || data.role === "logistics") {
      return !!data.organizationName;
    }
    return true;
  },
  {
    message: "Organization name is required for retailers and logistics partners",
    path: ["organizationName"],
  }
).refine(
  (data) => {
    if (data.role === "retailer") {
      return !!data.taxId;
    }
    return true;
  },
  {
    message: "Tax ID is required for retailers",
    path: ["taxId"],
  }
);

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("consumer");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "consumer",
      organizationName: "",
      taxId: "",
      termsAccepted: false,
      privacyAccepted: false,
      marketingConsent: false,
    },
  });

  const watchRole = form.watch("role") as UserRole;
  const watchPassword = form.watch("password");

  // Update selectedRole when form role changes
  if (watchRole !== selectedRole) {
    setSelectedRole(watchRole);
  }

  // Evaluate password strength
  const evaluatePasswordStrength = (password: string) => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Variety check
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= 8) score += 1;
    
    return Math.min(Math.floor((score / 7) * 100), 100);
  };

  // Update password strength when password changes
  if (watchPassword) {
    const strength = evaluatePasswordStrength(watchPassword);
    if (strength !== passwordStrength) {
      setPasswordStrength(strength);
    }
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength >= 80) return "Strong";
    if (passwordStrength >= 50) return "Moderate";
    return "Weak";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength >= 80) return "text-green-600";
    if (passwordStrength >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      const additionalData: Record<string, any> = {
        consentSettings: {
          marketing: !!data.marketingConsent,
          cookies: true,
          dataSharing: false,
          lastUpdated: Date.now()
        }
      };
      
      if (data.role === "retailer" || data.role === "logistics") {
        additionalData.organizationName = data.organizationName;
      }
      
      if (data.role === "retailer") {
        additionalData.taxId = data.taxId;
      }
      
      await signUp(data.email, data.password, data.name, data.role as UserRole, additionalData);
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
      await signInWithGoogle(selectedRole);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const passwordCriteria = [
    { check: /^.{8,}$/, label: "At least 8 characters" },
    { check: /[A-Z]/, label: "At least one uppercase letter" },
    { check: /[a-z]/, label: "At least one lowercase letter" },
    { check: /[0-9]/, label: "At least one number" },
    { check: /[^A-Za-z0-9]/, label: "At least one special character" },
  ];

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
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Join the future of sustainable fashion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Account Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted transition-colors">
                            <RadioGroupItem value="consumer" id="consumer" />
                            <label htmlFor="consumer" className="flex items-center cursor-pointer w-full">
                              <User className="mr-2 h-4 w-4 text-soft-pink" />
                              <div className="flex flex-col">
                                <span className="font-medium">Consumer</span>
                                <span className="text-xs text-muted-foreground">Donate and shop sustainable fashion</span>
                              </div>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted transition-colors">
                            <RadioGroupItem value="retailer" id="retailer" />
                            <label htmlFor="retailer" className="flex items-center cursor-pointer w-full">
                              <Building2 className="mr-2 h-4 w-4 text-soft-pink" />
                              <div className="flex flex-col">
                                <span className="font-medium">Retailer</span>
                                <span className="text-xs text-muted-foreground">Register inventory as paper donations</span>
                              </div>
                            </label>
                          </div>
                          <div className="flex items-center space-x-2 rounded-md border p-3 cursor-pointer hover:bg-muted transition-colors">
                            <RadioGroupItem value="logistics" id="logistics" />
                            <label htmlFor="logistics" className="flex items-center cursor-pointer w-full">
                              <Truck className="mr-2 h-4 w-4 text-soft-pink" />
                              <div className="flex flex-col">
                                <span className="font-medium">Logistics Partner</span>
                                <span className="text-xs text-muted-foreground">Facilitate shipping and delivery</span>
                              </div>
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} autoComplete="name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your@email.com" {...field} autoComplete="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(watchRole === "retailer" || watchRole === "logistics") && (
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Company Inc." {...field} autoComplete="organization" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {watchRole === "retailer" && (
                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input placeholder="TX-12345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="********" 
                          {...field} 
                          autoComplete="new-password" 
                        />
                      </FormControl>
                      
                      {/* Password strength meter */}
                      {field.value && (
                        <>
                          <div className="flex justify-between items-center mt-1 mb-1">
                            <span className="text-xs">Password Strength:</span>
                            <span className={`text-xs font-medium ${getPasswordStrengthColor()}`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                passwordStrength >= 80 ? 'bg-green-500' : 
                                passwordStrength >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${passwordStrength}%` }}
                            />
                          </div>
                          
                          {/* Password criteria checklist */}
                          <div className="space-y-1 mt-2">
                            {passwordCriteria.map((criteria, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                {criteria.check.test(field.value) ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                  <XCircle className="h-3.5 w-3.5 text-red-500" />
                                )}
                                <span className={`text-xs ${
                                  criteria.check.test(field.value) ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {criteria.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                      
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
                        <Input 
                          type="password" 
                          placeholder="********" 
                          {...field} 
                          autoComplete="new-password" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Consent checkboxes */}
                <div className="space-y-4 pt-2">
                  <Alert className="bg-muted/50 border-none">
                    <AlertCircle className="h-4 w-4 text-soft-pink" />
                    <AlertDescription className="text-xs">
                      Please review our terms and privacy policy before creating your account.
                    </AlertDescription>
                  </Alert>
                
                  <FormField
                    control={form.control}
                    name="termsAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I agree to the <a href="/legal/terms-of-service" className="text-soft-pink hover:underline">Terms of Service</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="privacyAccepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I agree to the <a href="/legal/privacy-policy" className="text-soft-pink hover:underline">Privacy Policy</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="marketingConsent"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm">
                            I agree to receive marketing emails and updates
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create Account
                </Button>
              </form>
            </Form>
            
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
          <CardFooter>
            <div className="text-center text-sm w-full">
              Already have an account?{" "}
              <Link to="/auth/login" className="text-soft-pink hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
