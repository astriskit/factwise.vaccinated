import { useState, useEffect } from "react";
import { addDays, subDays, isBefore, isEqual } from "date-fns";
import PieChart from "./components/pieChart";

import "./App.css";

const isVaccinated =
  (on) =>
  ({ vaccination_date }) => {
    const dt = new Date(vaccination_date);
    return isBefore(dt, on) || isEqual(dt, on);
  };

const totalVaccinated = (on, data) => {
  return data.filter(isVaccinated(on));
};

function App() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Current Date Fetch from current_date.json in public/data
  const [vaccineDates, setVaccineDates] = useState([]); // List Of Vaccine Dates Fetch from vaccine_dates.json in public/data
  const [currentVaccinated, setCurrentVaccinated] = useState([]);

  useEffect(() => {
    // Use fetch() to fetch requited data from public/data
    fetch("/data/current_date.json")
      .then((res) => {
        return res.json();
      })
      .then(({ current_date }) => {
        setCurrentDate(new Date(current_date));
      })
      .catch((err) => {
        console.error(`Error while fetching data: ${err.message}`);
      });
  }, []);

  useEffect(() => {
    fetch("/data/vaccine_dates.json")
      .then((res) => res.json())
      .then((data) => {
        setVaccineDates(data);
      })
      .catch((err) => {
        console.error(`Error while fetching vaccine-data: ${err.message}`);
      });
  }, []);

  useEffect(() => {
    const vaccinated = totalVaccinated(currentDate, vaccineDates);
    setCurrentVaccinated(vaccinated);
  }, [currentDate, vaccineDates]);

  const handleCurrentDateIncrement = () => {
    const nextDate = addDays(currentDate, 1);
    setCurrentDate(nextDate);
  };

  const handleCurrentDateDecrement = () => {
    const nextDate = subDays(currentDate, 1);
    setCurrentDate(nextDate);
  };

  const totalPoints = vaccineDates.length;
  const vaccinatedPoints = currentVaccinated.length;
  const unVaccinatedPoints = totalPoints - vaccinatedPoints;

  return (
    <div className="App">
      <h4 className="summary">
        {vaccinatedPoints} out of {totalPoints} people have been vaccinated
      </h4>
      <div className="date">
        <button onClick={handleCurrentDateIncrement}>+</button>{" "}
        {/* Set Current Date to next date on click  */}
        <div className="currentdate">{currentDate.toDateString()}</div>
        <button onClick={handleCurrentDateDecrement}>-</button>{" "}
        {/* Set Current Date to drevious date on click  */}
      </div>
      <div className="chart">
        {/* Update the following Component to display pie chart with proper data, alignment and colors */}
        <PieChart data={[vaccinatedPoints, unVaccinatedPoints]} />
      </div>
      <div className="users">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Vaccination Status</th>
            </tr>
          </thead>
          <tbody>
            {vaccineDates.map(
              ({ person_name, vaccination_date, person_id }) => {
                const isPersonVaccinated = isVaccinated(currentDate)({
                  vaccination_date,
                });
                const status = isPersonVaccinated
                  ? "Vaccine Done"
                  : "Vaccine Pending";
                const statusClass = isPersonVaccinated
                  ? "text-green"
                  : "text-red";
                return (
                  <tr key={person_id}>
                    <td key="name">{person_name}</td>
                    <td key="status" className={statusClass}>
                      {status}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
