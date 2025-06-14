export async function getResumeData() {
  const response = await fetch('https://raw.githubusercontent.com/kylegrantlucas/resume/master/resume.json');
  return response.json();
}
