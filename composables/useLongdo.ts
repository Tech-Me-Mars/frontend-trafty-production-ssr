export async function useLoadLongdoScript(): Promise<void> {
  try {
    const res = await fetch('/api/load-longdo');
    const scriptCode = await res.text();

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = scriptCode;
    document.head.appendChild(script);

    await waitForLongdo();
  } catch (error) {
    console.error('Error loading Longdo script:', error);
    throw error;
  }
}

function waitForLongdo(): Promise<void> {
  return new Promise(resolve => {
    const check = () => {
      if (window.longdo) resolve();
      else setTimeout(check, 100);
    };
    check();
  });
}
