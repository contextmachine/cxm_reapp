import { useThree } from "@react-three/fiber";

const Grid = () => {
  const { scene } = useThree();

  console.log("scene", scene);

  return () => {};
};

export default Grid;
