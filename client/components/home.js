import React, {Component} from 'react'
import DrawingBoard from './drawingBoard'
import {Grid, FormGroup, ControlLabel, FormControl, HelpBlock, Row, Button, Col} from 'react-bootstrap'
const path = require('path')
import EE from '../eventEmitter';
export const finishedEmitter = new EE();
import ReactCountdownClock from 'react-countdown-clock'


import axios from 'axios'
function FieldGroup({ id, label, help, ...props }) {
    return (
      <FormGroup controlId={id}>
        <ControlLabel>{label}</ControlLabel>
        <FormControl {...props} />
        {help && <HelpBlock>{help}</HelpBlock>}
      </FormGroup>
    );
  }


export default class Home extends Component {

    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            thePath: '',
            renderAll: false,
            correct: 0,
            userOne: '',
            userTwo: '',
            userOneScore: 0,
            userTwoScore: 0,
            imgOne: '',
            imgTwo: '',
            timeRemaining: 60,
            over: false,
            radius: 10,
            color: 'black',
            imageCount: 0,
            room: '',
            imgThree: '',
            imgFour: '',
            onetotalscore: 0,
            twototalscore: 0,
        }
        this.onComplete = this.onComplete.bind(this)
        this.handleSubmit =  this.handleSubmit.bind(this)
        this.increaseRad = this.increaseRad.bind(this)
        this.decreaseRad = this.decreaseRad.bind(this)
        this.changeColorBlack =  this.changeColorBlack.bind(this)
        this.changeColorBlue =  this.changeColorBlue.bind(this)
        this.changeColorGreen =  this.changeColorGreen.bind(this)
        this.changeColorRed =  this.changeColorRed.bind(this)
        this.changeColorWhite = this.changeColorWhite.bind(this)
        this.nextImage =  this.nextImage.bind(this)
    }

    componentDidMount() {
        axios.get('/api/compare')
        .then((res) => res.data)
        .then((res) => {
            this.setState({thePath: res})
        })

        finishedEmitter.urdone = (theTruth) => {
            this.onComplete(true)
        };
    }
    nextImage() {
        var countNow = this.state.imageCount
        this.handleClick('', countNow)        
        if (countNow === 4) {
            alert('You finished!')
        } else {
            this.setState({imageCount: countNow+ 1})            
        }
    }

    handleClick(e, countNow) {

        var canvasLeft = document.getElementById("left");
        var canvasRight = document.getElementById("right");
        var mainImage = document.getElementById("center")
        var leftImage = new Image();
        var rightImage = new Image();
        

        leftImage.src = canvasLeft.toDataURL("image/png");
        rightImage.src = canvasRight.toDataURL("image/png");
        

        var firstPercentage;
        var secondPercentage;

        axios.post('/api/compare', {mainImage: mainImage.src, otherImage: leftImage.src, count: this.state.imageCount})
        .then((res) =>  res.data)
        .then((res) => {
            firstPercentage = 100 - Number(res.data.misMatchPercentage)
            var onetotalscorebro = this.state.onetotalscore
            this.setState({onetotalscore: onetotalscorebro + firstPercentage})
            if (countNow === 0) {
                this.setState({
                    imgOne: res.image,
                    userOneScore: firstPercentage
                })
            } else if (countNow === 1) {
                this.setState({
                    imgThree: res.image,
                    userOneScore: firstPercentage
                })
            }
        })
        .then(() => {
            return axios.post('/api/compare', {otherImage : rightImage.src, mainImage: mainImage.src, count: this.state.imageCount})
        })
        .then((res) => res.data)
        .then((res) => {
            secondPercentage = 100 - Number(res.data.misMatchPercentage)
            var twototalscorebro = this.state.twototalscore
            this.setState({twototalscore: secondPercentage + twototalscorebro})
            if (countNow === 0) {
                
                this.setState({
                    imgTwo: res.image,
                    userOneScore: firstPercentage
                })
            } else if (countNow === 1) {
                this.setState({
                    imgFour: res.image,
                    userOneScore: firstPercentage
                })
            }
        })
    }


    renderMiddleImage() {
        var images = [
            'image1.png',
            'image2.png',
            'image3.png',
            'image4.png',
            'image5.png',
        ]
        return (
            
            <div style={{border: '5px solid black', backgroundColor: 'white', width: '300', height: '300'}}>
                <img id="center" style={{width: '300px', height: '300px'}} src={images[this.state.imageCount]}>
                </img>
            </div>
        )
    }

    handleSubmit(e) {
        e.preventDefault()
        var userOne = e.target.userOne.value
        var room = e.target.room.value
        this.setState({
            userOne,
            userTwo: room,
            renderAll: true
        })
    }
    render() {
        return (
            <div>
            {this.state.renderAll ?  
                this.renderEverything() :
                <div style={{backgroundColor:'black', height: '100vh'}}>
                <Grid >
                    <Row>
                    <Col style={{textAlign: 'center', paddingTop:'40vh', color: 'white'}}>
                        <form onSubmit={this.handleSubmit}>
                        <FieldGroup
                            id="formControlsText"
                            type="text"
                            label="Text"
                            name="userOne"
                            placeholder="Enter userOne"
                        />
                        <FieldGroup
                            id="formControlsText"
                            type="text"
                            label="Room"
                            name="room"
                            placeholder="Enter Room"
                        />
                        <Button type="submit">
                            Submit
                        </Button>
                        </form>
                    </Col>
                    </Row>

                </Grid>
                </div>
            }
            </div>
        )
    }

    increaseRad() {
        var newRadius = this.state.radius + 2
        this.setState({radius: newRadius})
    }
    decreaseRad() {
        var newRadius = this.state.radius - 2
        this.setState({radius: newRadius})
    }
    changeColorBlue() {
        this.setState({color: 'blue'})
    }
    changeColorGreen() {
        this.setState({color: 'green'})
    }
    changeColorRed() {
        this.setState({color: 'red'})        
    }
    changeColorWhite() {
        this.setState({color: 'white'})        
    }
    changeColorBlack() {
        this.setState({color: 'black'})
    }
    onComplete(dontemit) {
        if (dontemit) {
            this.handleClick()
            this.setState({over: true})
        } else {
            finishedEmitter.emit('finished')
            this.handleClick('', this.state.imageCount)
            this.setState({over: true})
        }
        alert(`your final score for player on left is ${this.state.onetotalscore / 5} and player right is ${this.state.twototalscore / 5}`)
        console.log(this.state.over, 'INRGIN')
    }

    restart(e) {
        console.log('should refresh page')
    }

    renderEverything() {
        const style = {
            border: '5px solid black',
            backgroundImage: `url("https://images.freecreatives.com/wp-content/uploads/2016/02/Free-Dark-wood-Background.jpg")`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            height: '300vh'
    }
        const fontStyle = {
            textAlign: 'center',
            color: 'white',
            fontFamily: `'Acme', sans-serif`
        }
        const controlStyle ={
            backgroundColor: 'white', 
            display: 'inline',
            marginLeft: '10px'
        }
        return(
            <div style={style}>
            <Grid>

                <Row style={fontStyle}>
                    <Col md={2}>
                    <ReactCountdownClock seconds={60}
                     color="white"
                     alpha={0.9}
                     size={100}
                     style={{backgroundColor: 'inLine', height: '50px', marginBottom: '500px'}}
                     onComplete={this.onComplete} />

                    </Col>
                    <Col md={8}>
                    <h1 style={{display: 'inLine'}}>
                        Welcome to The ImageCheckerThingyMajingy     
                    </h1>
                    <div style={{height: '50px', width: '50px', display: 'inLine'}}>
                 
                    </div>
                    <h1 style={{display: 'block'}}>
                        You have 60 Seconds. Get through All Five Images. Your Time Starts Now.     
                    </h1>
                    </Col>
                    <Col md={2}>
                    </Col>
                    <Button style={{display: 'inLine', marginLeft: '30px', height: '40px'}}onClick={this.nextImage}>
                        Next
                    </Button>
                    <Button style={{display: 'inLine', marginLeft: '30px', height: '40px'}}onClick={this.handleClick}>
                        See Your Results
                    </Button>
                </Row>
                <Row>
                    <div id='toolbar' style={{backgroundColor: 'white', width: '100%', color: 'black', height: '50px'}}>
                        <div id='radius'>
                            Radius <span id='radval'> {this.state.radius}</span>
                            <Button onClick={this.decreaseRad} style={controlStyle} id='decrad' >-</Button>
                            <Button onClick={this.increaseRad} style={controlStyle} id='decrad'>+</Button>
                            <Button onClick={this.changeColorBlue}style={{backgroundColor:'blue', height:'50px', width:'50px', borderRadius: '20px' }}></Button>
                            <Button onClick={this.changeColorGreen}style={{backgroundColor:'green', height:'50px', width:'50px', borderRadius: '20px' }}></Button>
                            <Button onClick={this.changeColorWhite}style={{backgroundColor:'white', height:'50px', width:'50px', borderRadius: '20px' }}></Button>
                            <Button onClick={this.changeColorRed}style={{backgroundColor:'red', height:'50px', width:'50px', borderRadius: '20px' }}></Button>
                            <Button onClick={this.changeColorBlack}style={{backgroundColor:'black', height:'50px', width:'50px', borderRadius: '20px' }}></Button>
                        </div>

                    </div>
                </Row>
                <Row>
                    <Col style={{color: 'white'}} md={4}>
                        <h3>{this.state.userOne}'s board </h3>
                        { !this.state.over ? 
                            <DrawingBoard propcolor={this.state.color} canvasId='left' radius={this.state.radius}/> :
                            <div><h1> Time is up!</h1> </div>
                        }
                    </Col>
                    <Col style={{color: 'white'}}md={4}>
                    <h3>Draw This Image ASAP!!!!!!!!</h3>
                    {this.renderMiddleImage()}
                    </Col>
                    <Col style={{color: 'white'}} md={4}>
                        <h3>{this.state.userTwo}'s board </h3>
                        { !this.state.over ?
                        <DrawingBoard propcolor={this.state.color} canvasId='right' radius={this.state.radius}/> :
                            <div><h1> Time is up!</h1> </div>
                        }
                    </Col>
                </Row>
                <Row>
                        {/* {!this.state.over ? <div></div> : */}

                            <Grid>
                                <Row>
                                    <Col md={4}>
                                    <div style={{backgroundColor: 'white', width: '300'}}>
                                        <img id="center" style={{display:'inline', width: '300px', height: '300px'}} src={this.state.imgOne}></img>
                                    </div>
                                    </Col>
                                    <Col md={4}>
                                    <div style={{height: '300px', color: "white"}}id='appendhere'>
                                        <h1> &larr; {this.state.userOne}'s Score: {this.state.userOneScore}%</h1>
                                        <h1>{this.state.userTwo}'s Score: {this.state.userTwoScore}% &rarr;</h1>
                                        <form onSubmit={this.restart}>
                                        <button type="submit" style={{color: 'black'}}onClick={this.restart}>Play Again!</button>
                                        </form>
                                    </div>
                                    </Col>
                                    <Col md={4}>
                                    <div style={{backgroundColor: 'white', width: '300'}}>
                                    <img id="center" style={{display: 'inline', width: '300px', height: '300px'}} src={this.state.imgTwo}></img>
                                    </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                    <div style={{backgroundColor: 'white', width: '300'}}>
                                        <img id="center" style={{display:'inline', width: '300px', height: '300px'}} src={this.state.imgThree}></img>
                                    </div>
                                    </Col>
                                    <Col md={4}>
                                    <div style={{height: '300px', color: "white"}}id='appendhere'>
                                        <h1> &larr; {this.state.userOne}'s Score: {this.state.userOneScore}%</h1>
                                        <h1>{this.state.userTwo}'s Score: {this.state.userTwoScore}% &rarr;</h1>
                                        <form onSubmit={this.restart}>
                                        <button type="submit" style={{color: 'black'}}onClick={this.restart}>Play Again!</button>
                                        </form>
                                    </div>
                                    </Col>
                                    <Col md={4}>
                                    <div style={{backgroundColor: 'white', width: '300'}}>
                                    <img id="center" style={{display: 'inline', width: '300px', height: '300px'}} src={this.state.imgFour}></img>
                                    </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                    <div style={{backgroundColor: 'white', width: '300'}}>
                                        <img id="center" style={{display:'inline', width: '300px', height: '300px'}} src={this.state.imgOne}></img>
                                    </div>
                                    </Col>
                                    <Col md={4}>
                                    <div style={{height: '300px', color: "white"}}id='appendhere'>
                                        <h1> &larr; {this.state.userOne}'s Score: {this.state.userOneScore}%</h1>
                                        <h1>{this.state.userTwo}'s Score: {this.state.userTwoScore}% &rarr;</h1>
                                        <form onSubmit={this.restart}>
                                        <button type="submit" style={{color: 'black'}}onClick={this.restart}>Play Again!</button>
                                        </form>
                                    </div>
                                    </Col>
                                    <Col md={4}>
                                    <div style={{backgroundColor: 'white', width: '300'}}>
                                    <img id="center" style={{display: 'inline', width: '300px', height: '300px'}} src={this.state.imgTwo}></img>
                                    </div>
                                    </Col>
                                </Row>
                               
                            </Grid>

                        
                        
                </Row>
            </Grid>
            </div>

        )
    }
}
