import { useState } from 'react';
import { Alert } from 'react-native';

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
    } else {

    }
  };

  const cancelRecording = () => {
    setIsRecording(false);
  };

  return {
    isRecording,
    toggleRecording,
    cancelRecording,
  };
}
