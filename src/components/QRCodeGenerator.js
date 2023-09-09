import React, { useState, useEffect, useCallback } from 'react';
import { saveAs } from 'file-saver';
const QRCode = require('qrcode');

function QRCodeGenerator() {
  const [data, setData] = useState('');
  const [width, setWidth] = useState(128);
  const [height, setHeight] = useState(128);
  const [format, setFormat] = useState('png');
  const [qrColor, setQRColor] = useState('#000000');
  const [bgColor, setBGColor] = useState('#ffffff');
  const [qrCodeDataURL, setQRCodeDataURL] = useState('');

  const generateQRCode = useCallback(() => {
    const qrOptions = {
      width,
      height,
      color: {
        dark: qrColor,
        light: bgColor,
      },
    };

    try {
      if (!data) {
        setQRCodeDataURL(''); // Clear the QR code if there's no input
      return;
      }

      QRCode.toDataURL(data, qrOptions, function (err, url) {
        if (err) {
          console.error('Error generating QR code:', err);
        } else {
          setQRCodeDataURL(url);
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error.message);
    }
  }, [data, width, height, qrColor, bgColor]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  const downloadQRCode = () => {
    if (!qrCodeDataURL) return;

    const blob = dataURLtoBlob(qrCodeDataURL);
    saveAs(blob, `qrcode.${format}`);
  };

  const dataURLtoBlob = (dataURL) => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  return (
    <div className='container'>
    <div className='card' style={{ width: '24rem' }}>
      <div className='card-body'>
        <h1 className='card-title'>QR Code Generator</h1>
        <div className='row'>
          <div className='col-md-6'>
            <form>
              <div className='mb-3'>
                <label htmlFor='data' className='form-label'>
                  Enter the data:
                </label>
                <input
                  id='data'
                  className='form-control'
                  type='text'
                  placeholder='Enter data'
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='width' className='form-label'>
                  Width:
                </label>
                <input
                  id='width'
                  className='form-control'
                  type='number'
                  placeholder='Width'
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='height' className='form-label'>
                  Height:
                </label>
                <input
                  id='height'
                  className='form-control'
                  type='number'
                  placeholder='Height'
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='format' className='form-label'>
                  Select Format:
                </label>
                <select
                  id='format'
                  className='form-select'
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                >
                  <option value='png'>PNG</option>
                  <option value='jpg'>JPG</option>
                  <option value='svg'>SVG</option>
                </select>
              </div>
              <div className='mb-3'>
                <label htmlFor='qrColor' className='form-label'>
                  QR color:
                </label>
                <input
                  id='qrColor'
                  className='form-control'
                  type='color'
                  value={qrColor}
                  onChange={(e) => setQRColor(e.target.value)}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='bgColor' className='form-label'>
                  Background color:
                </label>
                <input
                  id='bgColor'
                  className='form-control'
                  type='color'
                  value={bgColor}
                  onChange={(e) => setBGColor(e.target.value)}
                />
              </div>
              <button
                type='button'
                onClick={downloadQRCode}
                className='btn btn-primary'
              >
                Download
              </button>
            </form>
          </div>
          <div className='col-md-6'>
            {qrCodeDataURL && (
              <img
                src={qrCodeDataURL}
                alt='QR Code'
                className='img-fluid'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}
export default QRCodeGenerator;


