import { appointmentPageStyles, cardStyles, badgeStyles, iconSize } from "../assets/dummyStyles"
import axios from "axios";

const API_BASE = "http://localhost:4000";
const APi = axios.create({baseURL: API_BASE});
//helper function
const AppointmentPage = () => {
  return (
    <div className={appointmentPageStyles.pageContainer}>
        <Toaster position="top-right" />
        <div className={appointmentPageStyles.maxWidthContainer}>

            <h1 className={appointmentPageStyles.doctorTitle}>
                Your Doctor Appointments
            </h1>
            {loadingDoctors && (
                <div className={appointmentPageStyles.loadingText}>
                    Loading Doctors....
                </div>
            )}

            {!loadingDoctors && appointmentData.length === 0 && (
                <div className={appointmentPageStyles.emptyStateText}>
                    No doctor appointment found.
                </div>
            )}
        </div>
    </div>
  )
}

export default AppointmentPage