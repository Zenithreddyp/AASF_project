// LoadingAnimation.jsx
import React, { useEffect, useState } from 'react';
import '../styles/LoadingAnimation.css'; // Don't forget to create this CSS file!

const LoadingAnimation = ({ onAnimationComplete }) => {
  const [stage, setStage] = useState('initial'); // 'initial', 'downloading', 'complete'
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Stage 1: Initial download icon animation
    if (stage === 'initial') {
      const initialTimer = setTimeout(() => {
        setStage('downloading');
      }, 1000); // Wait 1 second before starting progress
      return () => clearTimeout(initialTimer);
    }

    // Stage 2: Progress bar animation
    if (stage === 'downloading' && progress < 100) {
      const progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + 5; // Increment by 5%
          if (newProgress >= 100) {
            clearInterval(progressInterval);
            setStage('complete');
            return 100;
          }
          return newProgress;
        });
      }, 100); // Update progress every 100ms
      return () => clearInterval(progressInterval);
    }

    // Stage 3: Complete animation
    if (stage === 'complete') {
      const completeTimer = setTimeout(() => {
        // Optionally, call a callback to hide the animation after a short delay
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 1500); // Display 'Complete' for 1.5 seconds
      return () => clearTimeout(completeTimer);
    }
  }, [stage, progress, onAnimationComplete]);

  return (
    <div className="loading-animation-overlay">
      <div className="loading-animation-container">
        {stage === 'initial' && (
          <div className="download-icon">
            <div className="circle"></div>
            <div className="arrow-down"></div>
          </div>
        )}

        {stage === 'downloading' && (
          <div className="progress-section">
            <div className="parachute-arrow"></div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">{progress}%</p>
          </div>
        )}

        {stage === 'complete' && (
          <div className="complete-section">
            <p>Complete</p>
            <div className="checkmark-icon"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingAnimation;