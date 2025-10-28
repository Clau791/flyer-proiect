import React, { useState, useRef } from 'react';

// --- Loader Component (Spinner) ---
const Loader = () => (
  <svg
    className="animate-spin h-6 w-6 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// --- HexLogo Component ---
const HexLogo = ({ className = 'w-16 h-16' }) => (
  <svg
    className={className}
    viewBox="0 0 100 115"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M50 0L93.3 25V75L50 100L6.7 75V25L50 0Z" fill="#FFFFFF" />
    <path
      d="M50 6.9282L88.9711 30.1345V79.8655L50 103.072L11.0289 79.8655V30.1345L50 6.9282Z"
      fill="#0B2349"
    />
    <path
      d="M62.5 37.5L50 62.5L37.5 37.5"
      stroke="#E5732A"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M75 25V50L62.5 75"
      stroke="#E5732A"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25 25V50L37.5 75"
      stroke="#FFFFFF"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// --- Draggable Component Wrapper ---
const DraggableElement = ({ id, position, onDrag, children, className = '' }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      onDrag(id, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <div
      className={`absolute ${className} ${isDragging ? 'cursor-grabbing z-50' : 'cursor-grab'}`}
      style={{
        zIndex: 1, 
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.1s ease'
      }}
      onMouseDown={handleMouseDown}
    >
      {children}
    </div>
  );
};

// --- Flyer Component with Draggable Elements ---
const FlyerComponent = React.forwardRef(({
  title,
  subtitle,
  year,
  qrText,
  poweredByText,
  logoLine1,
  logoLine2,
  uploadedLogo,
  selectedImage,
  defaultBgStyle,
  elementPositions,
  onElementDrag
}, ref) => {
  return (
    <div ref={ref} className="w-full space-y-6">
      {/* FRONT SIDE */}
      <div className="w-full">
        <h3 className="text-2xl font-bold mb-2 text-white">Front</h3>
        <div
          id="flyer-front"
          className="w-full mx-auto text-white font-sans rounded-lg shadow-2xl overflow-hidden relative"
          style={{
            ...defaultBgStyle,
            backgroundImage: selectedImage ? `url(${selectedImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            aspectRatio: '1 / 1',
            width: '400px',
            height: '400px'
          }}
        >
          {/* Header Front - Draggable */}
          <DraggableElement
            id="header-top"
            position={elementPositions['header-top']}
            onDrag={onElementDrag}
          >
            <div className="text-left text-white">
              <span className="block font-extrabold text-2xl tracking-tight leading-tight">
                {title}
              </span>
              <span className="block font-light text-xl tracking-tight leading-tight mt-1">
                {subtitle}{' '}
                <span className="font-bold text-orange-500">{year}</span>
              </span>
            </div>
          </DraggableElement>

          {/* Logo Front - Draggable */}
          <DraggableElement
            id="logo-top"
            position={elementPositions['logo-top']}
            onDrag={onElementDrag}
          >
            {uploadedLogo ? (
              <img src={uploadedLogo} alt="Logo" className="w-14 h-14 object-contain rounded-md" />
            ) : (
              <HexLogo className="w-14 h-14" />
            )}
          </DraggableElement>

          {/* QR Code */}
          <div 
            className="absolute flex flex-col items-center pointer-events-none"
            style={{
              left: '100px',
              top: '140px',
              zIndex: 51
            }}
          >
            <img
              src="https://placehold.co/140x140/FFFFFF/000000?text=QR+Code"
              alt="QR Code"
              className="w-32 h-32 rounded-md border-4 border-white shadow-lg"
            />
            <p className="mt-3 text-xs text-gray-200 text-center px-4 leading-snug max-w-[200px]">
              {qrText}
            </p>
          </div>

          {/* Footer Front - Draggable */}
          <DraggableElement
            id="footer-top"
            position={elementPositions['footer-top']}
            onDrag={onElementDrag}
          >
            <div className="text-center text-white">
              <p className="text-xs text-gray-300 mb-1">
                {poweredByText}
              </p>
              <div className="flex items-baseline justify-center">
                <span
                  className="font-bold text-2xl italic"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {logoLine1}
                </span>
                <span
                  className="font-light text-2xl ml-1"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {logoLine2}
                </span>
              </div>
            </div>
          </DraggableElement>
        </div>
      </div>

      {/* BACK SIDE */}
      <div className="w-full">
        <h3 className="text-2xl font-bold mb-2 text-white">Back</h3>
        <div
          id="flyer-back"
          className="w-full mx-auto text-white font-sans rounded-lg shadow-2xl overflow-hidden relative"
          style={{
            ...defaultBgStyle,
            backgroundImage: selectedImage ? `url(${selectedImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            aspectRatio: '1 / 1',
            width: '400px',
            height: '400px'
          }}
        >
          {/* Header Back - Draggable */}
          <DraggableElement
            id="header-bottom"
            position={elementPositions['header-bottom']}
            onDrag={onElementDrag}
          >
            <div className="text-left text-white">
              <span className="block font-extrabold text-2xl tracking-tight leading-tight">
                {title}
              </span>
              <span className="block font-light text-xl tracking-tight leading-tight mt-1">
                {subtitle}{' '}
                <span className="font-bold text-orange-500">{year}</span>
              </span>
            </div>
          </DraggableElement>

          {/* Logo Back - Draggable */}
          <DraggableElement
            id="logo-bottom"
            position={elementPositions['logo-bottom']}
            onDrag={onElementDrag}
          >
            {uploadedLogo ? (
              <img src={uploadedLogo} alt="Logo" className="w-14 h-14 object-contain rounded-md" />
            ) : (
              <HexLogo className="w-14 h-14" />
            )}
          </DraggableElement>

          {/* White Space - NON-DRAGGABLE (FIXED) */}
          <div 
            className="absolute w-9/10 h-52 bg-white/90 rounded-md shadow-inner flex items-center justify-center pointer-events-none"
            style={{
              zIndex: 51,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <span className="text-gray-500 text-sm font-medium">Space for notes</span>
          </div>

          {/* Footer Back - Draggable */}
          <DraggableElement
            id="footer-bottom"
            position={elementPositions['footer-bottom']}
            onDrag={onElementDrag}
          >
            <div className="text-center text-white">
              <p className="text-xs text-gray-300 mb-1">
                {poweredByText}
              </p>
              <div className="flex items-baseline justify-center">
                <span
                  className="font-bold text-2xl italic"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {logoLine1}
                </span>
                <span
                  className="font-light text-2xl ml-1"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {logoLine2}
                </span>
              </div>
            </div>
          </DraggableElement>
        </div>
      </div>
    </div>
  );
});

// --- Main App Component ---
export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [defaultBgStyle, setDefaultBgStyle] = useState({
    backgroundColor: '#0B2349',
  });
  const [userPrompt, setUserPrompt] = useState(
    'Abstract geometric background pattern, high-tech datacenter aesthetic, shades of blue, dark blue, white, and grey'
  );
  

  
const [selectedForDownload, setSelectedForDownload] = useState(false);

// FuncÈ›ia pentru "Choose this design"      => trimite datele cÄƒtre backend
const handleChooseDesign = async () => {
  setSelectedForDownload(true);
  
  try {
    const flyerData = {
      title,
      subtitle,
      year,
      qrText,
      poweredByText,
      logoLine1,
      logoLine2,
      backgroundImage: selectedImage,
      uploadedLogo: uploadedLogo,
      elementPositions: elementPositions
    };

    const response = await fetch('https://your-backend-api.com/api/save-design', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flyerData: flyerData
      })
    });

    if (!response.ok) {
      throw new Error('Error saving design');
    }

    const result = await response.json();
    console.log('Design saved:', result);
    
  } catch (err) {
    console.error('Error:', err);
    setError('Could not save design. Please try again.');
  } finally {
    setSelectedForDownload(false);
  }
};
  const [title, setTitle] = useState('Title');
  const [subtitle, setSubtitle] = useState('Subtitle');
  const [year, setYear] = useState('2025');
  const [qrText, setQrText] = useState('Scan the QR code for the event Agenda');
  const [poweredByText, setPoweredByText] = useState('POWERED BY');
  const [logoLine1, setLogoLine1] = useState('Partner');
  const [logoLine2, setLogoLine2] = useState(' Name');
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [uploadedBackground, setUploadedBackground] = useState(null);

  const flyerRef = useRef(null);

  // PoziÈ›iile iniÈ›iale ale elementelor
  const [elementPositions, setElementPositions] = useState({
    'header-top': { x: 20, y: 24 },
    'logo-top': { x: 310, y: 20 },
    'footer-top': { x: 100, y: 350 },
    'header-bottom': { x: 20, y: 24 },
    'logo-bottom': { x: 310, y: 20 },
    'footer-bottom': { x: 100, y: 350 }
  });

  // State pentru trimitere email
  const [emailAddress, setEmailAddress] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const handleElementDrag = (id, newPosition) => {
    setElementPositions(prev => ({
      ...prev,
      [id]: newPosition
    }));
  };

  const resetPositions = () => {
    setElementPositions({
      'header-top': { x: 20, y: 24 },
      'logo-top': { x: 310, y: 20 },
      'footer-top': { x: 100, y: 350 },
      'header-bottom': { x: 20, y: 24 },
      'logo-bottom': { x: 310, y: 20 },
      'footer-bottom': { x: 100, y: 350 }
    });
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Target aspect ratio is 1:1 (square)
          const size = Math.min(img.width, img.height);
          
          let sourceX = 0;
          let sourceY = 0;
          
          // Center crop to square
          if (img.width > img.height) {
            sourceX = (img.width - size) / 2;
          } else {
            sourceY = (img.height - size) / 2;
          }
          
          // Set canvas to 400x400 (square)
          canvas.width = 400;
          canvas.height = 400;
          
          // Draw cropped square image
          ctx.drawImage(
            img,
            sourceX, sourceY, size, size,
            0, 0, canvas.width, canvas.height
          );
          
          const croppedImage = canvas.toDataURL('image/png');
          setUploadedBackground(croppedImage);
          setSelectedImage(croppedImage);
          setDefaultBgStyle(null);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  // FuncÈ›ie pentru download local (folosind print to PDF sau screenshot nativ browser)
  const handleDownload = () => {
    // OpÈ›iune 1: Deschide dialog de print (user poate salva ca PDF)
    window.print();
  };

  // FuncÈ›ie pentru trimitere pe email cÄƒtre backend
  const handleSendEmail = async () => {
    if (!emailAddress.trim()) {
      setError('VÄƒ rugÄƒm sÄƒ introduceÈ›i o adresÄƒ de email validÄƒ.');
      return;
    }

    setSendingEmail(true);
    setError(null);
    setEmailSuccess(false);

    try {
      // PregÄƒteÈ™te datele pentru backend
      const flyerData = {
        title,
        subtitle,
        year,
        qrText,
        poweredByText,
        logoLine1,
        logoLine2,
        backgroundImage: selectedImage,
        uploadedLogo: uploadedLogo,
        elementPositions: elementPositions
      };

      // Trimite request cÄƒtre backend
      // ÃŽNLOCUIEÈ˜TE URL-ul cu adresa ta de backend
      const response = await fetch('https://your-backend-api.com/api/send-flyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          flyerData: flyerData
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la trimiterea email-ului');
      }

      const result = await response.json();
      console.log('RÄƒspuns backend:', result);

      setEmailSuccess(true);
      setEmailAddress('');
      
      // È˜terge mesajul de succes dupÄƒ 5 secunde
      setTimeout(() => {
        setEmailSuccess(false);
      }, 5000);

    } catch (err) {
      console.error('Eroare la trimiterea email-ului:', err);
      setError(err.message || 'Nu s-a putut trimite email-ul. VÄƒ rugÄƒm sÄƒ reÃ®ncercaÈ›i.');
    } finally {
      setSendingEmail(false);
    }
  };

  const generateImages = async () => {
    setLoading(true);
    setError(null);

    if (!userPrompt.trim()) {
      setError('Please enter an image theme (prompt).');
      setLoading(false);
      return;
    }

    setGeneratedImages([]);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

    const payload = {
      instances: [{ prompt: userPrompt }],
      parameters: { sampleCount: 4 },
    };

    let attempt = 0;
    const maxAttempts = 5;

    while (attempt < maxAttempts) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.status === 429 || response.status >= 500) {
          const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
          await sleep(delay);
          attempt++;
          continue;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message ||
              `Request failed with status ${response.status}`
          );
        }

        const result = await response.json();
        if (result.predictions && result.predictions.length > 0) {
          const imageUrls = result.predictions.map(
            (pred) => `data:image/png;base64,${pred.bytesBase64Encoded}`
          );
          setGeneratedImages(imageUrls);
          setSelectedImage(imageUrls[0]);
          setDefaultBgStyle(null);
        } else {
          throw new Error('No images were generated.');
        }
        break;
      } catch (err) {
        if (attempt >= maxAttempts - 1) {
          console.error(err);
          setError(
            err.message ||
              'An error occurred while generating images. Please try again.'
          );
          break;
        }
        attempt++;
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await sleep(delay);
      }
    }
    setLoading(false);
  };

  const handleSelectImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setDefaultBgStyle(null);
  };


  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-900 text-white font-sans p-4 md:p-8">
      <div className="flex flex-col lg:flex-row w-full max-w-7xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Flyer Preview */}
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center p-6 md:p-8 bg-gray-750">
          <div className="flex items-center justify-center w-full mb-4">
            <h1 className="text-2xl font-bold">
              Create your custom Badge 
            </h1>

          </div>
          <p className="text-xl text-white mb-4 text-center">
             Drag elements to reposition them on the badge preview.
          </p>
          <FlyerComponent
            ref={flyerRef}
            title={title}
            subtitle={subtitle}
            year={year}
            qrText={qrText}
            poweredByText={poweredByText}
            logoLine1={logoLine1}
            logoLine2={logoLine2}
            uploadedLogo={uploadedLogo}
            selectedImage={selectedImage}
            defaultBgStyle={defaultBgStyle}
            elementPositions={elementPositions}
            onElementDrag={handleElementDrag}
          />


        </div>

        {/* Controls */}
        <div className="w-full lg:w-3/5 p-6 md:p-8 overflow-y-auto" style={{ maxHeight: '90vh' }}>
                      
          {/* Text Customization */}
          <div className="bg-gray-700 p-5 rounded-lg mb-6">
            <h2 className="text-xl font-bold mb-4">
              1. Customize Text
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title-input" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input id="title-input" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>
              <div>
                <label htmlFor="subtitle-input" className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label>
                <input id="subtitle-input" type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>
              <div>
                <label htmlFor="year-input" className="block text-sm font-medium text-gray-300 mb-1">Year</label>
                <input id="year-input" type="text" value={year} onChange={(e) => setYear(e.target.value)} className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>
              {/* <div>
                <label htmlFor="qr-text-input" className="block text-sm font-medium text-gray-300 mb-1">Text QR</label>
                <input id="qr-text-input" type="text" value={qrText} onChange={(e) => setQrText(e.target.value)} className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div> */}
              <div>
                <label htmlFor="powered-input" className="block text-sm font-medium text-gray-300 mb-1">Text "Powered by"</label>
                <input id="powered-input" type="text" value={poweredByText} onChange={(e) => setPoweredByText(e.target.value)} className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>
              <div>
                <label htmlFor="logo1-input" className="block text-sm font-medium text-gray-300 mb-1">Partner </label>
                <input id="logo1-input" type="text" value={logoLine1} onChange={(e) => setLogoLine1(e.target.value)} className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>
              <div>
                <label htmlFor="logo2-input" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input id="logo2-input" type="text" value={logoLine2} onChange={(e) => setLogoLine2(e.target.value)} className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"/>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="logo-upload" className="block text-sm font-medium text-gray-300 mb-1">Choose your logo</label>
                <input 
                  id="logo-upload" 
                  type="file" 
                  accept="image/*"
                  onChange={handleLogoUpload} 
                  className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-blue-600 file:text-white
                             hover:file:bg-blue-700
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="background-upload" className="block text-sm font-medium text-gray-300 mb-1">
                  Upload Background Photo (Square 1:1 ratio recommended)
                </label>
                <input 
                  id="background-upload" 
                  type="file" 
                  accept="image/*"
                  onChange={handleBackgroundUpload} 
                  className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md text-white
                             file:mr-4 file:py-2 file:px-4
                             file:rounded-md file:border-0
                             file:text-sm file:font-semibold
                             file:bg-green-600 file:text-white
                             hover:file:bg-green-700
                             focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-400 mt-1">
                  * Image will be automatically cropped to 1:1 square aspect ratio (400x400px)
                </p>
              </div>
            </div>
          </div>

          {/* Generate Background */}
          <h2 className="text-xl font-bold mb-4">
            2. Generate Background
          </h2>
          
          <div className="mb-4">
            <label htmlFor="prompt-input" className="block text-sm font-medium text-gray-300 mb-2">
              Describe the image theme
            </label>
            <textarea
              id="prompt-input"
              rows="3"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ex: Abstract geometric pattern..."
            />
          </div>

          <div className="mb-6">
            <button
              onClick={generateImages}
              disabled={loading || !userPrompt.trim()}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <>
                  <Loader />
                  <span>Generating...</span>
                </>
              ) : (
                'Generate 4 Backgrounds'
              )}
            </button>
          </div>

          {error && (
            <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded-lg mb-6 shadow-md">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {generatedImages.length > 0 && !loading && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Choose a background:</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {generatedImages.map((imgUrl, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectImage(imgUrl)}
                    className={`rounded-lg overflow-hidden cursor-pointer transition-all duration-200 shadow-lg ${
                      selectedImage === imgUrl
                        ? 'ring-4 ring-blue-500 scale-105'
                        : 'ring-2 ring-gray-600 hover:ring-blue-400'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Background ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Butoane mutate mai jos */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={resetPositions}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                >
                  Reset Elements
                </button>
                <button
                  onClick={handleChooseDesign}
                  disabled={selectedForDownload}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
                >
                  {selectedForDownload ? (
                    <>
                      <Loader />
                      <span>Saving...</span>
                    </>
                  ) : (
                    'Choose this Design'
                  )}
                </button>
              </div>
            </div>
          )}
          
          
        </div>
      </div>
    </div>
  );
}