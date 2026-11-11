import { useEffect } from 'react';

// Footer newsletter form: validates the address and confirms in place (no backend in this clone).
export default function useNewsletter(ref) {
  useEffect(() => {
    const root = ref.current;
    const form = root && root.querySelector('form');
    if (!form) return undefined;
    const input = form.querySelector('input:not([type=submit])');
    const submit = form.querySelector('input[type=submit]');
    const onSubmit = (e) => {
      e.preventDefault();
      if (!input.value || !/^\S+@\S+\.\S+$/.test(input.value)) { input.focus(); input.setAttribute('aria-invalid', 'true'); return; }
      input.removeAttribute('aria-invalid'); input.value = '';
      submit.value = 'Subscribed ✓'; setTimeout(() => { submit.value = 'Subscribe'; }, 2500);
    };
    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, [ref]);
}
