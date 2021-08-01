import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Spinner, ToggleButton, Image, FormCheck } from 'react-bootstrap'
import Dropzone from 'react-dropzone'
import MyDropZone from '../components/MyDropZone'
import InputSlider from '../components/Slider'
import cat from '../img/cat.jpeg'

const b64 = "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"

function MainPage() {
    
    const [alert, setAlert] = useState(false)
    const [ssState, setssState] = useState({'sal':null, 'seg':null, 'peaks':null})

    const [files, setFiles] = useState([{
        file: cat,
        preview: cat,
        width: 480,
        height: 360,
    }]);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [btnLoadingState, setBtnLoadingState] = useState(false)
    const [debug, setDebug] = useState(false)

    const onNewImageDrop = (newState) => {
        setFiles(newState)
        setWidth(0)
        setHeight(0)
    }

    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
      }, [files]);

    const cropClicked = () => {
        setBtnLoadingState(true)
        // make asynchronous call
        setTimeout(() => {
            setBtnLoadingState(false)
        }, 3000)
      }

    return (
        <Container className="mt-3">
            < MyDropZone files ={files} setFiles={onNewImageDrop}/>
            <InputSlider 
                name="Width"
                value={width}
                setValue={setWidth}
                maximum={files[0] && files[0].width}
            />
            <InputSlider
                name="Height"
                value={height}
                setValue={setHeight}
                maximum={files[0] && files[0].height}
            />
            
            <Row className="justify-content-center align-items-center">
                <Col xs={"auto"}>
                <Button 
                    variant="primary" 
                    onClick={cropClicked}
                    >
                { btnLoadingState && <Spinner
                        as="span"
                        animation="grow"
                        size="sm"
                        role="status"
                        aria-hidden="false"
                    />
                }
                {btnLoadingState ? 'Croping...' : 'Crop'}
                </Button>
                </Col>
                {btnLoadingState && <Col xs={"auto"}>est: 10sec</Col> }
                <Col xs={"auto"}>
                <FormCheck inline label="debug" onChange={(e) => setDebug(e.target.checked)}/>
                </Col>
            </Row>


            <Row >
                <p>State: DEBUG {debug ? "True" : "False"}</p>
                <p>State: Input {files[0] && files[0].preview}</p>
                <p>State: Size {width} x {height} </p>
                <p>State: Loading {btnLoadingState ? "True" : "False"}</p>
            </Row>
            <Row>
                <Col xs={4} style={imageCellStyle}>
                    <Image
                        fluid
                        src={files[0] && files[0].preview}
                    />
                </Col>
                <Col xs={4} style={imageCellStyle}>
                    <Image
                        fluid
                        src={`data:image/jpeg;base64,${b64}`}
                    />
                </Col>
                <Col xs={4} style={imageCellStyle}>
                    <Image
                        fluid
                        src={`data:image/jpeg;base64,${b64}`}
                    />
                </Col>
            </Row>

            <Row >
                <p>Result</p>
            </Row>
        </Container>
    )
}

const imageCellStyle = {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
}

export default MainPage

