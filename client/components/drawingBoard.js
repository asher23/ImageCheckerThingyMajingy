import React, {Component} from 'react'
import connect from 'react-redux'
import EE from '../eventEmitter';
export const whiteboard = new EE();

export default class DrawingBoard extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        var canvas = document.querySelector('#' + this.props.canvasId)
        var context = canvas.getContext('2d')
        var radius = this.props.radius;
        canvas.width = '300'
        canvas.height = '300'
        var currentMousePosition = {
            x: 0,
            y: 0
        };
        
        var lastMousePosition = {
            x: 0,
            y: 0
        };
        let drawing = false;   
        canvas.addEventListener('mousedown',e => {
            drawing = true;
            currentMousePosition.x = e.offsetX;
            currentMousePosition.y = e.offsetY;
        });       
        canvas.addEventListener('mouseup', () => {
            drawing = false;
        });
        canvas.addEventListener('mousemove',e => {
            if (!drawing) return;
            lastMousePosition.x = currentMousePosition.x;
            lastMousePosition.y = currentMousePosition.y;
            currentMousePosition.x = e.offsetX;
            currentMousePosition.y = e.offsetY;
            console.log(this.props)
            whiteboard.draw(lastMousePosition, currentMousePosition, true, canvas.id, e, this.props.propcolor);
        });
            
        whiteboard.draw = (start, end, shouldBroadcast, id, e, color) => {
            console.log('COLOin drawR', color)
            var radius = this.props.radius
            var canvas = document.querySelector('#' + id)
            var context = canvas.getContext('2d')
            context.lineWidth = radius * 2            
            context.beginPath();
            context.strokeStyle = color;
            context.arc(end.x, end.y, radius, 0, Math.PI * 2)
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.closePath();
            context.stroke();
            if (shouldBroadcast) {
                whiteboard.emit('draw', start, end, id, e, color);
            }              
        };
    }
    render() {
        const style = {
            border: '5px solid black',
            backgroundColor: 'white'
        }
        return(
            <canvas id={this.props.canvasId} style={style}>
            </canvas>
        )
    }
}

