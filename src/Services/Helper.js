export function Base64UrlDecode(input) {
    // Заменяем символы URL-формата на стандартные для Base64
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    
    // Добавляем недостающие символы '=' для корректной длины (если нужно)
    const padding = base64.length % 4;
    if (padding) {
      base64 += '='.repeat(4 - padding);
    }
  
    // Декодируем строку в обычный формат Base64
    return atob(base64); // atob() используется для декодирования Base64 строки
  }