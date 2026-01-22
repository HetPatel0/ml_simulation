"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {SimHeader} from "../common/sim-header";

type DataPoint = { x: number; y: number };
type LogEntry = {
  epoch: number;
  loss: number;
  mle: string;
  w: number;
  dw: number;
  b: number;
  db: number;
};

export default function LogisticTrainingSim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Simulation State Refs (Mutable for animation loop)
  const dataRef = useRef<DataPoint[]>([]);
  const paramsRef = useRef({ w: 0, b: 0 });
  const isTrainingRef = useRef(false);
  const epochRef = useRef(0);
  const reqIdRef = useRef<number>(0);

  // UI State
  const [isTraining, setIsTraining] = useState(false);
  const [stats, setStats] = useState({
    loss: 0,
    mle: "0.00",
    dw: 0,
    db: 0,
    w: 0,
    b: 0,
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Constants
  const LEARNING_RATE = 0.05;
  const MAX_EPOCHS = 500;
  const PADDING = 40;

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

  // --- Drawing Logic ---
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Helpers
    const mapX = (x: number) => PADDING + (x / 12) * (width - 2 * PADDING);
    const mapY = (y: number) => (height - PADDING) - y * (height - 2 * PADDING);

    ctx.clearRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING, mapY(0)); ctx.lineTo(width - PADDING, mapY(0));
    ctx.moveTo(mapX(0), PADDING); ctx.lineTo(mapX(0), height - PADDING);
    ctx.stroke();

    // Threshold Line
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(PADDING, mapY(0.5)); ctx.lineTo(width - PADDING, mapY(0.5));
    ctx.stroke();
    ctx.setLineDash([]);

    // Data Points
    for (let p of dataRef.current) {
      ctx.beginPath();
      ctx.arc(mapX(p.x), mapY(p.y), 6, 0, 2 * Math.PI);
      ctx.fillStyle = p.y === 1 ? "#22c55e" : "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.stroke();
    }

    // Sigmoid Curve
    ctx.beginPath();
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    const { w, b } = paramsRef.current;
    for (let x = 0; x <= 12; x += 0.1) {
      let y = sigmoid(w * x + b);
      if (x === 0) ctx.moveTo(mapX(x), mapY(y));
      else ctx.lineTo(mapX(x), mapY(y));
    }
    ctx.stroke();
  };

  // --- Logic ---
  const generateData = () => {
    stopTraining();
    dataRef.current = [];
    paramsRef.current = { w: 0, b: 0 };
    epochRef.current = 0;
    setLogs([]);
    setStats({ loss: 0, mle: "0.00", dw: 0, db: 0, w: 0, b: 0 });

    for (let i = 0; i < 50; i++) {
      let x = Math.random() * 12;
      let z = 1.5 * x - 9; // Target logic
      let prob = sigmoid(z);
      let y = Math.random() < prob ? 1 : 0;
      dataRef.current.push({ x, y });
    }
    draw();
  };

  const startTraining = () => {
    isTrainingRef.current = true;
    setIsTraining(true);
    loop();
  };

  const stopTraining = () => {
    isTrainingRef.current = false;
    setIsTraining(false);
    if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
  };

  const loop = () => {
    if (!isTrainingRef.current) return;

    let { w, b } = paramsRef.current;
    let dw = 0, db = 0, totalLoss = 0, logLikelihoodSum = 0;
    const m = dataRef.current.length;

    if (m === 0) return;

    for (let p of dataRef.current) {
      let pred = sigmoid(w * p.x + b);
      let error = pred - p.y;
      
      dw += error * p.x;
      db += error;

      let safePred = Math.max(0.000001, Math.min(0.999999, pred));
      totalLoss += -(p.y * Math.log(safePred) + (1 - p.y) * Math.log(1 - safePred));
      logLikelihoodSum += (p.y * Math.log(safePred) + (1 - p.y) * Math.log(1 - safePred));
    }

    dw /= m;
    db /= m;
    w -= LEARNING_RATE * dw;
    b -= LEARNING_RATE * db;

    paramsRef.current = { w, b };
    epochRef.current++;

    // Update Visuals
    draw();

    // Update React State (Throttled slightly naturally by React batching, but we do every frame here)
    // For smoother UI in heavy loads, you might throttle this part.
    const currentStats = {
        loss: totalLoss / m,
        mle: logLikelihoodSum.toFixed(2),
        dw, db, w, b
    };
    setStats(currentStats);

    if (epochRef.current % 5 === 0) {
      setLogs(prev => [
        { epoch: epochRef.current, ...currentStats },
        ...prev.slice(0, 49) // Keep last 50
      ]);
    }

    if (epochRef.current >= MAX_EPOCHS) {
      stopTraining();
    } else {
      reqIdRef.current = requestAnimationFrame(loop);
    }
  };

  useEffect(() => {
    generateData();
    return () => stopTraining();
  }, []);

  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-5xl mx-auto">
      <SimHeader
        title="Logistic Regression Internals"
        description="MLE & Gradient Descent Visualizer"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Controls & Canvas */}
        <div className="lg:col-span-2 space-y-4">
            <div className="flex gap-4">
                <button 
                    onClick={generateData}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                >
                    1. Generate Data
                </button>
                <button 
                    onClick={isTraining ? stopTraining : startTraining}
                    className={`flex-1 font-bold py-2 px-4 rounded transition text-white ${isTraining ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                >
                    {isTraining ? "Stop Training" : "2. Start Training"}
                </button>
            </div>
            
            <Card>
                <CardContent className="p-2">
                     <canvas ref={canvasRef} width={600} height={350} className="w-full bg-white rounded border" />
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Stats */}
        <div className="space-y-4">
            <Card className="bg-slate-50">
                <CardHeader className="pb-2"><CardTitle className="text-sm uppercase text-slate-500">Objective Functions</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Log Loss (minimize):</span>
                        <span className="font-mono font-bold text-red-600">{stats.loss.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Likelihood (maximize):</span>
                        <span className="font-mono font-bold text-green-600">{stats.mle}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">*Likelihood is P(Data|Model).</p>
                </CardContent>
            </Card>

            <Card className="bg-slate-50">
                <CardHeader className="pb-2"><CardTitle className="text-sm uppercase text-slate-500">Gradient Descent</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                    <div className="font-mono bg-slate-900 text-yellow-400 p-2 rounded text-xs mb-2">
                        dw = Σ(pred-y)*x<br/>db = Σ(pred-y)
                    </div>
                    <div className="flex justify-between">
                        <span>Slope Grad (dw):</span>
                        <span className="font-mono font-bold">{stats.dw.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Bias Grad (db):</span>
                        <span className="font-mono font-bold">{stats.db.toFixed(4)}</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                        <strong>Current Weights:</strong><br/>
                        w = {stats.w.toFixed(2)}, b = {stats.b.toFixed(2)}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Log Table */}
      <Card>
          <CardHeader className="py-4"><CardTitle className="text-base">Training Log (Last 50 Updates)</CardTitle></CardHeader>
          <CardContent className="p-0 max-h-48 overflow-y-auto">
              <table className="w-full text-sm text-right border-collapse">
                  <thead className="bg-slate-100 text-slate-500 sticky top-0">
                      <tr>
                          <th className="p-2 text-left">Epoch</th>
                          <th className="p-2">Loss</th>
                          <th className="p-2">Likelihood</th>
                          <th className="p-2">w</th>
                          <th className="p-2">dw</th>
                      </tr>
                  </thead>
                  <tbody className="font-mono text-xs">
                      {logs.map((log, i) => (
                          <tr key={i} className="border-b even:bg-slate-50 hover:bg-slate-100">
                              <td className="p-2 text-left">{log.epoch}</td>
                              <td className="p-2 text-red-600">{log.loss.toFixed(4)}</td>
                              <td className="p-2 text-green-600">{log.mle}</td>
                              <td className="p-2">{log.w.toFixed(3)}</td>
                              <td className="p-2 text-slate-500">{log.dw.toFixed(4)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </CardContent>
      </Card>
    </div>
  );
}