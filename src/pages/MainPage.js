import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Spinner, Image, FormCheck } from 'react-bootstrap'
import MyDropZone from '../components/MyDropZone'
import InputSlider from '../components/Slider'
import cat from '../img/cat.jpeg'
import ReactCrop from 'react-image-crop';
import DEMO_B64 from '../img/demoSalSeg'

function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
  
    // New lines to be added
    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";
  
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
  
    // As Base64 string
    const base64Image = canvas.toDataURL("image/jpeg");
    return base64Image;
  
    // // As a blob
    // return new Promise((resolve, reject) => {
    //   canvas.toBlob(
    //     (blob) => {
    //       blob.name = fileName;
    //       resolve(blob);
    //     },
    //     "image/jpeg",
    //     1
    //   );
    // });
  }

  
function MainPage() {

    const [ssState, setssState] = useState({'ssImg':`data:image/png;base64,${DEMO_B64}`, 'peaks':{x:137, y:69, x1:91, y1: 12, x2:97, y2: 176}})
    const [results, setsResults] = useState([[0.02313090875122586, [137, 22, 387, 322]]])
    const [resultsImg, setsResultsImg] = useState([])

    const [files, setFiles] = useState([{
        file: cat,
        preview: cat,
        width: 480,
        height: 360,
    }]);
    const [width, setWidth] = useState(250);
    const [height, setHeight] = useState(300);
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

    useEffect(() => {
        console.log("EFFECT");
        window.Caman(`#SEG`, ssState.ssImg, function () {
            this["channel2"](0);
            this.render();
          });

          window.Caman(`#SAL`, ssState.ssImg, function () {
            this["channel3"](0);
            this.render();
          });

    }, [ssState, debug])

    useEffect(() => {
            Promise.all(results.map(async (res,i) => {
                // const image = files[0] && files[0].preview
                const image = document.getElementById('SRC')
                const croppedImg = await getCroppedImg(image, res2crop(res), "res"+i+".jpeg")
                return {
                    score: res[0], 
                    img: croppedImg,
                }
            })).then( (res) => {
                console.log(res)
                setsResultsImg(res)
            })
    }, [results])


    const cropClicked = () => {
        setBtnLoadingState(true)
        // make asynchronous call
        setTimeout(() => {
            setBtnLoadingState(false)
        }, 3000)
      }

    const res2crop = (res) => {
        var [x1,y1,x2,y2] = res[1]  
        var crop ={
            unit: 'px',
            width: x2-x1,
            height: y2-y1,
            x: x1,
            y: y1
        }
        console.log(crop)
        return crop
    }

    const ResultImages = () => {
        return (
            <Row>
                {resultsImg.map((res, i) => 
                    <Col key={"RES"+i} xs={4}>
                        <p class="text-center">{res.score}</p>
                        <Image id={"RES"+i}
                            fluid
                            src={res.img} 
                        />
                    </Col>
                    )
                }
            </Row>
        )

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
                <FormCheck inline label="debug" checked={debug} onChange={(e) => setDebug(e.target.checked)}/>
                </Col>
            </Row>

            { debug && 
            <div>
                <Row >
                    <Col xs={4}>
                        <p class="text-center">INPUT</p>
                    </Col> 
                    <Col xs={4}>
                        <p class="text-center">SALIENCY</p>
                    </Col> 
                    <Col xs={4}>
                        <p class="text-center">SEGMENTATION</p>
                    </Col> 
                </Row>
                <Row >
                    <Col xs={4} style={imageCellStyle}>
                        <Image
                            fluid
                            src={files[0] && files[0].preview}
                        />
                    </Col>
                    <Col xs={4} style={imageCellStyle}>
                        <Image id={"SAL"}
                            fluid
                            src={ssState.ssImg}
                        />
                    </Col>
                    <Col xs={4} style={imageCellStyle}>
                        <Image id={"SEG"}
                            fluid
                            src={ssState.ssImg}
                        />
                    </Col>
                </Row>
            </div>
            }
            <ResultImages/>
        </Container>
    )
}

const imageCellStyle = {
    display: 'flex',
    justifyContent: 'center', 
    alignItems: 'center', 
    height: "auto",
}


export default MainPage

