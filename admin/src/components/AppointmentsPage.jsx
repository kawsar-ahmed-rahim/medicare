import { pageStyles, statusClasses, keyframesStyles } from './../assets/dummyStyles';

const API_BASE = "http://localhost:4000";

// helpers function


const AppointmentsPage = () => {
  //2

  // 3.fetch list from server


  // 4. if admin want to cancel

  return (
    <div className={pageStyles.container}>
      <style className={keyframesStyles}></style>
      <div className={pageStyles.maxWidthContainer}>
        <header className={pageStyles.headerContainer}>
          <div className={pageStyles.headerTitleSection}>
            <h1 className={pageStyles.headerTitle}>Appointments</h1>
            <p className={pageStyles.headerSubtitle}>Manage and search upcoming patient appointments</p>
          </div>



          <div className={pageStyles.headerControlsSection}>
            <div className="flex flex-col md:flex-col sm:flex-row items-center gap-3">
              <div className={pageStyles.searchContainer}><Search size={16} className={pageStyles.searchIcon} />
              <input className={pageStyles.searchInput} placeholder='Search doctor, patient, speciality or mobile'  value={query} onChange={(e) => setQuery(e.target.value)}/>
              </div>

              <div className={pageStyles.filterContainer}>
                <div className={pageStyles.dateFilter}>
                  <Calender size={14} className={pageStyles.dateFilterIcon}/>
                  <input type="date" className= {pageStyles.dateInput} value={filterDate} onChange={(e)=> setFilterDate(e.target.value)}
                   />
                </div>

                <select className={pageStyles.selectFilter} value={filterSpeciality} onChange={(e) => setFilterSpeciality(e.target.value)}>
                  {specialities.map((s) => (
                    <option value={s} key={s}>{
                      s === "all" ? "All Specialities"
: s                    }</option>
                  ))}
                </select>
                <button onClick={()= > {
                  setQuery(""); setFilterDate(""); setFilterSpeciality("all");
                  setShowAll(false); SpeechSynthesisErrorEvent(null);
                }} className={pageStyles.clearButton}>Clear

                </button>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className={pageStyles.loadingErrorContainer}>Loading...</div>
        ) : error ? (
          <div className={pageStyles.errorContainer}>{error}</div>
        ) : sortedFiltered.length === 0 ? (
          <div className={pageStyles.noResultsContainer}>No appointments found</div>
        ) : (
          <main className={pageStyles.gridContainer}>
            {displayed.map((a, idx)=> {
              const statusLower = (a.status || "").lowerCase();
              const isCancelled = 
              statusLower === "canceled" || statusLower === "cancelled";
              const isCompleted = statusLower === "completed";
return (
  // div
)

            })}

          </main>
        )}
        {sortedFiltered.length > 8 && (
          <div className="flex justify-center mt-4"><button>
            </button></div>
        )}
      </div>

    </div>
  )
}

export default AppointmentsPage