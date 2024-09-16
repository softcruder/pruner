import React from 'react';
import { Bell, ChevronDown, Home, LogIn, LogOut } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import GradientText from '@/components/shared/gradient-text';

interface HeaderProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    theme?: string;
    user?: { first_name: string };
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, setIsAuthenticated, theme, user }) => {
    const { first_name } = user || {};
    return (
        <header className="flex justify-between items-center p-4">
        <GradientText as="h1" className="text-4xl font-bold cursor-pointer">Prunely</GradientText>
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <CustomButton variant="outline" className="flex items-center gap-2 rounded-full p-5 h-14">
                    <span className="flex flex-col text-xs items-start">Welcome, 
                        <span className="text-base "> {`${first_name || 'Nasirullah'}`}</span>
                    </span> 
                    <ChevronDown className="h-4 w-4" />
                </CustomButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className={`${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                <DropdownMenuItem onClick={() => setIsAuthenticated(false)} className={`${theme === 'dark' ? 'text-white' : 'text-black'} flex items-center gap-2`}>
                    <CustomButton variant="ghost" className="flex items-center gap-3">
                        <Home className="h-5 w-5" />
                        <Link href={`/dashboard`}>Dashboard</Link>
                    </CustomButton>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsAuthenticated(false)} className="text-red-500 flex items-center gap-2">
                    <CustomButton variant="ghost" className="flex items-center gap-3">
                        <LogOut className="h-5 w-5"/> Logout
                    </CustomButton>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <CustomButton variant="default" size="icon">
              <Bell className="h-5 w-5" />
            </CustomButton>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <CustomButton variant="dark" className="flex items-center" size="lg">
              Login <LogIn className="ml-2 h-4 w-4" />
            </CustomButton>
            <CustomButton size="lg">Register Now</CustomButton>
          </div>
        )}
      </header>
    );
};

// const styles = {
//     header: {
//         padding: '10px 20px',
//         backgroundColor: '#333',
//         color: '#fff',
//     },
//     nav: {
//         display: 'flex',
//         justifyContent: 'space-around',
//     },
//     link: {
//         color: '#fff',
//         textDecoration: 'none',
//     },
// };

export default Header;