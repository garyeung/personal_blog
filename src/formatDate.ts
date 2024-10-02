function formatDate(dateString:string) {
  const [year, month, day] = dateString.split('-');
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'  

  ];
  return `${months[parseInt(month) - 1]} ${day}, ${year}`;
}

export default formatDate; 