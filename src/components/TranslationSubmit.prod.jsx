'use client'
import { useState } from 'react';
import styles from '../styles/pages/transSubmit.module.css';

const TransSubmit = ({ pageType, identifier }) => {
  const [translation, setTranslation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!translation.trim()) return;
    
    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/translation/addTrans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageType,
          identifier,
          content: translation
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTranslation('');
        // Reset success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to submit translation');
      }
    } catch (err) {
      setError('An error occurred while submitting your translation');
      console.error('Error submitting translation:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.userTranslationSection}>
      <h3>HOW WOULD YOU TRANSLATE THIS POEM?</h3>
      <textarea 
        className={styles.userTranslationInput} 
        placeholder="Write your translation here..."
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
      />
      
      <div className={styles.translationControls}>
        <button 
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={submitting || !translation.trim()}
        >
          {submitting ? 'Submitting...' : 'Submit Translation'}
        </button>
        
        {success && (
          <div className={styles.successMessage}>
            Translation submitted successfully!
          </div>
        )}
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransSubmit;