import { useEffect, useRef, useState } from 'react';
import { Button, Box, useDisclosure, Heading, Select } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import Webcam from 'react-webcam';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

function FaceRecognitionPage() {
  const videoRef = useRef();
  const webcamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isCaptureDisabled, setCaptureDisabled] = useState(false);
  const [isPredictDisabled, setPredictDisabled] = useState(true);
  const [isPredictLoading, setPredictLoading] = useState(false);
  const [value, setValue] = useState('');
  const [isMatch, setIsMatch] = useState(false);

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    enableCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      setCameras(videoDevices);
      if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  const videoConstraints = {
    deviceId: selectedCamera !== '' ? { exact: selectedCamera } : undefined,
  };

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setCaptureDisabled(true);
    setPredictDisabled(false);
    console.log(imageSrc);
  };

  const PredictFace = async () => {
    try {
        setPredictLoading(true);
        const base64toBlob = (base64) => {
          const byteCharacters = atob(base64.split(',')[1]);
          const byteArrays = [];
    
          for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
    
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
            }
    
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
          }
    
          return new Blob(byteArrays, { type: 'image/jpeg' });
        };
    
        const imageBlob = base64toBlob(capturedImage);
    
        const formData = new FormData();
        formData.append('photo', imageBlob, 'captured_image.jpg'); 

        // TODO : Call API to predict the photo

        setValue('Loading...');
        setIsMatch(false);
        onOpen();

    }
    catch (error) {
      console.error('Error registering exam:', error);
    }
    finally {
      setPredictLoading(false);
    }
  }

  useEffect(() => {
    getAvailableCameras();
  }, []);

  return (
    <>
      <Box
        bgGradient="linear(to-tr, #B6FFFA, #687EFF)"
        w="100%" h="100vh"
        p={3}
        color="white"
        display="flex"
        alignItems="center"
        flexDir="column"
      >
        <Box
          display='flex'
          flexDir='row'
          alignItems={"center"}
          justifyContent='space-between'
          w='100%'
          px='5'
        >
          <Button
            variant='outline'
            as={RouterLink}
            to="/"
          >
            Back
          </Button>
          <Heading
            my={4}
            fontSize="4xl"
            color="white"
            fontFamily={"sans-serif"}
          >
            Face Recognition
          </Heading>
        </Box>
        <Box
          w='100%'
          display='flex'
          flexDir='column'
          alignItems='center'
          justifyContent='center'
        >
          <Box position="relative" mb={4}>
            <Webcam
              audio={false}
              height={400}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={600}
              videoConstraints={videoConstraints}
              style={{ borderRadius: '8px', transform: 'scaleX(-1)' }}
            />
            {capturedImage && (
              <img
                src={capturedImage}
                alt="Captured"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '8px',
                  transform: 'scaleX(-1)',
                }}
              />
            )}
          </Box>
          <Box mb={4}>
            <Select
              placeholder="Select Camera"
              value={selectedCamera}
              onChange={handleCameraChange}
              width={600}
              color={"black"}
              isDisabled={isCaptureDisabled}
            >
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </Select>
          </Box>
          <Box
            display='flex'
            flexDir='row'
            alignItems='center'
            justifyContent='center'
            width={600}
            mb={4}
          >
            {capturedImage ? (
              <Button
                colorScheme="red"
                onClick={() => {
                  setCapturedImage(null);
                  setCaptureDisabled(false);
                  setPredictDisabled(true);
                }}
                width={600}
                mr={4}
              >
                Cancel
              </Button>
            ) : null}
            <Button
              colorScheme="teal"
              onClick={captureImage}
              width={600}
              isDisabled={isCaptureDisabled}
            >
              Capture
            </Button>
          </Box>
          <Box mb={4}>
            <Button
              colorScheme="blue"
              onClick={PredictFace}
              width={600}
              isDisabled={isPredictDisabled}
              isLoading={isPredictLoading}
            >
              Predict
            </Button>
          </Box>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} 
        isCentered
        motionPreset="slideInBottom"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Result : {value} ( {isMatch ? 'Match' : 'Not Match'} )
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              as={RouterLink}
              to='/streamvideo'
              mx='2'
            >
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default FaceRecognitionPage;
