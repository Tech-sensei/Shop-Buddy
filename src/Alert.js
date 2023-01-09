import React, { useEffect } from "react";

const Alert = ({ message, type, removeAlert, list }) => {
  useEffect(() => {
    const alertTimeout = setTimeout(() => {
      removeAlert();
    }, 3000);

    return () => clearInterval(alertTimeout);
  }, [list]);

  return <p className={`alert alert-${type}`}>{message}</p>;
};

export default Alert;
