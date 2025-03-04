import React from 'react';
import { useState, useEffect } from 'react';
import './styles.css';

const Ariane = () => {
  const [data, setData] = useState(['Efreiflix']);

  const push = (event) => {
    let datas = data.slice();
    datas.push(event.detail);
    setData(datas);
    window.removeEventListener('ariane-push', push);
    window.removeEventListener('ariane-pop', pop);
    window.removeEventListener('ariane-path', path);
  }

  const pop = (event) => {
    let datas = data.slice();
    datas.pop();
    setData(datas);
    window.removeEventListener('ariane-push', push);
    window.removeEventListener('ariane-pop', pop);
    window.removeEventListener('ariane-path', path);
  }

  const path = (event) => {
    console.log(event.detail)
    let datas = event.detail;
    setData(datas);
    window.removeEventListener('ariane-push', push);
    window.removeEventListener('ariane-pop', pop);
    window.removeEventListener('ariane-path', path);
  }

  window.addEventListener('ariane-push', push);
  window.addEventListener('ariane-pop', pop);
  window.addEventListener('ariane-path', path);

  return (
    <div className='ariane-box'>
      {data.map((item, index) =>
        data.length - 1 !== index ? (
          <>
            <p>{item}</p>
            <p>-</p>
          </>
        ) : (
          <p className="ariane-current">{item}</p>
        )
      )}

    </div>
  );
};

export default Ariane; 