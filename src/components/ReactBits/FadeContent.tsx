import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface FadeContentProps {
  children: React.ReactNode;
  blur?: boolean;
  duration?: number;
  initialOpacity?: number;
  threshold?: number;
  delay?: number;
  className?: string;
}

export const FadeContent: React.FC<FadeContentProps> = ({
  children,
  blur = false,
  duration = 1000,
  initialOpacity = 0,
  threshold = 0.1,
  delay = 0,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: initialOpacity, y: 30, filter: blur ? 'blur(10px)' : 'blur(0px)' }}
      animate={
        isInView
          ? { opacity: 1, y: 0, filter: 'blur(0px)' }
          : { opacity: initialOpacity, y: 30, filter: blur ? 'blur(10px)' : 'blur(0px)' }
      }
      transition={{
        duration: duration / 1000,
        delay: delay / 1000,
        ease: [0.16, 1, 0.3, 1], // Custom easing similar to spring
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeContent;
