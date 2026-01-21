// "use client"

// import { useEffect, useRef, useState, useCallback } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// interface Point {
//     x: number
//     y: number
// }

// export default function PolynomialRegression() {
//     const canvasRef = useRef<HTMLCanvasElement>(null)
//     const [points, setPoints] = useState<Point[]>([])
//     const [degree, setDegree] = useState(3)
//     const [coeffs, setCoeffs] = useState<number[]>([])
//     const [dragIdx, setDragIdx] = useState(-1)

//     // Constants
//     const width = 800
//     const height = 450

//     // --- Math Logic (Gaussian Elimination) ---
//     const solve = useCallback((currentPoints: Point[], currentDegree: number) => {
//         if (currentPoints.length === 0) return []

//         const N = currentPoints.length
//         const M = currentDegree + 1

//         // Prepare Matrices
//         let X: number[][] = []
//         let Y: number[] = []

//         for (let i = 0; i < N; i++) {
//             let row: number[] = []
//             for (let p = 0; p < M; p++) row.push(Math.pow(currentPoints[i].x, p))
//             X.push(row)
//             Y.push(currentPoints[i].y)
//         }

//         // Normal Equation: (X^T * X) * coeffs = X^T * Y
//         const transpose = (m: number[][]): number[][] => m[0].map((_, c) => m.map(r => r[c]))
//         const mult = (m1: number[][], m2: number[][]): number[][] => {
//             let r: number[][] = []
//             for (let i = 0; i < m1.length; i++) {
//                 r[i] = []
//                 for (let j = 0; j < m2[0].length; j++) {
//                     let sum = 0
//                     for (let k = 0; k < m1[0].length; k++) sum += m1[i][k] * m2[k][j]
//                     r[i][j] = sum
//                 }
//             }
//             return r
//         }
//         const multVec = (m: number[][], v: number[]): number[] => {
//             return m.map(row => row.reduce((a, b, i) => a + b * v[i], 0))
//         }

//         let XT = transpose(X)
//         let A = mult(XT, X)
//         let B = multVec(XT, Y)

//         // Ridge Regression (Stability)
//         for (let i = 0; i < M; i++) A[i][i] += 0.00001

//         // Gaussian Elimination
//         const gaussian = (A: number[][], B: number[]) => {
//             let n = A.length
//             let M = A.map((r, i) => [...r, B[i]])
//             for (let i = 0; i < n; i++) {
//                 let max = i
//                 for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[max][i])) max = k
//                 [M[i], M[max]] = [M[max], M[i]]
//                 for (let k = i + 1; k < n; k++) {
//                     let f = -M[k][i] / M[i][i]
//                     for (let j = i; j <= n; j++) M[k][j] += f * M[i][j]
//                 }
//             }
//             let x = new Array(n).fill(0)
//             for (let i = n - 1; i >= 0; i--) {
//                 let s = 0
//                 for (let j = i + 1; j < n; j++) s += M[i][j] * x[j]
//                 x[i] = (M[i][n] - s) / M[i][i]
//             }
//             return x
//         }

//         return gaussian(A, B)
//     }, [])

//     const predict = (x: number, currentCoeffs: number[]) => {
//         let y = 0
//         for (let i = 0; i < currentCoeffs.length; i++) y += currentCoeffs[i] * Math.pow(x, i)
//         return y
//     }

//     // Effect: Solve when points/degree change
//     useEffect(() => {
//         const newCoeffs = solve(points, degree)
//         setCoeffs(newCoeffs)
//     }, [points, degree, solve])

//     // --- Drawing ---
//     const draw = useCallback(() => {
//         const canvas = canvasRef.current
//         if (!canvas) return
//         const ctx = canvas.getContext("2d")
//         if (!ctx) return

//         // Clear
//         ctx.fillStyle = "#1e293b" // Dark bg
//         ctx.fillRect(0, 0, width, height)

