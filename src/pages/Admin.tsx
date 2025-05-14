
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

const Admin = () => {
  const { user } = useAuth();
  const [resellers, setResellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Only admin can access this page - in a real app, would use proper admin role
  // For demo, we're using first created account as admin
  const isAdmin = user?.id === 'admin' || user?.email === 'admin@example.com';

  useEffect(() => {
    if (isAdmin) {
      // Fetch all resellers from localStorage
      const storedUsersString = localStorage.getItem('ila_beauty_users');
      const storedUsers: Record<string, User> = storedUsersString ? JSON.parse(storedUsersString) : {};
      const resellerUsers = Object.values(storedUsers).filter(u => u.role === 'reseller');
      setResellers(resellerUsers);
    }
    setLoading(false);
  }, [isAdmin]);

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

  // Redirect if not admin
  if (!loading && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="container mx-auto py-8 flex-grow px-4">
        <h1 className="text-3xl font-serif mb-8">Admin Dashboard</h1>
        
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
      </main>
      <Footer />
    </div>
  );
};

export default Admin;
