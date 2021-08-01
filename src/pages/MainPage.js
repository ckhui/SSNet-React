import React, { useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import {useDropzone} from 'react-dropzone'

function MainPage() {
    
    const [img, setImg] = useState(null)
    const [debug, setDebug] = useState(false)
    const [alert, setAlert] = useState(false)
    const [ssState, setssState] = useState({'sal':null, 'seg':null, 'peaks':null})
    
    return (
        <Container className="justify-content-md-center">
            <Row >
                <p>Drop Zone</p>
            </Row>
            <Row >
                <p>Image Viewer</p>
            </Row>
            <Row >
                <p>Sliders</p>
            </Row>
            <Row >
                <p>Crop Btn</p>
                <p>Debug Switch</p>
            </Row>
            <Row >
                <p>SS View</p>
                <p>SS View</p>
            </Row>
            <Row >
                <p>Result</p>
            </Row>
        </Container>
    )
}

export default MainPage

