import { Typewriter } from 'react-simple-typewriter';

export default function AnimatedTitle() {
  return (
    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center' }}>
      <Typewriter
        words={['Find items by visual search']}
        loop={0}
        cursor
        cursorStyle='_'
        typeSpeed={70}
        deleteSpeed={50}
        delaySpeed={1000}
      />
    </h1>
  );
} 