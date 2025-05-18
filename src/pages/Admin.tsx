
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '@/types/user';
import { useAuth } from '@/context/AuthContext';
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
import { PlusCircle, Trash2, Save, X } from 'lucide-react';

// Types for products and categories
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const Admin = () => {
  const { user } = useAuth();
  const [resellers, setResellers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resellers');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Only admin can access this page - in a real app, would use proper admin role
  // For demo, we're using first created account as admin
  const isAdmin = user?.id === 'admin' || user?.email === 'admin@example.com';

  // Forms for products and categories
  const productForm = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      imageUrl: '',
    },
  });

  const categoryForm = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (isAdmin) {
      // Fetch all users from localStorage
      const storedUsersString = localStorage.getItem('ila_beauty_users');
      const storedUsers: Record<string, User> = storedUsersString ? JSON.parse(storedUsersString) : {};
      
      // Filter users by role
      const resellerUsers = Object.values(storedUsers).filter(u => u.role === 'reseller');
      const customerUsers = Object.values(storedUsers).filter(u => u.role === 'customer');
      
      setResellers(resellerUsers);
      setCustomers(customerUsers);
      
      // Fetch products and categories from localStorage
      const storedProductsString = localStorage.getItem('ila_beauty_products');
      const storedProducts: Product[] = storedProductsString ? JSON.parse(storedProductsString) : [];
      setProducts(storedProducts);
      
      const storedCategoriesString = localStorage.getItem('ila_beauty_categories');
      const storedCategories: Category[] = storedCategoriesString ? JSON.parse(storedCategoriesString) : [];
      setCategories(storedCategories);
    }
    setLoading(false);
  }, [isAdmin]);

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
  const handleAddProduct = (data: any) => {
    const newProduct: Product = {
      id: `product_${Date.now()}`,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      category: data.category,
      imageUrl: data.imageUrl,
      createdAt: new Date().toISOString()
    };

    const updatedProducts = [...products, newProduct];
    localStorage.setItem('ila_beauty_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    
    setIsAddingProduct(false);
    productForm.reset();
    
    toast({
      title: "Product Added",
      description: `${data.name} has been added to the product catalog.`,
    });
  };

  const handleUpdateProduct = (data: any) => {
    if (!editingProductId) return;
    
    const updatedProducts = products.map(product => 
      product.id === editingProductId 
        ? { 
            ...product, 
            name: data.name, 
            description: data.description, 
            price: parseFloat(data.price), 
            category: data.category, 
            imageUrl: data.imageUrl 
          } 
        : product
    );
    
    localStorage.setItem('ila_beauty_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    
    setEditingProductId(null);
    productForm.reset();
    
    toast({
      title: "Product Updated",
      description: `${data.name} has been updated.`,
    });
  };

  const startEditProduct = (product: Product) => {
    productForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl
    });
    setEditingProductId(product.id);
  };

  const handleDeleteProduct = (productId: string) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    localStorage.setItem('ila_beauty_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
    
    toast({
      title: "Product Deleted",
      description: "The product has been removed from the catalog.",
    });
  };

  // CATEGORY FUNCTIONS
  const handleAddCategory = (data: any) => {
    const newCategory: Category = {
      id: `category_${Date.now()}`,
      name: data.name,
      description: data.description,
      createdAt: new Date().toISOString()
    };

    const updatedCategories = [...categories, newCategory];
    localStorage.setItem('ila_beauty_categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
    
    setIsAddingCategory(false);
    categoryForm.reset();
    
    toast({
      title: "Category Added",
      description: `${data.name} has been added to the categories.`,
    });
  };

  const handleUpdateCategory = (data: any) => {
    if (!editingCategoryId) return;
    
    const updatedCategories = categories.map(category => 
      category.id === editingCategoryId 
        ? { 
            ...category, 
            name: data.name, 
            description: data.description
          } 
        : category
    );
    
    localStorage.setItem('ila_beauty_categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
    
    setEditingCategoryId(null);
    categoryForm.reset();
    
    toast({
      title: "Category Updated",
      description: `${data.name} has been updated.`,
    });
  };

  const startEditCategory = (category: Category) => {
    categoryForm.reset({
      name: category.name,
      description: category.description
    });
    setEditingCategoryId(category.id);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(category => category.id !== categoryId);
    localStorage.setItem('ila_beauty_categories', JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
    
    toast({
      title: "Category Deleted",
      description: "The category has been removed.",
    });
  };

  // Redirect if not admin
  if (!loading && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-8 flex-grow px-4">
        <h1 className="text-3xl font-serif mb-8">Admin Dashboard</h1>
        
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
                              name="category"
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
                                        <option key={category.id} value={category.name}>
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
                            name="imageUrl"
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
                              name="category"
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
                                        <option key={category.id} value={category.name}>
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
                            name="imageUrl"
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
                          <TableCell>{product.category}</TableCell>
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
