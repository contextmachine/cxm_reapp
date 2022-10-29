import InfographicsScene from "./scenes/infographics-scene";
import ModellingScene from "./scenes/modelling-scene";

const ExperimentalList = [
  {
    name: "Инфографика",
    id: "infographics-scene",
    module: <InfographicsScene />,
  },
  {
    name: "Моделлинг",
    id: "modelling-scene",
    module: <ModellingScene />,
  },
];

export default ExperimentalList;
