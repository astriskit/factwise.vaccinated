import { Pie } from "react-chartjs-2";

const PieChart = ({ data }) => {
  const options = {
    labels: ["Vaccinated", "Not Vaccinated"],
    datasets: [
      {
        label: "People % vaccinated on selected date",
        data: data,
        backgroundColor: ["green", "red"],
        hoverOffset: 4,
      },
    ],
    height: "50%",
  };
  return (
    <div style={{ height: "100px" }}>
      <Pie data={options} style={{ height: "100px" }} />
    </div>
  );
};

export default PieChart;
