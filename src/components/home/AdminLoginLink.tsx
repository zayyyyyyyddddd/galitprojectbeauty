
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const AdminLoginLink: React.FC = () => {
  return (
    <div className="text-center mt-4">
      <Link to="/admin-login">
        <Button variant="outline" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          Admin Login
        </Button>
      </Link>
    </div>
  );
};

export default AdminLoginLink;
