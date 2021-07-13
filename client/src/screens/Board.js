import React,{useState,useRef, useEffect} from 'react';
import io from 'socket.io-client';

import '../styles/board.css';
import '../styles/board.css';

const Board = () => {

    {/** Get jamboard Id */}
    const param  = window.location.search.split("=");
    console.log(param);
    const jamboardId = param[1];

    {/** Brush Size and color */}
    const [color,setColor] = useState("#000000");
    const [size,setSize] = useState("5");

    const socketRef = useRef();
    const canvasRef = useRef();
    const timeoutRef = useRef();

    // const [ctx,setCtx] = useState({strokeColor : color, strokeSize : size});

    const [isDrawing,setIsDrawing] = useState(false);
    


    useEffect(() => {
        {/** scoket connection for real time collaboration */}

        socketRef.current = io.connect("/");
        
        canvasRef.current = document.querySelector("#board");
        const clearCanvas = canvasRef.current.toDataURL("image/png");

        let ImageData = canvasRef.current.toDataURL("image/png");
        
        socketRef.current.emit("join canvas", {jamboardId, ImageData});

        {/** Capture data when other user draws on whiteboard */}
        socketRef.current.on("canvas-data", (data) => {
    
            let handle = setInterval(() => {
                if(isDrawing)return;

                setIsDrawing(true);
                clearInterval(handle);

                let image = new Image()
                {/** add the drawing to our whiteboard */}
                let ctx = canvasRef.current.getContext('2d');

                image.onload = () => {
                    ctx.drawImage(image, 0, 0);
                    setIsDrawing(false);
                }
                image.src = data;
            }, 200)
    
        })
        
        drawOnCanvas();
    },[])

    
    const drawOnCanvas = () => {

        let ctx = canvasRef.current.getContext('2d');
        let sketch = document.querySelector('#sketch');
        let sketch_style = getComputedStyle(sketch);
        
        canvasRef.current.width = parseInt(sketch_style.getPropertyValue('width'));
        canvasRef.current.height = parseInt(sketch_style.getPropertyValue('height'));

        {/** Track Mouse Positions */}
        let mouse = {x: 0, y: 0};
        let last_mouse = {x: 0, y: 0};


        /* Mouse Capturing Work */
        canvasRef.current.addEventListener('mousemove', (e) =>{
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - canvasRef.current.offsetLeft;
            mouse.y = e.pageY - canvasRef.current.offsetTop;
        }, false);
        
      
        canvasRef.current.addEventListener('mousedown', (e)=> {
            canvasRef.current.addEventListener('mousemove', onPaint, false);
        }, false);

        canvasRef.current.addEventListener('mouseup', (e) =>{
            canvasRef.current.removeEventListener('mousemove', onPaint, false);
        }, false);


        const onPaint = () => {

            ctx.lineWidth = size;
            ctx.strokeStyle = color;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';

            console.log(size,color)
            {/** Track stroke */}
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            {/** timeout of 1second */}            
            if(timeoutRef.current != undefined)clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                let image = canvasRef.current.toDataURL("image/png");
                socketRef.current.emit("canvas-data", image);
            },1000) 
        }
    }


    
    return (
        <div className="container">
            <div class="tools-section">
                {/** Tool Bar */}
                <div className="color-picker-container" >
                    Select Brush Color : &nbsp; 
                    <input type="color" value={color} onChange={e => setColor(e.target.value)}/>
                </div>

                <div className="brushsize-container">
                    Select Brush Size : &nbsp; 
                    <select value={size} onChange={e => setSize(e.target.value)}>
                        <option> 5 </option>
                        <option> 10 </option>
                        <option> 15 </option>
                        <option> 20 </option>
                        <option> 25 </option>
                        <option> 30 </option>
                    </select>
                </div>
            </div>
            {/** Canvas */}
            <div class="board-container">
                <div class="sketch" id="sketch">
                    <canvas className="board" id="board"></canvas>
                </div>
            </div>
        </div>

    )
    
}

export default Board