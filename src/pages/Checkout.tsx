
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  CreditCard, 
  Package,
  User, 
  Mail, 
  Phone, 
  Home, 
  Truck, 
  CircleCheck,
  ShoppingCart,
  Calendar,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Mock cart data
const mockCartItems = [
  {
    id: "P001",
    name: "Classic White Shirt",
    price: 35.99,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop",
  },
  {
    id: "P003",
    name: "Designer Handbag",
    price: 78.25,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop",
  }
];

const Checkout = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<'cart' | 'shipping' | 'payment' | 'review'>('cart');
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [isLoading, setIsLoading] = useState(false);
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = 4.99;
  const taxRate = 0.0825; // 8.25%
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingCost + taxAmount;
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };
  
  const handleShippingSubmit = () => {
    // Very basic validation
    if (!shippingAddress.firstName || !shippingAddress.email || !shippingAddress.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setActiveStep('payment');
  };
  
  const handlePaymentSubmit = () => {
    setActiveStep('review');
  };
  
  const handlePlaceOrder = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Order placed successfully!", {
        description: `Order #AC${Math.floor(Math.random() * 10000)}`,
      });
      
      // Redirect to confirmation (would be a separate page in a real app)
      navigate("/marketplace");
    }, 1500);
  };
  
  const nextStep = () => {
    if (activeStep === 'cart') setActiveStep('shipping');
    else if (activeStep === 'shipping') handleShippingSubmit();
    else if (activeStep === 'payment') handlePaymentSubmit();
    else if (activeStep === 'review') handlePlaceOrder();
  };
  
  const prevStep = () => {
    if (activeStep === 'shipping') setActiveStep('cart');
    else if (activeStep === 'payment') setActiveStep('shipping');
    else if (activeStep === 'review') setActiveStep('payment');
  };
  
  return (
    <div className="animate-enter space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase securely</p>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={() => navigate("/marketplace")}
        >
          <ChevronLeft className="mr-1" />
          Continue Shopping
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Your Checkout</CardTitle>
                <div className="flex">
                  {['cart', 'shipping', 'payment', 'review'].map((step, index) => (
                    <div key={step} className="flex items-center">
                      <div 
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${activeStep === step ? 'bg-soft-pink text-white' : index < ['cart', 'shipping', 'payment', 'review'].indexOf(activeStep) ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {index < ['cart', 'shipping', 'payment', 'review'].indexOf(activeStep) ? (
                          <CircleCheck className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      {index < 3 && (
                        <div 
                          className={`h-1 w-6 ${index < ['cart', 'shipping', 'payment'].indexOf(activeStep) ? 'bg-green-500' : 'bg-gray-200'}`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-6">
              <AnimatedTabContent activeStep={activeStep} />
            </CardContent>
          </Card>
          
          <div className="flex justify-between pt-4">
            {activeStep !== 'cart' && (
              <Button 
                variant="outline" 
                onClick={prevStep}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            
            <Button 
              className={activeStep === 'cart' ? 'w-full' : 'ml-auto'}
              onClick={nextStep}
              disabled={cartItems.length === 0}
              {...(activeStep === 'review' && { disabled: isLoading })}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                <>
                  {activeStep === 'cart' && 'Continue to Shipping'}
                  {activeStep === 'shipping' && 'Continue to Payment'}
                  {activeStep === 'payment' && 'Review Order'}
                  {activeStep === 'review' && 'Place Order'}
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Order Summary
              </CardTitle>
              <CardDescription>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pb-6">
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 rounded bg-gray-100 shrink-0 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${taxAmount.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col items-start space-y-2 pt-0">
              <div className="flex items-center text-sm text-muted-foreground">
                <Gift className="h-4 w-4 mr-2" />
                Have a promo code?
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Estimated delivery: 3-5 business days
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface AnimatedTabContentProps {
  activeStep: 'cart' | 'shipping' | 'payment' | 'review';
}

const AnimatedTabContent = ({ activeStep }: AnimatedTabContentProps) => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(mockCartItems);
  
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const removeItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };
  
  return (
    <motion.div
      key={activeStep}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {activeStep === 'cart' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Your Cart</h3>
          
          {cartItems.length > 0 ? (
            <>
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 pb-4 border-b">
                  <div 
                    className="h-24 w-24 rounded overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h4 
                      className="font-medium hover:text-soft-pink cursor-pointer"
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      {item.name}
                    </h4>
                    <p className="text-muted-foreground text-sm mt-1">${item.price.toFixed(2)}</p>
                    
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground text-sm h-8"
                        onClick={() => removeItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Your cart is empty</h3>
              <p className="text-muted-foreground mt-1">Add some items to your cart to continue</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/marketplace')}
              >
                Browse Products
              </Button>
            </div>
          )}
        </div>
      )}
      
      {activeStep === 'shipping' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Shipping Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" placeholder="John" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" placeholder="Doe" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="john@example.com" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" placeholder="(123) 456-7890" required />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Input id="address" placeholder="123 Main St" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" placeholder="New York" required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input id="state" placeholder="NY" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code *</Label>
                <Input id="zipCode" placeholder="10001" required />
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Shipping Method</h4>
            
            <RadioGroup defaultValue="standard" className="space-y-3">
              <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="font-normal cursor-pointer">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Standard Shipping</span>
                      <span className="text-xs text-muted-foreground">3-5 business days</span>
                    </div>
                  </Label>
                </div>
                <span className="font-medium">$4.99</span>
              </div>
              
              <div className="flex items-center justify-between space-x-2 rounded-md border p-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="font-normal cursor-pointer">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Express Shipping</span>
                      <span className="text-xs text-muted-foreground">1-2 business days</span>
                    </div>
                  </Label>
                </div>
                <span className="font-medium">$9.99</span>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}
      
      {activeStep === 'payment' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Payment Method</h3>
          
          <Tabs defaultValue="credit-card" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="credit-card">
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger value="paypal">PayPal</TabsTrigger>
              <TabsTrigger value="apple-pay">Apple Pay</TabsTrigger>
            </TabsList>
            
            <TabsContent value="credit-card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card *</Label>
                <Input id="cardName" placeholder="John Doe" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input id="cardNumber" placeholder="1234 1234 1234 1234" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input id="expiryDate" placeholder="MM/YY" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input id="cvv" placeholder="123" required />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="saveCard" className="rounded border-gray-300" />
                <Label htmlFor="saveCard" className="text-sm font-normal">Save card for future purchases</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="paypal" className="h-[220px] flex items-center justify-center">
              <div className="text-center">
                <div className="py-4">
                  <p>You'll be redirected to PayPal to complete your purchase.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="apple-pay" className="h-[220px] flex items-center justify-center">
              <div className="text-center">
                <div className="py-4">
                  <p>Complete your purchase with Apple Pay.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Billing Address</h4>
            
            <div className="flex items-center space-x-2 mb-4">
              <input type="checkbox" id="sameAsShipping" className="rounded border-gray-300" defaultChecked />
              <Label htmlFor="sameAsShipping" className="text-sm font-normal">Same as shipping address</Label>
            </div>
          </div>
        </div>
      )}
      
      {activeStep === 'review' && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Review Your Order</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Shipping Address</h4>
                <Button variant="ghost" size="sm" className="h-8 text-xs">Edit</Button>
              </div>
              
              <div className="text-sm">
                <p>John Doe</p>
                <p>123 Main St</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
                <p className="mt-2">john@example.com</p>
                <p>(123) 456-7890</p>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Payment Method</h4>
                <Button variant="ghost" size="sm" className="h-8 text-xs">Edit</Button>
              </div>
              
              <div className="text-sm">
                <p>Credit Card ending in 1234</p>
                <p>Expires 12/25</p>
                <p className="mt-2">Billing address same as shipping</p>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Order Items</h4>
              <Button variant="ghost" size="sm" className="h-8 text-xs">Edit</Button>
            </div>
            
            <div className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="h-16 w-16 rounded bg-gray-100 shrink-0 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h4 className="font-medium mb-3">Shipping Method</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Standard Shipping (3-5 business days)</span>
              </div>
              <span>$4.99</span>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Order Terms</h4>
            
            <div className="flex items-center space-x-2 mb-2">
              <input type="checkbox" id="terms" className="rounded border-gray-300" required />
              <Label htmlFor="terms" className="text-sm font-normal">
                I agree to the <a href="#" className="text-soft-pink hover:underline">Terms and Conditions</a> and <a href="#" className="text-soft-pink hover:underline">Privacy Policy</a>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="newsletter" className="rounded border-gray-300" />
              <Label htmlFor="newsletter" className="text-sm font-normal">Subscribe to our newsletter</Label>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Checkout;
