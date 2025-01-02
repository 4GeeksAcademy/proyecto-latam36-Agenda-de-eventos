import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Breadcrumbs = ({ eventName }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const formatPathName = (path) => {
    return path
      .replace(/-|_/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const pathNames = location.pathname
    .split("/")
    .filter(path => {
      if (!path) return false;
      const lowerPath = path.toLowerCase();
      return lowerPath !== 'eventdetails' && 
             lowerPath !== 'eventodetails' && 
             lowerPath !== 'eventosdetails';
    });

  return (
    <div className="breadcrumbs p-4 flex flex-col items-start gap-2">
      <div className="flex items-center flex-wrap gap-2">
        
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Home
        </Link>

        {eventName && (
          <>
            <span className="mx-2">/</span>
            <span className="font-medium">{eventName}</span>
          </>
        )}

        {!eventName && pathNames.map((path, index) => {
          const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathNames.length - 1;

          return (
            <React.Fragment key={index}>
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="font-medium">{formatPathName(path)}</span>
              ) : (
                <Link to={routeTo} className="text-blue-600 hover:text-blue-800">
                  {formatPathName(path)}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="rounded btn-primary fw-bold mt-1"
      >
        Volver
      </button>
    </div>
  );
};

export default Breadcrumbs;