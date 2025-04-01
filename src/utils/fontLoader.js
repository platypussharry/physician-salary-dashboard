// Font loading optimization
import FontFaceObserver from 'fontfaceobserver';

export const loadFonts = () => {
  const outfit400 = new FontFaceObserver('Outfit', { weight: 400 });
  const outfit500 = new FontFaceObserver('Outfit', { weight: 500 });
  const outfit600 = new FontFaceObserver('Outfit', { weight: 600 });

  Promise.all([
    outfit400.load(null, 5000), // Add timeout of 5 seconds
    outfit500.load(null, 5000),
    outfit600.load(null, 5000)
  ]).then(() => {
    document.documentElement.classList.add('fonts-loaded');
  }).catch((err) => {
    console.warn('Some critical fonts are not available:', err);
    // Add fonts-loaded class anyway to ensure content is visible
    document.documentElement.classList.add('fonts-loaded');
  });
}; 