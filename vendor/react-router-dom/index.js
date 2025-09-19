const React = require('react');

const RouterContext = React.createContext({
  location: { pathname: '/' },
  navigate: () => {},
});

const isBrowser = typeof window !== 'undefined';

function normalizePath(pathname) {
  if (!pathname) return '/';
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.replace(/\/+$/, '');
  }
  return pathname;
}

function BrowserRouter({ children }) {
  const [location, setLocation] = React.useState(() => ({
    pathname: isBrowser ? normalizePath(window.location.pathname) : '/',
  }));

  const navigate = React.useCallback((to, options = {}) => {
    const target = normalizePath(typeof to === 'string' ? to : '/');
    if (isBrowser) {
      const method = options.replace ? 'replaceState' : 'pushState';
      window.history[method](null, '', target);
    }
    setLocation({ pathname: target });
  }, []);

  React.useEffect(() => {
    if (!isBrowser) return undefined;
    const handlePopState = () => {
      setLocation({ pathname: normalizePath(window.location.pathname) });
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const contextValue = React.useMemo(() => ({ location, navigate }), [location, navigate]);

  return React.createElement(RouterContext.Provider, { value: contextValue }, children);
}

function matchPath(pathname, path) {
  if (path === '*' || path === '/*') {
    return true;
  }
  const normalizedPath = normalizePath(path);
  return pathname === normalizedPath;
}

function Routes({ children }) {
  const { location } = React.useContext(RouterContext);
  let element = null;

  React.Children.forEach(children, (child) => {
    if (element || !React.isValidElement(child)) {
      return;
    }
    const { path = '*', element: routeElement } = child.props || {};
    if (matchPath(location.pathname, path)) {
      element = routeElement || null;
    }
  });

  return element;
}

function Route() {
  return null;
}

function Navigate({ to, replace }) {
  const { navigate } = React.useContext(RouterContext);
  React.useEffect(() => {
    navigate(to, { replace });
  }, [navigate, to, replace]);
  return null;
}

function useLocation() {
  const { location } = React.useContext(RouterContext);
  return location;
}

function useNavigate() {
  const { navigate } = React.useContext(RouterContext);
  return navigate;
}

function Link({ to, replace, onClick, children, target, ...rest }) {
  const { navigate } = React.useContext(RouterContext);

  const handleClick = (event) => {
    if (onClick) {
      onClick(event);
    }

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      (target && target !== '_self') ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    navigate(to, { replace });
  };

  return React.createElement('a', { ...rest, href: to, onClick: handleClick, target }, children);
}

module.exports = {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
};
