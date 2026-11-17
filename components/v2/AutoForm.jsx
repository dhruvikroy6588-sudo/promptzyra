'use client';
import { useRef, useEffect } from 'react';

// Filter form that submits itself when a select changes or the user pauses typing.
// The Apply button still works as a normal submit.
export default function AutoForm({ children, delay = 600, ...props }) {
  const ref = useRef(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const submit = () => { const f = ref.current; if (f) (f.requestSubmit ? f.requestSubmit() : f.submit()); };
  return (
    <form ref={ref} {...props}
      onChange={(e) => {
        const t = e.target;
        clearTimeout(timer.current);
        if (t.tagName === 'SELECT' || t.type === 'checkbox' || t.type === 'radio') submit();
        else if (t.tagName === 'INPUT') timer.current = setTimeout(submit, delay);
      }}>
      {children}
    </form>
  );
}
