import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export const BlurText: React.FC<BlurTextProps> = ({ text, delay = 50, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delay / 1000, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      filter: 'blur(20px)',
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline-flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: index === words.length - 1 ? '0' : '0.25em', whiteSpace: 'nowrap' }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default BlurText;
