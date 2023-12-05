import { useRef, useState, useEffect } from 'react';
import { Box, Button, Flex, Heading, Select } from '@chakra-ui/react';
import Webcam from 'react-webcam';

const StreamVideoPage = () => {
  const webcamRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');

  useEffect(() => {
    // Fetch available cameras when the component mounts
    getAvailableCameras();
  }, []);

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');
      setCameras(videoDevices);
      // Set the default selected camera to the first one (if available)
      if (videoDevices.length > 0) {
        setSelectedCamera(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const startRecording = () => {
    // Your logic to start recording
    setRecording(true);
    // You may use webcamRef.current to access the webcam and start recording
  };

  const stopRecording = () => {
    // Your logic to stop recording
    setRecording(false);
    // You may use webcamRef.current to access the webcam and stop recording
  };

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  const videoConstraints = {
    deviceId: selectedCamera !== '' ? { exact: selectedCamera } : undefined,
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Stream Video Page</Heading>
      <Flex 
        mb={4}
        align="start"
        justify="space-between"
        flexDir={["column", "row"]}
      > 
        <Box
          
          
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
            {recording && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                color="white"
                fontWeight="bold"
                fontSize="2xl"
              >
                Recording...
              </Box>
            )}
          </Box>
          <Box mb={4}>
            <Select
              placeholder="Select Camera"
              value={selectedCamera}
              onChange={handleCameraChange}
            >
              {cameras.map((camera) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${camera.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </Select>
          </Box>
          <Box>
            {recording ? (
              <Button colorScheme="red" onClick={stopRecording}>
                Stop Recording
              </Button>
            ) : (
              <Button colorScheme="teal" onClick={startRecording}>
                Start Recording
              </Button>
            )}
          </Box>
        </Box>
        <Box
          mb='4' mx='4'
          position="relative"
          minH="400px"
          width="40vw"
          bg="gray.200"
          borderRadius="8px"
        >
          Recording...
        </Box>
      </Flex>
    </Box>
  );
};

export default StreamVideoPage;
