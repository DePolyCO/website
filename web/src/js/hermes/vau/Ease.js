const SUBDIVISION_PRECISION = 0.0000001;
const SUBDIVISION_MAX_ITERATIONS = 10;

const kSplineTableSize = 11;
const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

const A = (aA1, aA2) => {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1;
};
const B = (aA1, aA2) => {
  return 3.0 * aA2 - 6.0 * aA1;
};
const C = (aA1) => {
  return 3.0 * aA1;
};

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
const calcBezier = (aT, aA1, aA2) => {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
};

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
const getSlope = (aT, aA1, aA2) => {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
};

const binarySubdivide = (aX, aA, aB, mX1, mX2) => {
  let currentX,
    currentT,
    i = 0;
  do {
    currentT = aA + (aB - aA) / 2.0;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0.0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (
    Math.abs(currentX) > SUBDIVISION_PRECISION &&
    ++i < SUBDIVISION_MAX_ITERATIONS
  );
  return currentT;
};

const newtonRaphsonIterate = (aX, aGuessT, mX1, mX2) => {
  for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
    const currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0.0) {
      return aGuessT;
    }
    const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
};

const linear = (x) => x;

export const Ease = {
  linear,
  i1: (m) => {
    return -Math.cos(m * (Math.PI / 2)) + 1;
  },
  o1: (m) => {
    return Math.sin(m * (Math.PI / 2));
  },
  io1: (m) => {
    return -0.5 * (Math.cos(Math.PI * m) - 1);
  },
  i2: (m) => {
    return m * m;
  },
  o2: (m) => {
    return m * (2 - m);
  },
  io2: (m) => {
    return m < 0.5 ? 2 * m * m : -1 + (4 - 2 * m) * m;
  },
  i3: (m) => {
    return m * m * m;
  },
  o3: (m) => {
    return --m * m * m + 1;
  },
  io3: (m) => {
    return m < 0.5 ? 4 * m * m * m : (m - 1) * (2 * m - 2) * (2 * m - 2) + 1;
  },
  i4: (m) => {
    return m * m * m * m;
  },
  o4: (m) => {
    return 1 - --m * m * m * m;
  },
  io4: (m) => {
    return m < 0.5 ? 8 * m * m * m * m : 1 - 8 * --m * m * m * m;
  },
  i5: (m) => {
    return m * m * m * m * m;
  },
  o5: (m) => {
    return 1 + --m * m * m * m * m;
  },
  io5: (m) => {
    return m < 0.5 ? 16 * m * m * m * m * m : 1 + 16 * --m * m * m * m * m;
  },
  i6: (m) => {
    return m === 0 ? 0 : Math.pow(2, 10 * (m - 1));
  },
  o6: (m) => {
    return m === 1 ? 1 : 1 - Math.pow(2, -10 * m);
  },
  io6: (m) => {
    if (m === 0) return 0;
    if (m === 1) return 1;
    if ((m /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (m - 1));
    return 0.5 * (-Math.pow(2, -10 * --m) + 2);
  },
  bezier: (mX1, mY1, mX2, mY2) => {
    // bezier values should be in [0-1, range]

    if (mX1 === mY1 && mX2 === mY2) {
      return linear;
    }

    // Precompute samples table
    const sampleValues = new Float32Array(kSplineTableSize);
    for (let i = 0; i < kSplineTableSize; ++i) {
      sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
    }

    const getTForX = (aX) => {
      let intervalStart = 0.0;
      let currentSample = 1;
      const lastSample = kSplineTableSize - 1;

      for (
        ;
        currentSample !== lastSample && sampleValues[currentSample] <= aX;
        ++currentSample
      ) {
        intervalStart += kSampleStepSize;
      }
      --currentSample;

      // Interpolate to provide an initial guess for t
      const dist =
        (aX - sampleValues[currentSample]) /
        (sampleValues[currentSample + 1] - sampleValues[currentSample]);
      const guessForT = intervalStart + dist * kSampleStepSize;

      const initialSlope = getSlope(guessForT, mX1, mX2);
      if (initialSlope >= NEWTON_MIN_SLOPE) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
      } else if (initialSlope === 0.0) {
        return guessForT;
      } else {
        return binarySubdivide(
          aX,
          intervalStart,
          intervalStart + kSampleStepSize,
          mX1,
          mX2
        );
      }
    };

    return (x) => {
      // Because JavaScript number are imprecise, we should guarantee the extremes are right.
      if (x === 0 || x === 1) {
        return x;
      }
      return calcBezier(getTForX(x), mY1, mY2);
    };
  },
};
