import styles from './MatrixBackground.module.css';

const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ';

// Enough characters to tile a ~4000px tall page at 40px rows × ~48 columns
const repeated = (CHARS + ' ').repeat(60);

export default function MatrixBackground() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.matrix}>
        {[...repeated].map((char, i) => (
          <span key={i}>{char}</span>
        ))}
      </div>
    </div>
  );
}
