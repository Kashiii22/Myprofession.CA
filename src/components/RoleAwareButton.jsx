'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { 
  FaUserShield, 
  FaHome,
  FaDashboardAlt
} from 'react-icons/fa';
import { isSuperAdmin } from '@/lib/authUtils';

export default function SuperAdminRoleAwareButton({ isMobile = false }) {
  const { isLoggedIn, user } = useSelector(state => state.auth);
  
  if (!isLoggedIn || !user) return null;

  const baseClass = isMobile
    ? "block text-center w-full px-4 py-2 rounded-lg transition"
    : "text-md font-medium px-4 py-2 rounded-lg transition";

  // Check if user is SuperAdmin and route accordingly
  if (isSuperAdmin(user)) {
    return (
      <Link
        href="/superadmin"
        onClick={isMobile ? handleLinkClick : undefined}
        className={`${baseClass} bg-red-600 hover:bg-red-700 text-white font-semibold`}
      >
        SuperAdmin Panel
      </Link>
    );
  }

  switch (user.role) {
      case 'ADMIN':
        return (
          <Link
            href="/admin/dashboard"
            onClick={isMobile ? handleLinkClick : undefined}
            className={`${baseClass} bg-red-600 hover:bg-red-700 text-white`}
          >
            Admin Panel
          </Link>
        );
      case 'MENTOR':
        return (
          <Link
            href="/mentor/dashboard"
            onClick={isMobile ? handleLinkClick : undefined}
            className={`${baseClass} bg-green-600 hover:bg-green-700 text-white`}
          >
            Mentor Dashboard
          </Link>
        );
      default:
        return (
          <button
            onClick={isMobile ? () => {
              handleExpertRegistrationClick();
              setMobileMenuOpen(false);
            } : handleExpertRegistrationClick}
            className={`${baseClass} text-transparent border border-blue-500 text-blue-400 hover:bg-blue-900/50`}
          >
            Become an Expert
          </button>
        );
    }
  };

  const handleLogout = () => {
    if (isSuperAdmin(user)) {
      // For SuperAdmin, also redirect to main home after logout
      } else if (isMobileMenuOpen) {
        setMobileMenuOpen(false);
        setProfileDropdownOpen(false);
      }
      console.log('Logout clicked for role:', user?.role);
      router.push('/');
    }
  };

  try {
    const response = await logout(); 
  } catch (error) {
      console.error('Logout failed:', error); 
    }
    dispatch(setLogout()); 
    
    if (isSuperAdmin(user)) {
      console.log('Redirecting to main site...');
    }
    
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return <span>{message}</span>;
}

export default function SuperAdminRoleAwareButton({ isMobile = false }) {
  const { isLoggedIn, user } = useSelector(state => state.auth);
  
  if (!isLoggedIn || !user) return null;

  const baseClass = isMobile
    ? "block text-center w-full px-4 py-2 rounded-lg transition"
    : "text-md font-medium px-4 py-2 rounded-lg transition";

  // Check if user is SuperAdmin and route accordingly
  if (isSuperAdmin(user)) {
    return (
      <Link
        href="/superadmin"
        onClick={isMobile ? handleLinkClick : undefined}
        className={`${baseClass} bg-red-600 hover:bg-red-700 text-white font-semibold`}
      >
        SuperAdmin Panel
      </Link>
    );
  }

  switch (user.role) {
    case 'ADMIN':
      case 'MENTOR':
        return (
          <Link
            href="/mentor/dashboard"
            onClick={isMobile ? handleLinkClick : undefined}
            className={`${baseClass} bg-green-600 hover:bg-green-700 text-white`}
          >
            Mentor Dashboard
          </Link>
        );
      default:
        return (
          <button
            onClick={isMobile ? () => {
              handleExpertRegistrationClick();
              setMobileMenuOpen(false);
            } : handleExpertRegistrationClick}
            className={`${baseClass} bg-transparent border border-blue-500 text-blue-400 hover:bg-blue-900/50`}
          >
            Become an Expert
          </button>
        );
    }
  };
}
