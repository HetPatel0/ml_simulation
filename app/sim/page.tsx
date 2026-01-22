//TODO: Convert all pages to TSX
//TODO: Here will be collection of all simulations with proper cards and descriptions
//TODO: Add Search Functionality to search for simulations
//TODO: Make sub route which will take to specific simulation page as sim/simtype in route
//TODO: while making notice how each simpulation has simheader notice its margins and paddings and make it uniform
//TODO: if Logisstic regression has many components make export file like logistic01 logistic02 



import GradientDescent from "@/components/simulations/GradientDescent";
import KernelTrickVisualizer from "@/components/simulations/KernelTrickVisualizer";
import LeastSquares from "@/components/simulations/LeastSquares";
import LinearRegressionInteractive from "@/components/simulations/LinearRegressionInteractive";
import LogisticFunctionVisualizer from "@/components/simulations/LogisticFunctionVisualizer";
import LogisticRegression from "@/components/simulations/LogisticRegression";
import LogisticTrainingSim from "@/components/simulations/LogisticTrainingSim";
import PolynomialRegression from "@/components/simulations/PolynomialRegression";
import SupportVectorRegression from "@/components/simulations/SupportVectorRegression";
import SVRVisualizer from "@/components/simulations/SVRVisualizer";

export default function check() {
  return (
    <>
      <GradientDescent />
      <LeastSquares />
      <LogisticRegression />
      <PolynomialRegression />

      now new ones 
      <KernelTrickVisualizer/>
      <LinearRegressionInteractive/>
      <LogisticFunctionVisualizer/>
      <LogisticTrainingSim/>
      <SVRVisualizer/>
      {/* <SupportVectorRegression /> */}
    </>
  );
}
