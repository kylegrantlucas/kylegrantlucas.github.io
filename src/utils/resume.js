export async function getResumeData() {
  const response = await fetch('https://raw.githubusercontent.com/kylegrantlucas/resume/master/resume.json');
  return response.json();
}

/**
 * Formats an ISO date string (YYYY-MM-DD) to human-readable format (Mon YYYY)
 * @param {string} dateString - ISO date string like "2022-04-01"
 * @returns {string} Formatted date like "Apr 2022"
 */
export function formatDate(dateString) {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}
