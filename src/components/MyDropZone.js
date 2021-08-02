import React, {useMemo} from 'react';
import {useDropzone} from 'react-dropzone';
import {Image as BSImage} from 'react-bootstrap'
import reactImageSize from 'react-image-size';

function MyDropZone({files, setFiles}) {

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
      accept: 'image/*',
      onDrop: acceptedFiles => {
        const file = acceptedFiles[0]
        const url = URL.createObjectURL(file)
        console.log(url)
        reactImageSize(url)
            .then(({ width, height }) => {
                setFiles([{
                    file: file,
                    preview: url,
                    width,
                    height,
                }])        
            })
      },
    });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const preview = files.map((file, i)=> (
    <div key={file.name} style={thumb} >
      <div style={thumbInner}>
      <BSImage id={"SRC"} src={file.preview} fluid />
        <p style={thumbDim}> {file.width} x {file.height}</p>
      </div>
    </div>
  ));

  return (
    <div >
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        {preview}
      </div>
    </div>
  );
}

const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: 'gray',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: 'gray',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const activeStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    // borderColor: '#00e676'
    borderColor: '#2196f3'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };
  

const thumb = {
    display: 'inline-flex',
    width: '80%',
    maxWidth: 600,
    height: 'auto',
    padding: 4,
    boxSizing: 'border-box',
    justifyContent: 'center',
  };

  const thumbInner = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const thumbDim = {
      color: 'black',
      margin: 0,
  }
  
export default MyDropZone