//         // Draw Grid
//         ctx.strokeStyle = "#334155"
//         ctx.lineWidth = 1
//         ctx.beginPath()
//         const cx = width / 2
//         const cy = height / 2
//         ctx.moveTo(cx, 0); ctx.lineTo(cx, height)
//         ctx.moveTo(0, cy); ctx.lineTo(width, cy)
//         ctx.stroke()

//         // Draw Curve
//         if (coeffs.length > 0) {
//             ctx.strokeStyle = "#38bdf8"
//             ctx.lineWidth = 3
//             ctx.beginPath()
//             let start = false
//             // Draw across entire width
//             for (let px = 0; px <= width; px += 2) {
//                 // Pixel -> Math
//                 let mx = (px - cx) / (width / 2.5)
//                 let my = predict(mx, coeffs)

//                 // Math -> Pixel
//                 let py = (-my * (height / 2.5)) + cy

//                 // Clip
//                 if (my > 5 || my < -5) { start = false; continue }

//                 if (!start) { ctx.moveTo(px, py); start = true }
//                 else ctx.lineTo(px, py)
//             }
//             ctx.stroke()
//         }

//         // Draw Points
//         points.forEach((p, i) => {
//             // Math -> Pixel
//             let px = (p.x * (width / 2.5)) + cx
//             let py = (-p.y * (height / 2.5)) + cy

//             // Residual line
//             let predY = predict(p.x, coeffs)
//             let predPy = (-predY * (height / 2.5)) + cy

//             ctx.strokeStyle = "rgba(255,255,255,0.2)"
//             ctx.lineWidth = 1
//             ctx.beginPath()
//             ctx.moveTo(px, py)
//             ctx.lineTo(px, predPy)
//             ctx.stroke()

//             // Dot
//             ctx.fillStyle = (i === dragIdx) ? "#ffffff" : "#ef4444"
//             ctx.beginPath()
//             ctx.arc(px, py, 6, 0, Math.PI * 2)
//             ctx.fill()
//         })

//     }, [points, coeffs, dragIdx])

//     useEffect(() => {
//         draw()
//     }, [draw])

//     // --- Interaction ---
//     const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
//         const canvas = canvasRef.current
//         if (!canvas) return { x: 0, y: 0 }
//         const rect = canvas.getBoundingClientRect()

//         // @ts-expect-error - touch event handling
//         const clientX = e.touches ? e.touches[0].clientX : e.clientX
//         // @ts-expect-error - touch event handling
//         const clientY = e.touches ? e.touches[0].clientY : e.clientY

//         const scaleX = canvas.width / rect.width
//         const scaleY = canvas.height / rect.height

//         const x = (clientX - rect.left) * scaleX
//         const y = (clientY - rect.top) * scaleY

//         // Map to Math (-1 to 1 approx)
//         let mx = (x - width / 2) / (width / 2.5)
//         let my = -(y - height / 2) / (height / 2.5)
//         return { x: mx, y: my }
//     }

//     const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
//         // @ts-expect-error - type check
//         if (e.button === 2) return // Ignore right click start here, handled in contextmenu if needed

//         const m = getCoords(e)
//         let closest = -1
//         let minD = 0.1

//         points.forEach((p, i) => {
//             let d = Math.hypot(p.x - m.x, p.y - m.y)
//             if (d < minD) { minD = d; closest = i }
//         })

//         if (closest !== -1) {
//             setDragIdx(closest)
//         } else {
//             setPoints(prev => [...prev, { x: m.x, y: m.y }])
//             setDragIdx(points.length) // It will be the new last one
//         }
//     }

//     const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
//         if (dragIdx === -1) return
//         const m = getCoords(e)
//         setPoints(prev => {
//             const next = [...prev]
//             if (next[dragIdx]) {
//                 next[dragIdx] = {
//                     x: Math.max(-1.5, Math.min(1.5, m.x)),
//                     y: Math.max(-1.5, Math.min(1.5, m.y))
//                 }
//             }
//             return next
//         })
//     }

