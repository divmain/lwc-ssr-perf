import React from 'react';


const isDivisibleByThree = (remaining) => (remaining % 3) === 0;
const isDivisibleByTwo = (remaining) => (remaining % 2) === 0;

function IfPositive({ remaining, someChildren }) {
  if (isDivisibleByThree(remaining)) {
    return someChildren.map((child) => (
      <span key={child}>
        <Component label={child} remaining={remaining - 1} />
      </span>
    ));
  } else if (isDivisibleByTwo(remaining)) {
    return (
      <div>
        <span>two</span>
        <Component remaining={remaining - 1} />
      </div>
    );
  } else {
    return <Component remaining={remaining - 1} />;
  }
}

export default function Component({ label, remaining }) {
  remaining = remaining ?? 9;
  label = label ?? 'default';

  const someChildren = ['a', 'b', 'c'];;

  const inner = remaining > 0
    ? <IfPositive remaining={remaining} someChildren={someChildren} />
    : 'terminal node';

  return (
    <div data-label={label}>
      {inner}
    </div>
  );
}

