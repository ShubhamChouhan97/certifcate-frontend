import React, { useEffect, useState } from 'react';
import style from './style.module.css';
import io from 'socket.io-client';
const socket = io('https://certifcate-backend.onrender.com');
import ProgressBar from '../ProgressBar/index.jsx';
function Table({length ,batchId}) {
  const [Total, setTotal] = useState(length);
  const [certificates, setCertificates] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTotal(prev => prev + length);
  }, [batchId]);

  useEffect(() => {
    const handleCertificateGenerated = (cert) => {
      setCount((prev) => prev + 1);
    //  console.log('Certificate created:', cert);
      setCertificates((prev) => [...prev, cert]);
    };
  
    socket.on('certificate-generated', handleCertificateGenerated);
    return () => {
      socket.off('certificate-generated', handleCertificateGenerated);
    };
  }, []);
  const handleView = (path) => {
    window.open(`https://certifcate-backend.onrender.com${path}`, '_blank');
  };

  const handleDownload = async (path, fileName) => {
    try {
      const response = await fetch(`https://certifcate-backend.onrender.com${path}`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDownloadAll = async () => {
    for (const cert of certificates) {
      await handleDownload(cert.path, cert.fileName);
    }
  };
const progressPercent = Total === 0 ? 0 : (count / Total) * 100;
  return (
    <div className={style.main}>
    <div className={style.detail}>
    <h3>Total Generated : {count}/{Total}</h3>
    <h3> BatchId :{batchId}</h3>
   <ProgressBar progress={progressPercent} />
   </div>
      <div className={style.tablediv}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Sr No</th>
              <th>Name</th>
              <th>Certificate Id</th>
              <th>View Certificate</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{cert.name}</td>
                <td>{cert.certificateId}</td>
                <td>
                  <button className={style.download} onClick={() => handleView(cert.path)}>
                    View
                  </button>
                </td>
                <td>
                  <button className={style.download} onClick={() => handleDownload(cert.path, cert.fileName)}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
            {certificates.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                  No certificates generated yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {certificates.length > 0 && (
        <button className={style.downall} onClick={handleDownloadAll}>
          Download all
        </button>
      )}
    </div>
  );
}

export default Table;
