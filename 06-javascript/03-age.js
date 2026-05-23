const calculateAge = (dateString) => {
  const birthDate = new Date(dateString);

  if (isNaN(birthDate.getTime())) {
    return 'Error: Invalid date format';
  }

  const today = new Date();

  if (birthDate > today) {
    return 'Error: Birth date cannot be in the future';
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age > 125) {
    return 'Are you sure you are more than 125 years old?';
  }

  return `You are ${age} years old`;
};

console.log(calculateAge('2000-07-01'));
// You are 25 years old
console.log(calculateAge('1988-05-18'));
// You are 38 years old
console.log(calculateAge('2190-01-01'));
// Error: Birth date cannot be in the future
console.log(calculateAge('1800-01-01'));
// Are you sure you are more than 125 years old?
console.log(calculateAge('invalid-date'));
// Error: Invalid date format

// Note: These calculations were done on May 18, 2026.
