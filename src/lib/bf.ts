/**
 * Minimal brainf*ck interpreter.
 * Tape size: 30 000 cells. Output is capped at 500 characters.
 */
export function runBF(src: string): string {
  const tape = new Uint8Array(30000);
  let dp = 0;
  let ip = 0;
  let out = '';

  // Pre-compute bracket jump table
  const jmp: Record<number, number> = {};
  const stack: number[] = [];
  for (let i = 0; i < src.length; i++) {
    if (src[i] === '[') {
      stack.push(i);
    } else if (src[i] === ']') {
      const j = stack.pop()!;
      jmp[j] = i;
      jmp[i] = j;
    }
  }

  while (ip < src.length && out.length < 500) {
    switch (src[ip]) {
      case '>': dp++; break;
      case '<': dp--; break;
      case '+': tape[dp] = (tape[dp] + 1) & 0xff; break;
      case '-': tape[dp] = (tape[dp] - 1) & 0xff; break;
      case '.': out += String.fromCharCode(tape[dp]); break;
      case '[': if (!tape[dp]) ip = jmp[ip]; break;
      case ']': if (tape[dp]) ip = jmp[ip]; break;
    }
    ip++;
  }
  return out;
}

/** The BF program that prints "Hi!" */
export const BF_CODE =
  '+++++++++[>++++++++<-]>.' +           // H = 72
  '+++++++++++++++++++++++++++++++++.' +  // i = 105
  '[-]' +                                // zero cell
  '+++++++++++++++++++++++++++++++++.';  // ! = 33

export const BF_SOURCE_DISPLAY = `+++++++++[>++++++++<-]>.
++++++++++++++++++++++++
+++++++++.
[-]+++++++++++++++++++++
+++++++++++++++++.`;
