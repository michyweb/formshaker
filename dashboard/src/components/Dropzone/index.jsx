import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useDropzone } from 'react-dropzone'

import { storeFiles } from './actions'

const Dropzone = (props) => {
  const [files, setFiles] = useState([])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: acceptedFiles => {
      const form = new FormData()
      acceptedFiles.map(file => {
        form.append('evidences', file, file.name)
        return null
      })
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })))
    }
  })

  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  function getDataUrl (file) {
    return new Promise(resolve => {
      const file = files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve({
          content: reader.result,
          contentType: file.type,
          fileName: file.name
        })
      }
      reader.readAsDataURL(file)
    })
  }

  if (files.length > 0) {
    getDataUrl(files).then((response) => {
      props.storeFiles({
        value: response.content.split('base64,')[1],
        contentType: response.contentType,
        fileName: response.fileName
      })
    })
  }

  return (
    <section className='container'>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input
          {...getInputProps()}
        />
        <p>Arrastra los archivos aquí, o haz click para seleccionar</p>
      </div>
      {files.length > 0
        ? <div style={{ textAlign: 'center' }}>
          <img src={files[0].preview} alt='' style={{ height: 50, width: 50 }} />
        </div> // eslint-disable-line
        : null}
    </section>
  )
}

const bindActions = dispatch => ({
  storeFiles: file => dispatch(storeFiles(file))
})

export default connect(null, bindActions)(Dropzone)
