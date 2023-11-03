import { useState, createContext, useEffect, useCallback } from "react";

const ToastContext = createContext();

export default ToastContext;
export const ToastContextProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    //window.scrollTo(0, 0);
    let timer;
    if (toasts.length > 0) {
      timer = setTimeout(() => {
        setToasts((toasts) => toasts.slice(1));
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  const success = useCallback(
    function (msg) {
      let toast = { msg };
      toast.className = "success";
      setToasts([toast]);
    },
    [setToasts]
  );

  const error = useCallback(
    function (msg) {
      let toast = { msg };
      toast.className = "danger";
      setToasts([toast]);
    },
    [setToasts]
  );

  const warning = useCallback(
    function (msg) {
      let toast = { msg };
      toast.className = "warning";
      setToasts([toast]);
    },
    [setToasts]
  );

  const info = useCallback(
    function (msg) {
      let toast = { msg };
      toast.className = "info";
      setToasts([toast]);
    },
    [setToasts]
  );

  const notification = {
    success,
    error,
    warning,
    info,
  };

  return (
    <ToastContext.Provider value={notification}>
      {children}
      {toasts.map((toast, index) => (
        <div
          className={`position-fixed z-index-9 alert top-0 end-0 start-auto m-2 alert-${toast.className} alert-dismissible fade show`}
          // style={{
          //   backgroundColor: "#000",
          //   color: "#fff",
          //   padding: "7px 10px",
          //   right: "16px",
          //   borderRadius: "10px",
          //   top: "18px",
          //   zIndex: "9999999"
          // }}
          key={index}
        >
          {toast.msg}
          {/* <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button> */}
        </div>
      ))}
    </ToastContext.Provider>
  );
};
