import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * fn: () => Promise<T>
 * deps: 依存配列（変化すると再取得）
 * 戻り値: { status: 'loading'|'success'|'error', data, error, reload }
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));
    fnRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: null });
      })
      .catch((error) => {
        if (!cancelled) setState({ status: 'error', data: null, error });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => load(), [...deps, load]); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, reload: load };
}
