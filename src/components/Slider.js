import React from 'react';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import { Col, Row } from 'react-bootstrap'

export default function InputSlider({name, value, setValue, maximum}) {    
    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
    };
    
    const handleInputChange = (event) => {
        var value = event.target.value === '' ? '' : Number(event.target.value)
        value = Math.min(value, maximum)
        setValue(value);
    };

    return (
        <Row style={{paddingTop: 40}}>
            <Col xs={2}>
                {name}
            </Col>
            <Col xs={2}>
                <Input
                disabled={maximum == null}
                value={value}
                margin="dense"
                onChange={handleInputChange}
                inputProps={{
                    step: 10,
                    min: 0,
                    max: 100,
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                }}
                />
            </Col>
            <Col>
                <Slider
                disabled={maximum == null}
                value={typeof value === 'number' ? value : 0}
                onChange={handleSliderChange}
                aria-labelledby="input-slider"
                max={maximum}
                valueLabelDisplay="on"
                />
            </Col>
        </Row>
        );
    }