//     const handleEnd = () => setDragIdx(-1)

//     const handleDelete = (e: React.MouseEvent) => {
//         e.preventDefault()
//         const m = getCoords(e)
//         let closest = -1
//         let minD = 0.1
//         points.forEach((p, i) => {
//             let d = Math.hypot(p.x - m.x, p.y - m.y)
//             if (d < minD) { minD = d; closest = i }
//         })
//         if (closest !== -1) {
//             setPoints(prev => prev.filter((_, i) => i !== closest))
//         }
//     }

//     // Pre-sets
//     const handleReset = () => {
//         const newPoints = []
//         for (let x = -0.8; x <= 0.8; x += 0.2) {
//             newPoints.push({ x, y: Math.sin(x * 3) * 0.5 })
//         }
//         setPoints(newPoints)
//         setDegree(3)
//     }

//     useEffect(() => {
//         // Init with some data
//         if (points.length === 0) handleReset()
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])

//     return (
//         <div className="flex flex-col gap-6 p-6 items-center w-full max-w-5xl mx-auto" onMouseUp={handleEnd} onTouchEnd={handleEnd}>
//             <Card className="w-full">
//                 <CardHeader className="text-center">
//                     <CardTitle>Polynomial Curve Fitting</CardTitle>
//                     <CardDescription>Drag points to shape the curve. Right-click to delete.</CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">

//                     <div className="flex justify-center border rounded-lg overflow-hidden bg-slate-900">
//                         <canvas
//                             ref={canvasRef}
//                             width={width}
//                             height={height}
//                             className="w-full max-w-[800px] cursor-crosshair touch-none"
//                             onMouseDown={handleStart}
//                             onMouseMove={handleMove}
//                             onTouchStart={handleStart}
//                             onTouchMove={handleMove}
//                             onContextMenu={handleDelete}
//                         />
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-8 items-center">
//                         <div className="space-y-4">
//                             <div className="flex justify-between">
//                                 <label className="text-sm font-medium">Polynomial Degree: {degree}</label>
//                                 <span className="text-xs text-muted-foreground">(Max: {Math.max(1, points.length - 1)})</span>
//                             </div>
//                             <input
//                                 type="range"
//                                 min="1"
//                                 max={Math.max(1, Math.min(20, points.length - 1))}
//                                 step="1"
//                                 value={degree}
//                                 onChange={(e) => setDegree(parseInt(e.target.value))}
//                                 className="w-full cursor-pointer accent-blue-500"
//                             />

//                             <div className="flex gap-2">
//                                 <Button variant="outline" onClick={() => setDegree(Math.min(20, Math.max(1, points.length - 1)))}>
//                                     Auto Fit
//                                 </Button>
//                                 <Button variant="secondary" onClick={handleReset}>
//                                     Reset Data
//                                 </Button>
//                                 <Button variant="destructive" onClick={() => setPoints([])}>
//                                     Clear All
//                                 </Button>
//                             </div>
//                         </div>

//                         <div className="bg-muted p-4 rounded-lg font-mono text-xs md:text-sm break-all">
//                             {coeffs.length === 0 ? "Add points..." : "y = "}
//                             {coeffs.map((c, i) => {
//                                 const idx = coeffs.length - 1 - i
//                                 const val = coeffs[idx]
//                                 if (!val) return null
//                                 const sign = val >= 0 ? " + " : " - "
//                                 const num = Math.abs(val).toFixed(2)
//                                 if (idx === 0) return <span key={idx}>{sign}{num}</span>
//                                 if (idx === 1) return <span key={idx}>{sign}{num}x</span>
//                                 return <span key={idx}>{sign}{num}x^{idx}</span>
//                             })}
//                         </div>
//                     </div>

//                 </CardContent>
//             </Card>
//         </div>
//     )
// }
