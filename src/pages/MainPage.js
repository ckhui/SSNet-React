import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Spinner, Image, FormCheck } from 'react-bootstrap'
import MyDropZone from '../components/MyDropZone'
import InputSlider from '../components/Slider'
import cat from '../img/cat.jpeg'
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

function cropRequestOptionFull(image_file, crop_w, crop_h) {
    var formdata = new FormData();
    formdata.append("input", image_file);
    formdata.append("crop_w", crop_w);
    formdata.append("crop_h", crop_h);

    var requestOptions = {
        method: 'POST',
        body: formdata,
      };
    return requestOptions
}

function cropRequestOptionSS(segsalb64, peak_bb, img_w, img_h, crop_w, crop_h) {
    var data = {
        "sal_seg": segsalb64,
        "peak_bb": peak_bb,
        "img_w": img_w,
        "img_h": img_h,
        "crop_w": crop_w,
        "crop_h": crop_h,
    }

    var requestOptions = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
          },
      };
    return requestOptions
}


function MainPage() {
    const [ssState, setssState] = useState({'ssImg':`data:image/png;base64,${DEMO_B64}`, 'peaks_bb':[{"peak": [137,69], "rect": [91,12,97,176]}] })
    const [results, setsResults] = useState([{ 'score':0.02313090875122586, 'rect':[137, 22, 387, 322]}])
    const [resultsImg, setsResultsImg] = useState([])

    const [files, setFiles] = useState([{
        file: cat,
        preview: cat,
        width: 480,
        height: 360,
    }]);
    const [width, setWidth] = useState(250);
    const [height, setHeight] = useState(300);
    const [time, setTime] = useState(0);
    const [btnLoadingState, setBtnLoadingState] = useState(false)
    const [debug, setDebug] = useState(false)

    const onNewImageDrop = (newState) => {
        setFiles(newState)
        setssState({})
        setsResults([])
        setsResultsImg([])
        setTime(0)
        var w = (newState[0] && newState[0].width) || 1
        var h = (newState[0] && newState[0].height) || 1
        setWidth(Math.round(w / 2))
        setHeight(Math.round(h / 2))
    }

    
    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
      }, [files]);

    useEffect(() => {
        if (!debug) { return }
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
                    score: res.score, 
                    img: croppedImg,
                }
            })).then( (res) => {
                setsResultsImg(res)
            })
    }, [results])


    const cropClicked = () => {

        setBtnLoadingState(true)

        if (ssState.ssImg) {
            var img_w = files[0] && files[0].width
            var img_h = files[0] && files[0].height
            var opt = cropRequestOptionSS(ssState.ssImg, ssState.peaks_bb, img_w, img_h, width, height)
            fetch('http://localhost:5000/sscrop', opt)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.err) {
                    window.alert(data.err);
                } else {
                    setsResults(data.results)
                    setTime(data.time)
                }
                setBtnLoadingState(false)
            }).catch(err => {
                console.log(err)
                setBtnLoadingState(false)
            })
        } else {
            var opt = cropRequestOptionFull(files[0].file, width, height)
            fetch('http://localhost:5000/sspredict', opt)
            .then(response => response.json())
            .then(data => {
                // console.log(data)
                if (data.err) {
                    window.alert(data.err);
                } else {
                    setssState({'ssImg':`data:image/png;base64,${data.sal_seg}`, 'peaks_bb':data.peaks_bb })
                    setsResults(data.results)
                    setTime(data.time)
                }
                setBtnLoadingState(false)
            }).catch(err => {
                console.log(err)
                setBtnLoadingState(false)
            })
        }

        
      }

    const res2crop = (res) => {
        var [x1,y1,x2,y2] = res.rect 
        var crop ={
            unit: 'px',
            width: x2-x1,
            height: y2-y1,
            x: x1,
            y: y1
        }
        return crop
    }

    const ResultImages = () => {
        return (
            <Row>
                {resultsImg.map((res, i) => 
                    <Col key={"RES"+i} xs={4} >
                        <p class="text-center">{res.score}</p>
                        <div style={imageCellStyle}>
                            <Image id={"RES"+i}
                                fluid
                                src={res.img} 
                            />
                        </div>
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
            
            <Row>
            <p class="text-center">Time Taken: {time.toFixed(5)} sec</p>
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

