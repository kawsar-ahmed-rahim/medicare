import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VerifyPaymentPage from "./VerifyPaymentPage";

const API_BASE = "http://localhost:4000";

const VerifyServicePaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const VerifyPayment = async () => {
      const params = new URLSearchParams(location.search || "");
      const sessionId = params.get("session_id");

      if (location.pathname === "/service-appointment/cancel") {
        if (!cancelled)
          navigate("/appointments?payment_status=Cancelled", { replace: true });
      }
      return;
    };
    if (!sessionId) {
      if (!cancelled)
        navigate("/appointments?payment_status=Failed", { replace: true });
    }
    return;
  }
  try {
    const res = await axios.get(
        `${API_BASE}/api/service-appointments/confirm`,{
            params: { session_id: sessionId},
            timeout: 15000,
        },
    );
    if(cancelled) return;
    if(res?.data?.success){
        navigate("/appointments?service_payment=Paid",{
            replace: true,
        })
    } else {
        navigate("/appointments?service_payment=Failed",{
            replace: true,
        })

    }
  } catch (error) {
    console.error("Service Payment verification failed:",error);
    if(!cancelled){
        navigate("/appointment?service_payment=Failed",{
            replace: true,
        })
    }
    
  }
  VerifyServicePayment();
  return () => {
    cancelled = true;
  }
},[location, navigate]
);
  return null;
};

export default VerifyServicePaymentPage;
