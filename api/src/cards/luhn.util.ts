export function generateCardNumber(bin: string): string {
  let number = bin;
  for (let i = 0; i < 9; i++) {
    number += Math.floor(Math.random() * 10).toString();
  }

  let sum = 0;
  let isEven = true; 
  
  for (let i = number.length - 1; i >= 0; i--) {
    let digit = parseInt(number[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return number + checkDigit.toString();
}