import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 text-sm font-medium text-[var(--color-on-surface-variant)] mb-6">
      <Link to="/admin/dashboard" className="hover:text-[var(--color-primary)] transition-colors flex items-center">
        <HomeIcon className="w-4 h-4 mr-1" />
      </Link>
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        // Skip 'admin' itself if it is not the main destination
        if (value === 'admin' && !last) return null;

        return (
          <React.Fragment key={to}>
            <ChevronRightIcon className="w-4 h-4 text-[var(--color-outline-variant)]" />
            {last ? (
              <span className="text-[var(--color-on-surface)] capitalize">{value}</span>
            ) : (
              <Link to={to} className="hover:text-[var(--color-primary)] transition-colors capitalize">
                {value}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
