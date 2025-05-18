
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { PlusCircle, Trash2, Save, X, LogOut } from 'lucide-react';

// Types for products and categories
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [resellers, setResellers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [activeTab, setActiveTab] = useState('resellers');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Check admin status
  useEffect(() => {
    const adminSessionStr = localStorage.getItem('admin_session');
    
    if (adminSessionStr) {
      try {
        const adminSession = JSON.parse(adminSessionStr);
        if (adminSession && adminSession.isAdmin) {
          setAdminUser(adminSession);
        } else {
          navigate('/admin-login');
        }
      } catch (error) {
        console.error('Failed to parse admin session:', error);
        navigate('/admin-login');
      }
    } else {
      navigate('/admin-login');
    }
    
    setLoading(false);
  }, [navigate]);

  // Fetch resellers and customers
  useEffect(() => {
    if (adminUser) {
      // Fetch users from localStorage for now
      // In a real app, these would come from Supabase
      const storedUsersString = localStorage.getItem('ila_beauty_users');
      const storedUsers: Record<string, User> = storedUsersString ? JSON.parse(storedUsersString) : {};
      
      // Filter users by role
      const resellerUsers = Object.values(storedUsers).filter(u => u.role === 'reseller');
      const customerUsers = Object.values(storedUsers).filter(u => u.role === 'customer');
      
      setResellers(resellerUsers);
      setCustomers(customerUsers);
      
      // Fetch products from Supabase
      fetchProducts();
      
      // Fetch categories from Supabase
      fetchCategories();
    }
  }, [adminUser]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive"
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive"
      });
    } finally {
      setLoadingCategories(false);
    }
  };

  // Forms for products and categories
  const productForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category_id: '',
      image_url: '',
    },
  });

  const categoryForm = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // RESELLER FUNCTIONS
  const handleApprovalChange = (resellerId: string, approved: boolean) => {
    // Update user in localStorage
    const storedUsersString = localStorage.getItem('ila_beauty_users');
    const storedUsers: Record<string, User> = storedUsersString ? JSON.parse(storedUsersString) : {};
    
    if (storedUsers[resellerId]) {
      storedUsers[resellerId].approved = approved;
      localStorage.setItem('ila_beauty_users', JSON.stringify(storedUsers));
      
      // Update local state
      setResellers(prev => 
        prev.map(r => r.id === resellerId ? { ...r, approved } : r)
      );
      
      toast({
        title: `Reseller ${approved ? 'Approved' : 'Disapproved'}`,
        description: `The reseller has been ${approved ? 'approved' : 'disapproved'}.`,
      });
    }
  };

  const handleUpdateStage = (resellerId: string, stage: 'brown' | 'silver' | 'gold') => {
    // Update user in localStorage
    const storedUsersString = localStorage.getItem('ila_beauty_users');
    const storedUsers: Record<string, User> = storedUsersString ? JSON.parse(storedUsersString) : {};
    
    if (storedUsers[resellerId]) {
      storedUsers[resellerId].resellerStage = stage;
      localStorage.setItem('ila_beauty_users', JSON.stringify(storedUsers));
      
      // Update local state
      setResellers(prev => 
        prev.map(r => r.id === resellerId ? { ...r, resellerStage: stage } : r)
      );
      
      toast({
        title: "Reseller Stage Updated",
        description: `The reseller has been updated to ${stage} level.`,
      });
    }
  };

  // PRODUCT FUNCTIONS
  const handleAddProduct = async (data: any) => {
    try {
      const newProduct = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category_id: data.category_id || null,
        image_url: data.image_url,
      };

      const { data: insertedProduct, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setProducts(prev => [insertedProduct, ...prev]);
      setIsAddingProduct(false);
      productForm.reset();
      
      toast({
        title: "Product Added",
        description: `${data.name} has been added to the product catalog.`,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProduct = async (data: any) => {
    if (!editingProductId) return;
    
    try {
      const updatedProduct = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        category_id: data.category_id || null,
        image_url: data.image_url,
      };

      const { error } = await supabase
        .from('products')
        .update(updatedProduct)
        .eq('id', editingProductId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setProducts(prev => 
        prev.map(product => 
          product.id === editingProductId ? { ...product, ...updatedProduct } : product
        )
      );
      
      setEditingProductId(null);
      productForm.reset();
      
      toast({
        title: "Product Updated",
        description: `${data.name} has been updated.`,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive"
      });
    }
  };

  const startEditProduct = (product: Product) => {
    productForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category_id: product.category_id,
      image_url: product.image_url
    });
    setEditingProductId(product.id);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      toast({
        title: "Product Deleted",
        description: "The product has been removed from the catalog.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive"
      });
    }
  };

  // CATEGORY FUNCTIONS
  const handleAddCategory = async (data: any) => {
    try {
      const newCategory = {
        name: data.name,
        description: data.description,
      };

      const { data: insertedCategory, error } = await supabase
        .from('categories')
        .insert([newCategory])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setCategories(prev => [...prev, insertedCategory]);
      setIsAddingCategory(false);
      categoryForm.reset();
      
      toast({
        title: "Category Added",
        description: `${data.name} has been added to the categories.`,
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add category.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCategory = async (data: any) => {
    if (!editingCategoryId) return;
    
    try {
      const updatedCategory = {
        name: data.name,
        description: data.description,
      };

      const { error } = await supabase
        .from('categories')
        .update(updatedCategory)
        .eq('id', editingCategoryId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setCategories(prev => 
        prev.map(category => 
          category.id === editingCategoryId ? { ...category, ...updatedCategory } : category
        )
      );
      
      setEditingCategoryId(null);
      categoryForm.reset();
      
      toast({
        title: "Category Updated",
        description: `${data.name} has been updated.`,
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Error",
        description: "Failed to update category.",
        variant: "destructive"
      });
    }
  };

  const startEditCategory = (category: Category) => {
    categoryForm.reset({
      name: category.name,
      description: category.description
    });
    setEditingCategoryId(category.id);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setCategories(prev => prev.filter(category => category.id !== categoryId));
      
      toast({
        title: "Category Deleted",
        description: "The category has been removed.",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    toast({
      title: "Logout Successful",
      description: "You have been logged out of the admin panel.",
    });
    navigate('/admin-login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto py-8 flex-grow flex items-center justify-center">
          <p>Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin-login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-8 flex-grow px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-medium">{adminUser.email}</p>
              <p className="text-sm text-muted-foreground">Admin</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resellers">Resellers</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          {/* RESELLERS TAB */}
          <TabsContent value="resellers">
            <Card>
              <CardHeader>
                <CardTitle>Reseller Management</CardTitle>
                <CardDescription>Approve resellers and manage their tiers</CardDescription>
              </CardHeader>
              <CardContent>
                {resellers.length === 0 ? (
                  <p className="text-muted-foreground">No resellers found.</p>
                ) : (
                  <div className="grid gap-4">
                    {resellers.map((reseller) => (
                      <div key={reseller.id} className="p-4 border rounded-md flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <p className="font-medium">{reseller.email}</p>
                          <p className="text-sm text-muted-foreground">Joined: {new Date(reseller.createdAt).toLocaleDateString()}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={reseller.approved ? "default" : "outline"}>
                              {reseller.approved ? "Approved" : "Pending"}
                            </Badge>
                            {reseller.resellerStage && (
                              <Badge 
                                className={
                                  reseller.resellerStage === 'brown' ? 'bg-skin-brown' : 
                                  reseller.resellerStage === 'silver' ? 'bg-gray-400' : 
                                  'bg-skin-gold'
                                }
                              >
                                {reseller.resellerStage.charAt(0).toUpperCase() + reseller.resellerStage.slice(1)}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {/* Approval buttons */}
                          {!reseller.approved ? (
                            <Button 
                              size="sm" 
                              onClick={() => handleApprovalChange(reseller.id, true)}
                            >
                              Approve
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleApprovalChange(reseller.id, false)}
                            >
                              Revoke Approval
                            </Button>
                          )}
                          
                          {/* Stage buttons */}
                          <div className="flex gap-2 flex-wrap">
                            <Button 
                              size="sm"
                              variant={reseller.resellerStage === 'brown' ? 'default' : 'outline'}
                              className={reseller.resellerStage === 'brown' ? 'bg-skin-brown' : ''}
                              onClick={() => handleUpdateStage(reseller.id, 'brown')}
                            >
                              Brown
                            </Button>
                            <Button 
                              size="sm"
                              variant={reseller.resellerStage === 'silver' ? 'default' : 'outline'}
                              className={reseller.resellerStage === 'silver' ? 'bg-gray-400' : ''}
                              onClick={() => handleUpdateStage(reseller.id, 'silver')}
                            >
                              Silver
                            </Button>
                            <Button 
                              size="sm"
                              variant={reseller.resellerStage === 'gold' ? 'default' : 'outline'}
                              className={reseller.resellerStage === 'gold' ? 'bg-skin-gold' : ''}
                              onClick={() => handleUpdateStage(reseller.id, 'gold')}
                            >
                              Gold
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CUSTOMERS TAB */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>Monitor customer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {customers.length === 0 ? (
                  <p className="text-muted-foreground">No customers found.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell className="font-medium">{customer.email}</TableCell>
                          <TableCell>{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant="default">Active</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PRODUCTS TAB */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Product Management</CardTitle>
                  <CardDescription>Add and edit products</CardDescription>
                </div>
                {!isAddingProduct && !editingProductId && (
                  <Button 
                    onClick={() => setIsAddingProduct(true)}
                    size="sm"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {loadingProducts ? (
                  <div className="text-center py-4">Loading products...</div>
                ) : (
                  <>
                    {isAddingProduct && (
                      <Card className="mb-6 border-dashed">
                        <CardHeader>
                          <CardTitle>Add New Product</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Form {...productForm}>
                            <form onSubmit={productForm.handleSubmit(handleAddProduct)} className="space-y-4">
                              <FormField
                                control={productForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={productForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter product description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={productForm.control}
                                  name="price"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Price</FormLabel>
                                      <FormControl>
                                        <Input type="number" placeholder="0.00" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={productForm.control}
                                  name="category_id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Category</FormLabel>
                                      <FormControl>
                                        <select 
                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                                          {...field}
                                        >
                                          <option value="">Select category</option>
                                          {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                              {category.name}
                                            </option>
                                          ))}
                                        </select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={productForm.control}
                                name="image_url"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter image URL" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end gap-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    setIsAddingProduct(false);
                                    productForm.reset();
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Product
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    )}

                    {editingProductId && (
                      <Card className="mb-6 border-dashed">
                        <CardHeader>
                          <CardTitle>Edit Product</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Form {...productForm}>
                            <form onSubmit={productForm.handleSubmit(handleUpdateProduct)} className="space-y-4">
                              <FormField
                                control={productForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Product Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={productForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter product description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                  control={productForm.control}
                                  name="price"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Price</FormLabel>
                                      <FormControl>
                                        <Input type="number" placeholder="0.00" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={productForm.control}
                                  name="category_id"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Category</FormLabel>
                                      <FormControl>
                                        <select 
                                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                                          {...field}
                                        >
                                          <option value="">Select category</option>
                                          {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                              {category.name}
                                            </option>
                                          ))}
                                        </select>
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={productForm.control}
                                name="image_url"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter image URL" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end gap-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    setEditingProductId(null);
                                    productForm.reset();
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  <Save className="mr-2 h-4 w-4" />
                                  Update Product
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    )}

                    {products.length === 0 && !isAddingProduct ? (
                      <p className="text-muted-foreground">No products found. Add your first product to get started.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>${product.price.toFixed(2)}</TableCell>
                              <TableCell>
                                {categories.find(c => c.id === product.category_id)?.name || 'Uncategorized'}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => startEditProduct(product)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteProduct(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CATEGORIES TAB */}
          <TabsContent value="categories">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Category Management</CardTitle>
                  <CardDescription>Add and edit product categories</CardDescription>
                </div>
                {!isAddingCategory && !editingCategoryId && (
                  <Button 
                    onClick={() => setIsAddingCategory(true)}
                    size="sm"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {loadingCategories ? (
                  <div className="text-center py-4">Loading categories...</div>
                ) : (
                  <>
                    {isAddingCategory && (
                      <Card className="mb-6 border-dashed">
                        <CardHeader>
                          <CardTitle>Add New Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Form {...categoryForm}>
                            <form onSubmit={categoryForm.handleSubmit(handleAddCategory)} className="space-y-4">
                              <FormField
                                control={categoryForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={categoryForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter category description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end gap-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    setIsAddingCategory(false);
                                    categoryForm.reset();
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  <Save className="mr-2 h-4 w-4" />
                                  Save Category
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    )}

                    {editingCategoryId && (
                      <Card className="mb-6 border-dashed">
                        <CardHeader>
                          <CardTitle>Edit Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Form {...categoryForm}>
                            <form onSubmit={categoryForm.handleSubmit(handleUpdateCategory)} className="space-y-4">
                              <FormField
                                control={categoryForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter category name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={categoryForm.control}
                                name="description"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Enter category description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end gap-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    setEditingCategoryId(null);
                                    categoryForm.reset();
                                  }}
                                >
                                  <X className="mr-2 h-4 w-4" />
                                  Cancel
                                </Button>
                                <Button type="submit">
                                  <Save className="mr-2 h-4 w-4" />
                                  Update Category
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    )}

                    {categories.length === 0 && !isAddingCategory ? (
                      <p className="text-muted-foreground">No categories found. Add your first category to get started.</p>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categories.map((category) => (
                            <TableRow key={category.id}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell>{category.description}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => startEditCategory(category)}
                                  >
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleDeleteCategory(category.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
