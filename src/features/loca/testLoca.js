import React, { useEffect, useRef } from 'react';

const AddressFormWithMap = () => {
  const formRef = useRef(null);

  useEffect(() => {
    // Load Longdo Map script
    const script = document.createElement('script');
    script.src = 'https://api.longdo.com/map/?key=' + process.env.API_KEY;
    script.async = true;
    script.onload = () => initializeMap();
    document.body.appendChild(script);

    // Load AddressForm script
    const addressScript = document.createElement('script');
    addressScript.src = 'https://api.longdo.com/address-form/js/addressform.js';
    addressScript.async = true;
    document.body.appendChild(addressScript);

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(addressScript);
    };
  }, []);

  const initializeMap = () => {
    if (window.longdo) {
      formRef.current = new window.longdo.AddressForm('form_div', {
        map: 'map_div', // id of map div
        showLabels: false,
        debugDiv: 'debugoutput'
      });
    }
  };

  const handleSubmit = () => {
    if (formRef.current) {
      const formData = formRef.current.getFormJSON();
      console.log('Form Data:', formData);
    }
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.resetForm();
    }
  };

  return (
    <div style={{ display: 'inline-block', verticalAlign: 'top' }}>
      <div id="form_div" style={{ width: '320px', border: 'solid 2px' }}>
        Loading...
      </div>
      <button onClick={handleSubmit} style={{ marginTop: '1rem' }}>
        Submit
      </button>
      <button onClick={handleReset} style={{ marginTop: '1rem' }}>
        Reset
      </button>
      <div
        id="debugoutput"
        style={{
          maxWidth: '18rem',
          backgroundColor: '#fff39c',
          padding: '0.5rem',
          borderRadius: '6px',
          verticalAlign: 'top',
          marginTop: '1rem'
        }}
      >
        ลองกรอกข้อมูลในฟอร์ม หรือลากหมุดบนแผนที่
      </div>

      {/* Map div */}
      <div
        id="map_div"
        style={{ width: '350px', height: '350px', display: 'inline-block' }}
      ></div>
    </div>
  );
};

export default AddressFormWithMap;
